const express = require('express');
const { body, validationResult } = require('express-validator');
const { isManager } = require('../middleware/auth');
const db = require('../config/db');
const { Op, fn, col } = require('sequelize');
const RoomType = db.RoomType;
const Room = db.Room;
const Booking = db.Booking;

const router = express.Router();

// Get all room types
router.get('/types', async (req, res) => {
  try {
    if (!RoomType) return res.status(500).json({ success: false, message: 'Room types model not available' });
    const types = await RoomType.findAll({ order: [['base_price','ASC']] });
    res.json({ success: true, data: types });
  } catch (error) {
    console.error('Room types error:', error);
    res.status(500).json({ success: false, message: 'Error fetching room types' });
  }
});

// Create room type
router.post('/types', isManager, [
  body('name').notEmpty().withMessage('Room type name is required'),
  body('description').optional(),
  body('base_price').isFloat({ min: 0 }).withMessage('Valid base price is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('amenities').optional().isArray().withMessage('Amenities must be an array')
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

    const { name, description, base_price, capacity, amenities } = req.body;

    if (!RoomType) return res.status(500).json({ success: false, message: 'Room types model not available' });
    const created = await RoomType.create({ name, description, base_price, capacity, amenities: amenities || [] });
    res.status(201).json({ success: true, message: 'Room type created successfully', data: { id: created.id } });
  } catch (error) {
    console.error('Room type creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating room type' 
    });
  }
});

// Update room type
router.put('/types/:id', isManager, [
  body('name').optional().notEmpty().withMessage('Room type name cannot be empty'),
  body('description').optional(),
  body('base_price').optional().isFloat({ min: 0 }).withMessage('Valid base price is required'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('amenities').optional().isArray().withMessage('Amenities must be an array')
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
    const { name, description, base_price, capacity, amenities } = req.body;

    if (!RoomType) return res.status(500).json({ success: false, message: 'Room types model not available' });
    const rt = await RoomType.findByPk(id);
    if (!rt) return res.status(404).json({ success: false, message: 'Room type not found' });
    await rt.update({ name, description, base_price, capacity, amenities: amenities ? amenities : rt.amenities });
    res.json({ success: true, message: 'Room type updated successfully', data: rt });
  } catch (error) {
    console.error('Room type update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating room type' 
    });
  }
});

// Get all rooms
router.get('/', async (req, res) => {
  try {
    if (!Room) return res.status(500).json({ success: false, message: 'Rooms model not available' });
    const { page = 1, limit = 10, status, room_type_id, floor } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const where = {};
    if (status) where.status = status;
    if (floor) where.floor = Number(floor);
    if (room_type_id) where.room_type_id = Number(room_type_id);

    const { rows: items, count: total } = await Room.findAndCountAll({
      where,
      include: [{ model: RoomType }],
      order: [['room_number','ASC']],
      limit: Number(limit),
      offset
    });

    res.json({ success: true, data: items, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
  } catch (error) {
    console.error('Rooms error:', error);
    res.status(500).json({ success: false, message: 'Error fetching rooms' });
  }
});

// Create new room
router.post('/', isManager, [
  body('room_number').notEmpty().withMessage('Room number is required'),
  body('room_type_id').isInt().withMessage('Room type ID is required'),
  body('floor').isInt({ min: 1 }).withMessage('Floor must be at least 1'),
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

    const { room_number, room_type_id, floor, notes } = req.body;

    if (!Room) return res.status(500).json({ success: false, message: 'Rooms model not available' });
    const existingRoom = await Room.findOne({ where: { room_number } });
    if (existingRoom) return res.status(409).json({ success: false, message: 'Room number already exists' });
    const created = await Room.create({ room_number, room_type_id: room_type_id, floor, notes });
    res.status(201).json({ success: true, message: 'Room created successfully', data: { id: created.id } });
  } catch (error) {
    console.error('Room creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating room' 
    });
  }
});

// Update room
router.put('/:id', isManager, [
  body('room_number').optional().notEmpty().withMessage('Room number cannot be empty'),
  body('room_type_id').optional().isInt().withMessage('Room type ID must be a number'),
  body('floor').optional().isInt({ min: 1 }).withMessage('Floor must be at least 1'),
  body('status').optional().isIn(['available', 'occupied', 'maintenance', 'cleaning']).withMessage('Invalid status'),
  body('is_clean').optional().isBoolean().withMessage('is_clean must be a boolean'),
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
    const { room_number, room_type_id, floor, status, is_clean, notes } = req.body;

    if (!Room) return res.status(500).json({ success: false, message: 'Rooms model not available' });
    const room = await Room.findByPk(id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    if (room_number) {
      const existingRoom = await Room.findOne({ where: { room_number, id: { [Op.ne]: id } } });
      if (existingRoom) return res.status(409).json({ success: false, message: 'Room number already exists' });
    }
    await room.update({ room_number: room_number || room.room_number, room_type_id: room_type_id || room.room_type_id, floor: floor || room.floor, status: status || room.status, is_clean: typeof is_clean === 'boolean' ? is_clean : room.is_clean, notes: notes || room.notes });
    res.json({ success: true, message: 'Room updated successfully', data: room });
  } catch (error) {
    console.error('Room update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating room' 
    });
  }
});

// Get room availability
router.get('/availability', async (req, res) => {
  try {
    const { check_in_date, check_out_date, room_type_id } = req.query;

    if (!check_in_date || !check_out_date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Check-in and check-out dates are required' 
      });
    }

    if (!Room || !Booking) return res.status(500).json({ success: false, message: 'Models not available' });
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    // Find bookings that overlap and are confirmed/checked_in
    const overlapping = await Booking.findAll({
      where: {
        status: { [Op.in]: ['confirmed','checked_in'] },
        [Op.or]: [
          { [Op.and]: [ { check_in_date: { [Op.lte]: checkIn } }, { check_out_date: { [Op.gt]: checkIn } } ] },
          { [Op.and]: [ { check_in_date: { [Op.lt]: checkOut } }, { check_out_date: { [Op.gte]: checkOut } } ] },
          { [Op.and]: [ { check_in_date: { [Op.gte]: checkIn } }, { check_out_date: { [Op.lte]: checkOut } } ] }
        ]
      },
      attributes: ['room_id']
    });
    const bookedRoomIds = overlapping.map(b => b.room_id).filter(Boolean);
    const where = { status: 'available' };
    if (room_type_id) where.room_type_id = Number(room_type_id);
    if (bookedRoomIds.length > 0) where.id = { [Op.notIn]: bookedRoomIds };
    const rooms = await Room.findAll({ where, include: [{ model: RoomType }], order: [['room_number','ASC']] });
    res.json({ success: true, data: rooms });
  } catch (error) {
    console.error('Room availability error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching room availability' 
    });
  }
});

// Get room details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!Room) return res.status(500).json({ success: false, message: 'Rooms model not available' });
    const room = await Room.findByPk(id, { include: [{ model: RoomType }] });
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, data: room });
  } catch (error) {
    console.error('Room details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching room details' 
    });
  }
});

// Get room dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    // Total rooms
    if (!Room) return res.status(500).json({ success: false, message: 'Rooms model not available' });
    const totalRooms = await Room.count();
    const availableRooms = await Room.count({ where: { status: 'available' } });
    const occupiedRooms = await Room.count({ where: { status: 'occupied' } });
    const maintenanceRooms = await Room.count({ where: { status: 'maintenance' } });
    // rooms by type
    const roomsByTypeRaw = await Room.findAll({
      attributes: ['room_type_id', [fn('COUNT', col('id')), 'count']],
      group: ['room_type_id'],
      order: [[fn('COUNT', col('id')), 'DESC']]
    });
    // Attach name for each type
    const roomsByType = await Promise.all(roomsByTypeRaw.map(async (r) => {
      const rt = await RoomType.findByPk(r.room_type_id);
      return { room_type_id: r.room_type_id, name: rt ? rt.name : null, count: Number(r.get('count')) };
    }));
    const occupancyRate = totalRooms === 0 ? 0 : (occupiedRooms * 100.0) / totalRooms;
    res.json({ success: true, data: { totalRooms, availableRooms, occupiedRooms, maintenanceRooms, roomsByType, occupancyRate } });
  } catch (error) {
    console.error('Room dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching room dashboard data' 
    });
  }
});

module.exports = router; 