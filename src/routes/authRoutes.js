const express = require("express");
const authController = require("../controllers/authController");
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

//will add the admin privelages later to the register route
const router = express.Router();
router.post("/register",authenticateToken,authorizeRole('admin'), authController.register);
router.post("/login", authController.login);

module.exports = router;
