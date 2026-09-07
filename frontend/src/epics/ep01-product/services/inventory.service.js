import apiClient from '../../../services/apiClient';

/**
 * EP-01 Inventory API Service
 * Manages SKU stocks, thresholds, valuations, and stock adjustments.
 */

const FALLBACK_INVENTORY = [
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

let localInventory = [...FALLBACK_INVENTORY];

function calculateStatus(stock, threshold) {
  if (stock <= 0) return 'OUT_OF_STOCK';
  if (stock <= threshold) return 'LOW_STOCK';
  return 'IN_STOCK';
}

/**
 * Fetch all inventory with optional search and filters.
 * @param {object} params - { search, category, status }
 * @returns {Promise<Array>}
 */
export async function getInventory(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'ALL') query.append('category', params.category);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.warehouse && params.warehouse !== 'ALL') query.append('warehouse', params.warehouse);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.order) query.append('order', params.order);

    const response = await apiClient.get(`/api/admin/inventory?${query.toString()}`);
    if (response.data?.data) {
      localInventory = response.data.data;
      return response.data.data;
    }
  } catch {
    // Graceful local fallback
  }

  let result = [...localInventory];
  if (params.search) {
    const q = params.search.toLowerCase().trim();
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.warehouseLocation.toLowerCase().includes(q) ||
        item.supplierName.toLowerCase().includes(q)
    );
  }
  if (params.category && params.category !== 'ALL') {
    result = result.filter((item) => item.category === params.category);
  }
  if (params.status && params.status !== 'ALL') {
    result = result.filter((item) => item.status === params.status);
  }
  if (params.warehouse && params.warehouse !== 'ALL') {
    result = result.filter((item) =>
      item.warehouseLocation.toLowerCase().includes(params.warehouse.toLowerCase())
    );
  }
  if (params.sortBy) {
    result.sort((a, b) => {
      let valA = a[params.sortBy];
      let valB = b[params.sortBy];
      if (typeof valA === 'string') {
        return params.order === 'desc'
          ? valB.localeCompare(valA)
          : valA.localeCompare(valB);
      }
      return params.order === 'desc'
        ? (Number(valB) || 0) - (Number(valA) || 0)
        : (Number(valA) || 0) - (Number(valB) || 0);
    });
  }
  return result;
}

/**
 * Fetch inventory KPI statistics.
 * @returns {Promise<object>}
 */
export async function getInventoryStats() {
  try {
    const response = await apiClient.get('/api/admin/inventory/stats');
    if (response.data?.data) return response.data.data;
  } catch {
    // Graceful fallback
  }

  const totalItems = localInventory.length;
  const totalStockQty = localInventory.reduce((sum, item) => sum + item.stockOnHand, 0);
  const totalValuation = localInventory.reduce((sum, item) => sum + item.stockOnHand * item.retailPrice, 0);
  const lowStockCount = localInventory.filter((item) => item.status === 'LOW_STOCK').length;
  const outOfStockCount = localInventory.filter((item) => item.status === 'OUT_OF_STOCK').length;

  return {
    totalItems,
    totalStockQty,
    totalValuation,
    lowStockCount,
    outOfStockCount,
  };
}

/**
 * Create a new inventory item.
 * @param {object} payload
 * @returns {Promise<object>}
 */
export async function createInventoryItem(payload) {
  try {
    const response = await apiClient.post('/api/admin/inventory', payload);
    return response.data?.data;
  } catch {
    const stock = Number(payload.stockOnHand) || 0;
    const threshold = Number(payload.minThreshold) || 10;
    const newItem = {
      id: `INV-${Date.now().toString().slice(-3)}`,
      sku: payload.sku?.toUpperCase() || `SKU-LOCAL-${Date.now().toString().slice(-3)}`,
      ...payload,
      stockOnHand: stock,
      minThreshold: threshold,
      costPrice: Number(payload.costPrice) || 0,
      retailPrice: Number(payload.retailPrice) || 0,
      status: calculateStatus(stock, threshold),
      lastRestockedAt: new Date().toISOString(),
    };
    localInventory.unshift(newItem);
    return newItem;
  }
}

/**
 * Update inventory record.
 * @param {string} id
 * @param {object} payload
 * @returns {Promise<object>}
 */
export async function updateInventoryItem(id, payload) {
  try {
    const response = await apiClient.put(`/api/admin/inventory/${id}`, payload);
    return response.data?.data;
  } catch {
    const idx = localInventory.findIndex((i) => i.id === id);
    if (idx !== -1) {
      const stock = payload.stockOnHand !== undefined ? Number(payload.stockOnHand) : localInventory[idx].stockOnHand;
      const threshold = payload.minThreshold !== undefined ? Number(payload.minThreshold) : localInventory[idx].minThreshold;
      localInventory[idx] = {
        ...localInventory[idx],
        ...payload,
        stockOnHand: stock,
        minThreshold: threshold,
        status: calculateStatus(stock, threshold),
      };
      return localInventory[idx];
    }
    return payload;
  }
}

/**
 * Quick stock adjustment (restock or deduction).
 * @param {string} id
 * @param {object} data - { quantity, reason, notes }
 * @returns {Promise<object>}
 */
export async function adjustStock(id, data) {
  try {
    const response = await apiClient.post(`/api/admin/inventory/${id}/adjust`, data);
    return response.data?.data;
  } catch {
    const idx = localInventory.findIndex((i) => i.id === id);
    if (idx !== -1) {
      const change = Number(data.quantity) || 0;
      const prevStock = localInventory[idx].stockOnHand;
      const newStock = Math.max(0, localInventory[idx].stockOnHand + change);
      localInventory[idx].stockOnHand = newStock;
      localInventory[idx].status = calculateStatus(newStock, localInventory[idx].minThreshold);
      if (change > 0) localInventory[idx].lastRestockedAt = new Date().toISOString();

      const adjRecord = {
        id: `ADJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        change,
        previousStock: prevStock,
        resultingStock: newStock,
        reason: data.reason || 'MANUAL_ADJUSTMENT',
        notes: data.notes ? data.notes.trim() : '',
        timestamp: new Date().toISOString(),
      };
      if (!localInventory[idx].adjustments) {
        localInventory[idx].adjustments = [];
      }
      localInventory[idx].adjustments.unshift(adjRecord);

      return { item: localInventory[idx], adjustment: adjRecord };
    }
    return {};
  }
}

/**
 * Delete inventory record.
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function deleteInventoryItem(id) {
  try {
    const response = await apiClient.delete(`/api/admin/inventory/${id}`);
    return response.data?.data;
  } catch {
    const idx = localInventory.findIndex((i) => i.id === id);
    if (idx !== -1) {
      const [del] = localInventory.splice(idx, 1);
      return del;
    }
    return { id };
  }
}
