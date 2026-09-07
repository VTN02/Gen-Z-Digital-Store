'use strict';

const { config } = require('../config/environment');

/**
 * Central error handling middleware.
 * Must be registered LAST in Express middleware chain.
 */
// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  // Operational errors that are intentional
  if (err.isOperational) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
      ...(config.isDev && { stack: err.stack }),
    });
  }

  // Validation errors from express-validator
  if (err.type === 'validation') {
    return res.status(422).json({
      success: false,
      message: 'Validation failed.',
      errors: err.errors,
    });
  }

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'A record with this value already exists.',
    });
  }

  // Generic server error — never expose internals in production
  console.error('[Error]', err);
  return res.status(500).json({
    success: false,
    message: 'An unexpected error occurred. Please try again later.',
    ...(config.isDev && { error: err.message, stack: err.stack }),
  });
}

module.exports = { errorMiddleware };
