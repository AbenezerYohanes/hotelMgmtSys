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
const { body } = require('express-validator');
const { runValidation } = require('../middleware/validation');

router.get('/users', users.listUsers);
router.post('/users', [body('email').isEmail(), body('password').isLength({ min: 6 }), body('role').isIn(['superadmin','admin','staff','receptionist','guest']), runValidation], users.createUser);
router.get('/users/:id', users.getUser);
router.put('/users/:id', [body('email').optional().isEmail(), body('role').optional().isIn(['superadmin','admin','staff','receptionist','guest']), runValidation], users.updateUser);
router.delete('/users/:id', users.deleteUser);

module.exports = router;
