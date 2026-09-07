'use strict';

/**
 * Environment configuration validator.
 * Throws on startup if required variables are missing.
 */

const REQUIRED_VARS = [
  'PORT',
  'NODE_ENV',
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
  'ADMIN_ACCESS_KEY',
];

function validateEnvironment() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `[Config] Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file.'
    );
  }
}

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',

  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  },

  admin: {
    accessKey: process.env.ADMIN_ACCESS_KEY,
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
};

module.exports = { config, validateEnvironment };
