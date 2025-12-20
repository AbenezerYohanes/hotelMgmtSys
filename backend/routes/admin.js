const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const rooms = require('../controllers/roomsController');
const bookings = require('../controllers/bookingsController');
const hrAdminRoutes = require('../admin/hr/routes/hrRoutes');
const { body } = require('express-validator');
const { runValidation } = require('../middleware/validation');

router.use(authenticate, authorize(['admin','superadmin']));

router.get('/rooms', rooms.listRooms);
router.post('/rooms', [body('name').notEmpty(), body('number').notEmpty(), body('type').notEmpty(), body('price').isFloat({ gt: 0 }), runValidation], rooms.createRoom);

router.get('/bookings', bookings.listBookings);
router.post('/bookings', [body('roomId').isInt(), body('guestId').optional().isInt(), body('startDate').isISO8601(), body('endDate').isISO8601(), runValidation], bookings.createBooking);

// Hotel HR endpoints
router.use('/hr', hrAdminRoutes);

module.exports = router;
