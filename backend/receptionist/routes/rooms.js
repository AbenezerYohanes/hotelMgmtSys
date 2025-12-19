const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const ctrl = require('../controllers/roomsController');

router.use(auth, roleGuard(['receptionist']));
router.get('/', ctrl.list);
router.patch('/:id/status', ctrl.updateStatus);

module.exports = router;
