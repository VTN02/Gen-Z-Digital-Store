'use strict';

const reviewService = require('../services/review.service');

/**
 * EP-03 Review Controller
 */

/**
 * Public: Submit review
 * POST /api/reviews
 */
async function submitReview(req, res, next) {
  try {
    const { customerName, rating, title, comment } = req.body;
    if (!customerName || !customerName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Your name is required.',
      });
    }
    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5 stars.',
      });
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Review commentary cannot be empty.',
      });
    }

    const review = await reviewService.submitReview(req.body);
    return res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted for moderation.',
      data: review,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Public: Get approved reviews
 * GET /api/reviews
 */
async function getApprovedReviews(req, res, next) {
  try {
    const reviews = await reviewService.getPublicReviews();
    return res.status(200).json({
      success: true,
      data: reviews,
      total: reviews.length,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Get all reviews with filters
 * GET /api/admin/reviews
 */
async function getAdminReviews(req, res, next) {
  try {
    const filters = {
      status: req.query.status,
      category: req.query.category,
      search: req.query.search,
    };
    const reviews = await reviewService.getAllReviews(filters);
    return res.status(200).json({
      success: true,
      data: reviews,
      total: reviews.length,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Update review status (approve or reject)
 * PATCH /api/admin/reviews/:id/status
 */
async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const updated = await reviewService.updateReviewStatus(req.params.id, status);
    return res.status(200).json({
      success: true,
      message: `Review marked as ${status}.`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Delete review
 * DELETE /api/admin/reviews/:id
 */
async function deleteReview(req, res, next) {
  try {
    const deleted = await reviewService.deleteReview(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully.',
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  submitReview,
  getApprovedReviews,
  getAdminReviews,
  updateStatus,
  deleteReview,
};
