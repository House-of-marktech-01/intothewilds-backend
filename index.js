const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
// require("dotenv").config();
// const loadEnv = require("./src/config/env");
// loadEnv();

// Importing Routes
const authRoutes = require("./src/routes/authRoutes");
const inventoryRoutes = require("./src/routes/inventoryRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("Database connection error:", error));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/booking", bookingRoutes);
// app.use("/api/v1/", );
// app.use("/api/v1/", );

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
