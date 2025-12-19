const { Payment } = require('../models');

exports.record = async (req, res, next) => {
  try {
    const { bookingId, amount, method, metadata } = req.body;
    if (!bookingId || !amount || !method) return res.status(400).json({ success: false, message: 'Missing fields' });
    const p = await Payment.create({ bookingId, amount, method, metadata, verified: true });
    res.status(201).json({ success: true, data: p });
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const payments = await Payment.findAll();
    res.json({ success: true, data: payments });
  } catch (err) { next(err); }
};
