const express = require('express');
const router = express.Router();
const { Reservation, Room } = require('../models');
const { authenticateJWT } = require('../middleware/auth');

// Create reservation (guest or receptionist)
router.post('/', authenticateJWT, async (req, res, next) => {
    try {
        const reservation = await Reservation.create(req.body);
        // Optionally update room status
        await Room.update({ status: 'booked' }, { where: { id: reservation.room_id } });
        res.json({ reservation });
    } catch (err) { next(err); }
});

// Get reservations for guest
router.get('/my', authenticateJWT, async (req, res, next) => {
    try {
        const reservations = await Reservation.findAll({ where: { guest_id: req.user.id } });
        res.json({ reservations });
    } catch (err) { next(err); }
});

module.exports = router;
