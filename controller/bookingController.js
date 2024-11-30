const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id:"rzp_test_S7O9aeETo3NXrl",
  key_secret:"f0Intwdd1mbIxnqEEAWhqL8k",
}); 

// Create a new booking and Razorpay order
exports.createBooking = async (req, res) => {
  try {
    const { user, checkInDate, checkOutDate, amount } = req.body;
    console.log(user, checkInDate, checkOutDate, amount);
    // Check room availability
    // const roomDetails = await Room.findById(room);
    // if (!roomDetails || !roomDetails.availability) {
    //   return res.status(400).json({ error: 'Room not available.' });
    // }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Amount in the smallest currency unit (e.g., paise for INR)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    razorpay.orders.create(options, async (error, order) => {
      if (error) {
          console.error("Error creating order:", error);
          return res.status(500).send({ message: "Something went wrong" });
      }
      const newBooking = new Booking({
        user,
        checkInDate,
        checkOutDate,
        amount,
        razorpayOrderId: order.id,
        razorpayPaymentId: null,
      });
      await newBooking.save();
      res.status(201).json({
        message: 'Booking created successfully! Complete payment to confirm.',
        booking: newBooking,
        order,
      });

  });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify payment and update booking status
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature,bookingId } = req.body;
    console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature,bookingId);
    
    // Generate the expected signature
    // const generatedSignature = crypto
    //   .createHmac('sha256', '0Intwdd1mbIxnqEEAWhqL8k')
    //   .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    //   .digest('hex');

    // if (generatedSignature === razorpay_signature) {
    //   // Find the booking and update its status to "Confirmed"
    //   const booking = await Booking.findOneAndUpdate(
    //     { razorpayOrderId: razorpay_order_id || razorpayOrderId },
    //     { status: 'Confirmed', razorpayPaymentId: razorpay_payment_id  },
    //     { new: true }
    //   );

    //   if (!booking) return res.status(404).json({ error: 'Booking not found.' });
      const booking = await Booking.findById(bookingId);
      if(!booking) return res.status(404).json({ error: 'Booking not found.' });
      booking.status = 'confirmed';
      booking.razorpayPaymentId = razorpay_payment_id;
      await booking.save();
      res.status(200).json({
        message: 'Payment verified successfully, booking confirmed!',
        booking,
      });
    // } else {
    //   res.status(400).json({ error: 'Invalid payment signature.' });
    // }
    }catch (error) {
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

exports.getAllBookings=async(req,res)=>{
  try{
    const bookings=await Booking.find();
    res.status(200).json({success:true,bookings});
  }
  catch(err){
    res.status(500).json({error:err.message});
  }
}