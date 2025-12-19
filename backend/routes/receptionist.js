const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const bookings = require('../controllers/bookingsController');
const { body, param } = require('express-validator');
const { runValidation } = require('../middleware/validation');

router.use(authenticate, authorize(['receptionist','admin','superadmin']));

// receptionist endpoints for check-in/out
router.post('/bookings', [body('roomId').isInt(), body('guestId').optional().isInt(), body('startDate').isISO8601(), body('endDate').isISO8601(), runValidation], bookings.createBooking);
router.put('/bookings/:id', [param('id').isInt(), body('status').optional().isIn(['booked','checked_in','checked_out','cancelled']), runValidation], bookings.updateBooking);

module.exports = router;
