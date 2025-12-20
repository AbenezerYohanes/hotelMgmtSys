const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const pricingController = require('../controllers/pricingController');

router.use(authenticate, authorizeRole('superadmin'));
router.get('/', pricingController.list);
router.post('/', pricingController.create);
router.get('/history', pricingController.history);

module.exports = router;
