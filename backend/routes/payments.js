const express = require('express');
const router = express.Router();
const { pay, createPaymentIntent, handleWebhook } = require('../controllers/paymentsController');

router.post('/', express.json(), pay);
router.post('/intent', express.json(), createPaymentIntent);

// webhook route expects raw body (signature verification)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
