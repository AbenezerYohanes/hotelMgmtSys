const jwt = require('jsonwebtoken');
const { query } = require('../database/config');
const db = require('../config/db');
const UserModel = db && db.User ? db.User : null;

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Prefer Sequelize model lookup when available
    const userId = decoded.id || decoded.userId;
    if (UserModel) {
      const found = await UserModel.findByPk(userId, {
        attributes: ['id','username','email','first_name','last_name','role','is_active','privileges']
      });
        if (!found) return res.status(401).json({ message: 'Invalid token' });
        const userObj = found.get ? found.get({ plain: true }) : found;
        if (!userObj.is_active) return res.status(401).json({ message: 'Account is deactivated' });
        // normalize id and userId
        userObj.userId = String(userObj.id);
        req.user = userObj;
        return next();
    }

    // Fallback to raw query
    const result = await query(
      'SELECT id, username, email, first_name, last_name, role, is_active, privileges FROM users WHERE id = ?',
      [userId]
    );

    if (!result.rows || result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = result.rows[0];
    if (!user.is_active) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // keep backward-compatible shape
    user.id = user.id || user.ID || user.userId;
    user.userId = String(user.id);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(500).json({ message: 'Authentication error' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

const isAdmin = authorizeRoles('admin');
const isManager = authorizeRoles('admin', 'manager');
const isStaff = authorizeRoles('admin', 'manager', 'staff');

module.exports = {
  authenticateToken,
  authorizeRoles,
  isAdmin,
  isManager,
  isStaff
};