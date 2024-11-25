const express = require('express');
const dotenv = require('dotenv');
const connectToMongo = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoute');
const bookingRoutes = require('./routes/bookingRoute');

dotenv.config();

const app = express();
connectToMongo();

//middlewares
app.use(express.json()); //parse json bodies


//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/booking', bookingRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));