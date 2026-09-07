'use strict';

const dashboardService = require('../services/dashboard.service');

/**
 * EP-04 Dashboard Controller
 */

/**
 * GET /api/admin/dashboard/stats
 */
async function getStats(req, res, next) {
  try {
    const stats = await dashboardService.getOverviewStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/dashboard/recent-orders
 */
async function getRecentOrders(req, res, next) {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const orders = await dashboardService.getRecentOrdersList(limit);
    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStats,
  getRecentOrders,
};
