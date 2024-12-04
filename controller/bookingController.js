const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();
const Property = require('../models/Properties');

const razorpay = new Razorpay({
  key_id:"rzp_test_S7O9aeETo3NXrl",
  key_secret:"f0Intwdd1mbIxnqEEAWhqL8k",
}); 

// Create a new booking and Razorpay order
exports.createBooking = async (req, res) => {
  try {
    const { user, checkInDate, checkOutDate, amount, property, tour ,adults,children} = req.body;
    
    if(property) {
      const propertyDetails = await Property.findById(property);
      if(!propertyDetails) return res.status(400).json({error: "Property not found"});
      
      const existingBookings = await Booking.find({
        property: property,
        status: 'confirmed',
        $or: [
          {
            checkInDate: { $lt: checkOutDate },
            checkOutDate: { $gt: checkInDate }
          }
        ]
      });

      const bookedRoomsCount = existingBookings.length;
      
      if (bookedRoomsCount >= propertyDetails.bedroom) {
        return res.status(400).json({
          success:false,
          message: "No rooms available for the selected dates"
        });
      }
    }

    const options = {
      amount: amount * 100, 
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
        children,
        adults,
        amount,
        razorpayOrderId: order.id,
        razorpayPaymentId: null,
        property,
        tour,
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
    const bookings=await Booking.find().populate('user');
    res.status(200).json({success:true,bookings});
  }
  catch(err){
    res.status(500).json({error:err.message});
  }
}

exports.updateBookingStatus=async(req,res)=>{
  try{
    const {id}=req.params;
    if(!id) return res.status(400).json({error:"Booking ID is required"});
    const booking=await Booking.findByIdAndUpdate(id,{$set:{status:req.body.status}},{new:true});
    res.status(200).json({message:"Booking status updated successfully",booking});
  }
  catch(err){
    res.status(500).json({error:err.message});
  }
}

exports.getBookingByUserId=async(req,res)=>{
  try{
    const {id}=req.params;
    const bookings=await Booking.find({user:id});
    res.status(200).json({success:true,bookings});
  }
  catch(err){
    res.status(500).json({error:err.message});
  }
}
