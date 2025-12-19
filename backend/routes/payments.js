const express = require('express');
const router = express.Router();
const { pay } = require('../controllers/paymentsController');

// simple payment endpoint (dummy)
router.post('/', pay);

// webhook placeholder (for Stripe/PayPal webhooks)
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  // In production verify webhook signature
  console.log('payment webhook received');
  res.json({ ok: true });
});

module.exports = router;
