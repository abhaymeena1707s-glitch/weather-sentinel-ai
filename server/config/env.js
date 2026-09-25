const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/weather_sentinel_ai',
  JWT_SECRET: process.env.JWT_SECRET || 'weather-sentinel-ultra-secret-jwt-key-sih-2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ML_SERVICE_URL: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  MODEL_MODE: process.env.MODEL_MODE || 'mock', // 'mock' or 'python'
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173'
};
