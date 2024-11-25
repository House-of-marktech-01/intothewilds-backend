// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controller/authController')
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');


// Register Route
router.post('/register', authenticateToken, authorizeRole('admin'), authController.register);

// Login Route
router.post('/login', authController.login);

module.exports = router;
