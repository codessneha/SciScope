const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const morganMiddleware = require('./middleware/logger');
const logger = require('./utils/logger');

// Load env vars
dotenv.config();

// Set default NODE_ENV
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to database
connectDB();

// Initialize express
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// HTTP request logger
app.use(morganMiddleware);

// Mount routers
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/papers', require('./routes/paperRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/graph', require('./routes/graphRoutes'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PaperNova API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to PaperNova API',
    version: '1.0.0',
  });
});

// ✅ Handle 404 FIRST
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ✅ Error handler must be LAST
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Graceful shutdown (important for nodemon & Docker)
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully.');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully.');
  server.close(() => process.exit(0));
});

module.exports = app;
