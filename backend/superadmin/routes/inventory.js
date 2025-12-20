const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const inventoryController = require('../controllers/inventoryController');

router.use(authenticate, authorizeRole('superadmin'));
router.get('/', inventoryController.list);
router.post('/', inventoryController.create);
router.put('/:id', inventoryController.update);
router.delete('/:id', inventoryController.remove);

module.exports = router;
