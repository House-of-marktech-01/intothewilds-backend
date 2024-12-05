const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  checkInDate: { type: Date },
  checkOutDate: { type: Date },
  amount: { type: Number },
  adults: { type: Number, default: 0 },
  children: { type: Number, default: 0 },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  Date: { type: Date, default: Date.now },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  tour: { type: String },
  roomBooked:{type:Number,default:0}
});
module.exports = mongoose.model('Booking', bookingSchema);
