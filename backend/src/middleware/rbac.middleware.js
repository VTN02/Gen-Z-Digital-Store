'use strict';

/**
 * Role-Based Access Control middleware.
 * Usage: router.get('/admin-only', requireAdminAuth, requireRole('admin'), handler)
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions.',
      });
    }

    next();
  };
}

module.exports = { requireRole };
