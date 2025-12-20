const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/pricing', require('./pricing'));
router.use('/cabins', require('./cabins'));
router.use('/rooms', require('./rooms'));
router.use('/inventory', require('./inventory'));
router.use('/payments', require('./payments'));
router.use('/analytics', require('./analytics'));
router.use('/notifications', require('./notifications'));
router.use('/settings', require('./settings'));

module.exports = router;
