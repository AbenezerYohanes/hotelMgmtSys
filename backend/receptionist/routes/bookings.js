const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const ctrl = require('../controllers/bookingsController');

router.use(auth, roleGuard(['receptionist']));
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.post('/:id/cancel', ctrl.cancel);

module.exports = router;
