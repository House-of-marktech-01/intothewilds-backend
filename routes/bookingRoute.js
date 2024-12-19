const express = require('express');
const bookingController = require('../controller/bookingController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
// const { validateBooking } = require('../middleware/validateInputs');

const router = express.Router();

// Create a booking
router.post('/new-booking', bookingController.createBooking);

// Get all bookings (Admin only)
router.get('/get-all-bookings' ,authenticateToken, authorizeRole('admin') , bookingController.getBookings);
router.get('/userbookings',authenticateToken,bookingController.getuserbookings);
router.get('/explore-bookings',bookingController.getExploreBookings);

// Update booking status (admin only)
router.put('/update/:id',authenticateToken, authorizeRole('admin') , bookingController.updateBookingStatus);

// Cancel a booking (admin only)
router.delete('/cancel/:id' ,bookingController.cancelBooking);

//verify payment
router.post('/verify-payment', bookingController.verifyPayment);

router.get('/getBookings',bookingController.getAllBookings);
router.get('/getBookings/:id',bookingController.getBookingByUserId);
// Update booking status (admin only)
router.post('/:id/status', bookingController.updateBookingStatus);


module.exports = router;
