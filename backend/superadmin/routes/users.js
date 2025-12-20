const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const usersController = require('../controllers/usersController');

router.use(authenticate, authorizeRole('superadmin'));

router.get('/', usersController.list);
router.post('/', usersController.create);
router.get('/:id', usersController.get);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.remove);
router.post('/:id/activate', usersController.activate);
router.post('/:id/reset-password', usersController.resetPassword);

module.exports = router;
