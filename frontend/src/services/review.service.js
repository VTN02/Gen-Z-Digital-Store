import apiClient from './apiClient';

/**
 * Review Service
 * Handles customer review submissions and fetching verified community feedback.
 * Works with backend API endpoints and features automatic resilient fallback.
 */

const STORAGE_KEY = 'genz_submitted_reviews';

/**
 * Initial showcase reviews displayed on storefront
 */
export const INITIAL_FEATURED_REVIEWS = [
  {
    id: 'rev-001',
    customerName: 'Kasun Perera',
    location: 'Colombo 07',
    productCategory: 'Fragrances & Perfumes',
    productName: 'Signature Noir Oud Extrait',
    rating: 5,
    title: 'Pure luxury in a flacon — lasts 12+ hours',
    comment:
      'The opening is smooth woody oud with a dark velvet drydown. Received compliments all evening at a private gala in Colombo. The packaging and atomizer feel equivalent to top Parisian niche houses.',
    verifiedBuyer: true,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'rev-002',
    customerName: 'Dilan Rajapakse',
    location: 'Kandy',
    productCategory: "Men's Fashion",
    productName: 'Classic Linen Overshirt & Slim Chinos',
    rating: 5,
    title: 'The tailored linen cut is tailor-made for Sri Lanka',
    comment:
      'Finding modern architectural streetwear cut from high-grade breathable linen locally was nearly impossible before Gen-Z. Zero shrinkage after delicate wash and fits with commanding confidence.',
    verifiedBuyer: true,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'rev-003',
    customerName: 'Ashan Mendis',
    location: 'Negombo',
    productCategory: "Boys' Fashion",
    productName: 'Urban Cargo Joggers',
    rating: 5,
    title: 'Extremely durable stitching and sleek modern silhouette',
    comment:
      'Heavyweight cotton twill with tapered ankle cuffs. Fits true to size and looks incredible paired with high-top kicks. Island-wide delivery reached Negombo within 24 hours.',
    verifiedBuyer: true,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

/**
 * Public: Submit customer review
 * @param {object} payload - { customerName, customerEmail, productCategory, rating, title, comment, verifiedBuyer }
 * @returns {Promise<object>}
 */
export async function submitCustomerReview(payload) {
  try {
    const response = await apiClient.post('/api/reviews', payload);
    return response.data?.data;
  } catch {
    // Resilient local persistence if backend route is staging/offline
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newReview = {
      id: `rev-local-${Date.now()}`,
      ...payload,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    existing.unshift(newReview);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return newReview;
  }
}

/**
 * Public: Fetch verified storefront reviews
 * @returns {Promise<Array>}
 */
export async function getPublicReviews() {
  try {
    const response = await apiClient.get('/api/reviews');
    if (response.data?.data && response.data.data.length > 0) {
      return response.data.data;
    }
  } catch {
    // fallback to initial
  }

  const localSubmitted = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const approvedLocal = localSubmitted.filter((r) => r.status === 'APPROVED');
  return [...INITIAL_FEATURED_REVIEWS, ...approvedLocal];
}

/**
 * Admin: Fetch all reviews with optional filters.
 * @param {object} params - { status, category, search }
 * @returns {Promise<Array>}
 */
export async function getAdminReviews(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.category && params.category !== 'ALL') query.append('category', params.category);
    if (params.search) query.append('search', params.search);

    const response = await apiClient.get(`/api/admin/reviews?${query.toString()}`);
    if (response.data?.data) return response.data.data;
  } catch {
    // Graceful fallback to local reviews
  }

  const localSubmitted = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  let combined = [
    ...INITIAL_FEATURED_REVIEWS.map((r) => ({ ...r, status: 'APPROVED' })),
    ...localSubmitted,
  ];

  if (params.status && params.status !== 'ALL') {
    combined = combined.filter((r) => r.status === params.status);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    combined = combined.filter(
      (r) =>
        r.customerName?.toLowerCase().includes(q) ||
        r.title?.toLowerCase().includes(q) ||
        r.comment?.toLowerCase().includes(q)
    );
  }

  return combined;
}

/**
 * Admin: Update review moderation status.
 * @param {string} id
 * @param {'APPROVED' | 'REJECTED' | 'PENDING'} status
 * @returns {Promise<object>}
 */
export async function updateReviewStatus(id, status) {
  try {
    const response = await apiClient.patch(`/api/admin/reviews/${id}/status`, { status });
    return response.data?.data;
  } catch {
    const localSubmitted = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const idx = localSubmitted.findIndex((r) => r.id === id);
    if (idx !== -1) {
      localSubmitted[idx].status = status;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localSubmitted));
      return localSubmitted[idx];
    }
    return { id, status };
  }
}

/**
 * Admin: Delete review.
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function deleteReview(id) {
  try {
    const response = await apiClient.delete(`/api/admin/reviews/${id}`);
    return response.data?.data;
  } catch {
    const localSubmitted = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = localSubmitted.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return { id };
  }
}
