// Import required modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db"); // Database connection
const loadEnv = require("./config/env"); // Load environment variables

// Load environment variables
loadEnv();

// Route Imports
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const rateRoutes = require("./routes/rateRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/rates", rateRoutes);
app.use("/api/payments", paymentRoutes);

// Server and Socket.io Setup
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Error handling middleware
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

// Server Listener
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
