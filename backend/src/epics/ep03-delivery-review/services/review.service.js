'use strict';

/**
 * EP-03 Review Management Service
 * Provides in-memory seeded reviews with submission and admin moderation workflows.
 */

let reviews = [
  {
    id: 'REV-201',
    customerName: 'Kavindu Senanayake',
    customerEmail: 'kavindu.s@gmail.com',
    productCategory: 'Fragrances & Perfumes',
    rating: 5,
    title: 'Noir Intense EDP is phenomenal!',
    comment: 'Lasts more than 10 hours in the Colombo heat. Truly niche perfume quality at an affordable Sri Lankan retail price. Premium packaging too!',
    verifiedBuyer: true,
    status: 'APPROVED',
    createdAt: '2026-03-01T10:30:00.000Z',
  },
  {
    id: 'REV-202',
    customerName: 'Dulith Ranasinghe',
    customerEmail: 'dulith.r@outlook.com',
    productCategory: "Men's Fashion",
    rating: 5,
    title: 'Oxford Linen Shirt fits perfectly',
    comment: 'The stitch quality is exceptional. Fabric is breathable and doesn’t shrink after wash. Definitely ordering more colors.',
    verifiedBuyer: true,
    status: 'APPROVED',
    createdAt: '2026-03-02T14:15:00.000Z',
  },
  {
    id: 'REV-203',
    customerName: 'Roshani Wijetunga',
    customerEmail: 'roshani.w@yahoo.com',
    productCategory: "Boys' Fashion",
    rating: 4,
    title: 'Great fit for my 11-year-old son',
    comment: 'Bought the casual polo and shorts set for my son. Good cotton fabric, comfortable and modern styling.',
    verifiedBuyer: true,
    status: 'APPROVED',
    createdAt: '2026-03-03T09:00:00.000Z',
  },
  {
    id: 'REV-204',
    customerName: 'Malik Jayasuriya',
    customerEmail: 'malik.j@gmail.com',
    productCategory: 'Fragrances & Perfumes',
    rating: 5,
    title: 'Royal Oud is a masterpiece',
    comment: 'Distinctive oriental woody notes. Received countless compliments at an evening event in Kandy.',
    verifiedBuyer: false,
    status: 'PENDING',
    createdAt: '2026-03-06T18:45:00.000Z',
  },
  {
    id: 'REV-205',
    customerName: 'Anuki Fernando',
    customerEmail: 'anuki.f@gmail.com',
    productCategory: "Men's Fashion",
    rating: 2,
    title: 'Color looked slightly different online',
    comment: 'The olive green chino was a darker shade than in the photos. Still decent quality.',
    verifiedBuyer: true,
    status: 'PENDING',
    createdAt: '2026-03-07T08:20:00.000Z',
  },
];

let nextReviewId = 206;

/**
 * Get all reviews with status and search filters (Admin).
 */
async function getAllReviews(filters = {}) {
  let result = [...reviews];

  if (filters.status && filters.status !== 'ALL') {
    result = result.filter((r) => r.status === filters.status);
  }

  if (filters.category && filters.category !== 'ALL') {
    result = result.filter((r) => r.productCategory === filters.category);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(
      (r) =>
        r.customerName.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
    );
  }

  return result;
}

/**
 * Get approved reviews for public storefront display.
 */
async function getPublicReviews() {
  return reviews.filter((r) => r.status === 'APPROVED');
}

/**
 * Submit a new customer review (Public).
 */
async function submitReview(data) {
  const id = `REV-${nextReviewId++}`;

  const newReview = {
    id,
    customerName: data.customerName.trim(),
    customerEmail: data.customerEmail?.trim() || '',
    productCategory: data.productCategory || "Men's Fashion",
    rating: Math.min(5, Math.max(1, Number(data.rating) || 5)),
    title: data.title?.trim() || 'Customer Review',
    comment: data.comment?.trim() || '',
    verifiedBuyer: Boolean(data.verifiedBuyer),
    status: 'PENDING', // All user submissions start as pending for admin approval
    createdAt: new Date().toISOString(),
  };

  reviews.unshift(newReview);
  return newReview;
}

/**
 * Update review moderation status (Admin).
 */
async function updateReviewStatus(id, status) {
  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) {
    const err = new Error(`Review with ID ${id} not found.`);
    err.statusCode = 404;
    throw err;
  }

  if (!['APPROVED', 'PENDING', 'REJECTED'].includes(status)) {
    const err = new Error('Invalid status. Must be APPROVED, PENDING, or REJECTED.');
    err.statusCode = 400;
    throw err;
  }

  reviews[index].status = status;
  reviews[index].moderatedAt = new Date().toISOString();
  return reviews[index];
}

/**
 * Delete a review (Admin).
 */
async function deleteReview(id) {
  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) {
    const err = new Error(`Review with ID ${id} not found.`);
    err.statusCode = 404;
    throw err;
  }

  const [deleted] = reviews.splice(index, 1);
  return deleted;
}

module.exports = {
  getAllReviews,
  getPublicReviews,
  submitReview,
  updateReviewStatus,
  deleteReview,
};
