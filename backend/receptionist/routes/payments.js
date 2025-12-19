const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const ctrl = require('../controllers/paymentsController');

router.use(auth, roleGuard(['receptionist']));
router.post('/', ctrl.record);
router.get('/', ctrl.list);

module.exports = router;