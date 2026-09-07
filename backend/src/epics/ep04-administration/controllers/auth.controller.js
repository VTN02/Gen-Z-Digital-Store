'use strict';

const { validateAdminKey } = require('../services/auth.service');
const { config } = require('../../../config/environment');

/**
 * EP-04 Admin Auth Controller (thin layer — business logic in service)
 */

/**
 * POST /api/admin/auth/validate-key
 * Accepts access key, sets httpOnly cookie on success.
 */
async function validateKey(req, res, next) {
  try {
    const { key } = req.body;
    const { token, admin } = validateAdminKey(key);

    // Set httpOnly cookie — never accessible from JavaScript
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000, // 8 hours in ms
    });

    return res.status(200).json({
      success: true,
      message: 'Authenticated successfully.',
      admin,
      token,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/auth/logout
 * Clears the admin session cookie.
 */
async function logout(req, res) {
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
  });
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
}

/**
 * GET /api/admin/auth/me
 * Returns current session info (requires auth middleware).
 */
async function getMe(req, res) {
  return res.status(200).json({
    success: true,
    admin: req.admin,
  });
}

module.exports = { validateKey, logout, getMe };
