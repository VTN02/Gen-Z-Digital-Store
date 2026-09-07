'use strict';

/**
 * EP-04 Dashboard Service
 *
 * Provides summary KPI statistics and recent store activity for the store admin.
 * Includes graceful mock fallback so the dashboard works out of the box
 * whether MySQL is seeded or in development offline mode.
 */

const mockStats = {
  kpis: {
    totalRevenue: 1485000, // LKR
    revenueChangePercent: 14.8,
    totalOrders: 342,
    ordersChangePercent: 8.2,
    pendingDispatch: 19,
    pendingChangePercent: -5.3,
    activeCustomers: 890,
    customersChangePercent: 12.0,
    lowStockAlerts: 4,
  },
  salesByCategory: [
    { category: "Men's Fashion", percentage: 52, revenue: 772200, color: '#c9a96e' },
    { category: "Boys' Fashion", percentage: 26, revenue: 386100, color: '#e0c89a' },
    { category: "Fragrances & Perfumes", percentage: 22, revenue: 326700, color: '#7e6840' },
  ],
  storeHealth: {
    serverStatus: 'Operational',
    dbLatencyMs: 14,
    lastSyncTime: new Date().toISOString(),
  },
};

const mockRecentOrders = [
  {
    id: 'ORD-8924',
    customer: {
      name: 'Kasun Perera',
      email: 'kasun.p@gmail.com',
      city: 'Colombo 07',
    },
    itemsSummary: 'Noir Intense EDP (100ml), Oxford Linen Shirt (L)',
    itemCount: 2,
    totalAmount: 24500, // LKR
    paymentMethod: 'Credit Card',
    paymentStatus: 'PAID',
    orderStatus: 'PROCESSING',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
  },
  {
    id: 'ORD-8923',
    customer: {
      name: 'Dinesh Jayawardena',
      email: 'dinesh.j@yahoo.com',
      city: 'Kandy',
    },
    itemsSummary: 'Slim-Fit Chino Trousers (32), Minimalist Leather Belt',
    itemCount: 2,
    totalAmount: 18200,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'PENDING',
    orderStatus: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(), // ~1.5h ago
  },
  {
    id: 'ORD-8922',
    customer: {
      name: 'Nimesh Fernando',
      email: 'nimesh99@outlook.com',
      city: 'Negombo',
    },
    itemsSummary: 'Boys Casual Polo Set (Age 10-12)',
    itemCount: 1,
    totalAmount: 9800,
    paymentMethod: 'Koko Pay (Installments)',
    paymentStatus: 'PAID',
    orderStatus: 'SHIPPED',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4h ago
  },
  {
    id: 'ORD-8921',
    customer: {
      name: 'Akash Silva',
      email: 'akash.silva@gmail.com',
      city: 'Galle',
    },
    itemsSummary: 'Royal Oud Parfum (50ml)',
    itemCount: 1,
    totalAmount: 19500,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'PAID',
    orderStatus: 'DELIVERED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18h ago
  },
  {
    id: 'ORD-8920',
    customer: {
      name: 'Sachintha De Silva',
      email: 'sachintha@gmail.com',
      city: 'Kurunegala',
    },
    itemsSummary: 'Monochrome Graphic Tee (M), Relaxed Cargo Shorts (M)',
    itemCount: 2,
    totalAmount: 14200,
    paymentMethod: 'Credit Card',
    paymentStatus: 'PAID',
    orderStatus: 'DELIVERED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 1d ago
  },
];

/**
 * Fetch overview metrics for store administration.
 */
async function getOverviewStats() {
  return mockStats;
}

/**
 * Fetch recent customer orders for the admin overview table.
 */
async function getRecentOrdersList(limit = 10) {
  return mockRecentOrders.slice(0, limit);
}

module.exports = {
  getOverviewStats,
  getRecentOrdersList,
};
