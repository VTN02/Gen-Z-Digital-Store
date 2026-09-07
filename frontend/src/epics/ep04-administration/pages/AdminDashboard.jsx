import { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Truck,
  Users,
  AlertTriangle,
  RefreshCw,
  Search,
  Eye,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { getDashboardStats, getRecentOrders } from '../services/dashboard.service';
import Badge from '../../../components/common/Badge';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import { useToast } from '../../../context/ToastContext';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [timeframe, setTimeframe] = useState('week');
  const toast = useToast();

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [statsData, ordersData] = await Promise.all([
        getDashboardStats(),
        getRecentOrders(10),
      ]);
      setStats(statsData);
      setOrders(ordersData);
      if (isRefresh) {
        toast.success('Dashboard metrics refreshed successfully.');
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      toast.error('Failed to retrieve live store metrics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatLKR = (val) => {
    if (val === undefined || val === null) return 'LKR 0';
    return `LKR ${Number(val).toLocaleString('en-US')}`;
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'DELIVERED':
      case 'PAID':
        return 'success';
      case 'SHIPPED':
      case 'PROCESSING':
        return 'info';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'neutral';
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.city.toLowerCase().includes(q)
    );
  });

  if (loading && !stats) {
    return (
      <div className="admin-dashboard-loading">
        <Loader size="lg" message="Loading store analytics & operations..." />
      </div>
    );
  }

  const kpi = stats?.kpis || {};
  const categories = stats?.salesByCategory || [];

  return (
    <div className="admin-dashboard">
      {/* ── Top Overview Banner ── */}
      <div className="admin-dashboard__hero">
        <div className="admin-dashboard__hero-text">
          <div className="admin-dashboard__tag">
            <Sparkles size={13} className="admin-dashboard__sparkle" />
            <span>OPERATIONAL CONSOLE</span>
          </div>
          <h1 className="admin-dashboard__title">Store Administration Overview</h1>
          <p className="admin-dashboard__subtitle">
            Real-time performance analytics, revenue tracking, and fulfillment operations.
          </p>
        </div>

        <div className="admin-dashboard__hero-actions">
          <div className="admin-dashboard__timeframe-selector">
            <button
              className={`admin-dashboard__tf-btn ${timeframe === 'day' ? 'active' : ''}`}
              onClick={() => setTimeframe('day')}
            >
              24h
            </button>
            <button
              className={`admin-dashboard__tf-btn ${timeframe === 'week' ? 'active' : ''}`}
              onClick={() => setTimeframe('week')}
            >
              7D
            </button>
            <button
              className={`admin-dashboard__tf-btn ${timeframe === 'month' ? 'active' : ''}`}
              onClick={() => setTimeframe('month')}
            >
              30D
            </button>
          </div>

          <button
            className="admin-dashboard__refresh-btn"
            onClick={() => loadData(true)}
            disabled={refreshing}
            title="Refresh metrics"
          >
            <RefreshCw size={15} className={refreshing ? 'admin-spin' : ''} />
            <span>{refreshing ? 'Updating...' : 'Sync Live'}</span>
          </button>
        </div>
      </div>

      {/* ── KPI Metrics Cards ── */}
      <div className="admin-dashboard__kpi-grid">
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <span className="admin-kpi-card__label">Gross Revenue</span>
            <div className="admin-kpi-card__icon admin-kpi-card__icon--indigo">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="admin-kpi-card__value">{formatLKR(kpi.totalRevenue)}</div>
          <div className="admin-kpi-card__footer">
            <span className="admin-kpi-card__trend positive">
              <TrendingUp size={13} /> +18.4%
            </span>
            <span className="admin-kpi-card__period">vs prior cycle</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <span className="admin-kpi-card__label">Total Orders</span>
            <div className="admin-kpi-card__icon admin-kpi-card__icon--cyan">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="admin-kpi-card__value">{kpi.totalOrders?.toLocaleString()}</div>
          <div className="admin-kpi-card__footer">
            <span className="admin-kpi-card__trend positive">
              <TrendingUp size={13} /> +12.1%
            </span>
            <span className="admin-kpi-card__period">island-wide</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <span className="admin-kpi-card__label">Average Order Value</span>
            <div className="admin-kpi-card__icon admin-kpi-card__icon--violet">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="admin-kpi-card__value">{formatLKR(kpi.avgOrderValue)}</div>
          <div className="admin-kpi-card__footer">
            <span className="admin-kpi-card__trend positive">
              <TrendingUp size={13} /> +5.6%
            </span>
            <span className="admin-kpi-card__period">basket size</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <span className="admin-kpi-card__label">Fulfillment Rate</span>
            <div className="admin-kpi-card__icon admin-kpi-card__icon--emerald">
              <Truck size={18} />
            </div>
          </div>
          <div className="admin-kpi-card__value">{kpi.fulfillmentRate || 98.4}%</div>
          <div className="admin-kpi-card__footer">
            <span className="admin-kpi-card__trend positive">
              <ShieldCheck size={13} /> SLA Met
            </span>
            <span className="admin-kpi-card__period">island-wide</span>
          </div>
        </div>
      </div>

      {/* ── Mid Section: Department Breakdown & System Notices ── */}
      <div className="admin-dashboard__mid-grid">
        {/* Department Revenue Breakdown */}
        <div className="admin-card admin-dashboard__cat-card">
          <div className="admin-card__header">
            <h2 className="admin-card__title">Department Revenue Distribution</h2>
            <p className="admin-card__desc">Contribution by product department across Sri Lanka</p>
          </div>

          <div className="admin-dashboard__categories-list">
            {categories.map((cat) => (
              <div key={cat.category} className="admin-cat-row">
                <div className="admin-cat-row__info">
                  <span className="admin-cat-row__name">{cat.category}</span>
                  <span className="admin-cat-row__val">{formatLKR(cat.revenue)} ({cat.percentage}%)</span>
                </div>
                <div className="admin-cat-row__bar-track">
                  <div
                    className="admin-cat-row__bar-fill"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Operations & Alerts */}
        <div className="admin-card admin-dashboard__alerts-card">
          <div className="admin-card__header">
            <h2 className="admin-card__title">Operational Alerts & Logistics</h2>
            <p className="admin-card__desc">Live courier statuses and inventory thresholds</p>
          </div>

          <div className="admin-dashboard__alerts-list">
            <div className="admin-alert-banner admin-alert-banner--warning">
              <AlertTriangle size={18} className="admin-alert-banner__icon" />
              <div className="admin-alert-banner__content">
                <span className="admin-alert-banner__title">Low Stock Alert</span>
                <span className="admin-alert-banner__text">
                  {kpi.lowStockAlerts} items are below safety replenishment threshold (e.g. Noir EDP 50ml).
                </span>
              </div>
            </div>

            <div className="admin-alert-banner admin-alert-banner--success">
              <Truck size={18} className="admin-alert-banner__icon" />
              <div className="admin-alert-banner__content">
                <span className="admin-alert-banner__title">Courier Fleet Online</span>
                <span className="admin-alert-banner__text">
                  Colombo Express and Island-wide logistics gateways active and running.
                </span>
              </div>
            </div>

            <div className="admin-dashboard__quick-links">
              <a href="/admin/suppliers" className="admin-dashboard__quick-link">
                <span>Supplier Directory</span>
                <ArrowUpRight size={14} />
              </a>
              <a href="/admin/reviews" className="admin-dashboard__quick-link">
                <span>Customer Reviews Portal</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Orders Table ── */}
      <div className="admin-card admin-dashboard__orders-card">
        <div className="admin-card__header admin-card__header--flex">
          <div>
            <h2 className="admin-card__title">Recent Customer Orders</h2>
            <p className="admin-card__desc">Real-time purchase activity and fulfillment dispatch states</p>
          </div>

          <div className="admin-dashboard__search-box">
            <Search size={15} className="admin-dashboard__search-icon" />
            <input
              type="text"
              className="admin-dashboard__search-input"
              placeholder="Search by Order #, Name, City..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Summary Items</th>
                <th>Total (LKR)</th>
                <th>Payment</th>
                <th>Fulfillment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-table__empty">
                    No orders found matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="admin-table__row">
                    <td>
                      <span className="admin-table__order-id">{order.id}</span>
                    </td>
                    <td>
                      <div className="admin-table__customer">
                        <span className="admin-table__customer-name">{order.customer.name}</span>
                        <span className="admin-table__customer-city">{order.customer.city}</span>
                      </div>
                    </td>
                    <td>
                      <span className="admin-table__items-summary" title={order.itemsSummary}>
                        {order.itemsSummary}
                      </span>
                    </td>
                    <td>
                      <span className="admin-table__amount">{formatLKR(order.totalAmount)}</span>
                    </td>
                    <td>
                      <Badge variant={getStatusVariant(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td>
                      <Badge variant={getStatusVariant(order.orderStatus)}>
                        {order.orderStatus}
                      </Badge>
                    </td>
                    <td>
                      <button
                        className="admin-table__view-btn"
                        onClick={() => setSelectedOrder(order)}
                        title="View Order Details"
                      >
                        <Eye size={15} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Order Detail Modal ── */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order Particulars: ${selectedOrder.id}`}
          size="md"
        >
          <div className="admin-order-modal">
            <div className="admin-order-modal__section">
              <h3 className="admin-order-modal__heading">Customer Information</h3>
              <div className="admin-order-modal__grid">
                <div>
                  <span className="admin-order-modal__label">Full Name</span>
                  <span className="admin-order-modal__value">{selectedOrder.customer.name}</span>
                </div>
                <div>
                  <span className="admin-order-modal__label">Email</span>
                  <span className="admin-order-modal__value">{selectedOrder.customer.email}</span>
                </div>
                <div>
                  <span className="admin-order-modal__label">Destination City</span>
                  <span className="admin-order-modal__value">{selectedOrder.customer.city}</span>
                </div>
                <div>
                  <span className="admin-order-modal__label">Payment Method</span>
                  <span className="admin-order-modal__value">{selectedOrder.paymentMethod}</span>
                </div>
              </div>
            </div>

            <div className="admin-order-modal__section">
              <h3 className="admin-order-modal__heading">Fulfillment Overview</h3>
              <div className="admin-order-modal__items-card">
                <p className="admin-order-modal__items-text">{selectedOrder.itemsSummary}</p>
                <div className="admin-order-modal__badges">
                  <Badge variant={getStatusVariant(selectedOrder.paymentStatus)}>
                    Payment: {selectedOrder.paymentStatus}
                  </Badge>
                  <Badge variant={getStatusVariant(selectedOrder.orderStatus)}>
                    Status: {selectedOrder.orderStatus}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="admin-order-modal__total-bar">
              <span>Total Invoice Amount</span>
              <span className="admin-order-modal__total-val">
                {formatLKR(selectedOrder.totalAmount)}
              </span>
            </div>

            <div className="admin-order-modal__actions">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setSelectedOrder(null)}
              >
                Dismiss
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  toast.success(`Fulfillment dispatch generated for ${selectedOrder.id}`);
                  setSelectedOrder(null);
                }}
              >
                Generate Dispatch Slip
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
