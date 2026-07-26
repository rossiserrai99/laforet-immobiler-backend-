const mongoose = require('mongoose');

const connectDB = async (retries = 3, delay = 5000) => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/laforet';
  
  while (retries > 0) {
    try {
      const conn = await mongoose.connect(uri, {
        autoIndex: process.env.NODE_ENV !== 'production', // Don't auto-build indexes in prod
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB Connection Error: ${error.message}`);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      if (retries === 0) {
        console.error('Failed to connect to MongoDB after multiple attempts. Exiting...');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

module.exports = connectDB;
