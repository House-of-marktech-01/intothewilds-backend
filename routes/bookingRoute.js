const express = require('express');
const bookingController = require('../controller/bookingController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
// const { validateBooking } = require('../middleware/validateInputs');

const router = express.Router();

// Create a booking
router.post('/new-booking',authenticateToken, bookingController.createBooking);

// Get all bookings (Admin only)
router.get('/get-all-bookings' ,authenticateToken, authorizeRole('admin') , bookingController.getBookings);

// Update booking status (admin only)
router.put('/update/:id',authenticateToken, authorizeRole('admin') , bookingController.updateBookingStatus);

// Cancel a booking (admin only)
router.delete('/cancel/:id',authenticateToken, authorizeRole('admin') ,bookingController.cancelBooking);

//verify payment
router.delete('/verify-payment', bookingController.verifyPayment);

module.exports = router;
