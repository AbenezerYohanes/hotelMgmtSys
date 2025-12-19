const { Booking, Payment, Room, Invoice, sequelize } = require('../models');

exports.checkout = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { bookingId, payments = [], applyLateFee = 0 } = req.body;
    const booking = await Booking.findByPk(bookingId, { include: [Payment], transaction: t });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    // calculate final amount
    let totalPaid = 0;
    for (const p of payments) {
      const pay = await Payment.create({ bookingId, amount: p.amount, method: p.method, verified: true, metadata: p.metadata }, { transaction: t });
      totalPaid += Number(p.amount);
    }
    const finalTotal = Number(booking.totalAmount) + Number(applyLateFee || 0);
    if (totalPaid < finalTotal) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Incomplete payment' });
    }
    booking.status = 'checked_out';
    await booking.save({ transaction: t });
    await Room.update({ status: 'cleaning' }, { where: { id: booking.roomId }, transaction: t });
    const invoice = await Invoice.create({ bookingId, items: [], total: finalTotal }, { transaction: t });
    await t.commit();
    res.json({ success: true, data: { booking, invoice } });
  } catch (err) { await t.rollback(); next(err); }
};
