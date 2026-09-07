'use strict';

require('dotenv').config();

const { validateEnvironment } = require('./config/environment');
const { testConnection } = require('./config/database');

// Validate env before starting
validateEnvironment();

const app = require('./app');
const { config } = require('./config/environment');

const PORT = config.port;

async function startServer() {
  try {
    // Test DB connection (non-fatal in dev if DB not running)
    await testConnection();
  } catch (err) {
    if (config.isDev) {
      console.warn('[Server] Database not available — continuing in dev mode without DB.');
    } else {
      console.error('[Server] Database connection required in production.');
      process.exit(1);
    }
  }

  app.listen(PORT, () => {
    console.log(`\n  ╔══════════════════════════════════════╗`);
    console.log(`  ║     Gen-Z Store Backend              ║`);
    console.log(`  ║     http://localhost:${PORT}           ║`);
    console.log(`  ║     Environment: ${config.nodeEnv.padEnd(18)}║`);
    console.log(`  ╚══════════════════════════════════════╝\n`);
  });
}

startServer();
