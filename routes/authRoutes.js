// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controller/authController')


// Register Route
router.post('/register',authController.register);

// Login Route
router.post('/login', authController.login);

// verify email
router.post('/verify-email', authController.verifyEmail);

module.exports = router;
