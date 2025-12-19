const { User } = require('../models');
const { sign } = require('../utils/jwt');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Missing credentials' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (user.role !== 'receptionist') return res.status(403).json({ success: false, message: 'Not allowed' });
    const token = sign(user);
    res.json({ success: true, data: { token, user: { id: user.id, name: user.name, email: user.email } } });
  } catch (err) { next(err); }
};
