'use strict';

const jwt = require('jsonwebtoken');
const { config } = require('../config/environment');

/**
 * Admin authentication middleware.
 * Validates JWT from Authorization header (Bearer token) or httpOnly cookie.
 */
function requireAdminAuth(req, res, next) {
  try {
    let token = null;

    // 1. Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }

    // 2. Fall back to httpOnly cookie
    if (!token && req.cookies && req.cookies.admin_token) {
      token = req.cookies.admin_token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    req.admin = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please authenticate again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.',
    });
  }
}

module.exports = { requireAdminAuth };
