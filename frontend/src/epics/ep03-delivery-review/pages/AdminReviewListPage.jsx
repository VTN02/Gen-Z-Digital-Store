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
  Eye,
  RotateCcw
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
      setReviews(data || []);
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

  // KPIs
  const totalReviews = reviews.length;
  const pendingCount = reviews.filter((r) => r.status === 'PENDING').length;
  const approvedCount = reviews.filter((r) => r.status === 'APPROVED').length;
  const avgRating = totalReviews
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalReviews).toFixed(1)
    : '5.0';

  return (
    <div className="admin-reviews-page">
      {/* ── Hero Banner ── */}
      <div className="admin-reviews-hero">
        <div className="admin-reviews-hero__text">
          <div className="admin-reviews-hero__tag">
            <Sparkles size={13} className="admin-reviews-hero__sparkle" />
            <span>EP-03 &middot; COMMUNITY FEEDBACK &amp; TRUST</span>
          </div>
          <h1 className="admin-reviews-hero__title">Customer Review Moderation</h1>
          <p className="admin-reviews-hero__subtitle">
            Inspect, approve, reject, or archive customer reviews submitted through the storefront.
          </p>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="admin-reviews-kpis">
        <div className="admin-review-kpi">
          <div className="admin-review-kpi__top">
            <span className="admin-review-kpi__lbl">Total Feedback</span>
            <div className="admin-review-kpi__icon admin-review-kpi__icon--indigo">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="admin-review-kpi__val">{totalReviews}</div>
          <span className="admin-review-kpi__sub">Across all departments</span>
        </div>

        <div className="admin-review-kpi">
          <div className="admin-review-kpi__top">
            <span className="admin-review-kpi__lbl">Pending Moderation</span>
            <div className="admin-review-kpi__icon admin-review-kpi__icon--warning">
              <Clock size={18} />
            </div>
          </div>
          <div className="admin-review-kpi__val">{pendingCount}</div>
          <span className="admin-review-kpi__sub">Awaiting executive decision</span>
        </div>

        <div className="admin-review-kpi">
          <div className="admin-review-kpi__top">
            <span className="admin-review-kpi__lbl">Live On Store</span>
            <div className="admin-review-kpi__icon admin-review-kpi__icon--cyan">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="admin-review-kpi__val">{approvedCount}</div>
          <span className="admin-review-kpi__sub">Publicly visible on landing</span>
        </div>

        <div className="admin-review-kpi">
          <div className="admin-review-kpi__top">
            <span className="admin-review-kpi__lbl">Average Rating</span>
            <div className="admin-review-kpi__icon admin-review-kpi__icon--emerald">
              <Star size={18} />
            </div>
          </div>
          <div className="admin-review-kpi__val">{avgRating} / 5.0</div>
          <span className="admin-review-kpi__sub">Vanguard customer score</span>
        </div>
      </div>

      {/* ── Tabs & Search Bar ── */}
      <div className="admin-reviews-controls">
        <div className="admin-reviews-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`admin-reviews-tab ${activeTab === tab.id ? 'admin-reviews-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
              {tab.id === 'PENDING' && pendingCount > 0 && (
                <span className="admin-reviews-tab__badge">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        <div className="admin-reviews-search">
          <Search size={15} className="admin-reviews-search__icon" />
          <input
            type="text"
            className="admin-reviews-search__input"
            placeholder="Search by customer, title, text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Reviews Table Card ── */}
      <div className="admin-reviews-table-card">
        {loading ? (
          <div className="admin-reviews-loading">
            <Loader size="md" message="Loading review archives..." />
          </div>
        ) : reviews.length === 0 ? (
          <div className="admin-reviews-empty">
            <AlertCircle size={38} className="admin-reviews-empty__icon" />
            <h3 className="admin-reviews-empty__title">No Reviews Found</h3>
            <p className="admin-reviews-empty__desc">
              No customer feedback matches the selected moderation tab or search filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveTab('ALL');
                setSearch('');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="admin-reviews-table-wrap">
            <table className="admin-reviews-table">
              <thead>
                <tr>
                  <th>Review #</th>
                  <th>Customer &amp; Category</th>
                  <th>Score</th>
                  <th>Title &amp; Commentary</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((rev) => (
                  <tr key={rev.id} className="admin-reviews-row">
                    <td>
                      <span className="admin-reviews-id">{rev.id}</span>
                    </td>
                    <td>
                      <div className="admin-reviews-customer">
                        <span className="admin-reviews-customer__name">{rev.customerName}</span>
                        <span className="admin-reviews-customer__category">{rev.productCategory || "Men's Fashion"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-reviews-stars">
                        <div className="admin-reviews-star-icons">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              className={star <= rev.rating ? 'star-filled' : 'star-empty'}
                            />
                          ))}
                        </div>
                        <span className="admin-reviews-stars__val">{rev.rating}.0</span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-reviews-text">
                        <span className="admin-reviews-title">{rev.title}</span>
                        <p className="admin-reviews-comment" title={rev.comment}>
                          {rev.comment}
                        </p>
                      </div>
                    </td>
                    <td>
                      <Badge variant={getStatusBadgeVariant(rev.status)}>
                        {rev.status}
                      </Badge>
                    </td>
                    <td>
                      <span className="admin-reviews-date">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-GB') : 'Recently'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-reviews-actions">
                        <button
                          className="admin-rev-btn"
                          onClick={() => setInspectReview(rev)}
                          title="Inspect Full Commentary"
                        >
                          <Eye size={14} />
                        </button>

                        {rev.status !== 'APPROVED' && (
                          <button
                            className="admin-rev-btn admin-rev-btn--approve"
                            onClick={() => handleStatusUpdate(rev.id, 'APPROVED')}
                            disabled={actionLoadingId === rev.id}
                            title="Approve & Publish to Store"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}

                        {rev.status !== 'REJECTED' && (
                          <button
                            className="admin-rev-btn admin-rev-btn--reject"
                            onClick={() => handleStatusUpdate(rev.id, 'REJECTED')}
                            disabled={actionLoadingId === rev.id}
                            title="Reject Review"
                          >
                            <XCircle size={14} />
                          </button>
                        )}

                        <button
                          className="admin-rev-btn admin-rev-btn--delete"
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
          <div className="admin-rev-modal">
            <div className="admin-rev-modal__header">
              <div>
                <h3 className="admin-rev-modal__name">{inspectReview.customerName}</h3>
                <span className="admin-rev-modal__cat">{inspectReview.productCategory}</span>
              </div>
              <Badge variant={getStatusBadgeVariant(inspectReview.status)}>
                {inspectReview.status}
              </Badge>
            </div>

            <div className="admin-rev-modal__stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={star <= inspectReview.rating ? 'star-filled' : 'star-empty'}
                />
              ))}
              <span className="admin-rev-modal__rating-num">{inspectReview.rating} out of 5 Stars</span>
            </div>

            <div className="admin-rev-modal__body">
              <h4 className="admin-rev-modal__heading">"{inspectReview.title}"</h4>
              <p className="admin-rev-modal__quote">{inspectReview.comment}</p>
            </div>

            <div className="admin-rev-modal__actions">
              {inspectReview.status !== 'APPROVED' && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    handleStatusUpdate(inspectReview.id, 'APPROVED');
                    setInspectReview(null);
                  }}
                >
                  Approve &amp; Publish
                </Button>
              )}
              {inspectReview.status !== 'REJECTED' && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    handleStatusUpdate(inspectReview.id, 'REJECTED');
                    setInspectReview(null);
                  }}
                >
                  Reject
                </Button>
              )}
              <Button
                variant="outline"
                size="md"
                onClick={() => setInspectReview(null)}
              >
                Close
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
        title="Delete Customer Review?"
        message={`Are you sure you want to delete review "${deleteTarget?.title}" by ${deleteTarget?.customerName}? This cannot be undone.`}
        confirmLabel="Delete Review"
        cancelLabel="Keep Review"
        variant="danger"
      />
    </div>
  );
}
