'use strict';

const { Router } = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { validateKey, logout, getMe } = require('../controllers/auth.controller');
const { requireAdminAuth } = require('../../../middleware/auth.middleware');
const { validate } = require('../../../middleware/validation.middleware');

const router = Router();

// Rate limit admin auth attempts — max 10 per 15 min per IP
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts. Please try again later.',
  },
});

/**
 * POST /api/admin/auth/validate-key
 * Validates admin access key and issues session token.
 */
router.post(
  '/validate-key',
  authRateLimit,
  [body('key').notEmpty().withMessage('Access key is required.').isString()],
  validate,
  validateKey
);

/**
 * POST /api/admin/auth/logout
 */
router.post('/logout', logout);

/**
 * GET /api/admin/auth/me
 * Returns current admin session.
 */
router.get('/me', requireAdminAuth, getMe);

module.exports = router;
