const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log('Mongoose connected');
  } catch (err) {
    console.log('Error connecting to MongoDB', err);
    process.exit(1);
  }
}

module.exports = connectDB;
