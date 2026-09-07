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
  Filter,
  Check
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
      setSuppliers(data || []);
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
        return 'neutral';
    }
  };

  const handleOpenCreate = () => {
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
    const errors = {};
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required.';
    if (!formData.contactPerson.trim()) errors.contactPerson = 'Contact person is required.';
    if (!formData.email.trim()) errors.email = 'Email address is required.';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateSupplier(formData.id, formData);
        toast.success(`Supplier "${formData.companyName}" updated.`);
      } else {
        await createSupplier(formData);
        toast.success(`Supplier "${formData.companyName}" enrolled.`);
      }
      setModalOpen(false);
      fetchList();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Operation failed. Please verify fields.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteSupplier(deleteTarget.id);
      toast.success(`Supplier "${deleteTarget.companyName}" removed.`);
      setDeleteTarget(null);
      fetchList();
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove supplier.');
    } finally {
      setDeleting(false);
    }
  };

  // KPI Calculations
  const totalCount = suppliers.length;
  const activeCount = suppliers.filter((s) => s.status === 'ACTIVE').length;
  const avgLeadTime = totalCount
    ? Math.round(suppliers.reduce((acc, s) => acc + (Number(s.leadTimeDays) || 0), 0) / totalCount)
    : 0;

  return (
    <div className="supplier-page">
      {/* ── Hero Banner ── */}
      <div className="supplier-hero">
        <div className="supplier-hero__text">
          <div className="supplier-hero__tag">
            <Sparkles size={13} className="supplier-hero__sparkle" />
            <span>EP-04 &middot; SOURCING &amp; VENDOR MANAGEMENT</span>
          </div>
          <h1 className="supplier-hero__title">Supplier &amp; Procurement Directory</h1>
          <p className="supplier-hero__subtitle">
            Manage fabric mills, fragrance distillers, packaging houses, and logistics partners across Sri Lanka.
          </p>
        </div>

        <div className="supplier-hero__actions">
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            className="supplier-add-btn"
          >
            <Plus size={16} />
            <span>Enroll New Supplier</span>
          </Button>
        </div>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div className="supplier-kpis">
        <div className="supplier-kpi-card">
          <div className="supplier-kpi-card__top">
            <span className="supplier-kpi-card__label">Total Directory</span>
            <div className="supplier-kpi-card__icon supplier-kpi-card__icon--indigo">
              <Building2 size={18} />
            </div>
          </div>
          <div className="supplier-kpi-card__val">{totalCount}</div>
          <span className="supplier-kpi-card__sub">Registered partners</span>
        </div>

        <div className="supplier-kpi-card">
          <div className="supplier-kpi-card__top">
            <span className="supplier-kpi-card__label">Active Suppliers</span>
            <div className="supplier-kpi-card__icon supplier-kpi-card__icon--cyan">
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="supplier-kpi-card__val">{activeCount}</div>
          <span className="supplier-kpi-card__sub">Fulfilling orders</span>
        </div>

        <div className="supplier-kpi-card">
          <div className="supplier-kpi-card__top">
            <span className="supplier-kpi-card__label">Average Lead Time</span>
            <div className="supplier-kpi-card__icon supplier-kpi-card__icon--violet">
              <Clock size={18} />
            </div>
          </div>
          <div className="supplier-kpi-card__val">{avgLeadTime} Days</div>
          <span className="supplier-kpi-card__sub">Dispatch SLA standard</span>
        </div>

        <div className="supplier-kpi-card">
          <div className="supplier-kpi-card__top">
            <span className="supplier-kpi-card__label">Sourcing Domains</span>
            <div className="supplier-kpi-card__icon supplier-kpi-card__icon--emerald">
              <Layers size={18} />
            </div>
          </div>
          <div className="supplier-kpi-card__val">{CATEGORIES.length - 1}</div>
          <span className="supplier-kpi-card__sub">Apparel, oils, packs</span>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="supplier-controls">
        <div className="supplier-search-wrap">
          <Search size={16} className="supplier-search-icon" />
          <input
            type="text"
            className="supplier-search-input"
            placeholder="Search suppliers by name, contact, city, code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="supplier-filter-chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`supplier-chip ${selectedCategory === cat ? 'supplier-chip--active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'ALL' ? 'All Domains' : cat}
            </button>
          ))}
        </div>

        <div className="supplier-status-filter">
          <Filter size={14} className="supplier-status-icon" />
          <select
            className="supplier-status-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* ── Supplier Table ── */}
      <div className="supplier-table-card">
        {loading ? (
          <div className="supplier-table-loading">
            <Loader size="md" message="Accessing supplier records..." />
          </div>
        ) : suppliers.length === 0 ? (
          <div className="supplier-empty">
            <AlertCircle size={40} className="supplier-empty-icon" />
            <h3 className="supplier-empty-title">No Suppliers Found</h3>
            <p className="supplier-empty-desc">
              No matching partners found under the current search and category criteria.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('');
                setSelectedCategory('ALL');
                setSelectedStatus('ALL');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="supplier-table-container">
            <table className="supplier-table">
              <thead>
                <tr>
                  <th>Vendor Identifier</th>
                  <th>Company &amp; Domain</th>
                  <th>Primary Liaison</th>
                  <th>Contact Details</th>
                  <th>Terms &amp; Lead Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((sup) => (
                  <tr key={sup.id} className="supplier-table__row">
                    <td>
                      <span className="supplier-code">{sup.id}</span>
                    </td>
                    <td>
                      <div className="supplier-vendor-cell">
                        <span className="supplier-vendor-name">{sup.companyName}</span>
                        <span className="supplier-vendor-category">{sup.category}</span>
                      </div>
                    </td>
                    <td>
                      <div className="supplier-liaison-cell">
                        <span className="supplier-liaison-name">{sup.contactPerson}</span>
                        <span className="supplier-liaison-city">
                          <MapPin size={11} />
                          {sup.city}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="supplier-contact-cell">
                        <a href={`mailto:${sup.email}`} className="supplier-contact-link">
                          <Mail size={12} />
                          <span>{sup.email}</span>
                        </a>
                        <a href={`tel:${sup.phone}`} className="supplier-contact-link">
                          <Phone size={12} />
                          <span>{sup.phone}</span>
                        </a>
                      </div>
                    </td>
                    <td>
                      <div className="supplier-terms-cell">
                        <span className="supplier-terms">{sup.paymentTerms}</span>
                        <span className="supplier-lead-time">
                          <Clock size={11} />
                          {sup.leadTimeDays}d SLA
                        </span>
                      </div>
                    </td>
                    <td>
                      <Badge variant={getStatusVariant(sup.status)}>
                        {sup.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td>
                      <div className="supplier-actions-cell">
                        <button
                          className="supplier-action-btn"
                          onClick={() => setViewSupplier(sup)}
                          title="View Vendor Particulars"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="supplier-action-btn"
                          onClick={() => handleOpenEdit(sup)}
                          title="Edit Profile"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="supplier-action-btn supplier-action-btn--delete"
                          onClick={() => setDeleteTarget(sup)}
                          title="Remove Supplier"
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

      {/* ── Create / Edit Supplier Modal ── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? `Modify Supplier: ${formData.id}` : 'Enroll New Supplier Profile'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="supplier-form">
          <div className="supplier-form__grid">
            <div className="supplier-form__field">
              <label className="supplier-form__label">
                Company Legal Name <span className="supplier-required">*</span>
              </label>
              <input
                type="text"
                className={`supplier-form__input ${formErrors.companyName ? 'supplier-form__input--err' : ''}`}
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Ceylon Fine Cottons PLC"
              />
              {formErrors.companyName && (
                <span className="supplier-form__err-msg">{formErrors.companyName}</span>
              )}
            </div>

            <div className="supplier-form__field">
              <label className="supplier-form__label">
                Primary Contact Person <span className="supplier-required">*</span>
              </label>
              <input
                type="text"
                className={`supplier-form__input ${formErrors.contactPerson ? 'supplier-form__input--err' : ''}`}
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="e.g. Ruwan Jayasuriya"
              />
              {formErrors.contactPerson && (
                <span className="supplier-form__err-msg">{formErrors.contactPerson}</span>
              )}
            </div>

            <div className="supplier-form__field">
              <label className="supplier-form__label">
                Official Email Address <span className="supplier-required">*</span>
              </label>
              <input
                type="email"
                className={`supplier-form__input ${formErrors.email ? 'supplier-form__input--err' : ''}`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="procurement@vendor.lk"
              />
              {formErrors.email && (
                <span className="supplier-form__err-msg">{formErrors.email}</span>
              )}
            </div>

            <div className="supplier-form__field">
              <label className="supplier-form__label">
                Phone Number <span className="supplier-required">*</span>
              </label>
              <input
                type="text"
                className={`supplier-form__input ${formErrors.phone ? 'supplier-form__input--err' : ''}`}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+94 11 234 5678"
              />
              {formErrors.phone && (
                <span className="supplier-form__err-msg">{formErrors.phone}</span>
              )}
            </div>

            <div className="supplier-form__field">
              <label className="supplier-form__label">Base City</label>
              <input
                type="text"
                className="supplier-form__input"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Colombo 03, Biyagama, Kandy"
              />
            </div>

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
                <option value="Packaging & Boxes">Packaging & Boxes</option>
              </select>
            </div>

            <div className="supplier-form__field">
              <label className="supplier-form__label">Payment Terms</label>
              <select
                className="supplier-form__select"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              >
                <option value="Net 15">Net 15 Days</option>
                <option value="Net 30">Net 30 Days</option>
                <option value="Advance Payment">Advance Payment</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </select>
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

            <div className="supplier-form__field">
              <label className="supplier-form__label">Operational Status</label>
              <select
                className="supplier-form__select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="ON_HOLD">ON HOLD</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div className="supplier-form__field">
              <label className="supplier-form__label">Supplier Rating (1.0 - 5.0)</label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                className="supplier-form__input"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              />
            </div>
          </div>

          <div className="supplier-form__field supplier-form__field--full">
            <label className="supplier-form__label">Registered Physical Address</label>
            <input
              type="text"
              className="supplier-form__input"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full warehouse or mill address in Sri Lanka"
            />
          </div>

          <div className="supplier-form__field supplier-form__field--full">
            <label className="supplier-form__label">Procurement &amp; Quality Notes</label>
            <textarea
              className="supplier-form__textarea"
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Specialized in 60s count linen; requires 10 days notice during festive season drops."
            />
          </div>

          <div className="supplier-form__actions">
            <Button
              variant="secondary"
              size="md"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              loading={submitting}
            >
              {isEditing ? 'Save Changes' : 'Confirm Enrollment'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── View Particulars Modal ── */}
      {viewSupplier && (
        <Modal
          isOpen={Boolean(viewSupplier)}
          onClose={() => setViewSupplier(null)}
          title={`Supplier Profile: ${viewSupplier.id}`}
          size="md"
        >
          <div className="supplier-view-card">
            <div className="supplier-view-header">
              <div>
                <h3 className="supplier-view-title">{viewSupplier.companyName}</h3>
                <span className="supplier-view-cat">{viewSupplier.category}</span>
              </div>
              <Badge variant={getStatusVariant(viewSupplier.status)}>
                {viewSupplier.status}
              </Badge>
            </div>

            <div className="supplier-view-grid">
              <div>
                <span className="supplier-view-lbl">Liaison Name</span>
                <span className="supplier-view-val">{viewSupplier.contactPerson}</span>
              </div>
              <div>
                <span className="supplier-view-lbl">Location</span>
                <span className="supplier-view-val">{viewSupplier.city}</span>
              </div>
              <div>
                <span className="supplier-view-lbl">Email</span>
                <span className="supplier-view-val">{viewSupplier.email}</span>
              </div>
              <div>
                <span className="supplier-view-lbl">Phone</span>
                <span className="supplier-view-val">{viewSupplier.phone}</span>
              </div>
              <div>
                <span className="supplier-view-lbl">Payment Terms</span>
                <span className="supplier-view-val">{viewSupplier.paymentTerms}</span>
              </div>
              <div>
                <span className="supplier-view-lbl">Lead Time</span>
                <span className="supplier-view-val">{viewSupplier.leadTimeDays} business days</span>
              </div>
              <div>
                <span className="supplier-view-lbl">Audit Rating</span>
                <span className="supplier-view-val">{viewSupplier.rating} / 5.0</span>
              </div>
            </div>

            {viewSupplier.address && (
              <div className="supplier-view-section">
                <span className="supplier-view-lbl">Physical Address</span>
                <span className="supplier-view-text">{viewSupplier.address}</span>
              </div>
            )}

            {viewSupplier.notes && (
              <div className="supplier-view-section">
                <span className="supplier-view-lbl">Procurement &amp; Quality Notes</span>
                <span className="supplier-view-text">{viewSupplier.notes}</span>
              </div>
            )}

            <div className="supplier-view-actions">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setViewSupplier(null)}
              >
                Close Particulars
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
                Edit Profile
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Confirm Delete Dialog ── */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Vendor From Directory?"
        message={`Are you certain you want to permanently delete supplier "${deleteTarget?.companyName}" (${deleteTarget?.id})? This will archive active vendor agreements.`}
        confirmLabel="Confirm Removal"
        cancelLabel="Keep Supplier"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
