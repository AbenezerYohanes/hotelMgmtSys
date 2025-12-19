const { Booking, Room } = require('../models');
const { sequelize } = require('../models');

exports.checkin = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { bookingId, roomId, identity } = req.body;
    const booking = await Booking.findByPk(bookingId, { transaction: t });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    booking.status = 'checked_in';
    booking.roomId = roomId || booking.roomId;
    await booking.save({ transaction: t });
    await Room.update({ status: 'occupied' }, { where: { id: booking.roomId }, transaction: t });
    await t.commit();
    res.json({ success: true, data: booking });
  } catch (err) { await t.rollback(); next(err); }
};
