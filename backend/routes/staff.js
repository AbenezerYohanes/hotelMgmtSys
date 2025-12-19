const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const bookings = require('../controllers/bookingsController');
const { body, param } = require('express-validator');
const { runValidation } = require('../middleware/validation');

router.use(authenticate, authorize(['staff','admin','superadmin']));

router.get('/bookings', bookings.listBookings);
router.put('/bookings/:id', [param('id').isInt(), body('status').optional().isIn(['booked','checked_in','checked_out','cancelled']), body('notes').optional().isString(), runValidation], bookings.updateBooking);

module.exports = router;
