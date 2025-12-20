const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Employee, Role } = require('../models');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Create employee (admin/superadmin)
router.post('/', authenticateJWT, authorizeRoles('admin', 'superadmin'), async (req, res, next) => {
    try {
        const { first_name, last_name, email, password, role_id, hotel_id } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const employee = await Employee.create({ first_name, last_name, email, password: hashed, role_id, hotel_id });
        res.json({ employee });
    } catch (err) { next(err); }
});

// List employees (admin)
router.get('/', authenticateJWT, authorizeRoles('admin', 'superadmin'), async (req, res, next) => {
    try {
        const list = await Employee.findAll({ include: [{ model: Role }] });
        res.json({ employees: list });
    } catch (err) { next(err); }
});

// Get self profile
router.get('/me', authenticateJWT, async (req, res, next) => {
    try {
        const user = await Employee.findByPk(req.user.id);
        res.json({ user });
    } catch (err) { next(err); }
});

module.exports = router;
