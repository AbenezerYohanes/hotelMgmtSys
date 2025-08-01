const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../database/config');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Generate booking number
const generateBookingNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `BK${year}${month}${random}`;
};

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, check_in_date, check_out_date } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      whereClause += ` AND b.status = $${paramCount}`;
      params.push(status);
    }

    if (check_in_date) {
      paramCount++;
      whereClause += ` AND b.check_in_date >= $${paramCount}`;
      params.push(check_in_date);
    }

    if (check_out_date) {
      paramCount++;
      whereClause += ` AND b.check_out_date <= $${paramCount}`;
      params.push(check_out_date);
    }

    const result = await query(`
      SELECT b.*, g.first_name, g.last_name, g.email, g.phone,
             r.room_number, rt.name as room_type, rt.base_price,
             u.first_name as created_by_name, u.last_name as created_by_last_name
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      LEFT JOIN users u ON b.created_by = u.id
      ${whereClause}
      ORDER BY b.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `, [...params, limit, offset]);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM bookings b
      ${whereClause}
    `, params);

    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Bookings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching bookings' 
    });
  }
});

// Create new booking
router.post('/', [
  body('guest_id').isInt().withMessage('Guest ID is required'),
  body('room_id').isInt().withMessage('Room ID is required'),
  body('check_in_date').isDate().withMessage('Valid check-in date is required'),
  body('check_out_date').isDate().withMessage('Valid check-out date is required'),
  body('adults').isInt({ min: 1 }).withMessage('At least 1 adult is required'),
  body('children').optional().isInt({ min: 0 }).withMessage('Children must be a non-negative number'),
  body('special_requests').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { 
      guest_id, room_id, check_in_date, check_out_date, 
      adults, children = 0, special_requests 
    } = req.body;

    // Check if room is available for the dates
    const roomAvailability = await query(`
      SELECT COUNT(*) as count
      FROM bookings
      WHERE room_id = $1 
      AND status IN ('confirmed', 'checked_in')
      AND (
        (check_in_date <= $2 AND check_out_date > $2) OR
        (check_in_date < $3 AND check_out_date >= $3) OR
        (check_in_date >= $2 AND check_out_date <= $3)
      )
    `, [room_id, check_in_date, check_out_date]);

    if (parseInt(roomAvailability.rows[0].count) > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'Room is not available for the selected dates' 
      });
    }

    // Get room details for pricing
    const roomDetails = await query(`
      SELECT rt.base_price, rt.capacity
      FROM rooms r
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.id = $1
    `, [room_id]);

    if (roomDetails.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Room not found' 
      });
    }

    const basePrice = roomDetails.rows[0].base_price;
    const capacity = roomDetails.rows[0].capacity;
    const totalGuests = adults + children;

    if (totalGuests > capacity) {
      return res.status(400).json({ 
        success: false, 
        message: `Room capacity is ${capacity} guests, but ${totalGuests} guests were specified` 
      });
    }

    // Calculate total amount (nights * base price)
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalAmount = nights * basePrice;

    const bookingNumber = generateBookingNumber();

    const result = await query(
      `INSERT INTO bookings (booking_number, guest_id, room_id, check_in_date, check_out_date,
       adults, children, total_amount, special_requests, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [bookingNumber, guest_id, room_id, check_in_date, check_out_date, 
       adults, children, totalAmount, special_requests, req.user.id]
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating booking' 
    });
  }
});

// Update booking
router.put('/:id', [
  body('check_in_date').optional().isDate().withMessage('Valid check-in date is required'),
  body('check_out_date').optional().isDate().withMessage('Valid check-out date is required'),
  body('adults').optional().isInt({ min: 1 }).withMessage('At least 1 adult is required'),
  body('children').optional().isInt({ min: 0 }).withMessage('Children must be a non-negative number'),
  body('status').optional().isIn(['confirmed', 'cancelled', 'checked_in', 'checked_out']).withMessage('Invalid status'),
  body('special_requests').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { check_in_date, check_out_date, adults, children, status, special_requests } = req.body;

    // Get current booking details
    const currentBooking = await query(
      'SELECT * FROM bookings WHERE id = $1',
      [id]
    );

    if (currentBooking.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    const booking = currentBooking.rows[0];

    // If dates are being changed, check availability
    if (check_in_date || check_out_date) {
      const newCheckIn = check_in_date || booking.check_in_date;
      const newCheckOut = check_out_date || booking.check_out_date;

      const roomAvailability = await query(`
        SELECT COUNT(*) as count
        FROM bookings
        WHERE room_id = $1 
        AND id != $2
        AND status IN ('confirmed', 'checked_in')
        AND (
          (check_in_date <= $3 AND check_out_date > $3) OR
          (check_in_date < $4 AND check_out_date >= $4) OR
          (check_in_date >= $3 AND check_out_date <= $4)
        )
      `, [booking.room_id, id, newCheckIn, newCheckOut]);

      if (parseInt(roomAvailability.rows[0].count) > 0) {
        return res.status(409).json({ 
          success: false, 
          message: 'Room is not available for the selected dates' 
        });
      }

      // Recalculate total amount if dates changed
      if (check_in_date || check_out_date) {
        const checkIn = new Date(newCheckIn);
        const checkOut = new Date(newCheckOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        // Get room base price
        const roomDetails = await query(`
          SELECT rt.base_price
          FROM rooms r
          LEFT JOIN room_types rt ON r.room_type_id = rt.id
          WHERE r.id = $1
        `, [booking.room_id]);

        const basePrice = roomDetails.rows[0].base_price;
        const totalAmount = nights * basePrice;

        const result = await query(
          `UPDATE bookings SET 
           check_in_date = COALESCE($1, check_in_date),
           check_out_date = COALESCE($2, check_out_date),
           adults = COALESCE($3, adults),
           children = COALESCE($4, children),
           status = COALESCE($5, status),
           special_requests = COALESCE($6, special_requests),
           total_amount = $7,
           updated_at = CURRENT_TIMESTAMP
           WHERE id = $8 RETURNING *`,
          [check_in_date, check_out_date, adults, children, status, special_requests, totalAmount, id]
        );

        res.json({
          success: true,
          message: 'Booking updated successfully',
          data: result.rows[0]
        });
      } else {
        const result = await query(
          `UPDATE bookings SET 
           adults = COALESCE($1, adults),
           children = COALESCE($2, children),
           status = COALESCE($3, status),
           special_requests = COALESCE($4, special_requests),
           updated_at = CURRENT_TIMESTAMP
           WHERE id = $5 RETURNING *`,
          [adults, children, status, special_requests, id]
        );

        res.json({
          success: true,
          message: 'Booking updated successfully',
          data: result.rows[0]
        });
      }
    } else {
      const result = await query(
        `UPDATE bookings SET 
         adults = COALESCE($1, adults),
         children = COALESCE($2, children),
         status = COALESCE($3, status),
         special_requests = COALESCE($4, special_requests),
         updated_at = CURRENT_TIMESTAMP
         WHERE id = $5 RETURNING *`,
        [adults, children, status, special_requests, id]
      );

      res.json({
        success: true,
        message: 'Booking updated successfully',
        data: result.rows[0]
      });
    }
  } catch (error) {
    console.error('Booking update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating booking' 
    });
  }
});

// Get booking details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT b.*, g.first_name, g.last_name, g.email, g.phone, g.address,
             r.room_number, r.floor, rt.name as room_type, rt.base_price, rt.amenities,
             u.first_name as created_by_name, u.last_name as created_by_last_name
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      LEFT JOIN users u ON b.created_by = u.id
      WHERE b.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Booking details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching booking details' 
    });
  }
});

// Get booking dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    // Total bookings today
    const todayBookings = await query(`
      SELECT COUNT(*) as count
      FROM bookings
      WHERE DATE(created_at) = CURRENT_DATE
    `);

    // Total bookings this month
    const monthBookings = await query(`
      SELECT COUNT(*) as count
      FROM bookings
      WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
    `);

    // Revenue this month
    const monthRevenue = await query(`
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM bookings
      WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
      AND status IN ('confirmed', 'checked_in', 'checked_out')
    `);

    // Occupancy rate
    const occupancyRate = await query(`
      SELECT 
        ROUND(
          (COUNT(CASE WHEN status IN ('confirmed', 'checked_in') THEN 1 END) * 100.0 / 
           (SELECT COUNT(*) FROM rooms WHERE status != 'maintenance')
          ), 2
        ) as rate
      FROM bookings
      WHERE check_in_date <= CURRENT_DATE AND check_out_date > CURRENT_DATE
    `);

    // Upcoming check-ins (next 7 days)
    const upcomingCheckins = await query(`
      SELECT b.*, g.first_name, g.last_name, r.room_number
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN rooms r ON b.room_id = r.id
      WHERE b.check_in_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
      AND b.status = 'confirmed'
      ORDER BY b.check_in_date
      LIMIT 10
    `);

    // Recent bookings
    const recentBookings = await query(`
      SELECT b.*, g.first_name, g.last_name, r.room_number
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN rooms r ON b.room_id = r.id
      ORDER BY b.created_at DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        todayBookings: parseInt(todayBookings.rows[0].count),
        monthBookings: parseInt(monthBookings.rows[0].count),
        monthRevenue: parseFloat(monthRevenue.rows[0].total),
        occupancyRate: parseFloat(occupancyRate.rows[0].rate || 0),
        upcomingCheckins: upcomingCheckins.rows,
        recentBookings: recentBookings.rows
      }
    });
  } catch (error) {
    console.error('Booking dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching booking dashboard data' 
    });
  }
});

module.exports = router; 