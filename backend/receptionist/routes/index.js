const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/bookings', require('./bookings'));
router.use('/guests', require('./guests'));
router.use('/rooms', require('./rooms'));
router.use('/payments', require('./payments'));
router.use('/checkin', require('./checkin'));
router.use('/checkout', require('./checkout'));
router.use('/notifications', require('./notifications'));

module.exports = router;
