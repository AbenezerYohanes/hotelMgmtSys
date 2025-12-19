const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const rooms = require('../controllers/roomsController');
const bookings = require('../controllers/bookingsController');

router.use(authenticate, authorize(['admin','superadmin']));

router.get('/rooms', rooms.listRooms);
router.post('/rooms', rooms.createRoom);

router.get('/bookings', bookings.listBookings);
router.post('/bookings', bookings.createBooking);

module.exports = router;
