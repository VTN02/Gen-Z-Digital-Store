'use strict';

const { Router } = require('express');
const {
  getInventory,
  getStats,
  getInventoryItem,
  createItem,
  updateItem,
  adjustStock,
  deleteItem,
} = require('../controllers/inventory.controller');
const { requireAdminAuth } = require('../../../middleware/auth.middleware');

const router = Router();

// Require admin auth for inventory management
router.use(requireAdminAuth);

/**
 * GET /api/admin/inventory/stats - KPI summary metrics
 */
router.get('/stats', getStats);

/**
 * GET /api/admin/inventory - list inventory with filters
 */
router.get('/', getInventory);

/**
 * GET /api/admin/inventory/:id - single inventory SKU
 */
router.get('/:id', getInventoryItem);

/**
 * POST /api/admin/inventory - create inventory record
 */
router.post('/', createItem);

/**
 * PUT /api/admin/inventory/:id - update inventory record
 */
router.put('/:id', updateItem);

/**
 * POST /api/admin/inventory/:id/adjust - stock level adjustment
 */
router.post('/:id/adjust', adjustStock);

/**
 * DELETE /api/admin/inventory/:id - delete inventory record
 */
router.delete('/:id', deleteItem);

module.exports = router;
