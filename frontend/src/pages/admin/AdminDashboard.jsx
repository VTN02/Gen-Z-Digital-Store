import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  DollarSign,
  Truck,
  Users,
  AlertTriangle,
  RefreshCw,
  Search,
  Eye,
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { getDashboardStats, getRecentOrders } from '../../services/dashboard.service';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { useToast } from '../../context/ToastContext';
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
        <Loader size="lg" message="Loading store analytics &amp; operations..." />
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
            <span>OPERATIONAL DASHBOARD</span>
          </div>
          <h1 className="admin-dashboard__title">Store Administration Overview</h1>
          <p className="admin-dashboard__subtitle">
            Real-time performance analytics, revenue tracking, and fulfillment operations.
          </p>
        </div>

        <div className="admin-dashboard__hero-actions">
          <div className="admin-dashboard__timeframe-selector">
            <button
              className={`admin-dashboard__time-btn ${timeframe === 'today' ? 'admin-dashboard__time-btn--active' : ''}`}
              onClick={() => setTimeframe('today')}
            >
              Today
            </button>
            <button
              className={`admin-dashboard__time-btn ${timeframe === 'week' ? 'admin-dashboard__time-btn--active' : ''}`}
              onClick={() => setTimeframe('week')}
            >
              This Week
            </button>
            <button
              className={`admin-dashboard__time-btn ${timeframe === 'month' ? 'admin-dashboard__time-btn--active' : ''}`}
              onClick={() => setTimeframe('month')}
            >
              This Month
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="admin-dashboard__refresh-btn"
          >
            <RefreshCw size={14} className={refreshing ? 'admin-dashboard__spin' : ''} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* ── KPI Metric Cards ── */}
      <section className="admin-dashboard__kpi-grid" aria-label="Key Performance Indicators">
        {/* Revenue */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__top">
            <span className="admin-kpi-card__label">Gross Store Revenue</span>
            <div className="admin-kpi-card__icon-wrap">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="admin-kpi-card__value">{formatLKR(kpi.totalRevenue)}</div>
          <div className="admin-kpi-card__footer">
            <span className="admin-kpi-card__trend admin-kpi-card__trend--up">
              <TrendingUp size={13} />
              +{kpi.revenueChangePercent}%
            </span>
            <span className="admin-kpi-card__period">vs previous period</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__top">
            <span className="admin-kpi-card__label">Total Orders Placed</span>
            <div className="admin-kpi-card__icon-wrap">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="admin-kpi-card__value">{kpi.totalOrders}</div>
          <div className="admin-kpi-card__footer">
            <span className="admin-kpi-card__trend admin-kpi-card__trend--up">
              <TrendingUp size={13} />
              +{kpi.ordersChangePercent}%
            </span>
            <span className="admin-kpi-card__period">sales volume</span>
          </div>
        </div>

        {/* Pending Dispatches */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__top">
            <span className="admin-kpi-card__label">Pending Dispatches</span>
            <div className="admin-kpi-card__icon-wrap admin-kpi-card__icon-wrap--warning">
              <Truck size={18} />
            </div>
          </div>
          <div className="admin-kpi-card__value">{kpi.pendingDispatch}</div>
          <div className="admin-kpi-card__footer">
            <span className="admin-kpi-card__trend admin-kpi-card__trend--neutral">
              {kpi.pendingChangePercent}%
            </span>
            <span className="admin-kpi-card__period">awaiting courier handover</span>
          </div>
        </div>

        {/* Active Customers */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__top">
            <span className="admin-kpi-card__label">Active Registered Shoppers</span>
            <div className="admin-kpi-card__icon-wrap">
              <Users size={18} />
            </div>
          </div>
          <div className="admin-kpi-card__value">{kpi.activeCustomers}</div>
          <div className="admin-kpi-card__footer">
            <span className="admin-kpi-card__trend admin-kpi-card__trend--up">
              <TrendingUp size={13} />
              +{kpi.customersChangePercent}%
            </span>
            <span className="admin-kpi-card__period">community growth</span>
          </div>
        </div>
      </section>

      {/* ── Mid Section: Category Share & Operations Health ── */}
      <div className="admin-dashboard__analytics-row">
        {/* Category Share */}
        <div className="admin-card admin-dashboard__category-card">
          <div className="admin-card__header">
            <div>
              <h2 className="admin-card__title">Sales by Department</h2>
              <p className="admin-card__desc">Revenue contribution across retail collections</p>
            </div>
          </div>

          <div className="admin-dashboard__category-list">
            {categories.map((cat) => (
              <div key={cat.category} className="admin-category-item">
                <div className="admin-category-item__header">
                  <span className="admin-category-item__name">{cat.category}</span>
                  <div className="admin-category-item__stats">
                    <span className="admin-category-item__val">{formatLKR(cat.revenue)}</span>
                    <span className="admin-category-item__pct">({cat.percentage}%)</span>
                  </div>
                </div>
                <div className="admin-category-item__bar-bg">
                  <div
                    className="admin-category-item__bar-fill"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Health & Alerts */}
        <div className="admin-card admin-dashboard__alerts-card">
          <div className="admin-card__header">
            <div>
              <h2 className="admin-card__title">Store Operations Status</h2>
              <p className="admin-card__desc">Fulfillment and inventory health checks</p>
            </div>
          </div>

          <div className="admin-dashboard__alerts-list">
            <div className="admin-alert-banner admin-alert-banner--warning">
              <AlertTriangle size={18} className="admin-alert-banner__icon" />
              <div className="admin-alert-banner__content">
                <span className="admin-alert-banner__title">Low Stock Alert</span>
                <span className="admin-alert-banner__text">
                  {kpi.lowStockAlerts} items are below safety threshold (e.g. Noir EDP 50ml).
                </span>
              </div>
            </div>

            <div className="admin-alert-banner admin-alert-banner--success">
              <Truck size={18} className="admin-alert-banner__icon" />
              <div className="admin-alert-banner__content">
                <span className="admin-alert-banner__title">Courier Fleet Integrated</span>
                <span className="admin-alert-banner__text">
                  Colombo Express and Island-wide logistics routes operational.
                </span>
              </div>
            </div>

            <div className="admin-dashboard__quick-links">
              <a href="/admin/deliveries" className="admin-dashboard__quick-link">
                <span>View All Deliveries</span>
                <ArrowUpRight size={14} />
              </a>
              <a href="/admin/reviews" className="admin-dashboard__quick-link">
                <span>Moderate Reviews</span>
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
                        title="View Order Particulars"
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
                  toast.success(`Fulfillment slip generated for ${selectedOrder.id}`);
                  setSelectedOrder(null);
                }}
              >
                Print Fulfillment Slip
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
