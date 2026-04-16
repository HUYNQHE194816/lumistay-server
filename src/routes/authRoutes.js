const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Chỉ cần duy nhất 1 route này cho Google
router.post('/google-sync', authController.googleLoginSync);

module.exports = router;