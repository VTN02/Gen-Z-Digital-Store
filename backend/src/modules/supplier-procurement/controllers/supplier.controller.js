'use strict';

const supplierService = require('../services/supplier.service');

/**
 * GET /api/admin/suppliers
 */
async function getSuppliers(req, res, next) {
  try {
    const filters = {
      search: req.query.search,
      category: req.query.category,
      status: req.query.status,
    };
    const suppliers = await supplierService.getAllSuppliers(filters);
    return res.status(200).json({
      success: true,
      data: suppliers,
      total: suppliers.length,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/suppliers/:id
 */
async function getSupplier(req, res, next) {
  try {
    const supplier = await supplierService.getSupplierById(req.params.id);
    return res.status(200).json({
      success: true,
      data: supplier,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/suppliers
 */
async function createSupplier(req, res, next) {
  try {
    const { companyName } = req.body;
    if (!companyName || !companyName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required.',
      });
    }

    const created = await supplierService.createSupplier(req.body);
    return res.status(201).json({
      success: true,
      message: 'Supplier added successfully.',
      data: created,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/suppliers/:id
 */
async function updateSupplier(req, res, next) {
  try {
    const updated = await supplierService.updateSupplier(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Supplier profile updated successfully.',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/suppliers/:id
 */
async function deleteSupplier(req, res, next) {
  try {
    const deleted = await supplierService.deleteSupplier(req.params.id);
    return res.status(200).json({
      success: true,
      message: `Supplier ${deleted.companyName} removed successfully.`,
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
