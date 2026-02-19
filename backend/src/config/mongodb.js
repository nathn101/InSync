const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    await mongoose.connect(MONGODB_URI);
  } catch (err) {
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;