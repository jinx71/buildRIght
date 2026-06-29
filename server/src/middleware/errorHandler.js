// One place where every error becomes a consistent { success:false, message, errors } body.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Internal Server Error';
  let errors = [];

  // Mongoose validation error → 400 with field messages
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => e.message);
  }

  // Duplicate key (e.g. email already registered) → 409
  if (err.code === 11000) {
    status = 409;
    message = `Duplicate value for: ${Object.keys(err.keyValue || {}).join(', ')}`;
  }

  // Invalid ObjectId → 400
  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // JWT errors → 401
  if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Session expired — please sign in again';
  }

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error('❌', err.stack || err.message);
  }

  res.status(status).json({ success: false, message, errors });
};

module.exports = errorHandler;
