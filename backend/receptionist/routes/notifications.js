const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const { Notification } = require('../models');

router.use(auth, roleGuard(['receptionist']));

router.get('/', async (req, res, next) => {
  try {
    const notifs = await Notification.findAll({ where: { userId: req.user.id } });
    res.json({ success: true, data: notifs });
  } catch (err) { next(err); }
});

module.exports = router;