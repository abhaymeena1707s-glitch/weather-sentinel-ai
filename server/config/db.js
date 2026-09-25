const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

let isConnected = false;
let useInMemory = false;

const connectDB = async () => {
  if (process.env.USE_IN_MEMORY === 'true') {
    useInMemory = true;
    console.log('⚡ Running in In-Memory Database Mode (Zero external DB dependency)');
    return true;
  }

  try {
    mongoose.set('strictQuery', false);
    // Attempt connection with 3-second timeout
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected to: ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB connection failed (${error.message}).`);
    console.log('⚡ Automatically activating Embedded In-Memory Store for full offline standalone operation.');
    useInMemory = true;
    return false;
  }
};

const getDbStatus = () => ({
  isConnected,
  useInMemory,
  mode: useInMemory ? 'in-memory-store' : 'mongodb'
});

module.exports = {
  connectDB,
  getDbStatus,
  isInMemory: () => useInMemory
};
