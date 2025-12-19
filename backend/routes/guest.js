const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const rooms = require('../controllers/roomsController');
const bookings = require('../controllers/bookingsController');
const { body } = require('express-validator');
const { runValidation } = require('../middleware/validation');

// public listing
router.get('/rooms', rooms.listRooms);
router.get('/rooms/:id', rooms.getRoom);

// create booking (must be authenticated as guest)
router.post('/bookings', authenticate, authorize(['guest','receptionist','staff','admin','superadmin']), [body('roomId').isInt(), body('startDate').isISO8601(), body('endDate').isISO8601(), runValidation], bookings.createBooking);

module.exports = router;
