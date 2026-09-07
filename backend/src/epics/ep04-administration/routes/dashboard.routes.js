'use strict';

const { Router } = require('express');
const { getStats, getRecentOrders } = require('../controllers/dashboard.controller');
const { requireAdminAuth } = require('../../../middleware/auth.middleware');

const router = Router();

// All dashboard endpoints require admin authentication
router.use(requireAdminAuth);

/**
 * GET /api/admin/dashboard/stats
 * Overview KPIs and category distribution
 */
router.get('/stats', getStats);

/**
 * GET /api/admin/dashboard/recent-orders
 * List recent orders for admin overview
 */
router.get('/recent-orders', getRecentOrders);

module.exports = router;
