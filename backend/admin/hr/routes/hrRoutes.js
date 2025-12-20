const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../../middleware/auth');
const ctrl = require('../../superadmin/hr/controllers/hrController');

// Admin-level HR endpoints (hotel-level)
router.use(authenticate, authorize(['admin','superadmin']));

router.get('/employees', ctrl.listEmployees);
router.get('/employees/:id', ctrl.getEmployee);
router.put('/employees/:id', ctrl.updateEmployee);

router.get('/departments', ctrl.listDepartments);

module.exports = router;
