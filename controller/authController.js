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
    const { emailorphone, password, name } = req.body;
    // console.log(req.body);
    if (!emailorphone || !password || !name) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // console.log(req.body);
    // Check if the email already exists
    let existingUser;
    if(emailorphone.includes("@")){
      existingUser = await User.findOne({ email: emailorphone });
    }
    else{
      existingUser = await User.findOne({ phone: emailorphone });
    }
    // console.log(existingUser);
    if (existingUser) {
      if (existingUser.email === emailorphone) {
        if(!existingUser.isVerified){
          const otp = generateOTP();
          existingUser.otp = otp;
          existingUser.otpGeneratedAt = Date.now();
          await existingUser.save();
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: emailorphone,
            subject: 'Verify Your Email Address',
            html: `<p>Hello ${name},</p>
                 <p>Thank you for registering. Please verify your email address by entering the otp below:</p>
                 <p><strong>${otp}</strong></p>
                 <p>This otp is valid for 10 mins.</p>`,
          });
          return res.status(201).json({ message: 'Email is already registered. Please verify your email to log in. OTP sent to your email.' });
        }
        else{
          return res.status(400).json({ error: 'Email is already registered.' });
        }
      }
      else {
        const otp = generateOTP();
        existingUser.otp = otp;
        existingUser.otpGeneratedAt = Date.now();
        await existingUser.save();
        const formattedPhone = formatContactNumber(existingUser.phone);
        const fast2smsData = {
          route: "otp",
          variables_values: otp,
          numbers: formattedPhone,
        };
        const fast2smsHeaders = {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        };
        const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
          method: "POST",
          body: JSON.stringify(fast2smsData),
          headers: fast2smsHeaders
        });
        if (response.status === 200) {
          return res.status(201).json({ message: 'Phone number is already registered. Please verify your phone number to log in. OTP sent to your phone number.' });
        }
        else {
          return res.status(400).json({ error: 'Failed to send OTP to your phone number.' });
        }
      }
    }

    // Create and save the user
    const email = emailorphone.includes("@") ? emailorphone : null;
    const phone = emailorphone.includes("@") ? null : emailorphone;
    const user = new User({ email, phone, password, name, isVerified: false });
    // console.log(user);
    await user.save();
    // console.log(user);
    // Generate OTP
    const otp = generateOTP();

    // Store OTP in the database or in-memory cache (for a limited time)
    // Here, we assume you store the OTP in the database (add field in the user model to store OTP temporarily)
    user.otp = otp;
    await user.save();
    if (email) {
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
    }
    else {
      //send sms
      const formatContactNumber = (contactNumber) => {
        if (contactNumber.startsWith("+91")) {
          return contactNumber.slice(3); // Remove +91
        }
        return contactNumber;
      };
      const formattedPhone = formatContactNumber(phone);
      const fast2smsData = {
        route: "otp",
        variables_values: otp,
        numbers: formattedPhone,
      };

      const fast2smsHeaders = {
        authorization: process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      };
      // console.log("fast2smsData", fast2smsData);
      // console.log("fast2smsHeaders", fast2smsHeaders);
      const response = await fetch(
        "https://www.fast2sms.com/dev/bulkV2",
        {
          method: "POST",
          body: JSON.stringify(fast2smsData),
          headers: fast2smsHeaders
        }
      );
      // console.log("response", response);
      if (response.status === 200) {
        res.status(201).json({
          message: 'User registered successfully. Please verify your phone number.',
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { emailorphone, password } = req.body;
    // console.log(req.body);
    if (!emailorphone || !password) {
      console.log("All fields are required");
      return res.status(400).json({ error: "All fields are required" });
    }
    // Find the user
    let user;
    if(emailorphone.includes("@")){
      user = await User.findOne({ email: emailorphone });
    }
    else{
      user = await User.findOne({ phone: emailorphone });
    }
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      const otp = generateOTP();
      user.otp = otp;
      user.otpGeneratedAt = Date.now();
      await user.save();
      if (user.email) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Verify Your Email Address',
          html: `<p>Hello ${user.name},</p>
               <p>Thank you for registering. Please verify your email address by entering the otp below:</p>
               <p><strong>${otp}</strong></p>
               <p>This otp is valid for 10 mins.</p>`,
        });
      }
      return res.status(204).json({ message: 'Please verify your email to log in. OTP sent to your email.' });
    }

    // Generate JWT for login
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const { _id, name, email: userEmail, phone, role } = user;
    res.json({ token, user: { _id, name, userEmail, phone, role } });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};


// Verify OTP
exports.verifyEmail = async (req, res) => {
  try {
    const { emailorphone, otp } = req.body;  // OTP should be sent in the request body along with email

    // Find the user by email
    console.log(emailorphone, otp);
    let user;
    if(emailorphone.includes("@")){
      user = await User.findOne({ email: emailorphone });
    }
    else{
      user = await User.findOne({ phone: emailorphone });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if the OTP matches and is still valid (e.g., within 10 minutes)
    if (user.otp !== otp) {
      console.log(user);
      console.log(user.otp, otp);
      console.log("Invalid OTP");

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
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      message: 'Email verified successfully.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Invalid request.' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.googleSignup = async (req, res) => {
  try {
    const response = req.body;
    const clientId = response.clientId;
    const clientCredentials = response.credential;
    const jwtDecode = jwt.decode(clientCredentials);
    const user = await User.findOne({ email: jwtDecode.email });
    if (user) {
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
        },
        message: "Signed in successfully"
      });
    }
    const newUser = new User({
      email: jwtDecode.email,
      name: jwtDecode.name,
      clientId: clientId,
      isVerified: true,
      avatar: jwtDecode.picture,
    });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        avatar: newUser.avatar,
        role: newUser.role,
      },
      message: "Signed up successfully"
    });
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

