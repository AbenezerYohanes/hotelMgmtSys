const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const ctrl = require('../controllers/checkoutController');

router.use(auth, roleGuard(['receptionist']));
router.post('/', ctrl.checkout);

module.exports = router;