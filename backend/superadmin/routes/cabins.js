const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const cabinsController = require('../controllers/cabinsController');

router.use(authenticate, authorizeRole('superadmin'));
router.get('/', cabinsController.list);
router.post('/', cabinsController.create);
router.put('/:id', cabinsController.update);
router.delete('/:id', cabinsController.remove);

module.exports = router;
