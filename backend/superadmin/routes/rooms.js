const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const roomsController = require('../controllers/roomsController');

router.use(authenticate, authorizeRole('superadmin'));
router.get('/', roomsController.list);
router.post('/', roomsController.create);
router.put('/:id', roomsController.update);
router.delete('/:id', roomsController.remove);

module.exports = router;
