'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const { config } = require('./config/environment');
const { errorMiddleware } = require('./middleware/error.middleware');

// Route imports
const adminAuthRoutes = require('./epics/ep04-administration/routes/auth.routes');
const adminDashboardRoutes = require('./epics/ep04-administration/routes/dashboard.routes');
const supplierRoutes = require('./modules/supplier-procurement/routes/supplier.routes');

const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: config.cors.origin,
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Request Parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Logging ─────────────────────────────────────────────────────────────────
if (config.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Gen-Z Store API',
    version: '1.0.0',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/suppliers', supplierRoutes);

// EP-01 (Developer 1) — placeholder
// app.use('/api/products', productRoutes);

// EP-02 (Developer 2) — placeholder
// app.use('/api/orders', orderRoutes);

// EP-03 — placeholder (Stage 2)
// app.use('/api/deliveries', deliveryRoutes);
// app.use('/api/reviews', reviewRoutes);

// EP-04 Admin — placeholder (Stage 2)
// app.use('/api/admin', adminRoutes);

// Supplier module — placeholder (Stage 2)
// app.use('/api/suppliers', supplierRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

// ─── Central Error Handler ────────────────────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
