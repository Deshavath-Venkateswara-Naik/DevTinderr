const mongoose = require("mongoose");

const connectDB = async () => {
 console.log("📡 Attempting DB connection...");
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
};

module.exports = connectDB;

