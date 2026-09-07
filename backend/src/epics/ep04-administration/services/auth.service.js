'use strict';

const jwt = require('jsonwebtoken');
const { config } = require('../../../config/environment');

/**
 * EP-04 Admin Authentication Service
 *
 * Validates the admin access key (server-side only).
 * The key is NEVER sent back in API responses.
 * On success, issues a signed JWT.
 */

/**
 * Validate the admin access key and return a signed JWT.
 * @param {string} key - The access key submitted by the user
 * @returns {{ token: string, admin: object }}
 * @throws {Error} if key is invalid
 */
function validateAdminKey(key) {
  if (!key || typeof key !== 'string') {
    throw createAuthError('Invalid access key.');
  }

  // Constant-time comparison to prevent timing attacks
  const expectedKey = config.admin.accessKey;
  if (!safeCompare(key.trim(), expectedKey)) {
    throw createAuthError('Invalid access key.');
  }

  const payload = {
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
  };

  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    issuer: 'genz-store',
  });

  return {
    token,
    admin: {
      role: payload.role,
    },
  };
}

/**
 * Simple constant-time string comparison.
 */
function safeCompare(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function createAuthError(message) {
  const err = new Error(message);
  err.isOperational = true;
  err.statusCode = 401;
  return err;
}

module.exports = { validateAdminKey };
