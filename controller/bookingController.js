const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Create a new booking and Razorpay order
exports.createBooking = async (req, res) => {
  try {
    const { user, room, checkInDate, checkOutDate, amount } = req.body;

    // Check room availability
    const roomDetails = await Room.findById(room);
    if (!roomDetails || !roomDetails.availability) {
      return res.status(400).json({ error: 'Room not available.' });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Amount in the smallest currency unit (e.g., paise for INR)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save booking with "Pending" status
    const newBooking = new Booking({
      user,
      room,
      checkInDate,
      checkOutDate,
      amount,
      status: 'pending',
      razorpayOrderId: order.id, // Store the Razorpay order ID
    });
    await newBooking.save();

    res.status(201).json({
      message: 'Booking created successfully! Complete payment to confirm.',
      booking: newBooking,
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify payment and update booking status
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Generate the expected signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      // Find the booking and update its status to "Confirmed"
      const booking = await Booking.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'Confirmed', razorpayPaymentId: razorpay_payment_id },
        { new: true }
      );

      if (!booking) return res.status(404).json({ error: 'Booking not found.' });

      res.status(200).json({
        message: 'Payment verified successfully, booking confirmed!',
        booking,
      });
    } else {
      res.status(400).json({ error: 'Invalid payment signature.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user room');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });

    res.status(200).json({ message: 'Booking updated successfully!', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });

    res.status(200).json({ message: 'Booking cancelled successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
