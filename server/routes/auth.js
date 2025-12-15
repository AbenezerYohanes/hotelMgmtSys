const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const { Op } = require('sequelize');
const User = db.User;
const { authenticateToken } = require('../middleware/auth');
const { requireRole, requirePrivilege } = require('../middleware/rbac');
const { auditLog } = require('../middleware/audit');

const router = express.Router();

// Register new user (public registration for clients, superadmin for admins)
router.post('/register', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('first_name').optional(),
  body('last_name').optional(),
  body('name').optional(),
  body('role').optional().isIn(['superadmin', 'super_admin', 'admin', 'manager', 'staff', 'user', 'client']).withMessage('Invalid role')
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

    const { email, password } = req.body;
    // support multiple name inputs for backward compatibility
    let { first_name, last_name, name, role = 'client', username } = req.body;

    if (!first_name && !last_name && name) {
      const parts = String(name).trim().split(/\s+/);
      first_name = parts.shift() || '';
      last_name = parts.join(' ') || '';
    }

    // Normalize role values
    if (role === 'superadmin') role = 'super_admin';
    if (role === 'user') role = 'client';

    // Check if user already exists
    const existing = await User.findOne({
      where: {
        [Op.or]: [
          { email },
          { username: username || null }
        ]
      }
    });
    if (existing) return res.status(409).json({ success: false, message: 'Email or username already exists' });

    // Only super_admin can create admin accounts
    if (role === 'admin' || role === 'super_admin') {
      if (!req.user || String(req.user.role).toLowerCase().replace(/\s+/g, '_') !== 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Only super_admin can create admin accounts'
        });
      }
    }

    // Set default privileges based on role
    let defaultPrivileges = {};
    if (role === 'admin') {
      defaultPrivileges = {
        manage_rooms: true,
        manage_bookings: true,
        manage_hr: true,
        view_reports: true
      };
    } else if (role === 'user' || role === 'client') {
      defaultPrivileges = {
        book_rooms: true,
        view_own_bookings: true
      };
    }

    // Override with provided privileges if any
    const userPrivileges = req.body.privileges ? { ...defaultPrivileges, ...req.body.privileges } : defaultPrivileges;

    // Create user via Sequelize (User model hooks will hash password)
    const user = await User.create({
      username: username || null,
      email,
      password, // plain password - model hook will hash
      first_name: first_name || null,
      last_name: last_name || null,
      role,
      privileges: userPrivileges,
      is_active: true,
      created_by: req.user?.id || null
    });

    // Audit log
    await auditLog('user_created', req.user?.id || user.id, user.id, {
      new_user_role: role,
      privileges: userPrivileges
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          privileges: user.privileges,
          is_active: user.is_active
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user'
    });
  }
});

// Login user (MongoDB-backed)
router.post('/login', [
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('username').optional().notEmpty().withMessage('Username cannot be empty'),
  body('password').notEmpty().withMessage('Password is required')
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

    const { email, username, password } = req.body;
    if (!email && !username) {
      return res.status(400).json({ success: false, message: 'Email or username is required' });
    }

    const identifier = email || username;

    // Find user by email OR username
    const found = await User.findOne({ where: { [Op.or]: [{ email: identifier }, { username: identifier }] } });
    if (!found) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (!found.is_active) return res.status(401).json({ success: false, message: 'Account is suspended or deactivated' });

    const isValid = await found.comparePassword(password);
    if (!isValid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = found.generateAuthToken();
    await auditLog('user_login', String(found.id), null, { email: found.email, role: found.role });

    res.json({ success: true, message: 'Login successful', data: { user: {
      id: String(found.id), email: found.email, username: found.username, first_name: found.first_name, last_name: found.last_name, role: found.role, privileges: found.privileges, is_active: found.is_active
    }, token } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Error during login' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['id','email','username','first_name','last_name','role','privileges','is_active','created_at'] });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [ body('first_name').optional().notEmpty().withMessage('First name cannot be empty'), body('last_name').optional().notEmpty().withMessage('Last name cannot be empty') ], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
    const { first_name, last_name } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    await user.save();
    res.json({ success: true, message: 'Profile updated successfully', data: {
      id: user.id, email: user.email, username: user.username, first_name: user.first_name, last_name: user.last_name, role: user.role, privileges: user.privileges, is_active: user.is_active
    }});
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
});

// Change password
router.put('/change-password', authenticateToken, [ body('current_password').notEmpty().withMessage('Current password is required'), body('new_password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters') ], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
    const { current_password, new_password } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const isValid = await user.comparePassword(current_password);
    if (!isValid) return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    user.password = new_password; // model hook will hash on save
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ success: false, message: 'Error changing password' });
  }
});

module.exports = router; 