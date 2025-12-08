const express = require('express');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/db');

const Booking = db.Booking;
const Room = db.Room;
const RoomType = db.RoomType;
const Guest = db.Guest;
const User = db.User;

const router = express.Router();

function generateBookingNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BK${timestamp}${random}`;
}

// Create a new booking
router.post('/', authenticateToken, [
  body('guest_id').isInt().withMessage('Valid guest ID is required'),
  body('room_id').isInt().withMessage('Valid room ID is required'),
  body('check_in_date').isISO8601().toDate().withMessage('Valid check-in date is required'),
  body('check_out_date').isISO8601().toDate().withMessage('Valid check-out date is required'),
  body('adults').optional().isInt({ min: 1 }).withMessage('Adults must be at least 1'),
  body('children').optional().isInt({ min: 0 }).withMessage('Children cannot be negative'),
  body('special_requests').optional().isLength({ max: 1000 }).withMessage('Special requests too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { guest_id, room_id, check_in_date, check_out_date, adults = 1, children = 0, special_requests } = req.body;

    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    const today = new Date(); today.setHours(0,0,0,0);

    if (checkIn < today) return res.status(400).json({ success: false, message: 'Check-in date cannot be in the past' });
    if (checkOut <= checkIn) return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date' });

    // Load room with room type
    const room = await Room.findByPk(room_id, { include: [{ model: RoomType, as: 'room_type' }] });
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

    const roomType = room.room_type;
    const max_occupancy = roomType ? (roomType.capacity || roomType.max_occupancy || 1) : 1;
    const totalGuests = Number(adults) + Number(children);
    if (totalGuests > max_occupancy) return res.status(400).json({ success: false, message: `Room can accommodate maximum ${max_occupancy} guests` });

    // Check overlapping bookings
    const overlapping = await Booking.count({
      where: {
        room_id,
        status: { [Op.in]: ['confirmed','checked_in'] },
        [Op.or]: [
          { check_in_date: { [Op.lte]: checkIn }, check_out_date: { [Op.gt]: checkIn } },
          { check_in_date: { [Op.lt]: checkOut }, check_out_date: { [Op.gte]: checkOut } },
          { check_in_date: { [Op.gte]: checkIn }, check_out_date: { [Op.lte]: checkOut } }
        ]
      }
    });
    if (overlapping > 0) return res.status(409).json({ success: false, message: 'Room is not available for the selected dates' });

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const basePrice = roomType ? parseFloat(roomType.base_price || 0) : 0;
    const totalAmount = nights * basePrice;
    const bookingNumber = generateBookingNumber();

    const created = await Booking.create({
      booking_number: bookingNumber,
      guest_id,
      room_id,
      check_in_date: checkIn,
      check_out_date: checkOut,
      adults,
      children,
      nights,
      total_amount: totalAmount,
      status: 'pending',
      special_requests,
      created_by: req.user?.id || null
    });

    res.status(201).json({ success: true, message: 'Booking created successfully', data: { booking_id: created.id, booking_number: bookingNumber, total_amount: totalAmount } });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ success: false, message: 'Error creating booking' });
  }
});

// Get all bookings (with pagination)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, guest_id, room_id, start_date, end_date } = req.query;
    const offset = (page - 1) * limit;
    const where = {};
    if (status) where.status = status;
    if (guest_id) where.guest_id = guest_id;
    if (room_id) where.room_id = room_id;
    if (start_date && end_date) {
      where.check_in_date = { [Op.gte]: new Date(start_date) };
      where.check_out_date = { [Op.lte]: new Date(end_date) };
    }

    const { rows, count } = await Booking.findAndCountAll({
      where,
      include: [
        { model: Guest, attributes: ['id','first_name','last_name','email','phone'], as: 'guest', required: false },
        { model: Room, attributes: ['id','room_number','floor'], as: 'room', required: false, include: [{ model: RoomType, as: 'room_type', attributes: ['id','name','base_price'] }] },
        { model: User, attributes: ['id','first_name','last_name','email'], as: 'user', required: false }
      ],
      order: [['created_at','DESC']],
      limit: Number(limit),
      offset: Number(offset)
    });

    res.json({ success: true, data: rows, pagination: { page: Number(page), limit: Number(limit), total: count, pages: Math.ceil(count / limit) } });
  } catch (error) {
    console.error('Bookings fetch error:', error);
    res.status(500).json({ success: false, message: 'Error fetching bookings' });
  }
});

// Update booking
router.put('/:id', authenticateToken, [
  body('check_in_date').optional().isISO8601().toDate(),
  body('check_out_date').optional().isISO8601().toDate(),
  body('adults').optional().isInt({ min: 1 }),
  body('children').optional().isInt({ min: 0 }),
  body('status').optional().isIn(['pending','confirmed','checked_in','checked_out','cancelled']),
  body('special_requests').optional().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const { check_in_date, check_out_date, adults, children, status, special_requests } = req.body;

    let totalAmount = booking.total_amount;

    if (check_in_date || check_out_date) {
      const newCheckIn = check_in_date ? new Date(check_in_date) : booking.check_in_date;
      const newCheckOut = check_out_date ? new Date(check_out_date) : booking.check_out_date;
      const today = new Date(); today.setHours(0,0,0,0);
      if (newCheckIn < today) return res.status(400).json({ success: false, message: 'Check-in date cannot be in the past' });
      if (newCheckOut <= newCheckIn) return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date' });

      const overlapping = await Booking.count({
        where: {
          room_id: booking.room_id,
          id: { [Op.ne]: booking.id },
          status: { [Op.in]: ['confirmed','checked_in'] },
          [Op.or]: [
            { check_in_date: { [Op.lte]: newCheckIn }, check_out_date: { [Op.gt]: newCheckIn } },
            { check_in_date: { [Op.lt]: newCheckOut }, check_out_date: { [Op.gte]: newCheckOut } },
            { check_in_date: { [Op.gte]: newCheckIn }, check_out_date: { [Op.lte]: newCheckOut } }
          ]
        }
      });
      if (overlapping > 0) return res.status(409).json({ success: false, message: 'Room is not available for the selected dates' });

      // Recalculate total amount
      const room = await Room.findByPk(booking.room_id, { include: [{ model: RoomType, as: 'room_type' }] });
      const roomType = room.room_type;
      const nights = Math.ceil((newCheckOut - newCheckIn) / (1000*60*60*24));
      totalAmount = nights * (roomType ? parseFloat(roomType.base_price || 0) : 0);

      const totalGuests = (adults !== undefined ? adults : booking.adults) + (children !== undefined ? children : booking.children);
      const maxOcc = roomType ? (roomType.capacity || roomType.max_occupancy || 1) : 1;
      if (totalGuests > maxOcc) return res.status(400).json({ success: false, message: `Room can accommodate maximum ${maxOcc} guests` });
    }

    await booking.update({
      ...(check_in_date ? { check_in_date } : {}),
      ...(check_out_date ? { check_out_date } : {}),
      ...(adults !== undefined ? { adults } : {}),
      ...(children !== undefined ? { children } : {}),
      ...(status ? { status } : {}),
      ...(special_requests ? { special_requests } : {}),
      total_amount: totalAmount
    });

    res.json({ success: true, message: 'Booking updated successfully', data: booking });
  } catch (error) {
    console.error('Booking update error:', error);
    res.status(500).json({ success: false, message: 'Error updating booking' });
  }
});

// Check-in
router.put('/:id/checkin', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status !== 'confirmed') return res.status(400).json({ success: false, message: 'Only confirmed bookings can be checked in' });

    const today = new Date(); today.setHours(0,0,0,0);
    const checkInDate = new Date(booking.check_in_date);
    if (checkInDate > today) return res.status(400).json({ success: false, message: 'Cannot check-in before the check-in date' });

    await booking.update({ status: 'checked_in' });
    await Room.update({ status: 'occupied' }, { where: { id: booking.room_id } });

    res.json({ success: true, message: 'Guest checked in successfully' });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ success: false, message: 'Error during check-in' });
  }
});

// Check-out
router.put('/:id/checkout', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status !== 'checked_in') return res.status(400).json({ success: false, message: 'Only checked-in bookings can be checked out' });

    await booking.update({ status: 'checked_out' });
    await Room.update({ status: 'available' }, { where: { id: booking.room_id } });

    res.json({ success: true, message: 'Guest checked out successfully' });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ success: false, message: 'Error during check-out' });
  }
});

// Get booking details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Booking.findByPk(id, { include: [ { model: Guest, as: 'guest' }, { model: Room, as: 'room', include: [{ model: RoomType, as: 'room_type' }] }, { model: User, as: 'user' } ] });
    if (!doc) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: doc });
  } catch (error) {
    console.error('Booking details error:', error);
    res.status(500).json({ success: false, message: 'Error fetching booking details' });
  }
});

// Dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayBookings, monthBookings, monthRevenue, occupiedBookingsCount, totalRooms] = await Promise.all([
      Booking.count({ where: { created_at: { [Op.gte]: startOfToday } } }),
      Booking.count({ where: { created_at: { [Op.gte]: startOfMonth } } }),
      Booking.sum('total_amount', { where: { created_at: { [Op.gte]: startOfMonth }, status: { [Op.in]: ['confirmed','checked_in','checked_out'] } } }),
      Booking.count({ where: { check_in_date: { [Op.lte]: new Date() }, check_out_date: { [Op.gt]: new Date() }, status: { [Op.in]: ['confirmed','checked_in'] } } }),
      Room.count({ where: { status: { [Op.ne]: 'maintenance' } } })
    ]);

    const upcomingCheckins = await Booking.findAll({ where: { check_in_date: { [Op.between]: [new Date(), new Date(new Date().getTime() + 7*24*60*60*1000)] }, status: 'confirmed' }, include: [{ model: Guest, as: 'guest' }, { model: Room, as: 'room' }], limit: 10, order: [['check_in_date','ASC']] });
    const recentBookings = await Booking.findAll({ include: [{ model: Guest, as: 'guest' }, { model: Room, as: 'room' }], order: [['created_at','DESC']], limit: 5 });

    const occupancyRate = (totalRooms === 0) ? 0 : Math.round((occupiedBookingsCount * 10000.0 / totalRooms)) / 100.0;

    res.json({ success: true, data: { todayBookings, monthBookings, monthRevenue: monthRevenue || 0, occupancyRate, upcomingCheckins, recentBookings } });
  } catch (error) {
    console.error('Booking dashboard error:', error);
    res.status(500).json({ success: false, message: 'Error fetching booking dashboard data' });
  }
});

// Delete booking
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (!['pending','cancelled'].includes(booking.status)) return res.status(400).json({ success: false, message: 'Cannot delete active bookings' });

    await Booking.destroy({ where: { id } });
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Booking deletion error:', error);
    res.status(500).json({ success: false, message: 'Error deleting booking' });
  }
});

module.exports = router;
