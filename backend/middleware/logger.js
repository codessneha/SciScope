const morgan = require('morgan');
const logger = require('../utils/logger');

// Create a stream object for Morgan
const stream = {
  write: (message) => logger.http(message.trim())
};

// Skip logging for certain routes in production
const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

// Build the morgan middleware
const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);

module.exports = morganMiddleware;