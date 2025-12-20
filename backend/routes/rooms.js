const express = require('express');
const router = express.Router();
const { Room } = require('../models');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Create room (admin)
router.post('/', authenticateJWT, authorizeRoles('admin', 'superadmin'), async (req, res, next) => {
    try {
        const room = await Room.create(req.body);
        res.json({ room });
    } catch (err) { next(err); }
});

// List rooms (public)
router.get('/', async (req, res, next) => {
    try {
        const rooms = await Room.findAll();
        res.json({ rooms });
    } catch (err) { next(err); }
});

module.exports = router;
