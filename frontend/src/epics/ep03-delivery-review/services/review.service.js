import apiClient from '../../../services/apiClient';

/**
 * EP-03 Review Management API Service
 */

/**
 * Public: Submit a new customer review.
 * @param {object} payload - { customerName, customerEmail, productCategory, rating, title, comment, verifiedBuyer }
 * @returns {Promise<object>}
 */
export async function submitCustomerReview(payload) {
  const response = await apiClient.post('/api/reviews', payload);
  return response.data?.data;
}

/**
 * Public: Fetch approved reviews for public storefront display.
 * @returns {Promise<Array>}
 */
export async function getPublicReviews() {
  const response = await apiClient.get('/api/reviews');
  return response.data?.data || [];
}

/**
 * Admin: Fetch all reviews with optional status, category, or search filters.
 * @param {object} params - { status, category, search }
 * @returns {Promise<Array>}
 */
export async function getAdminReviews(params = {}) {
  const query = new URLSearchParams();
  if (params.status && params.status !== 'ALL') query.append('status', params.status);
  if (params.category && params.category !== 'ALL') query.append('category', params.category);
  if (params.search) query.append('search', params.search);

  const response = await apiClient.get(`/api/admin/reviews?${query.toString()}`);
  return response.data?.data || [];
}

/**
 * Admin: Update review status (approve or reject).
 * @param {string} id
 * @param {'APPROVED' | 'REJECTED' | 'PENDING'} status
 * @returns {Promise<object>}
 */
export async function updateReviewStatus(id, status) {
  const response = await apiClient.patch(`/api/admin/reviews/${id}/status`, { status });
  return response.data?.data;
}

/**
 * Admin: Delete review.
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function deleteReview(id) {
  const response = await apiClient.delete(`/api/admin/reviews/${id}`);
  return response.data?.data;
}
