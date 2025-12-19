const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const rooms = require('../controllers/roomsController');
const bookings = require('../controllers/bookingsController');

// public listing
router.get('/rooms', rooms.listRooms);
router.get('/rooms/:id', rooms.getRoom);

// create booking (must be authenticated as guest)
router.post('/bookings', authenticate, authorize(['guest','receptionist','staff','admin','superadmin']), bookings.createBooking);

module.exports = router;
