'use strict';

const { Router } = require('express');
const {
  submitReview,
  getApprovedReviews,
  getAdminReviews,
  updateStatus,
  deleteReview,
} = require('../controllers/review.controller');
const { requireAdminAuth } = require('../../../middleware/auth.middleware');

const publicRouter = Router();
const adminRouter = Router();

// Public routes
publicRouter.get('/', getApprovedReviews);
publicRouter.post('/', submitReview);

// Admin routes (guarded by requireAdminAuth)
adminRouter.use(requireAdminAuth);
adminRouter.get('/', getAdminReviews);
adminRouter.patch('/:id/status', updateStatus);
adminRouter.delete('/:id', deleteReview);

module.exports = {
  publicReviewRoutes: publicRouter,
  adminReviewRoutes: adminRouter,
};
