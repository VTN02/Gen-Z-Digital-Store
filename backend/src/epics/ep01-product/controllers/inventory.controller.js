'use strict';

const inventoryService = require('../services/inventory.service');

/**
 * EP-01 Inventory Controller
 */

/**
 * GET /api/admin/inventory
 */
async function getInventory(req, res, next) {
  try {
    const filters = {
      search: req.query.search,
      category: req.query.category,
      status: req.query.status,
      warehouse: req.query.warehouse,
      sortBy: req.query.sortBy,
      order: req.query.order,
    };
    const items = await inventoryService.getAllInventory(filters);
    return res.status(200).json({
      success: true,
      data: items,
      total: items.length,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/inventory/stats
 */
async function getStats(req, res, next) {
  try {
    const stats = await inventoryService.getInventoryStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/inventory/:id
 */
async function getInventoryItem(req, res, next) {
  try {
    const item = await inventoryService.getInventoryById(req.params.id);
    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/inventory
 */
async function createItem(req, res, next) {
  try {
    const { name, sku } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required.',
      });
    }

    const created = await inventoryService.createInventoryItem(req.body);
    return res.status(201).json({
      success: true,
      message: 'Inventory item created successfully.',
      data: created,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/inventory/:id
 */
async function updateItem(req, res, next) {
  try {
    const updated = await inventoryService.updateInventoryItem(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Inventory item updated successfully.',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/inventory/:id/adjust
 */
async function adjustStock(req, res, next) {
  try {
    const { quantity, reason, notes } = req.body;
    if (quantity === undefined || Number(quantity) === 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid non-zero adjustment quantity is required.',
      });
    }

    const result = await inventoryService.adjustStock(req.params.id, {
      quantity,
      reason,
      notes,
    });

    return res.status(200).json({
      success: true,
      message: `Stock level updated by ${quantity > 0 ? '+' : ''}${quantity} units.`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/inventory/:id
 */
async function deleteItem(req, res, next) {
  try {
    const deleted = await inventoryService.deleteInventoryItem(req.params.id);
    return res.status(200).json({
      success: true,
      message: `Inventory SKU ${deleted.sku} archived successfully.`,
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getInventory,
  getStats,
  getInventoryItem,
  createItem,
  updateItem,
  adjustStock,
  deleteItem,
};
