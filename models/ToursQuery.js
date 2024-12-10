const mongoose = require("mongoose");

const toursQuerySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
});

const ToursQuery = mongoose.model("ToursQuery", toursQuerySchema);

module.exports = ToursQuery;

