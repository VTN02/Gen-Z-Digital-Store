'use strict';

const { validationResult } = require('express-validator');

/**
 * Validation middleware factory.
 * Usage: router.post('/path', [...validationRules], validate, handler)
 *
 * Collects express-validator errors and returns 422 if any exist.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
}

module.exports = { validate };
