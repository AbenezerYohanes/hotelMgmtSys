const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const { Op, fn, col, literal } = require('sequelize');
const Payment = db && db.Payment ? db.Payment : null;
const Booking = db && db.Booking ? db.Booking : null;
const Guest = db && db.Guest ? db.Guest : null;

const router = express.Router();

// Add a payment
router.post('/', async (req, res) => {
  try {
    const { booking_id, amount, date, method, metadata } = req.body;
    if (!Payment) return res.status(500).json({ success: false, message: 'Payment model not available' });
    const created = await Payment.create({ booking_id: booking_id || null, amount, payment_date: date ? new Date(date) : undefined, payment_method: method || null, metadata: metadata || null, payment_status: 'succeeded' });
    return res.status(201).json({ success: true, payment_id: created.id });
  } catch (err) {
    console.error('Create payment error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all payments
router.get('/', async (req, res) => {
  try {
    if (!Payment) return res.status(500).json({ success: false, message: 'Payment model not available' });
    const items = await Payment.findAll({ include: [{ model: Booking, as: 'booking', include: [{ model: Guest, as: 'guest' }] }] });
    const mapped = items.map(i => {
      const plain = i.get ? i.get({ plain: true }) : i;
      return {
        id: plain.id,
        amount: plain.amount,
        payment_date: plain.payment_date,
        payment_method: plain.payment_method,
        booking: plain.Booking || plain.booking
      };
    });
    return res.json({ success: true, data: mapped });
  } catch (err) {
    console.error('Get payments error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get daily/weekly revenue summary
router.get('/summary', async (req, res) => {
  try {
    if (!Payment) return res.status(500).json({ success: false, message: 'Payment model not available' });
    // Daily total for today
    const dailyRaw = await db.sequelize.query(
      `SELECT DATE(payment_date) AS day, SUM(amount) AS total FROM payments WHERE DATE(payment_date) = CURDATE() GROUP BY day`,
      { type: db.Sequelize.QueryTypes.SELECT }
    );
    // Weekly total for current week
    const weeklyRaw = await db.sequelize.query(
      `SELECT WEEK(payment_date, 1) AS week, SUM(amount) AS total FROM payments WHERE YEAR(payment_date) = YEAR(CURDATE()) AND WEEK(payment_date,1) = WEEK(CURDATE(),1) GROUP BY week`,
      { type: db.Sequelize.QueryTypes.SELECT }
    );
    res.json({ success: true, daily: dailyRaw[0] || {}, weekly: weeklyRaw[0] || {} });
  } catch (err) {
    console.error('Summary error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;