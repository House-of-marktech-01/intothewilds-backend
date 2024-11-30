const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
require('dotenv').config();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Change if using another provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP
const generateOTP = () => {
  // Generate a 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register user with email verification
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    // Create and save the user
    const user = new User({ email, password, name, isVerified: false });
    await user.save();

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in the database or in-memory cache (for a limited time)
    // Here, we assume you store the OTP in the database (add field in the user model to store OTP temporarily)
    user.otp = otp;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email Address',
      html: `<p>Hello ${name},</p>
             <p>Thank you for registering. Please verify your email address by entering the otp below:</p>
             <p><strong>${otp}</strong></p>
             <p>This otp is valid for 10 mins.</p>`,
    });

    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email to log in.' });
    }

    // Generate JWT for login
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const {_id, name, email: userEmail, role} = user;
    res.json({ token, user: {_id, name, userEmail, role} });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Verify OTP
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;  // OTP should be sent in the request body along with email

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if the OTP matches and is still valid (e.g., within 10 minutes)
    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP.' });
    }

    // Optionally, you can also check for OTP expiration here (e.g., if stored with an expiration time)
    // Here, we're assuming OTP is valid for 10 minutes
    const otpExpirationTime = 10 * 60 * 1000; // 10 minutes in milliseconds
    if (Date.now() - user.otpGeneratedAt > otpExpirationTime) {
      return res.status(400).json({ error: 'OTP has expired.' });
    }

    // Update the user to set isVerified to true
    user.isVerified = true;
    user.otp = null; // Clear OTP after successful verification
    await user.save();

    res.status(200).json({ message: 'Email verified successfully.' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid request.' });
  }
};

exports.getAllUsers=async(req,res)=>{
  try{
    const users=await User.find();
    res.status(200).json({success:true,users});
  }
  catch(err){
    res.status(500).json({error:err.message});
  }
}
