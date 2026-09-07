import apiClient from '../../../services/apiClient';

/**
 * Supplier Management API Service
 */

/**
 * Fetch all suppliers with optional search and filters.
 * @param {object} params - { search, category, status }
 * @returns {Promise<Array>}
 */
export async function getSuppliers(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.category && params.category !== 'ALL') query.append('category', params.category);
  if (params.status && params.status !== 'ALL') query.append('status', params.status);

  const response = await apiClient.get(`/api/admin/suppliers?${query.toString()}`);
  return response.data?.data || [];
}

/**
 * Fetch a single supplier by ID.
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function getSupplierById(id) {
  const response = await apiClient.get(`/api/admin/suppliers/${id}`);
  return response.data?.data;
}

/**
 * Create a new supplier.
 * @param {object} payload
 * @returns {Promise<object>}
 */
export async function createSupplier(payload) {
  const response = await apiClient.post('/api/admin/suppliers', payload);
  return response.data?.data;
}

/**
 * Update an existing supplier.
 * @param {string} id
 * @param {object} payload
 * @returns {Promise<object>}
 */
export async function updateSupplier(id, payload) {
  const response = await apiClient.put(`/api/admin/suppliers/${id}`, payload);
  return response.data?.data;
}

/**
 * Delete a supplier.
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function deleteSupplier(id) {
  const response = await apiClient.delete(`/api/admin/suppliers/${id}`);
  return response.data?.data;
}
