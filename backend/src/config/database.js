'use strict';

const mysql = require('mysql2/promise');
const { config } = require('./environment');

/**
 * MySQL2 connection pool.
 * Uses promise-based API throughout the application.
 */
const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

/**
 * Helper: execute a parameterized query and return rows.
 * @param {string} sql
 * @param {Array} params
 * @returns {Promise<Array>}
 */
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

/**
 * Test the database connection on startup.
 */
async function testConnection() {
  try {
    await pool.execute('SELECT 1');
    console.log('[Database] MySQL connection pool established.');
  } catch (err) {
    console.error('[Database] Connection failed:', err.message);
    throw err;
  }
}

module.exports = { pool, query, testConnection };
