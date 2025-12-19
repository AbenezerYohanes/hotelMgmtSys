const { initDb } = require('../config/database');

// Dummy payment handler — replace with Stripe/PayPal integration in production
const pay = async (req, res) => {
  const sequelize = await initDb();
  const { Payment, Booking } = require('../models')(sequelize);
  const { bookingId, method, amount } = req.body;
  const booking = await Booking.findByPk(bookingId);
  if (!booking) return res.status(400).json({ error: 'Invalid booking' });

  // create payment record
  const p = await Payment.create({ bookingId, method, amount, status: 'paid' });

  // notify via socket
  const io = req.app && req.app.get('io');
  if (io) io.emit('payment:received', { payment: p });

  res.json(p);
};

module.exports = { pay };
