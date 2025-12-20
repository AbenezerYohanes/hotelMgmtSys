const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');

router.post('/login', [body('email').isEmail(), body('password').isLength({ min: 6 })], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  return authController.login(req, res, next);
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');

router.post('/login', [body('email').isEmail(), body('password').isLength({ min: 6 })], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  return authController.login(req, res, next);
});

module.exports = router;
