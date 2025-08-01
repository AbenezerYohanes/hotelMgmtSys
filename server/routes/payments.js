const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../database/config');

const router = express.Router();

// Get all payments
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, payment_method } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      whereClause += ` AND p.payment_status = $${paramCount}`;
      params.push(status);
    }

    if (payment_method) {
      paramCount++;
      whereClause += ` AND p.payment_method = $${paramCount}`;
      params.push(payment_method);
    }

    const result = await query(`
      SELECT p.*, b.booking_number, b.total_amount as booking_total,
             g.first_name, g.last_name, g.email
      FROM payments p
      LEFT JOIN bookings b ON p.booking_id = b.id
      LEFT JOIN guests g ON b.guest_id = g.id
      ${whereClause}
      ORDER BY p.payment_date DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `, [...params, limit, offset]);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM payments p
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
    console.error('Payments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching payments' 
    });
  }
});

// Create new payment
router.post('/', [
  body('booking_id').isInt().withMessage('Booking ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Valid amount is required'),
  body('payment_method').notEmpty().withMessage('Payment method is required'),
  body('transaction_id').optional(),
  body('notes').optional()
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

    const { booking_id, amount, payment_method, transaction_id, notes } = req.body;

    // Check if booking exists
    const booking = await query(
      'SELECT total_amount, status FROM bookings WHERE id = $1',
      [booking_id]
    );

    if (booking.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    const bookingData = booking.rows[0];

    // Check if payment amount exceeds booking total
    if (amount > bookingData.total_amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment amount cannot exceed booking total' 
      });
    }

    const result = await query(
      `INSERT INTO payments (booking_id, amount, payment_method, payment_status, transaction_id, notes)
       VALUES ($1, $2, $3, 'completed', $4, $5) RETURNING *`,
      [booking_id, amount, payment_method, transaction_id, notes]
    );

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating payment' 
    });
  }
});

// Update payment
router.put('/:id', [
  body('amount').optional().isFloat({ min: 0 }).withMessage('Valid amount is required'),
  body('payment_method').optional().notEmpty().withMessage('Payment method cannot be empty'),
  body('payment_status').optional().isIn(['pending', 'completed', 'failed', 'refunded']).withMessage('Invalid payment status'),
  body('transaction_id').optional(),
  body('notes').optional()
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
    const { amount, payment_method, payment_status, transaction_id, notes } = req.body;

    const result = await query(
      `UPDATE payments SET 
       amount = COALESCE($1, amount),
       payment_method = COALESCE($2, payment_method),
       payment_status = COALESCE($3, payment_status),
       transaction_id = COALESCE($4, transaction_id),
       notes = COALESCE($5, notes)
       WHERE id = $6 RETURNING *`,
      [amount, payment_method, payment_status, transaction_id, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    res.json({
      success: true,
      message: 'Payment updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Payment update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating payment' 
    });
  }
});

// Get payment details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT p.*, b.booking_number, b.total_amount as booking_total, b.check_in_date, b.check_out_date,
             g.first_name, g.last_name, g.email, g.phone,
             r.room_number, rt.name as room_type
      FROM payments p
      LEFT JOIN bookings b ON p.booking_id = b.id
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Payment details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching payment details' 
    });
  }
});

// Get payment dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    // Total payments today
    const todayPayments = await query(`
      SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total
      FROM payments
      WHERE DATE(payment_date) = CURRENT_DATE
    `);

    // Total payments this month
    const monthPayments = await query(`
      SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total
      FROM payments
      WHERE DATE_TRUNC('month', payment_date) = DATE_TRUNC('month', CURRENT_DATE)
    `);

    // Payments by method
    const paymentsByMethod = await query(`
      SELECT payment_method, COUNT(*) as count, SUM(amount) as total
      FROM payments
      WHERE payment_status = 'completed'
      GROUP BY payment_method
      ORDER BY total DESC
    `);

    // Payment status distribution
    const paymentStatusDistribution = await query(`
      SELECT payment_status, COUNT(*) as count
      FROM payments
      GROUP BY payment_status
      ORDER BY count DESC
    `);

    // Recent payments
    const recentPayments = await query(`
      SELECT p.*, b.booking_number, g.first_name, g.last_name
      FROM payments p
      LEFT JOIN bookings b ON p.booking_id = b.id
      LEFT JOIN guests g ON b.guest_id = g.id
      ORDER BY p.payment_date DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        todayPayments: {
          count: parseInt(todayPayments.rows[0].count),
          total: parseFloat(todayPayments.rows[0].total)
        },
        monthPayments: {
          count: parseInt(monthPayments.rows[0].count),
          total: parseFloat(monthPayments.rows[0].total)
        },
        paymentsByMethod: paymentsByMethod.rows,
        paymentStatusDistribution: paymentStatusDistribution.rows,
        recentPayments: recentPayments.rows
      }
    });
  } catch (error) {
    console.error('Payment dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching payment dashboard data' 
    });
  }
});

module.exports = router; 