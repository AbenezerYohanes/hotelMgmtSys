const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Employee, Guest, Role } = require('../models');
require('dotenv').config();

// Employee login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await Employee.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });
        const payload = { id: user.id, email: user.email, role_id: user.role_id };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
        res.json({ token, user: payload });
    } catch (err) {
        next(err);
    }
});

// Guest register/login minimal
router.post('/guest/register', async (req, res, next) => {
    try {
        const { email, password, first_name, last_name } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const guest = await Guest.create({ email, password: hashed, first_name, last_name });
        res.json({ guest: { id: guest.id, email: guest.email } });
    } catch (err) { next(err); }
});

router.post('/guest/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const guest = await Guest.findOne({ where: { email } });
        if (!guest) return res.status(401).json({ message: 'Invalid credentials' });
        const match = await bcrypt.compare(password, guest.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });
        const payload = { id: guest.id, email: guest.email, role: 'guest' };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
        res.json({ token, guest: payload });
    } catch (err) { next(err); }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { runValidation } = require('../middleware/validation');
const { login, register } = require('../controllers/authController');

router.post('/login', [body('email').isEmail(), body('password').isLength({ min: 6 }), runValidation], login);
router.post('/register', [body('email').isEmail(), body('password').isLength({ min: 6 }), body('name').optional().isString(), runValidation], register);

module.exports = router;
