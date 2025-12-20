const express = require('express');
const router = express.Router();
const { Billing } = require('../models');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Create billing record (admin/receptionist)
router.post('/', authenticateJWT, authorizeRoles('receptionist', 'admin', 'superadmin'), async (req, res, next) => {
    try {
        const bill = await Billing.create(req.body);
        res.json({ bill });
    } catch (err) { next(err); }
});

// Get billing by reservation
router.get('/reservation/:id', authenticateJWT, async (req, res, next) => {
    try {
        const bill = await Billing.findOne({ where: { reservation_id: req.params.id } });
        res.json({ bill });
    } catch (err) { next(err); }
});

module.exports = router;
