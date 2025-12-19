const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const bookings = require('../controllers/bookingsController');

router.use(authenticate, authorize(['receptionist','admin','superadmin']));

// receptionist endpoints for check-in/out
router.post('/bookings', bookings.createBooking);
router.put('/bookings/:id', bookings.updateBooking);

module.exports = router;
