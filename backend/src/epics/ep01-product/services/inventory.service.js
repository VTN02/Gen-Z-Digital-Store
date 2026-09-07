'use strict';

/**
 * EP-01 Inventory & Product Stock Service
 * Provides in-memory seeded inventory with stock tracking, low stock alerts, and adjustment logs.
 */

let inventory = [
  {
    id: 'INV-101',
    sku: 'SKU-PERF-01',
    name: 'Noir Intense EDP 50ml',
    category: 'Fragrances & Oud',
    stockOnHand: 4,
    minThreshold: 10,
    costPrice: 4200,
    retailPrice: 8500,
    warehouseLocation: 'Colombo Hub - Bay A1',
    supplierName: 'Ceylon Fragrance Distillers',
    status: 'LOW_STOCK',
    lastRestockedAt: '2026-02-15T09:00:00.000Z',
  },
  {
    id: 'INV-102',
    sku: 'SKU-MEN-02',
    name: 'Charcoal Linen Overshirt (L)',
    category: "Men's Fashion",
    stockOnHand: 38,
    minThreshold: 12,
    costPrice: 4800,
    retailPrice: 8900,
    warehouseLocation: 'EPZ Biyagama - Bay B2',
    supplierName: 'Lanka Fabric Mills PLC',
    status: 'IN_STOCK',
    lastRestockedAt: '2026-02-28T14:30:00.000Z',
  },
  {
    id: 'INV-103',
    sku: 'SKU-MEN-03',
    name: 'Tailored Slim Chino (Navy 32)',
    category: "Men's Fashion",
    stockOnHand: 52,
    minThreshold: 15,
    costPrice: 3100,
    retailPrice: 6500,
    warehouseLocation: 'Colombo Hub - Bay C4',
    supplierName: 'Global Denim Imports Ltd',
    status: 'IN_STOCK',
    lastRestockedAt: '2026-03-01T11:00:00.000Z',
  },
  {
    id: 'INV-104',
    sku: 'SKU-PERF-04',
    name: 'Royal Oud Extrait 100ml',
    category: 'Fragrances & Oud',
    stockOnHand: 24,
    minThreshold: 8,
    costPrice: 8500,
    retailPrice: 16500,
    warehouseLocation: 'Colombo Hub - Safe Vault 1',
    supplierName: 'Ceylon Fragrance Distillers',
    status: 'IN_STOCK',
    lastRestockedAt: '2026-02-20T16:45:00.000Z',
  },
  {
    id: 'INV-105',
    sku: 'SKU-BOY-05',
    name: 'Boys Cargo Joggers (Black 14Y)',
    category: "Boys' Fashion",
    stockOnHand: 0,
    minThreshold: 10,
    costPrice: 1800,
    retailPrice: 3900,
    warehouseLocation: 'Kandy Warehouse - Bay D1',
    supplierName: 'Colombo Apparel Craft',
    status: 'OUT_OF_STOCK',
    lastRestockedAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'INV-106',
    sku: 'SKU-BOY-06',
    name: 'Heavyweight Boxy Graphic Tee (12Y)',
    category: "Boys' Fashion",
    stockOnHand: 6,
    minThreshold: 15,
    costPrice: 1400,
    retailPrice: 3200,
    warehouseLocation: 'Colombo Hub - Bay B3',
    supplierName: 'Colombo Apparel Craft',
    status: 'LOW_STOCK',
    lastRestockedAt: '2026-02-12T13:20:00.000Z',
  },
  {
    id: 'INV-107',
    sku: 'SKU-ACC-07',
    name: 'Full-Grain Leather Cardholder',
    category: 'Accessories',
    stockOnHand: 45,
    minThreshold: 10,
    costPrice: 1900,
    retailPrice: 4200,
    warehouseLocation: 'Colombo Hub - Bay E2',
    supplierName: 'Apex Luxe Packaging Co.',
    status: 'IN_STOCK',
    lastRestockedAt: '2026-02-25T15:00:00.000Z',
  },
  {
    id: 'INV-108',
    sku: 'SKU-MEN-08',
    name: 'Cuban Collar Silk Blend Shirt (M)',
    category: "Men's Fashion",
    stockOnHand: 29,
    minThreshold: 8,
    costPrice: 5200,
    retailPrice: 9800,
    warehouseLocation: 'EPZ Biyagama - Bay B1',
    supplierName: 'Lanka Fabric Mills PLC',
    status: 'IN_STOCK',
    lastRestockedAt: '2026-03-02T10:30:00.000Z',
  },
];

let nextInvId = 109;

function calculateStatus(stock, threshold) {
  if (stock <= 0) return 'OUT_OF_STOCK';
  if (stock <= threshold) return 'LOW_STOCK';
  return 'IN_STOCK';
}

/**
 * Get all inventory items with search & filters.
 */
async function getAllInventory(filters = {}) {
  let result = [...inventory];

  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.warehouseLocation.toLowerCase().includes(q) ||
        item.supplierName.toLowerCase().includes(q)
    );
  }

  if (filters.category && filters.category !== 'ALL') {
    result = result.filter((item) => item.category === filters.category);
  }

  if (filters.status && filters.status !== 'ALL') {
    result = result.filter((item) => item.status === filters.status);
  }

  if (filters.warehouse && filters.warehouse !== 'ALL') {
    result = result.filter((item) =>
      item.warehouseLocation.toLowerCase().includes(filters.warehouse.toLowerCase())
    );
  }

  if (filters.sortBy) {
    result.sort((a, b) => {
      let valA = a[filters.sortBy];
      let valB = b[filters.sortBy];
      if (typeof valA === 'string') {
        return filters.order === 'desc'
          ? valB.localeCompare(valA)
          : valA.localeCompare(valB);
      }
      return filters.order === 'desc'
        ? (Number(valB) || 0) - (Number(valA) || 0)
        : (Number(valA) || 0) - (Number(valB) || 0);
    });
  }

  return result;
}

/**
 * Get single inventory item by ID.
 */
async function getInventoryById(id) {
  const item = inventory.find((i) => i.id === id || i.sku === id);
  if (!item) {
    const err = new Error(`Inventory item with ID ${id} not found.`);
    err.statusCode = 404;
    throw err;
  }
  return item;
}

/**
 * Create a new inventory record.
 */
async function createInventoryItem(data) {
  const stock = Number(data.stockOnHand) || 0;
  const threshold = Number(data.minThreshold) || 10;
  const id = `INV-${nextInvId++}`;

  const newItem = {
    id,
    sku: data.sku ? data.sku.trim().toUpperCase() : `SKU-GENZ-${id}`,
    name: data.name.trim(),
    category: data.category || "Men's Fashion",
    stockOnHand: stock,
    minThreshold: threshold,
    costPrice: Number(data.costPrice) || 0,
    retailPrice: Number(data.retailPrice) || 0,
    warehouseLocation: data.warehouseLocation?.trim() || 'Colombo Hub - Main',
    supplierName: data.supplierName?.trim() || 'General Supplier',
    status: calculateStatus(stock, threshold),
    lastRestockedAt: new Date().toISOString(),
  };

  inventory.unshift(newItem);
  return newItem;
}

/**
 * Update inventory item attributes.
 */
async function updateInventoryItem(id, data) {
  const index = inventory.findIndex((i) => i.id === id);
  if (index === -1) {
    const err = new Error(`Inventory item with ID ${id} not found.`);
    err.statusCode = 404;
    throw err;
  }

  const stock = data.stockOnHand !== undefined ? Number(data.stockOnHand) : inventory[index].stockOnHand;
  const threshold = data.minThreshold !== undefined ? Number(data.minThreshold) : inventory[index].minThreshold;

  inventory[index] = {
    ...inventory[index],
    sku: data.sku ? data.sku.trim().toUpperCase() : inventory[index].sku,
    name: data.name ? data.name.trim() : inventory[index].name,
    category: data.category || inventory[index].category,
    stockOnHand: stock,
    minThreshold: threshold,
    costPrice: data.costPrice !== undefined ? Number(data.costPrice) : inventory[index].costPrice,
    retailPrice: data.retailPrice !== undefined ? Number(data.retailPrice) : inventory[index].retailPrice,
    warehouseLocation: data.warehouseLocation ? data.warehouseLocation.trim() : inventory[index].warehouseLocation,
    supplierName: data.supplierName ? data.supplierName.trim() : inventory[index].supplierName,
    status: calculateStatus(stock, threshold),
    updatedAt: new Date().toISOString(),
  };

  return inventory[index];
}

/**
 * Adjust stock quantity (Restock or Deduct).
 */
async function adjustStock(id, { quantity, reason, notes }) {
  const index = inventory.findIndex((i) => i.id === id);
  if (index === -1) {
    const err = new Error(`Inventory item with ID ${id} not found.`);
    err.statusCode = 404;
    throw err;
  }

  const change = Number(quantity);
  if (isNaN(change) || change === 0) {
    const err = new Error('Adjustment quantity must be a non-zero number.');
    err.statusCode = 400;
    throw err;
  }

  const newStock = Math.max(0, inventory[index].stockOnHand + change);
  const prevStock = inventory[index].stockOnHand;
  inventory[index].stockOnHand = newStock;
  inventory[index].status = calculateStatus(newStock, inventory[index].minThreshold);
  if (change > 0) {
    inventory[index].lastRestockedAt = new Date().toISOString();
  }

  const adjRecord = {
    id: `ADJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    change,
    previousStock: prevStock,
    resultingStock: newStock,
    reason: reason || 'MANUAL_ADJUSTMENT',
    notes: notes ? notes.trim() : '',
    timestamp: new Date().toISOString(),
  };

  if (!inventory[index].adjustments) {
    inventory[index].adjustments = [];
  }
  inventory[index].adjustments.unshift(adjRecord);

  return {
    item: inventory[index],
    adjustment: adjRecord,
  };
}

/**
 * Delete inventory record.
 */
async function deleteInventoryItem(id) {
  const index = inventory.findIndex((i) => i.id === id);
  if (index === -1) {
    const err = new Error(`Inventory item with ID ${id} not found.`);
    err.statusCode = 404;
    throw err;
  }

  const [deleted] = inventory.splice(index, 1);
  return deleted;
}

/**
 * Calculate KPI summary statistics.
 */
async function getInventoryStats() {
  const totalItems = inventory.length;
  const totalStockQty = inventory.reduce((sum, item) => sum + item.stockOnHand, 0);
  const totalValuation = inventory.reduce((sum, item) => sum + item.stockOnHand * item.retailPrice, 0);
  const totalCostValuation = inventory.reduce((sum, item) => sum + item.stockOnHand * item.costPrice, 0);
  const lowStockCount = inventory.filter((item) => item.status === 'LOW_STOCK').length;
  const outOfStockCount = inventory.filter((item) => item.status === 'OUT_OF_STOCK').length;
  const inStockCount = inventory.filter((item) => item.status === 'IN_STOCK').length;

  return {
    totalItems,
    totalStockQty,
    totalValuation,
    totalCostValuation,
    lowStockCount,
    outOfStockCount,
    inStockCount,
  };
}

module.exports = {
  getAllInventory,
  getInventoryById,
  createInventoryItem,
  updateInventoryItem,
  adjustStock,
  deleteInventoryItem,
  getInventoryStats,
};
