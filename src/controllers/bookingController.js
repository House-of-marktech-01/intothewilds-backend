const Booking = require('../models/Booking');
const Inventory = require('../models/Inventory');
const User = require('../models/User');

exports.createBooking = async (req, res) => {
    try {
        const { userId, roomId, checkInDate, checkOutDate, guests, specialRequests } = req.body;

        if (new Date(checkInDate) >= new Date(checkOutDate)) {
            return res.status(400).json({ message: 'Check-out date must be after check-in date.' });
        }

        const room = await Inventory.findById(roomId);
        if (!room || !room.availabilityStatus) {
            return res.status(400).json({ message: 'Room is not available for booking.' });
        }

        const diffTime = new Date(checkOutDate) - new Date(checkInDate);
        const numNights = diffTime / (1000 * 3600 * 24); // Convert time to days

        if (numNights <= 0) {
            return res.status(400).json({ message: 'Invalid dates. Check-out must be later than check-in.' });
        }

        const totalAmount = room.ratePerNight * numNights * guests;

        // Create the booking
        const newBooking = new Booking({
            userId,
            roomId,
            checkInDate,
            checkOutDate,
            guests,
            totalAmount,
            specialRequests,
            bookingStatus: 'pending',
            paymentStatus: 'unpaid'
        });

        await newBooking.save();

        // Update room availability
        room.availabilityStatus = false;  // Mark the room as unavailable
        await room.save();

        return res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to create booking', error: error.message });
    }
};

// Get all bookings for a user
exports.getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;

        const bookings = await Booking.find({ userId }).populate('roomId').populate('userId');

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this user.' });
        }

        return res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { bookingStatus, paymentStatus } = req.body;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        booking.bookingStatus = bookingStatus || booking.bookingStatus;
        booking.paymentStatus = paymentStatus || booking.paymentStatus;

        await booking.save();

        return res.status(200).json({ message: 'Booking status updated successfully', booking });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to update booking status', error: error.message });
    }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findByIdAndDelete(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        // Update room availability
        const room = await Inventory.findById(booking.roomId);
        room.availabilityStatus = true; // Mark the room as available again
        await room.save();

        return res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to delete booking', error: error.message });
    }
};

// Get all bookings (admin)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('roomId').populate('userId');

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found.' });
        }

        return res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
};
