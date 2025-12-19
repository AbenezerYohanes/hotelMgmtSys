const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const ctrl = require('../controllers/checkinController');

router.use(auth, roleGuard(['receptionist']));
router.post('/', ctrl.checkin);

module.exports = router;
