// env.js
const dotenv = require("dotenv");

// Load environment variables from .env file
const loadEnv = () => {
  dotenv.config();
  console.log("Environment variables loaded.");
};

module.exports = loadEnv;
