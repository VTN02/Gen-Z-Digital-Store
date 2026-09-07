import { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Clock,
  Star,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Layers,
  Filter
} from 'lucide-react';
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from '../services/supplier.service';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import Modal from '../../../components/common/Modal';
import Loader from '../../../components/common/Loader';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { useToast } from '../../../context/ToastContext';
import './SupplierListPage.css';

const CATEGORIES = [
  'ALL',
  "Men's Fashion",
  "Boys' Fashion",
  'Fragrance Oils',
  'Packaging & Boxes',
];

const STATUSES = ['ALL', 'ACTIVE', 'ON_HOLD', 'INACTIVE'];

const INITIAL_FORM = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  city: 'Colombo',
  address: '',
  category: "Men's Fashion",
  paymentTerms: 'Net 30',
  leadTimeDays: 7,
  status: 'ACTIVE',
  rating: 4.8,
  notes: '',
};

export default function SupplierListPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // View / Delete state
  const [viewSupplier, setViewSupplier] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const toast = useToast();

  const fetchList = async () => {
    try {
      const data = await getSuppliers({
        search,
        category: selectedCategory,
        status: selectedStatus,
      });
      setSuppliers(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load supplier directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [search, selectedCategory, selectedStatus]);

  // Status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'ON_HOLD':
        return 'warning';
      case 'INACTIVE':
        return 'neutral';
      default:
        return 'info';
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData(INITIAL_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (sup) => {
    setIsEditing(true);
    setFormData({
      id: sup.id,
      companyName: sup.companyName,
      contactPerson: sup.contactPerson,
      email: sup.email,
      phone: sup.phone,
      city: sup.city,
      address: sup.address,
      category: sup.category,
      paymentTerms: sup.paymentTerms,
      leadTimeDays: sup.leadTimeDays,
      status: sup.status,
      rating: sup.rating,
      notes: sup.notes || '',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.companyName.trim()) {
      errs.companyName = 'Company name is required.';
    }
    if (!formData.contactPerson.trim()) {
      errs.contactPerson = 'Contact person is required.';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateSupplier(formData.id, formData);
        toast.success(`Supplier ${formData.companyName} updated successfully.`);
      } else {
        await createSupplier(formData);
        toast.success(`Supplier ${formData.companyName} added to directory.`);
      }
      setModalOpen(false);
      fetchList();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteSupplier(deleteTarget.id);
      toast.success(`Supplier ${deleteTarget.companyName} removed.`);
      setDeleteTarget(null);
      fetchList();
    } catch (err) {
      toast.error('Failed to delete supplier.');
    } finally {
      setDeleting(false);
    }
  };

  // Metrics calculation
  const totalCount = suppliers.length;
  const activeCount = suppliers.filter((s) => s.status === 'ACTIVE').length;
  const avgLeadTime =
    suppliers.length > 0
      ? (
          suppliers.reduce((acc, curr) => acc + (curr.leadTimeDays || 0), 0) /
          suppliers.length
        ).toFixed(1)
      : '0';

  return (
    <div className="supplier-page">
      {/* ── Header Banner ── */}
      <div className="supplier-hero">
        <div className="supplier-hero__text">
          <div className="supplier-hero__tag">
            <Sparkles size={13} />
            <span>VENDOR RELATIONSHIPS</span>
          </div>
          <h1 className="supplier-hero__title">Supplier Directory &amp; Sourcing</h1>
          <p className="supplier-hero__subtitle">
            Manage fabric manufacturers, fragrance distillers, packaging vendors, and trading partners.
          </p>
        </div>

        <div className="supplier-hero__actions">
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAdd}
            className="supplier-add-btn"
          >
            <Plus size={16} />
            <span>Add New Supplier</span>
          </Button>
        </div>
      </div>

      {/* ── KPI Metric Highlights ── */}
      <section className="supplier-kpis" aria-label="Supplier Key Metrics">
        <div className="supplier-kpi-card">
          <div className="supplier-kpi-card__top">
            <span className="supplier-kpi-card__label">Total Registered Partners</span>
            <div className="supplier-kpi-card__icon-wrap">
              <Building2 size={18} />
            </div>
          </div>
          <div className="supplier-kpi-card__val">{totalCount}</div>
          <span className="supplier-kpi-card__sub">Across Sri Lanka &amp; Overseas</span>
        </div>

        <div className="supplier-kpi-card">
          <div className="supplier-kpi-card__top">
            <span className="supplier-kpi-card__label">Active Suppliers</span>
            <div className="supplier-kpi-card__icon-wrap supplier-kpi-card__icon-wrap--success">
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="supplier-kpi-card__val">{activeCount}</div>
          <span className="supplier-kpi-card__sub">Supplying ongoing stock</span>
        </div>

        <div className="supplier-kpi-card">
          <div className="supplier-kpi-card__top">
            <span className="supplier-kpi-card__label">Avg. Lead Time</span>
            <div className="supplier-kpi-card__icon-wrap">
              <Clock size={18} />
            </div>
          </div>
          <div className="supplier-kpi-card__val">{avgLeadTime} Days</div>
          <span className="supplier-kpi-card__sub">From order confirmation</span>
        </div>

        <div className="supplier-kpi-card">
          <div className="supplier-kpi-card__top">
            <span className="supplier-kpi-card__label">Primary Hubs</span>
            <div className="supplier-kpi-card__icon-wrap">
              <MapPin size={18} />
            </div>
          </div>
          <div className="supplier-kpi-card__val">Colombo &amp; Kandy</div>
          <span className="supplier-kpi-card__sub">Local export processing zones</span>
        </div>
      </section>

      {/* ── Search & Filter Controls ── */}
      <div className="supplier-filters-bar">
        <div className="supplier-search-input-wrap">
          <Search size={15} className="supplier-search-icon" />
          <input
            type="text"
            className="supplier-search-input"
            placeholder="Search company, contact person, city, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="supplier-filter-group">
          <div className="supplier-select-wrap">
            <Filter size={13} className="supplier-select-icon" />
            <select
              className="supplier-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by Category"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="supplier-select-wrap">
            <Layers size={13} className="supplier-select-icon" />
            <select
              className="supplier-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter by Status"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === 'ALL' ? 'All Statuses' : s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Table / Content ── */}
      <div className="supplier-card">
        {loading ? (
          <div className="supplier-loading-wrap">
            <Loader size="lg" message="Loading vendor directory..." />
          </div>
        ) : suppliers.length === 0 ? (
          <div className="supplier-empty-state">
            <AlertCircle size={36} className="supplier-empty-icon" />
            <h3 className="supplier-empty-title">No suppliers found</h3>
            <p className="supplier-empty-text">
              Try adjusting your search criteria or add a new supplier profile.
            </p>
            <Button variant="secondary" size="sm" onClick={handleOpenAdd}>
              Add First Supplier
            </Button>
          </div>
        ) : (
          <div className="supplier-table-container">
            <table className="supplier-table">
              <thead>
                <tr>
                  <th>Vendor ID</th>
                  <th>Company &amp; Contact</th>
                  <th>Sourcing Category</th>
                  <th>Location</th>
                  <th>Terms &amp; Lead Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((sup) => (
                  <tr key={sup.id} className="supplier-table__row">
                    <td>
                      <span className="supplier-id-tag">{sup.id}</span>
                    </td>
                    <td>
                      <div className="supplier-cell-company">
                        <span className="supplier-company-name">{sup.companyName}</span>
                        <div className="supplier-contact-sub">
                          <span>{sup.contactPerson}</span>
                          <span className="supplier-dot">·</span>
                          <span className="supplier-phone">{sup.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="supplier-category-pill">{sup.category}</span>
                    </td>
                    <td>
                      <div className="supplier-location-cell">
                        <MapPin size={13} />
                        <span>{sup.city}</span>
                      </div>
                    </td>
                    <td>
                      <div className="supplier-terms-cell">
                        <span className="supplier-terms-badge">{sup.paymentTerms}</span>
                        <span className="supplier-lead-time">{sup.leadTimeDays}d lead</span>
                      </div>
                    </td>
                    <td>
                      <Badge variant={getStatusVariant(sup.status)}>
                        {sup.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="supplier-action-buttons">
                        <button
                          className="supplier-btn-icon"
                          onClick={() => setViewSupplier(sup)}
                          title="View Vendor Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="supplier-btn-icon supplier-btn-icon--edit"
                          onClick={() => handleOpenEdit(sup)}
                          title="Edit Supplier"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="supplier-btn-icon supplier-btn-icon--delete"
                          onClick={() => setDeleteTarget(sup)}
                          title="Delete Supplier"
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

      {/* ── Add / Edit Modal ── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? `Edit Supplier: ${formData.companyName}` : 'Add New Supplier Profile'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="supplier-form">
          <div className="supplier-form__row">
            <div className="supplier-form__field">
              <label className="supplier-form__label">Company Name *</label>
              <input
                type="text"
                className={`supplier-form__input ${formErrors.companyName ? 'supplier-form__input--err' : ''}`}
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Ceylon Fabrics PLC"
              />
              {formErrors.companyName && (
                <span className="supplier-form__error-text">{formErrors.companyName}</span>
              )}
            </div>

            <div className="supplier-form__field">
              <label className="supplier-form__label">Contact Person *</label>
              <input
                type="text"
                className={`supplier-form__input ${formErrors.contactPerson ? 'supplier-form__input--err' : ''}`}
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="e.g. Nuwan Jayasuriya"
              />
              {formErrors.contactPerson && (
                <span className="supplier-form__error-text">{formErrors.contactPerson}</span>
              )}
            </div>
          </div>

          <div className="supplier-form__row">
            <div className="supplier-form__field">
              <label className="supplier-form__label">Email Address</label>
              <input
                type="email"
                className="supplier-form__input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="orders@supplier.lk"
              />
            </div>

            <div className="supplier-form__field">
              <label className="supplier-form__label">Phone Number *</label>
              <input
                type="text"
                className={`supplier-form__input ${formErrors.phone ? 'supplier-form__input--err' : ''}`}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+94 11 234 5678"
              />
              {formErrors.phone && (
                <span className="supplier-form__error-text">{formErrors.phone}</span>
              )}
            </div>
          </div>

          <div className="supplier-form__row">
            <div className="supplier-form__field">
              <label className="supplier-form__label">Sourcing Category</label>
              <select
                className="supplier-form__select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Men's Fashion">Men's Fashion</option>
                <option value="Boys' Fashion">Boys' Fashion</option>
                <option value="Fragrance Oils">Fragrance Oils</option>
                <option value="Packaging & Boxes">Packaging &amp; Boxes</option>
              </select>
            </div>

            <div className="supplier-form__field">
              <label className="supplier-form__label">Payment Terms</label>
              <select
                className="supplier-form__select"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              >
                <option value="Net 30">Net 30</option>
                <option value="Net 15">Net 15</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Advance Payment">Advance Payment</option>
              </select>
            </div>
          </div>

          <div className="supplier-form__row">
            <div className="supplier-form__field">
              <label className="supplier-form__label">City / Region</label>
              <input
                type="text"
                className="supplier-form__input"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Colombo, Kandy"
              />
            </div>

            <div className="supplier-form__field">
              <label className="supplier-form__label">Lead Time (Days)</label>
              <input
                type="number"
                min="1"
                max="90"
                className="supplier-form__input"
                value={formData.leadTimeDays}
                onChange={(e) => setFormData({ ...formData, leadTimeDays: e.target.value })}
              />
            </div>
          </div>

          <div className="supplier-form__row">
            <div className="supplier-form__field">
              <label className="supplier-form__label">Operational Status</label>
              <select
                className="supplier-form__select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="supplier-form__field">
              <label className="supplier-form__label">Rating (1.0 - 5.0)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                className="supplier-form__input"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              />
            </div>
          </div>

          <div className="supplier-form__field">
            <label className="supplier-form__label">Full Address / Location</label>
            <input
              type="text"
              className="supplier-form__input"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Biyagama EPZ, Phase 2, Sri Lanka"
            />
          </div>

          <div className="supplier-form__field">
            <label className="supplier-form__label">Supplier Notes &amp; Capabilities</label>
            <textarea
              className="supplier-form__textarea"
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Minimum order quantity, material specifications, special packaging options..."
            />
          </div>

          <div className="supplier-form__actions">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submitting}
            >
              {isEditing ? 'Save Changes' : 'Create Supplier'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── View Detail Modal ── */}
      {viewSupplier && (
        <Modal
          isOpen={Boolean(viewSupplier)}
          onClose={() => setViewSupplier(null)}
          title={`Supplier Profile: ${viewSupplier.companyName}`}
          size="md"
        >
          <div className="supplier-detail-view">
            <div className="supplier-detail-view__header">
              <div>
                <span className="supplier-id-tag">{viewSupplier.id}</span>
                <h3 className="supplier-detail-view__company">{viewSupplier.companyName}</h3>
                <span className="supplier-detail-view__cat">{viewSupplier.category}</span>
              </div>
              <Badge variant={getStatusVariant(viewSupplier.status)}>
                {viewSupplier.status}
              </Badge>
            </div>

            <div className="supplier-detail-view__grid">
              <div className="supplier-detail-view__item">
                <span className="supplier-detail-view__label">Contact Person</span>
                <span className="supplier-detail-view__val">{viewSupplier.contactPerson}</span>
              </div>

              <div className="supplier-detail-view__item">
                <span className="supplier-detail-view__label">Contact Phone</span>
                <a href={`tel:${viewSupplier.phone}`} className="supplier-detail-view__link">
                  {viewSupplier.phone}
                </a>
              </div>

              <div className="supplier-detail-view__item">
                <span className="supplier-detail-view__label">Email</span>
                <a href={`mailto:${viewSupplier.email}`} className="supplier-detail-view__link">
                  {viewSupplier.email || 'N/A'}
                </a>
              </div>

              <div className="supplier-detail-view__item">
                <span className="supplier-detail-view__label">City &amp; Region</span>
                <span className="supplier-detail-view__val">{viewSupplier.city}</span>
              </div>

              <div className="supplier-detail-view__item">
                <span className="supplier-detail-view__label">Payment Terms</span>
                <span className="supplier-detail-view__val">{viewSupplier.paymentTerms}</span>
              </div>

              <div className="supplier-detail-view__item">
                <span className="supplier-detail-view__label">Fulfillment Lead Time</span>
                <span className="supplier-detail-view__val">{viewSupplier.leadTimeDays} Days</span>
              </div>

              <div className="supplier-detail-view__item">
                <span className="supplier-detail-view__label">Vendor Rating</span>
                <span className="supplier-detail-view__val">⭐ {viewSupplier.rating} / 5.0</span>
              </div>

              <div className="supplier-detail-view__item">
                <span className="supplier-detail-view__label">Registered On</span>
                <span className="supplier-detail-view__val">
                  {new Date(viewSupplier.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {viewSupplier.address && (
              <div className="supplier-detail-view__notes-box">
                <span className="supplier-detail-view__label">Physical Address</span>
                <p className="supplier-detail-view__text">{viewSupplier.address}</p>
              </div>
            )}

            {viewSupplier.notes && (
              <div className="supplier-detail-view__notes-box">
                <span className="supplier-detail-view__label">Notes &amp; Capabilities</span>
                <p className="supplier-detail-view__text">{viewSupplier.notes}</p>
              </div>
            )}

            <div className="supplier-detail-view__footer">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setViewSupplier(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  const s = viewSupplier;
                  setViewSupplier(null);
                  handleOpenEdit(s);
                }}
              >
                Edit Vendor Profile
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
        title="Delete Supplier Profile"
        message={`Are you sure you want to delete ${deleteTarget?.companyName} (${deleteTarget?.id})? This partner will be removed from your active vendor directory.`}
        confirmText="Delete Supplier"
        cancelText="Keep"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
