import { useState, useEffect, useMemo } from 'react';
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Warehouse,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  RotateCcw,
  Sparkles,
  PackagePlus,
  SlidersHorizontal,
  DollarSign,
  Download,
  Info,
  Layers,
  RefreshCw,
  XCircle
} from 'lucide-react';
import {
  getInventory,
  getInventoryStats,
  createInventoryItem,
  updateInventoryItem,
  adjustStock,
  deleteInventoryItem
} from '../services/inventory.service';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import Modal from '../../../components/common/Modal';
import Loader from '../../../components/common/Loader';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { useToast } from '../../../context/ToastContext';
import './AdminInventoryPage.css';

const CATEGORIES = [
  'ALL',
  "Men's Fashion",
  'Fragrances & Oud',
  "Boys' Fashion",
  'Accessories',
];

const WAREHOUSES = [
  'ALL',
  'Colombo Hub',
  'EPZ Biyagama',
  'Kandy Warehouse',
];

const INITIAL_ITEM_FORM = {
  sku: '',
  name: '',
  category: "Men's Fashion",
  stockOnHand: 10,
  minThreshold: 10,
  costPrice: 3000,
  retailPrice: 6500,
  warehouseLocation: 'Colombo Hub - Bay A1',
  supplierName: 'General Supplier',
};

export default function AdminInventoryPage() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Sorting
  const [sortField, setSortField] = useState('stockOnHand');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modals
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(INITIAL_ITEM_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Quick stock adjustment modal
  const [adjustItem, setAdjustItem] = useState(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('RESTOCK');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  // Detail / Audit Log modal
  const [detailItem, setDetailItem] = useState(null);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState(null);

  const toast = useToast();

  const loadData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const [inventoryData, statsData] = await Promise.all([
        getInventory({
          search,
          category: selectedCategory,
          warehouse: selectedWarehouse,
          status: selectedStatus,
          sortBy: sortField,
          order: sortOrder,
        }),
        getInventoryStats(),
      ]);
      setItems(inventoryData || []);
      setStats(statsData || null);
      if (isManualRefresh) toast.success('Inventory synced with warehouse hub.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to load inventory records.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, selectedCategory, selectedWarehouse, selectedStatus, sortField, sortOrder]);

  const formatLKR = (val) => {
    if (val === undefined || val === null) return 'LKR 0';
    return `LKR ${Number(val).toLocaleString('en-US')}`;
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'IN_STOCK':
        return 'success';
      case 'LOW_STOCK':
        return 'warning';
      case 'OUT_OF_STOCK':
        return 'error';
      default:
        return 'neutral';
    }
  };

  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} className="inv-sort-icon inv-sort-icon--idle" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={12} className="inv-sort-icon inv-sort-icon--active" />
    ) : (
      <ArrowDown size={12} className="inv-sort-icon inv-sort-icon--active" />
    );
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData(INITIAL_ITEM_FORM);
    setFormErrors({});
    setItemModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setIsEditing(true);
    setFormData({
      id: item.id,
      sku: item.sku,
      name: item.name,
      category: item.category,
      stockOnHand: item.stockOnHand,
      minThreshold: item.minThreshold,
      costPrice: item.costPrice,
      retailPrice: item.retailPrice,
      warehouseLocation: item.warehouseLocation,
      supplierName: item.supplierName,
    });
    setFormErrors({});
    setItemModalOpen(true);
  };

  // Submit Item Form
  const handleItemSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required.';
    if (!formData.sku.trim()) errors.sku = 'SKU code is required.';
    if (formData.retailPrice <= 0) errors.retailPrice = 'Valid retail price required.';
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateInventoryItem(formData.id, formData);
        toast.success(`SKU "${formData.sku}" updated successfully.`);
      } else {
        await createInventoryItem(formData);
        toast.success(`New SKU "${formData.sku}" added to inventory.`);
      }
      setItemModalOpen(false);
      loadData();
    } catch (err) {
      toast.error('Failed to save inventory item.');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Adjustment Form
  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    const qty = Number(adjustQty);
    if (isNaN(qty) || qty === 0) {
      toast.error('Please specify a non-zero adjustment quantity.');
      return;
    }

    setAdjusting(true);
    try {
      const res = await adjustStock(adjustItem.id, {
        quantity: qty,
        reason: adjustReason,
        notes: adjustNotes,
      });
      toast.success(
        `Stock level for ${adjustItem.sku} adjusted by ${qty > 0 ? '+' : ''}${qty} units.`
      );
      if (detailItem && detailItem.id === adjustItem.id && res?.item) {
        setDetailItem(res.item);
      }
      setAdjustItem(null);
      setAdjustQty('');
      setAdjustNotes('');
      loadData();
    } catch (err) {
      toast.error('Adjustment failed.');
    } finally {
      setAdjusting(false);
    }
  };

  // Preset adjustment helper
  const handleApplyPreset = (qty, reason) => {
    setAdjustQty(qty);
    setAdjustReason(reason);
  };

  // Delete Action
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteInventoryItem(deleteTarget.id);
      toast.success(`SKU ${deleteTarget.sku} archived.`);
      if (detailItem && detailItem.id === deleteTarget.id) {
        setDetailItem(null);
      }
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      toast.error('Failed to archive inventory item.');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (items.length === 0) {
      toast.info('No inventory records matching current filter.');
      return;
    }

    const headers = [
      'SKU',
      'Product Name',
      'Category',
      'Stock On Hand',
      'Safety Threshold',
      'Cost Price (LKR)',
      'Retail Price (LKR)',
      'Gross Margin %',
      'Warehouse Location',
      'Supplier',
      'Status',
      'Last Restocked Date',
    ];

    const rows = items.map((item) => {
      const margin =
        item.retailPrice > 0
          ? (((item.retailPrice - item.costPrice) / item.retailPrice) * 100).toFixed(1)
          : '0.0';
      return [
        `"${item.sku}"`,
        `"${item.name.replace(/"/g, '""')}"`,
        `"${item.category}"`,
        item.stockOnHand,
        item.minThreshold,
        item.costPrice,
        item.retailPrice,
        `"${margin}%"`,
        `"${item.warehouseLocation.replace(/"/g, '""')}"`,
        `"${item.supplierName.replace(/"/g, '""')}"`,
        `"${item.status}"`,
        `"${item.lastRestockedAt ? new Date(item.lastRestockedAt).toISOString().split('T')[0] : 'N/A'}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `genz_inventory_stock_report_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Inventory stock report exported as CSV.');
  };

  // Live estimated margin preview for item modal
  const formMargin = useMemo(() => {
    const cost = Number(formData.costPrice) || 0;
    const retail = Number(formData.retailPrice) || 0;
    if (retail <= 0) return 0;
    return (((retail - cost) / retail) * 100).toFixed(1);
  }, [formData.costPrice, formData.retailPrice]);

  const totalValuation = stats?.totalValuation || 0;
  const totalCostValuation = stats?.totalCostValuation || 0;
  const totalQty = stats?.totalStockQty || 0;
  const lowStockCount = stats?.lowStockCount || 0;
  const outOfStockCount = stats?.outOfStockCount || 0;
  const inStockCount = stats?.inStockCount || 0;
  const totalItems = stats?.totalItems || items.length;

  return (
    <div className="admin-inventory-page">
      {/* ── Hero Banner ── */}
      <div className="inventory-hero">
        <div className="inventory-hero__text">
          <div className="inventory-hero__tag">
            <Sparkles size={13} className="inventory-hero__sparkle" />
            <span>EP-01 &middot; PRODUCT &amp; WAREHOUSE STOCK</span>
          </div>
          <h1 className="inventory-hero__title">Inventory &amp; Stock Control</h1>
          <p className="inventory-hero__subtitle">
            Real-time SKU stock levels, warehouse facilities, replenishment triggers, and valuation analytics across Sri Lanka.
          </p>
        </div>

        <div className="inventory-hero__actions">
          <Button
            variant="outline"
            size="md"
            onClick={handleExportCSV}
            className="inventory-export-btn"
            title="Export filtered records to spreadsheet"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => loadData(true)}
            className="inventory-refresh-btn"
            disabled={refreshing}
            title="Sync live warehouse inventory"
          >
            <RefreshCw size={15} className={refreshing ? 'inv-spin' : ''} />
            <span>{refreshing ? 'Syncing...' : 'Sync Hub'}</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            className="inventory-action-btn"
          >
            <Plus size={16} />
            <span>Add New SKU</span>
          </Button>
        </div>
      </div>

      {/* ── KPI Summary Cards (Interactive Filters) ── */}
      <div className="inventory-kpis">
        <div
          className="inventory-kpi"
          title="Total retail inventory value across all warehouses"
        >
          <div className="inventory-kpi__top">
            <span className="inventory-kpi__lbl">Inventory Valuation</span>
            <div className="inventory-kpi__icon inventory-kpi__icon--indigo">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="inventory-kpi__val">{formatLKR(totalValuation)}</div>
          <span className="inventory-kpi__sub">
            Cost base: {formatLKR(totalCostValuation)}
          </span>
        </div>

        <div
          className={`inventory-kpi inventory-kpi--interactive ${selectedStatus === 'ALL' ? 'inventory-kpi--active' : ''}`}
          onClick={() => setSelectedStatus('ALL')}
          title="Click to show all stock units"
        >
          <div className="inventory-kpi__top">
            <span className="inventory-kpi__lbl">Total Stock Units</span>
            <div className="inventory-kpi__icon inventory-kpi__icon--cyan">
              <Boxes size={18} />
            </div>
          </div>
          <div className="inventory-kpi__val">{totalQty.toLocaleString()} Units</div>
          <span className="inventory-kpi__sub">{inStockCount} SKUs healthy in stock</span>
        </div>

        <div
          className={`inventory-kpi inventory-kpi--interactive ${selectedStatus === 'LOW_STOCK' ? 'inventory-kpi--active-warning' : ''}`}
          onClick={() => setSelectedStatus(selectedStatus === 'LOW_STOCK' ? 'ALL' : 'LOW_STOCK')}
          title="Click to filter by low stock alert"
        >
          <div className="inventory-kpi__top">
            <span className="inventory-kpi__lbl">Low Stock Warnings</span>
            <div className="inventory-kpi__icon inventory-kpi__icon--warning">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="inventory-kpi__val warning-text">{lowStockCount} SKUs</div>
          <span className="inventory-kpi__sub">Below safety threshold &rarr;</span>
        </div>

        <div
          className={`inventory-kpi inventory-kpi--interactive ${selectedStatus === 'OUT_OF_STOCK' ? 'inventory-kpi--active-danger' : ''}`}
          onClick={() => setSelectedStatus(selectedStatus === 'OUT_OF_STOCK' ? 'ALL' : 'OUT_OF_STOCK')}
          title="Click to filter by out-of-stock items"
        >
          <div className="inventory-kpi__top">
            <span className="inventory-kpi__lbl">Stockouts / Depleted</span>
            <div className="inventory-kpi__icon inventory-kpi__icon--danger">
              <XCircle size={18} />
            </div>
          </div>
          <div className="inventory-kpi__val danger-text">{outOfStockCount} SKUs</div>
          <span className="inventory-kpi__sub">Immediate restock required &rarr;</span>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="inventory-controls">
        <div className="inventory-search">
          <Search size={16} className="inventory-search__icon" />
          <input
            type="text"
            className="inventory-search__input"
            placeholder="Search by SKU, item name, bay, vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="inventory-search__clear"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        <div className="inventory-chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`inventory-chip ${selectedCategory === cat ? 'inventory-chip--active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'ALL' ? 'All Departments' : cat}
            </button>
          ))}
        </div>

        <div className="inventory-selects">
          <div className="inventory-status-filter" title="Filter by Warehouse Hub">
            <Warehouse size={14} className="inventory-status-icon" />
            <select
              className="inventory-status-select"
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
            >
              <option value="ALL">All Warehouses</option>
              {WAREHOUSES.filter((w) => w !== 'ALL').map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          <div className="inventory-status-filter" title="Filter by Stock Condition">
            <SlidersHorizontal size={14} className="inventory-status-icon" />
            <select
              className="inventory-status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Stock States</option>
              <option value="LOW_STOCK">Low Stock Alert</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="IN_STOCK">In Stock (Healthy)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Inventory Table Card ── */}
      <div className="inventory-table-card">
        {loading ? (
          <div className="inventory-loading">
            <Loader size="md" message="Loading warehouse stock data..." />
          </div>
        ) : items.length === 0 ? (
          <div className="inventory-empty">
            <Boxes size={40} className="inventory-empty__icon" />
            <h3 className="inventory-empty__title">No Inventory Items Found</h3>
            <p className="inventory-empty__desc">
              No SKU records match your search query or department/warehouse filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('');
                setSelectedCategory('ALL');
                setSelectedWarehouse('ALL');
                setSelectedStatus('ALL');
              }}
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="inventory-table-wrap">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('sku')} className="inv-th--sortable">
                    <div className="inv-th-content">
                      <span>SKU &amp; Location</span>
                      {renderSortIcon('sku')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('name')} className="inv-th--sortable">
                    <div className="inv-th-content">
                      <span>Product Particulars</span>
                      {renderSortIcon('name')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('stockOnHand')} className="inv-th--sortable">
                    <div className="inv-th-content">
                      <span>Stock vs Safety</span>
                      {renderSortIcon('stockOnHand')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('retailPrice')} className="inv-th--sortable">
                    <div className="inv-th-content">
                      <span>Pricing &amp; Margin</span>
                      {renderSortIcon('retailPrice')}
                    </div>
                  </th>
                  <th>Stock State</th>
                  <th onClick={() => handleSort('lastRestockedAt')} className="inv-th--sortable">
                    <div className="inv-th-content">
                      <span>Restocked</span>
                      {renderSortIcon('lastRestockedAt')}
                    </div>
                  </th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const stockPct = Math.min(
                    100,
                    Math.round((item.stockOnHand / (item.minThreshold * 2.5 || 25)) * 100)
                  );
                  const marginPct =
                    item.retailPrice > 0
                      ? (((item.retailPrice - item.costPrice) / item.retailPrice) * 100).toFixed(0)
                      : 0;

                  return (
                    <tr
                      key={item.id}
                      className="inventory-table__row"
                      onClick={() => setDetailItem(item)}
                    >
                      <td>
                        <div className="inventory-sku-cell">
                          <span className="inventory-sku-code">{item.sku}</span>
                          <span className="inventory-location">
                            <Warehouse size={11} />
                            {item.warehouseLocation}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="inventory-product-cell">
                          <span className="inventory-product-name">{item.name}</span>
                          <span className="inventory-product-cat">
                            {item.category} &middot; {item.supplierName}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="inventory-stock-cell">
                          <div className="inventory-stock-nums">
                            <span
                              className={`inventory-stock-qty ${
                                item.stockOnHand <= 0
                                  ? 'danger-text'
                                  : item.stockOnHand <= item.minThreshold
                                  ? 'warning-text'
                                  : ''
                              }`}
                            >
                              {item.stockOnHand} units
                            </span>
                            <span className="inventory-threshold">
                              Safety: {item.minThreshold}
                            </span>
                          </div>
                          <div className="inventory-bar-track">
                            <div
                              className={`inventory-bar-fill ${
                                item.stockOnHand <= 0
                                  ? 'inventory-bar-fill--empty'
                                  : item.stockOnHand <= item.minThreshold
                                  ? 'inventory-bar-fill--low'
                                  : 'inventory-bar-fill--good'
                              }`}
                              style={{ width: `${Math.max(4, stockPct)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="inventory-pricing-cell">
                          <div className="inventory-pricing-top">
                            <span className="inventory-retail">{formatLKR(item.retailPrice)}</span>
                            <span className="inventory-margin-badge">+{marginPct}% margin</span>
                          </div>
                          <span className="inventory-cost">Cost: {formatLKR(item.costPrice)}</span>
                        </div>
                      </td>
                      <td>
                        <Badge variant={getStatusVariant(item.status)}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td>
                        <span className="inventory-date">
                          {item.lastRestockedAt
                            ? new Date(item.lastRestockedAt).toLocaleDateString('en-GB')
                            : 'N/A'}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="inventory-actions-cell">
                          <button
                            className="inv-btn inv-btn--info"
                            onClick={() => setDetailItem(item)}
                            title="Inspect SKU Details & Stock Audit Trail"
                          >
                            <Info size={14} />
                          </button>
                          <button
                            className="inv-btn inv-btn--adjust"
                            onClick={() => {
                              setAdjustItem(item);
                              setAdjustQty(10);
                              setAdjustReason('RESTOCK');
                              setAdjustNotes('');
                            }}
                            title="Quick Stock Adjustment / Restock"
                          >
                            <ArrowUpDown size={14} />
                          </button>
                          <button
                            className="inv-btn"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit SKU Attributes"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="inv-btn inv-btn--delete"
                            onClick={() => setDeleteTarget(item)}
                            title="Archive SKU"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Create / Edit SKU Modal ── */}
      <Modal
        isOpen={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        title={isEditing ? `Modify SKU Attributes: ${formData.sku}` : 'Register New Inventory SKU'}
        size="lg"
      >
        <form onSubmit={handleItemSubmit} className="inventory-form">
          <div className="inventory-form__grid">
            <div className="inventory-form__field">
              <label className="inventory-form__label">
                SKU Identifier Code <span className="inv-req">*</span>
              </label>
              <input
                type="text"
                className={`inventory-form__input ${formErrors.sku ? 'inventory-form__input--err' : ''}`}
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                placeholder="e.g. SKU-MEN-LINEN-01"
              />
              {formErrors.sku && <span className="inv-err">{formErrors.sku}</span>}
            </div>

            <div className="inventory-form__field">
              <label className="inventory-form__label">
                Product Title <span className="inv-req">*</span>
              </label>
              <input
                type="text"
                className={`inventory-form__input ${formErrors.name ? 'inventory-form__input--err' : ''}`}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Signature Noir Linen Overshirt (M)"
              />
              {formErrors.name && <span className="inv-err">{formErrors.name}</span>}
            </div>

            <div className="inventory-form__field">
              <label className="inventory-form__label">Category Department</label>
              <select
                className="inventory-form__select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Men's Fashion">Men's Fashion</option>
                <option value="Fragrances & Oud">Fragrances & Oud</option>
                <option value="Boys' Fashion">Boys' Fashion</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div className="inventory-form__field">
              <label className="inventory-form__label">Primary Sourcing Vendor</label>
              <input
                type="text"
                className="inventory-form__input"
                value={formData.supplierName}
                onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                placeholder="e.g. Ceylon Fragrance Distillers"
              />
            </div>

            <div className="inventory-form__field">
              <label className="inventory-form__label">Cost Price (LKR)</label>
              <input
                type="number"
                min="0"
                className="inventory-form__input"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
              />
            </div>

            <div className="inventory-form__field">
              <div className="inventory-form__label-row">
                <label className="inventory-form__label">
                  Retail Sale Price (LKR) <span className="inv-req">*</span>
                </label>
                {formData.retailPrice > 0 && (
                  <span className="inventory-form__margin-preview">
                    Margin: <strong>+{formMargin}%</strong>
                  </span>
                )}
              </div>
              <input
                type="number"
                min="0"
                className={`inventory-form__input ${formErrors.retailPrice ? 'inventory-form__input--err' : ''}`}
                value={formData.retailPrice}
                onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
              />
              {formErrors.retailPrice && <span className="inv-err">{formErrors.retailPrice}</span>}
            </div>

            <div className="inventory-form__field">
              <label className="inventory-form__label">Initial Stock On Hand</label>
              <input
                type="number"
                min="0"
                className="inventory-form__input"
                value={formData.stockOnHand}
                onChange={(e) => setFormData({ ...formData, stockOnHand: e.target.value })}
              />
            </div>

            <div className="inventory-form__field">
              <label className="inventory-form__label">Safety Min Threshold (Alert Trigger)</label>
              <input
                type="number"
                min="1"
                className="inventory-form__input"
                value={formData.minThreshold}
                onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
              />
            </div>
          </div>

          <div className="inventory-form__field inventory-form__field--full">
            <label className="inventory-form__label">Warehouse Facility &amp; Shelf / Bay Location</label>
            <input
              type="text"
              className="inventory-form__input"
              value={formData.warehouseLocation}
              onChange={(e) => setFormData({ ...formData, warehouseLocation: e.target.value })}
              placeholder="e.g. Colombo Hub - Bay A1, Rack 04"
            />
          </div>

          <div className="inventory-form__actions">
            <Button
              variant="secondary"
              size="md"
              type="button"
              onClick={() => setItemModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              loading={submitting}
            >
              {isEditing ? 'Save SKU Changes' : 'Confirm Registration'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Quick Stock Adjustment Modal ── */}
      {adjustItem && (
        <Modal
          isOpen={Boolean(adjustItem)}
          onClose={() => setAdjustItem(null)}
          title={`Adjust Stock Level: ${adjustItem.sku}`}
          size="sm"
        >
          <form onSubmit={handleAdjustSubmit} className="inventory-adjust-form">
            <div className="inventory-adjust-info">
              <span className="inventory-adjust-name">{adjustItem.name}</span>
              <span className="inventory-adjust-current">
                Current Stock: <strong>{adjustItem.stockOnHand} units</strong>
              </span>
            </div>

            {/* Quick Presets */}
            <div className="inventory-adjust-presets">
              <span className="inventory-adjust-presets__label">Quick Presets:</span>
              <div className="inventory-adjust-presets__btns">
                <button
                  type="button"
                  className="inv-preset-btn"
                  onClick={() => handleApplyPreset(10, 'RESTOCK')}
                >
                  +10 Restock
                </button>
                <button
                  type="button"
                  className="inv-preset-btn"
                  onClick={() => handleApplyPreset(25, 'RESTOCK')}
                >
                  +25 Restock
                </button>
                <button
                  type="button"
                  className="inv-preset-btn"
                  onClick={() => handleApplyPreset(50, 'RESTOCK')}
                >
                  +50 Batch
                </button>
                <button
                  type="button"
                  className="inv-preset-btn inv-preset-btn--deduct"
                  onClick={() => handleApplyPreset(-5, 'DAMAGED')}
                >
                  -5 Damage
                </button>
              </div>
            </div>

            <div className="inventory-form__field">
              <label className="inventory-form__label">
                Adjustment Quantity (+ to Add, - to Deduct)
              </label>
              <input
                type="number"
                className="inventory-form__input"
                value={adjustQty}
                onChange={(e) => setAdjustQty(e.target.value)}
                placeholder="e.g. 20 (restock) or -5 (shrinkage)"
                autoFocus
                required
              />
              <span className="inventory-adjust-calc">
                Resulting Balance:{' '}
                <strong>
                  {Math.max(0, adjustItem.stockOnHand + (Number(adjustQty) || 0))} units
                </strong>
              </span>
            </div>

            <div className="inventory-form__field">
              <label className="inventory-form__label">Adjustment Reason</label>
              <select
                className="inventory-form__select"
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
              >
                <option value="RESTOCK">Supplier Restock Shipment</option>
                <option value="CYCLE_COUNT">Physical Inventory Audit</option>
                <option value="DAMAGED">Damaged / Defective Write-off</option>
                <option value="SAMPLE">Showroom / Press Sample</option>
              </select>
            </div>

            <div className="inventory-form__field">
              <label className="inventory-form__label">Audit Notes (Optional)</label>
              <input
                type="text"
                className="inventory-form__input"
                value={adjustNotes}
                onChange={(e) => setAdjustNotes(e.target.value)}
                placeholder="e.g. Shipment invoice #INV-893 from Ceylon Fragrances"
              />
            </div>

            <div className="inventory-form__actions">
              <Button
                variant="secondary"
                size="md"
                type="button"
                onClick={() => setAdjustItem(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                loading={adjusting}
              >
                Apply Adjustment
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── SKU Detail & Audit Log Modal ── */}
      {detailItem && (
        <Modal
          isOpen={Boolean(detailItem)}
          onClose={() => setDetailItem(null)}
          title={`SKU Inspection & History: ${detailItem.sku}`}
          size="lg"
        >
          <div className="inventory-detail-modal">
            <div className="inv-detail-header">
              <div>
                <span className="inv-detail-cat">{detailItem.category}</span>
                <h2 className="inv-detail-title">{detailItem.name}</h2>
                <span className="inv-detail-loc">
                  <Warehouse size={13} />
                  {detailItem.warehouseLocation}
                </span>
              </div>
              <Badge variant={getStatusVariant(detailItem.status)}>
                {detailItem.status.replace('_', ' ')}
              </Badge>
            </div>

            {/* Metric Grid */}
            <div className="inv-detail-metrics">
              <div className="inv-detail-metric">
                <span className="inv-detail-metric__label">Units In Stock</span>
                <span className="inv-detail-metric__value">{detailItem.stockOnHand}</span>
                <span className="inv-detail-metric__sub">Safety min: {detailItem.minThreshold}</span>
              </div>

              <div className="inv-detail-metric">
                <span className="inv-detail-metric__label">Retail Price</span>
                <span className="inv-detail-metric__value">{formatLKR(detailItem.retailPrice)}</span>
                <span className="inv-detail-metric__sub">Cost: {formatLKR(detailItem.costPrice)}</span>
              </div>

              <div className="inv-detail-metric">
                <span className="inv-detail-metric__label">Gross Margin</span>
                <span className="inv-detail-metric__value inv-detail-metric__value--accent">
                  +
                  {detailItem.retailPrice > 0
                    ? (
                        ((detailItem.retailPrice - detailItem.costPrice) /
                          detailItem.retailPrice) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
                <span className="inv-detail-metric__sub">
                  Profit: {formatLKR(detailItem.retailPrice - detailItem.costPrice)}/unit
                </span>
              </div>

              <div className="inv-detail-metric">
                <span className="inv-detail-metric__label">Total Line Valuation</span>
                <span className="inv-detail-metric__value">
                  {formatLKR(detailItem.stockOnHand * detailItem.retailPrice)}
                </span>
                <span className="inv-detail-metric__sub">Supplier: {detailItem.supplierName}</span>
              </div>
            </div>

            {/* Audit Log / Adjustment History */}
            <div className="inv-detail-history">
              <div className="inv-detail-history__header">
                <h3 className="inv-detail-history__title">Stock Adjustment Audit Log</h3>
                <span className="inv-detail-history__badge">
                  {detailItem.adjustments?.length || 1} recorded
                </span>
              </div>

              <div className="inv-detail-history__list">
                {detailItem.adjustments && detailItem.adjustments.length > 0 ? (
                  detailItem.adjustments.map((adj) => (
                    <div key={adj.id} className="inv-history-row">
                      <div className="inv-history-row__left">
                        <span
                          className={`inv-history-row__change ${
                            adj.change > 0 ? 'inv-change--pos' : 'inv-change--neg'
                          }`}
                        >
                          {adj.change > 0 ? `+${adj.change}` : adj.change} units
                        </span>
                        <div className="inv-history-row__meta">
                          <span className="inv-history-row__reason">
                            {adj.reason.replace('_', ' ')}
                          </span>
                          {adj.notes && (
                            <span className="inv-history-row__notes">"{adj.notes}"</span>
                          )}
                        </div>
                      </div>
                      <div className="inv-history-row__right">
                        <span className="inv-history-row__balance">
                          Balance: {adj.resultingStock}
                        </span>
                        <span className="inv-history-row__time">
                          {new Date(adj.timestamp).toLocaleString('en-GB')}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="inv-history-row">
                    <div className="inv-history-row__left">
                      <span className="inv-history-row__change inv-change--pos">
                        Baseline Created
                      </span>
                      <div className="inv-history-row__meta">
                        <span className="inv-history-row__reason">Initial catalog seed</span>
                        <span className="inv-history-row__notes">
                          Initial stock level established
                        </span>
                      </div>
                    </div>
                    <div className="inv-history-row__right">
                      <span className="inv-history-row__balance">
                        Balance: {detailItem.stockOnHand}
                      </span>
                      <span className="inv-history-row__time">
                        {detailItem.lastRestockedAt
                          ? new Date(detailItem.lastRestockedAt).toLocaleString('en-GB')
                          : 'Baseline'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="inv-detail-actions">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setDetailItem(null)}
              >
                Close
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  const target = detailItem;
                  setDetailItem(null);
                  handleOpenEdit(target);
                }}
              >
                <Edit2 size={14} />
                <span>Edit SKU</span>
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  const target = detailItem;
                  setDetailItem(null);
                  setAdjustItem(target);
                  setAdjustQty(10);
                  setAdjustReason('RESTOCK');
                  setAdjustNotes('');
                }}
              >
                <ArrowUpDown size={14} />
                <span>Adjust / Restock Stock</span>
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
        title="Archive Inventory SKU?"
        message={`Are you sure you want to archive SKU "${deleteTarget?.sku}" (${deleteTarget?.name})? It will be removed from active warehouse tracking.`}
        confirmLabel="Archive SKU"
        cancelLabel="Keep SKU"
        variant="danger"
      />
    </div>
  );
}
