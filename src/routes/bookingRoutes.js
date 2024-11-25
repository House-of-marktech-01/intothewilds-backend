const express = require('express');
const bookingController = require('../controllers/bookingController');
// const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');
// const { validateBooking } = require('../middleware/validateInputs');

const router = express.Router();

// Create a booking
router.post('/new-booking', bookingController.createBooking);

// Get all bookings (Admin only)
router.get('/get-all-bookings', bookingController.getBookings);

// Update booking status
router.put('/update/:id', bookingController.updateBookingStatus);

// Cancel a booking
router.delete('/cancel/:id',bookingController.cancelBooking);

module.exports = router;
