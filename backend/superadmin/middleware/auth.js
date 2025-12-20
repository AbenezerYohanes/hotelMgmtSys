const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

async function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey');
    req.user = await User.findByPk(payload.id);
    if (!req.user) return res.status(401).json({ error: 'User not found' });
    next();
  } catch (err) { return res.status(401).json({ error: 'Invalid token' }); }
}

function authorizeRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(403).json({ error: 'Forbidden' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Insufficient role' });
    next();
  };
}

module.exports = { authenticate, authorizeRole };
