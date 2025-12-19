module.exports = (requiredRole = 'staff') => (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthenticated' });
  if (user.role !== requiredRole) return res.status(403).json({ error: 'Forbidden - staff only' });
  next();
};
