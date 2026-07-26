require('dotenv').config();
const app = require('./app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Always attempt to connect. We fallback to localhost if MONGODB_URI is not in .env
  await connectDB();
  
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections globally
  process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();
