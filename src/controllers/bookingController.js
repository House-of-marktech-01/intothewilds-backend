const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Razorpay = require('razorpay');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { user, room, checkInDate, checkOutDate } = req.body;

    const roomDetails = await Room.findById(room)
    if (!roomDetails || !roomDetails.availability) {
      return res.status(400).json({ error: 'Room not available.' });
    }

    const newBooking = new Booking({ user, room, checkInDate, checkOutDate });
    await newBooking.save();

    res.status(201).json({ message: 'Booking created successfully!', booking: newBooking });
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
