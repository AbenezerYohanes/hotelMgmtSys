const { Booking, Guest, Room, Payment, Invoice, sequelize } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.list = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({ include: [Guest, Room, Payment] });
    res.json({ success: true, data: bookings });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { guest, roomId, checkInDate, checkOutDate, totalAmount } = req.body;
    if (!guest || !checkInDate || !checkOutDate) return res.status(400).json({ success: false, message: 'Missing fields' });
    const g = await Guest.create(guest, { transaction: t });
    const reference = `BKG-${Date.now()}`;
    const booking = await Booking.create({ reference, guestId: g.id, roomId, checkInDate, checkOutDate, totalAmount }, { transaction: t });
    if (roomId) await Room.update({ status: 'reserved' }, { where: { id: roomId }, transaction: t });
    await t.commit();
    res.status(201).json({ success: true, data: booking });
  } catch (err) { await t.rollback(); next(err); }
};

exports.cancel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ success: false, message: 'Not found' });
    // Receptionist can cancel but we keep soft delete and set status
    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    await booking.save();
    res.json({ success: true, data: booking });
  } catch (err) { next(err); }
};
