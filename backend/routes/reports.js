const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { occupancy, revenue } = require('../controllers/reportsController');

router.use(authenticate, authorize(['admin','superadmin']));

router.get('/occupancy', occupancy);
router.get('/revenue', revenue);

module.exports = router;
