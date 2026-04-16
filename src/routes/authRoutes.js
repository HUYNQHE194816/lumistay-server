const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route này dùng để đồng bộ dữ liệu sau khi FE login Google thành công
router.post('/google-sync', authController.googleSync);

module.exports = router;