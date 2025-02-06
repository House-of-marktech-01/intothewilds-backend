const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();
const Property = require('../models/Properties');
const nodemailer = require('nodemailer');

const razorpay = new Razorpay({
  key_id:"rzp_test_S7O9aeETo3NXrl",
  key_secret:"f0Intwdd1mbIxnqEEAWhqL8k",
}); 

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Create a new booking and Razorpay order
exports.createBooking = async (req, res) => {
  try {
    const { user, checkInDate, checkOutDate, amount, property, tour ,adults,children} = req.body;
    //  console.log(req.body); 
     let roomBooked=0;
     let totalguest=0;
    if(property) {
      const propertyDetails = await Property.findById(property);
      // console.log(propertyDetails);
      if(!propertyDetails) return res.status(400).json({error: "Property not found"});
      
      totalguest = Number(adults) + Number(children);
      roomBooked = Math.ceil(totalguest / propertyDetails.guestCapacity);
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

      // Calculate total booked rooms from existing bookings
      const bookedRoomsCount = existingBookings.reduce((total, booking) => total + booking.roomBooked, 0);
      if (bookedRoomsCount + roomBooked > propertyDetails.bedroom) {
        return res.status(400).json({
          success: false,
          message: "Not enough rooms available for the selected guest sizes and dates"
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
          return res.status(400).json({ message: error.error.description });
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
        roomBooked
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
    
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
      const booking = await Booking.findById(bookingId)
        .populate('user')
        .populate('property');
      
      if(!booking) return res.status(404).json({ error: 'Booking not found.' });
      
      booking.status = 'confirmed';
      booking.razorpayPaymentId = razorpay_payment_id;
      await booking.save();

      // Send confirmation email
      const emailContent = `
        <h2>Booking Confirmation</h2>
        <p>Dear ${booking.user.name},</p>
        <p>Your booking has been confirmed. Here are the details:</p>
        <h3>Booking Details:</h3>
        <ul>
          <li>Check-in Date: ${new Date(booking.checkInDate).toLocaleDateString()}</li>
          <li>Check-out Date: ${new Date(booking.checkOutDate).toLocaleDateString()}</li>
          <li>Amount Paid: ₹${booking.amount}</li>
          <li>Number of Adults: ${booking.adults}</li>
          <li>Number of Children: ${booking.children}</li>
          <li>Payment ID: ${booking.razorpayPaymentId}</li>
        </ul>
        
        <h3>Property Details:</h3>
        <ul>
          <li>Property Name: ${booking.property.name}</li>
          <li>Location: ${booking.property.location}</li>
        </ul>
        
        <p>Thank you for choosing our service!</p>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: booking.user.email,
        subject: 'Booking Confirmation - Into The Wilds',
        html: emailContent,
      });

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
    const bookings = await Booking.find().populate('user property');
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
    const bookings=await Booking.find().populate('user').populate('property');
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

exports.getExploreBookings=async(req,res)=>{
  try{
    const {location,checkInDate,checkOutDate,adults,children}=req.body;
    const properties=await Property.find({location});
    res.status(200).json({success:true,properties});
  }
  catch(err){
    res.status(500).json({error:err.message});
  }
}

exports.getuserbookings=async(req,res)=>{
  try{
    const {userId}=req.user;
    const bookings=await Booking.find({user:userId}).populate('property');
    // console.log(bookings);
    return res.status(200).json({success:true,bookings});
  }
  catch(err){
    // console.log(err)
    res.status(500).json({error:err.message});
  }
}