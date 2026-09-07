'use strict';

const { Router } = require('express');
const {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require('../controllers/supplier.controller');
const { requireAdminAuth } = require('../../../middleware/auth.middleware');

const router = Router();

// Require admin authentication for all supplier operations
router.use(requireAdminAuth);

/**
 * GET /api/admin/suppliers - list with search & category filters
 */
router.get('/', getSuppliers);

/**
 * GET /api/admin/suppliers/:id - get single supplier
 */
router.get('/:id', getSupplier);

/**
 * POST /api/admin/suppliers - create new supplier
 */
router.post('/', createSupplier);

/**
 * PUT /api/admin/suppliers/:id - update supplier
 */
router.put('/:id', updateSupplier);

/**
 * DELETE /api/admin/suppliers/:id - delete supplier
 */
router.delete('/:id', deleteSupplier);

module.exports = router;
