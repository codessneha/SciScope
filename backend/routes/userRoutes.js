const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateMe,
  updatePassword
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { validate, userValidationRules } = require('../utils/validators');

// Public routes
router.post('/register', validate(userValidationRules.register), register);
router.post('/login', validate(userValidationRules.login), login);

// Private routes
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;