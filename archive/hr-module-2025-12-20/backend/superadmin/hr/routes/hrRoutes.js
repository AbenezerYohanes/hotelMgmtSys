const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../../../middleware/auth');
const { body } = require('express-validator');
const { runValidation } = require('../../../../middleware/validation');
const ctrl = require('../controllers/hrController');

// Mount under /hr in superadmin routes
router.use(authenticate, authorize(['superadmin']));

// Employees
router.get('/employees', ctrl.listEmployees);
router.post('/employees', [body('email').isEmail().withMessage('Invalid email')], ctrl.createEmployee);
router.get('/employees/:id', ctrl.getEmployee);
router.put('/employees/:id', ctrl.updateEmployee);
router.delete('/employees/:id', ctrl.deleteEmployee);

// Departments
router.get('/departments', ctrl.listDepartments);
router.post('/departments', [body('name').notEmpty()], ctrl.createDepartment);

module.exports = router;