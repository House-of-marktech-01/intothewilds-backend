const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  checkInDate: { type: Date },
  checkOutDate: { type: Date },
  amount: { type: Number },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  Date: { type: Date, default: Date.now },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  tour: { type: String },
});
module.exports = mongoose.model('Booking', bookingSchema);
