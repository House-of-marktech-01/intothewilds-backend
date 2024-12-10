const express = require("express");
const dotenv = require("dotenv");
const connectToMongo = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoute");
const bookingRoutes = require("./routes/bookingRoute");
const userRoutes = require("./routes/userRoutes");
const propertiesRoutes = require("./routes/propertiesRoutes");
const morgan = require("morgan");
const contactRoutes = require("./routes/contactRoutes");
const cors = require("cors");
const propertyListingQueryRoutes = require("./routes/propertyListingQueryRoutes");
const toursQueryRoutes = require("./routes/toursQueryRoutes");
const eventQueryRoutes = require("./routes/eventQueryRoutes");

dotenv.config();

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
}));
app.use(morgan("tiny"));
connectToMongo();


//middlewares
app.use(express.json()); //parse json bodies

//routes
app.get('/', (req, res) => {res.send('ITW Backend is running!')});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/properties", propertiesRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/propertyListingQuery", propertyListingQueryRoutes);
app.use("/api/v1/toursQuery", toursQueryRoutes);
app.use("/api/v1/eventQuery", eventQueryRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

