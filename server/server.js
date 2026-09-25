const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');

const { PORT, CLIENT_URL } = require('./config/env');
const { connectDB } = require('./config/db');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { setSocketIO } = require('./services/ingestionService');
const seedDatabase = require('./seed/seedDatabase');
const Station = require('./models/Station');

const app = express();
const server = http.createServer(app);

// Socket.IO Setup for real-time dashboard updates
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});
setSocketIO(io);

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Weather Sentinel AI API Engine',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount API routes
app.use('/api', apiRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected to Weather Sentinel real-time stream: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Centralized error handler
app.use(errorHandler);

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    // Check if initial seeding is needed
    const stationCount = await Station.countDocuments({});
    if (stationCount === 0) {
      console.log('⚡ Initializing fresh database with 25 AWS stations...');
      await seedDatabase();
    } else {
      console.log(`ℹ️ Found ${stationCount} existing stations in database.`);
    }

    server.listen(PORT, () => {
      console.log(`
=====================================================
☁️  WEATHER SENTINEL AI - BACKEND OPERATIONAL
📡  Tagline: Trustworthy Weather Data. Safer Decisions.
🚀  REST API:   http://localhost:${PORT}/api
🔌  Socket.IO:  ws://localhost:${PORT}
💚  Health:     http://localhost:${PORT}/health
=====================================================
      `);
    });
  } catch (err) {
    console.error('Fatal Server Startup Error:', err);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server };
