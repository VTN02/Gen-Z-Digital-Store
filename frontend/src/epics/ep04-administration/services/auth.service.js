import apiClient from '../../../services/apiClient';

/**
 * EP-04 Admin Authentication Service
 * Handles communication with the EP-04 admin auth endpoints.
 */

/**
 * Validate the admin access key.
 * @param {string} key
 * @returns {Promise<{ admin: object }>}
 */
export async function validateAdminKey(key) {
  const response = await apiClient.post('/api/admin/auth/validate-key', { key });
  return response.data;
}

/**
 * Logout the admin session.
 */
export async function adminLogout() {
  const response = await apiClient.post('/api/admin/auth/logout');
  return response.data;
}

/**
 * Get current admin session info.
 * @returns {Promise<{ admin: object }>}
 */
export async function getAdminSession() {
  const response = await apiClient.get('/api/admin/auth/me');
  return response.data;
}
