const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const bookings = require('../controllers/bookingsController');

router.use(authenticate, authorize(['staff','admin','superadmin']));

router.get('/bookings', bookings.listBookings);
router.put('/bookings/:id', bookings.updateBooking);

module.exports = router;
