const express = require("express");
const {
  createRazorpayPayment,
  verifyRazorpayPayment,
  updatePaymentStatus,
} = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// Create a new Razorpay payment
router.post("/create", authMiddleware, createRazorpayPayment);

// Verify Razorpay payment
router.post("/verify", authMiddleware, verifyRazorpayPayment);

// Update payment status
router.put("/status", authMiddleware, updatePaymentStatus);

module.exports = router;
