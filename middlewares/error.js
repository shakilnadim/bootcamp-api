const ErrorResponse = require('../utils/ErrorResponse');

function errorHandler(err, req, res, next) {
  let error = { ...err };
  error.message = err.message;

  // log to console for dev
  console.log(err);

  // Mongoose bad object id
  if (err.name === 'CastError') {
    let message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate keys
  if (err.code === 11000) {
    let message = Object.values(err.keyValue)[0] + ' already exists';
    error = new ErrorResponse(message, 400);
  }

  //Mongoose validation error
  if (err.name === 'ValidationError') {
    let message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
}

module.exports = errorHandler;
