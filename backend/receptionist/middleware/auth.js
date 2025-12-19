const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async function(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ success: false, message: 'Missing authorization header' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid token' });
    req.user = { id: user.id, role: user.role, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
