const db = require('../config/db');
const { Op } = require('sequelize');

const Booking = db.Booking;
const Room = db.Room;
const Guest = db.Guest;
const User = db.User;

exports.listBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: Room, attributes: ['id', 'room_number', 'room_type_id'] },
        { model: Guest, attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: User, attributes: ['id', 'username', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findByPk(id, {
      include: [Room, Guest, User]
    });
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const payload = req.body;
    // Ensure required fields
    if (!payload.room_id || !payload.check_in_date || !payload.check_out_date) {
      return res.status(400).json({ success: false, error: 'Missing required booking fields' });
    }

    const created = await Booking.create(payload);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    await booking.update(req.body);
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Booking.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ success: false, error: 'Booking not found' });
    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
