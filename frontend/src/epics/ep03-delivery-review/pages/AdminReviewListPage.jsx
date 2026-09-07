import { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  MessageSquare,
  Sparkles,
  Clock,
  ShieldCheck,
  AlertCircle,
  Eye
} from 'lucide-react';
import {
  getAdminReviews,
  updateReviewStatus,
  deleteReview
} from '../services/review.service';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import Loader from '../../../components/common/Loader';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { useToast } from '../../../context/ToastContext';
import './AdminReviewListPage.css';

const TABS = [
  { id: 'ALL', label: 'All Reviews' },
  { id: 'PENDING', label: 'Pending Approval' },
  { id: 'APPROVED', label: 'Approved & Live' },
  { id: 'REJECTED', label: 'Rejected' },
];

export default function AdminReviewListPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [inspectReview, setInspectReview] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const toast = useToast();

  const fetchReviews = async () => {
    try {
      const data = await getAdminReviews({
        status: activeTab,
        search,
      });
      setReviews(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load customer reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [activeTab, search]);

  const handleStatusUpdate = async (id, status) => {
    setActionLoadingId(id);
    try {
      await updateReviewStatus(id, status);
      toast.success(`Review ${id} has been marked as ${status}.`);
      fetchReviews();
    } catch (err) {
      toast.error('Failed to update review status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteReview(deleteTarget.id);
      toast.success(`Review ${deleteTarget.id} removed.`);
      setDeleteTarget(null);
      fetchReviews();
    } catch (err) {
      toast.error('Failed to delete review.');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'error';
      default:
        return 'neutral';
    }
  };

  // Metrics
  const totalReviews = reviews.length;
  const pendingCount = reviews.filter((r) => r.status === 'PENDING').length;
  const approvedCount = reviews.filter((r) => r.status === 'APPROVED').length;
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <div className="admin-reviews-page">
      {/* ── Header Banner ── */}
      <div className="admin-reviews-hero">
        <div className="admin-reviews-hero__text">
          <div className="admin-reviews-hero__tag">
            <Sparkles size={13} />
            <span>CUSTOMER EXPERIENCE (EP-03)</span>
          </div>
          <h1 className="admin-reviews-hero__title">Review Moderation &amp; Feedback</h1>
          <p className="admin-reviews-hero__subtitle">
            Verify buyer submissions, moderate product testimonials, and manage public store satisfaction ratings.
          </p>
        </div>
      </div>

      {/* ── KPI Metric Cards ── */}
      <section className="admin-reviews-kpis" aria-label="Review Metrics">
        <div className="admin-reviews-kpi">
          <div className="admin-reviews-kpi__top">
            <span className="admin-reviews-kpi__label">Total Submissions</span>
            <div className="admin-reviews-kpi__icon">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="admin-reviews-kpi__val">{totalReviews}</div>
          <span className="admin-reviews-kpi__sub">Feedback in database</span>
        </div>

        <div className="admin-reviews-kpi">
          <div className="admin-reviews-kpi__top">
            <span className="admin-reviews-kpi__label">Pending Moderation</span>
            <div className="admin-reviews-kpi__icon admin-reviews-kpi__icon--warning">
              <Clock size={18} />
            </div>
          </div>
          <div className="admin-reviews-kpi__val">{pendingCount}</div>
          <span className="admin-reviews-kpi__sub">Awaiting admin review</span>
        </div>

        <div className="admin-reviews-kpi">
          <div className="admin-reviews-kpi__top">
            <span className="admin-reviews-kpi__label">Approved &amp; Live</span>
            <div className="admin-reviews-kpi__icon admin-reviews-kpi__icon--success">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="admin-reviews-kpi__val">{approvedCount}</div>
          <span className="admin-reviews-kpi__sub">Published on storefront</span>
        </div>

        <div className="admin-reviews-kpi">
          <div className="admin-reviews-kpi__top">
            <span className="admin-reviews-kpi__label">Store Satisfaction</span>
            <div className="admin-reviews-kpi__icon admin-reviews-kpi__icon--gold">
              <Star size={18} />
            </div>
          </div>
          <div className="admin-reviews-kpi__val">⭐ {avgRating} / 5.0</div>
          <span className="admin-reviews-kpi__sub">Average customer rating</span>
        </div>
      </section>

      {/* ── Tab & Search Filter Bar ── */}
      <div className="admin-reviews-controls">
        <div className="admin-reviews-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`admin-reviews-tab-btn ${activeTab === tab.id ? 'admin-reviews-tab-btn--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
              {tab.id === 'PENDING' && pendingCount > 0 && (
                <span className="admin-reviews-tab-badge">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        <div className="admin-reviews-search">
          <Search size={15} className="admin-reviews-search-icon" />
          <input
            type="text"
            className="admin-reviews-search-input"
            placeholder="Search reviews, customer names, titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Reviews Table Card ── */}
      <div className="admin-reviews-card">
        {loading ? (
          <div className="admin-reviews-loading">
            <Loader size="lg" message="Loading customer feedback..." />
          </div>
        ) : reviews.length === 0 ? (
          <div className="admin-reviews-empty">
            <AlertCircle size={36} className="admin-reviews-empty-icon" />
            <h3 className="admin-reviews-empty-title">No reviews found</h3>
            <p className="admin-reviews-empty-text">
              There are no reviews matching the current tab and filter criteria.
            </p>
          </div>
        ) : (
          <div className="admin-reviews-table-container">
            <table className="admin-reviews-table">
              <thead>
                <tr>
                  <th>Review ID</th>
                  <th>Customer</th>
                  <th>Rating</th>
                  <th>Headline &amp; Commentary</th>
                  <th>Category</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Moderation Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((rev) => (
                  <tr key={rev.id} className="admin-reviews-row">
                    <td>
                      <span className="review-id-tag">{rev.id}</span>
                    </td>
                    <td>
                      <div className="review-customer-cell">
                        <span className="review-customer-name">{rev.customerName}</span>
                        {rev.customerEmail && (
                          <span className="review-customer-email">{rev.customerEmail}</span>
                        )}
                        {rev.verifiedBuyer && (
                          <span className="review-verified-badge">Verified Buyer</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="review-stars-cell">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < rev.rating ? 'gold-star-active' : 'star-inactive'}
                          />
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="review-content-cell">
                        <span className="review-title">{rev.title}</span>
                        <p className="review-comment" title={rev.comment}>
                          {rev.comment}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="review-category-pill">{rev.productCategory}</span>
                    </td>
                    <td>
                      <span className="review-date">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <Badge variant={getStatusBadgeVariant(rev.status)}>
                        {rev.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="review-actions-group">
                        <button
                          className="review-action-btn review-action-btn--inspect"
                          onClick={() => setInspectReview(rev)}
                          title="Inspect Review"
                        >
                          <Eye size={14} />
                        </button>

                        {rev.status !== 'APPROVED' && (
                          <button
                            className="review-action-btn review-action-btn--approve"
                            onClick={() => handleStatusUpdate(rev.id, 'APPROVED')}
                            disabled={actionLoadingId === rev.id}
                            title="Approve &amp; Publish"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}

                        {rev.status !== 'REJECTED' && (
                          <button
                            className="review-action-btn review-action-btn--reject"
                            onClick={() => handleStatusUpdate(rev.id, 'REJECTED')}
                            disabled={actionLoadingId === rev.id}
                            title="Reject Review"
                          >
                            <XCircle size={14} />
                          </button>
                        )}

                        <button
                          className="review-action-btn review-action-btn--delete"
                          onClick={() => setDeleteTarget(rev)}
                          title="Delete Review"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Inspect Review Modal ── */}
      {inspectReview && (
        <Modal
          isOpen={Boolean(inspectReview)}
          onClose={() => setInspectReview(null)}
          title={`Review Details: ${inspectReview.id}`}
          size="md"
        >
          <div className="review-inspect-modal">
            <div className="review-inspect-modal__top">
              <div>
                <span className="review-id-tag">{inspectReview.id}</span>
                <h3 className="review-inspect-modal__title">{inspectReview.title}</h3>
                <span className="review-inspect-modal__cat">{inspectReview.productCategory}</span>
              </div>
              <Badge variant={getStatusBadgeVariant(inspectReview.status)}>
                {inspectReview.status}
              </Badge>
            </div>

            <div className="review-inspect-modal__stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < inspectReview.rating ? 'gold-star-active' : 'star-inactive'}
                />
              ))}
              <span className="review-inspect-modal__rating-text">
                ({inspectReview.rating} out of 5 stars)
              </span>
            </div>

            <div className="review-inspect-modal__comment-box">
              <span className="review-inspect-modal__label">Customer Commentary</span>
              <p className="review-inspect-modal__comment-text">{inspectReview.comment}</p>
            </div>

            <div className="review-inspect-modal__grid">
              <div>
                <span className="review-inspect-modal__label">Author</span>
                <span className="review-inspect-modal__val">{inspectReview.customerName}</span>
              </div>
              <div>
                <span className="review-inspect-modal__label">Email</span>
                <span className="review-inspect-modal__val">{inspectReview.customerEmail || 'Not provided'}</span>
              </div>
              <div>
                <span className="review-inspect-modal__label">Purchase Verified</span>
                <span className="review-inspect-modal__val">
                  {inspectReview.verifiedBuyer ? 'Yes (Verified Buyer)' : 'No'}
                </span>
              </div>
              <div>
                <span className="review-inspect-modal__label">Submission Date</span>
                <span className="review-inspect-modal__val">
                  {new Date(inspectReview.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="review-inspect-modal__actions">
              {inspectReview.status !== 'APPROVED' && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    handleStatusUpdate(inspectReview.id, 'APPROVED');
                    setInspectReview(null);
                  }}
                >
                  Approve Review
                </Button>
              )}
              {inspectReview.status !== 'REJECTED' && (
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => {
                    handleStatusUpdate(inspectReview.id, 'REJECTED');
                    setInspectReview(null);
                  }}
                >
                  Reject Review
                </Button>
              )}
              <Button
                variant="secondary"
                size="md"
                onClick={() => setInspectReview(null)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Confirm Delete Dialog ── */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Customer Review"
        message={`Are you sure you want to permanently delete review ${deleteTarget?.id} submitted by ${deleteTarget?.customerName}?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
