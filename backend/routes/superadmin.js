const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const rooms = require('../controllers/roomsController');
const users = require('../controllers/usersController');

// Superadmin can manage rooms and users (users endpoints minimal here)
router.use(authenticate, authorize(['superadmin']));

router.get('/rooms', rooms.listRooms);
router.post('/rooms', rooms.createRoom);
router.get('/rooms/:id', rooms.getRoom);
router.put('/rooms/:id', rooms.updateRoom);
router.delete('/rooms/:id', rooms.deleteRoom);

// user management
router.get('/users', users.listUsers);
router.post('/users', users.createUser);
router.get('/users/:id', users.getUser);
router.put('/users/:id', users.updateUser);
router.delete('/users/:id', users.deleteUser);

module.exports = router;
