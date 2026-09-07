import apiClient from './apiClient';

/**
 * EP-04 Dashboard API Service
 */

/**
 * Fetch KPI statistics and category breakdown for Admin Dashboard.
 * @returns {Promise<object>}
 */
export async function getDashboardStats() {
  const response = await apiClient.get('/api/admin/dashboard/stats');
  return response.data?.data;
}

/**
 * Fetch recent customer orders for the store overview.
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getRecentOrders(limit = 10) {
  const response = await apiClient.get(`/api/admin/dashboard/recent-orders?limit=${limit}`);
  return response.data?.data || [];
}
