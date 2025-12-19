const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { runValidation } = require('../middleware/validation');
const { login, register } = require('../controllers/authController');

router.post('/login', [body('email').isEmail(), body('password').isLength({ min: 6 }), runValidation], login);
router.post('/register', [body('email').isEmail(), body('password').isLength({ min: 6 }), body('name').optional().isString(), runValidation], register);

module.exports = router;
