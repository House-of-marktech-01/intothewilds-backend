// // paymentController.js
// const Payment = require("../models/Payment");
// const Razorpay = require("razorpay");
// const crypto = require("crypto");

// // Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET_KEY,
// });

// // Create Razorpay payment
// exports.createRazorpayPayment = async (req, res) => {
//   const { amount, currency, bookingId, userId } = req.body;

//   try {
//     const options = {
//       amount: amount * 100, // Amount in the smallest currency unit
//       currency,
//       receipt: `${bookingId}_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);

//     const payment = await Payment.create({
//       bookingId,
//       userId,
//       amount,
//       currency,
//       transactionId: order.id,
//       paymentGateway: "Razorpay",
//       status: "Pending",
//     });

//     res.status(200).json({ orderId: order.id, paymentId: payment._id });
//   } catch (error) {
//     res.status(500).json({ message: "Razorpay payment failed", error });
//   }
// };

// // Verify Razorpay payment
// exports.verifyRazorpayPayment = async (req, res) => {
//   const { paymentId, orderId, signature } = req.body;

//   const body = `${orderId}|${paymentId}`;
//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
//     .update(body)
//     .digest("hex");

//   if (expectedSignature !== signature) {
//     return res.status(400).json({ message: "Invalid signature" });
//   }

//   try {
//     await Payment.updateOne(
//       { transactionId: orderId },
//       { status: "Completed" }
//     );
//     res.status(200).json({ message: "Payment verified and completed" });
//   } catch (error) {
//     res.status(500).json({ message: "Verification failed", error });
//   }
// };

// // Update payment status
// exports.updatePaymentStatus = async (req, res) => {
//   const { paymentId, status } = req.body;

//   try {
//     const payment = await Payment.findByIdAndUpdate(
//       paymentId,
//       { status },
//       { new: true }
//     );
//     res.status(200).json({ message: "Payment status updated", payment });
//   } catch (error) {
//     res.status(500).json({ message: "Status update failed", error });
//   }
// };
