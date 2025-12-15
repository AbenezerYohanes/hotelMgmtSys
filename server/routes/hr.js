const express = require('express');
const { body, validationResult } = require('express-validator');
const { isManager } = require('../middleware/auth');
const db = require('../config/db');
const { Op } = require('sequelize');
const Department = db && db.Department ? db.Department : null;
const Employee = db && db.Employee ? db.Employee : null;
const User = db && db.User ? db.User : null;

const router = express.Router();

// Get all departments
router.get('/departments', async (req, res) => {
  try {
    if (!Department) return res.status(500).json({ success: false, message: 'Department model not available' });
    const deps = await Department.findAll({ order: [['name','ASC']] });
    const data = await Promise.all(deps.map(async (d) => {
      const mgr = d.manager_id && User ? await User.findByPk(d.manager_id, { attributes: ['first_name','last_name'] }) : null;
      return { id: d.id, name: d.name, description: d.description, manager_id: d.manager_id, manager_name: mgr ? `${mgr.first_name} ${mgr.last_name}` : null };
    }));
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Departments error:', error);
    res.status(500).json({ success: false, message: 'Error fetching departments' });
  }
});

// Create new department
router.post('/departments', isManager, [
  body('name').notEmpty().withMessage('Department name is required'),
  body('description').optional(),
  body('manager_id').optional().isInt().withMessage('Manager ID must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { name, description, manager_id } = req.body;

    if (!Department) return res.status(500).json({ success: false, message: 'Department model not available' });
    const created = await Department.create({ name, description, manager_id: manager_id || null });
    const mgr = created.manager_id && User ? await User.findByPk(created.manager_id, { attributes: ['first_name','last_name'] }) : null;
    return res.status(201).json({ success: true, message: 'Department created successfully', data: { id: created.id, name: created.name, description: created.description, manager_id: created.manager_id, manager_name: mgr ? `${mgr.first_name} ${mgr.last_name}` : null } });
  } catch (error) {
    console.error('Department creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating department' 
    });
  }
});

// Update department
router.put('/departments/:id', isManager, [
  body('name').optional().notEmpty().withMessage('Department name cannot be empty'),
  body('description').optional(),
  body('manager_id').optional().isInt().withMessage('Manager ID must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { name, description, manager_id } = req.body;

    if (!Department) return res.status(500).json({ success: false, message: 'Department model not available' });
    const dept = await Department.findByPk(id);
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    await dept.update({ name: name || dept.name, description: description || dept.description, manager_id: manager_id ? manager_id : dept.manager_id });
    const mgr = dept.manager_id && User ? await User.findByPk(dept.manager_id, { attributes: ['first_name','last_name'] }) : null;
    res.json({ success: true, message: 'Department updated successfully', data: { id: dept.id, name: dept.name, description: dept.description, manager_id: dept.manager_id, manager_name: mgr ? `${mgr.first_name} ${mgr.last_name}` : null } });
  } catch (error) {
    console.error('Department update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating department' 
    });
  }
});

// Get all employees
router.get('/employees', async (req, res) => {
  try {
    const { page = 1, limit = 10, department_id, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    if (!Employee) return res.status(500).json({ success: false, message: 'Employee model not available' });
    const where = {};
    if (department_id) where.department_id = Number(department_id);
    if (status) where.status = status;
    const { rows: items, count: total } = await Employee.findAndCountAll({
      where,
      include: [{ model: Department, attributes: ['id','name'] }],
      order: [['created_at','DESC']],
      limit: Number(limit),
      offset: Number(offset)
    });
    // Attach user info for each employee
    const mapped = await Promise.all(items.map(async (e) => {
      const user = e.user_id && User ? await User.findByPk(e.user_id, { attributes: ['first_name','last_name','email','phone'] }) : null;
      return Object.assign({}, e.get ? e.get({ plain: true }) : e, { user: user ? { first_name: user.first_name, last_name: user.last_name, email: user.email, phone: user.phone } : null });
    }));
    res.json({ success: true, data: mapped, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
  } catch (error) {
    console.error('Employees error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching employees' 
    });
  }
});

// Create new employee
router.post('/employees', isManager, [
  body('user_id').isInt().withMessage('User ID is required'),
  body('employee_id').notEmpty().withMessage('Employee ID is required'),
  body('department_id').isInt().withMessage('Department ID is required'),
  body('position').notEmpty().withMessage('Position is required'),
  body('hire_date').isDate().withMessage('Valid hire date is required'),
  body('salary').isFloat({ min: 0 }).withMessage('Valid salary is required'),
  body('emergency_contact').optional(),
  body('emergency_phone').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { 
      user_id, employee_id, department_id, position, hire_date, 
      salary, emergency_contact, emergency_phone 
    } = req.body;

    if (!Employee) return res.status(500).json({ success: false, message: 'Employee model not available' });
    // Check uniqueness by employee_id or user_id
    const exists = await Employee.findOne({ where: { [Op.or]: [{ employee_id }, { user_id }] } });
    if (exists) return res.status(409).json({ success: false, message: 'Employee already exists' });
    const created = await Employee.create({ user_id, employee_id, department_id: department_id || null, position, hire_date, salary, emergency_contact, emergency_phone });
    // Attach user and department info
    const user = created.user_id && User ? await User.findByPk(created.user_id, { attributes: ['first_name','last_name','email','phone'] }) : null;
    const dept = created.department_id && Department ? await Department.findByPk(created.department_id) : null;
    res.status(201).json({ success: true, message: 'Employee created successfully', data: Object.assign({}, created.get({ plain: true }), { user: user ? { first_name: user.first_name, last_name: user.last_name, email: user.email, phone: user.phone } : null, department_name: dept ? dept.name : null }) });
  } catch (error) {
    console.error('Employee creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating employee' 
    });
  }
});

// Update employee
router.put('/employees/:id', isManager, [
  body('department_id').optional().isInt().withMessage('Department ID must be a number'),
  body('position').optional().notEmpty().withMessage('Position cannot be empty'),
  body('salary').optional().isFloat({ min: 0 }).withMessage('Valid salary is required'),
  body('status').optional().isIn(['active', 'inactive', 'terminated']).withMessage('Invalid status'),
  body('emergency_contact').optional(),
  body('emergency_phone').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { department_id, position, salary, status, emergency_contact, emergency_phone } = req.body;

    if (!Employee) return res.status(500).json({ success: false, message: 'Employee model not available' });
    const emp = await Employee.findByPk(id);
    if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });
    await emp.update({ department_id: department_id ? department_id : emp.department_id, position: position || emp.position, salary: salary || emp.salary, status: status || emp.status, emergency_contact: emergency_contact || emp.emergency_contact, emergency_phone: emergency_phone || emp.emergency_phone });
    const user = emp.user_id && User ? await User.findByPk(emp.user_id, { attributes: ['first_name','last_name','email','phone'] }) : null;
    const dept = emp.department_id && Department ? await Department.findByPk(emp.department_id) : null;
    res.json({ success: true, message: 'Employee updated successfully', data: Object.assign({}, emp.get({ plain: true }), { user: user ? { first_name: user.first_name, last_name: user.last_name, email: user.email, phone: user.phone } : null, department_name: dept ? dept.name : null }) });
  } catch (error) {
    console.error('Employee update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating employee' 
    });
  }
});

// Get employee details
router.get('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!Employee) return res.status(500).json({ success: false, message: 'Employee model not available' });
    const emp = await Employee.findByPk(id, { include: [{ model: Department, attributes: ['id','name'] }] });
    if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });
    const user = emp.user_id && User ? await User.findByPk(emp.user_id, { attributes: ['first_name','last_name','email','phone','address'] }) : null;
    res.json({ success: true, data: Object.assign({}, emp.get({ plain: true }), { user: user ? user.get({ plain: true }) : null, department_name: emp.Department ? emp.Department.name : null }) });
  } catch (error) {
    console.error('Employee details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching employee details' 
    });
  }
});

// Get HR dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    if (!Employee || !Department) return res.status(500).json({ success: false, message: 'Models not available' });
    // Total employees
    const totalRes = await db.sequelize.query('SELECT COUNT(*) as count FROM employees WHERE status = ?', { replacements: ['active'], type: db.Sequelize.QueryTypes.SELECT });
    const totalEmployees = parseInt(totalRes[0].count || 0);
    // Employees by department
    const employeesByDept = await db.sequelize.query(`
      SELECT d.id, d.name, COUNT(e.id) as count
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id AND e.status = 'active'
      GROUP BY d.id, d.name
      ORDER BY count DESC
    `, { type: db.Sequelize.QueryTypes.SELECT });
    // Recent hires
    const recentHires = await db.sequelize.query(`
      SELECT e.*, u.first_name, u.last_name
      FROM employees e
      LEFT JOIN users u ON e.user_id = u.id
      WHERE e.hire_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
      ORDER BY e.hire_date DESC
      LIMIT 5
    `, { type: db.Sequelize.QueryTypes.SELECT });
    // Average salary by department
    const avgSalaryByDept = await db.sequelize.query(`
      SELECT d.name, AVG(e.salary) as avg_salary
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id AND e.status = 'active'
      GROUP BY d.id, d.name
      HAVING AVG(e.salary) IS NOT NULL
      ORDER BY avg_salary DESC
    `, { type: db.Sequelize.QueryTypes.SELECT });

    res.json({ success: true, data: { totalEmployees, employeesByDepartment: employeesByDept, recentHires, averageSalaryByDepartment: avgSalaryByDept } });
  } catch (error) {
    console.error('HR dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching HR dashboard data' 
    });
  }
});

module.exports = router; 