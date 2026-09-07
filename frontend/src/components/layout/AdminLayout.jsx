import { useState, useEffect } from 'react';
import { Navigate, Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  Star,
  Building2,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
  Clock,
  CircleCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ToastContainer from '../common/Toast';
import './AdminLayout.css';

export default function AdminLayout() {
  const { isAuthenticated, logout, admin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Clock in Sri Lanka time (UTC+5:30)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Colombo',
        }) + ' SLST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-layout">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="admin-layout__backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <Link to="/admin/dashboard" className="admin-sidebar__brand">
            <span className="admin-sidebar__brand-main">GEN-Z</span>
            <span className="admin-sidebar__brand-sub">ADMIN</span>
          </Link>
          <button
            className="admin-sidebar__close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-sidebar__role-card">
          <div className="admin-sidebar__role-avatar">
            <Shield size={16} />
          </div>
          <div className="admin-sidebar__role-info">
            <span className="admin-sidebar__role-title">Store Administration</span>
            <span className="admin-sidebar__role-badge">SUPER ADMIN</span>
          </div>
        </div>

        <nav className="admin-sidebar__nav" aria-label="Admin Navigation">
          <div className="admin-sidebar__group-label">Core Operations</div>

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
            }
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/deliveries"
            className={({ isActive }) =>
              `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
            }
          >
            <Truck size={18} />
            <span>Deliveries &amp; Tracking</span>
          </NavLink>

          <NavLink
            to="/admin/suppliers"
            className={({ isActive }) =>
              `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
            }
          >
            <Building2 size={18} />
            <span>Suppliers &amp; Vendors</span>
          </NavLink>

          <NavLink
            to="/admin/reviews"
            className={({ isActive }) =>
              `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
            }
          >
            <Star size={18} />
            <span>Customer Reviews</span>
          </NavLink>

          <div className="admin-sidebar__group-label">Store Settings</div>

          <NavLink
            to="/admin/staff"
            className={({ isActive }) =>
              `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
            }
          >
            <Users size={18} />
            <span>Staff &amp; Access</span>
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
            }
          >
            <Settings size={18} />
            <span>Store Configuration</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar__footer">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-sidebar__link admin-sidebar__link--ghost"
          >
            <ExternalLink size={16} />
            <span>View Public Store</span>
          </a>

          <button
            onClick={handleLogout}
            className="admin-sidebar__logout-btn"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="admin-layout__content-wrap">
        {/* Top Header */}
        <header className="admin-header">
          <div className="admin-header__left">
            <button
              className="admin-header__menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation"
            >
              <Menu size={22} />
            </button>

            <div className="admin-header__status-badge">
              <CircleCheck size={14} className="admin-header__status-dot" />
              <span>System Online · Colombo</span>
            </div>
          </div>

          <div className="admin-header__right">
            <div className="admin-header__time" title="Current Sri Lanka Time">
              <Clock size={14} />
              <span>{currentTime}</span>
            </div>

            <button
              onClick={handleLogout}
              className="admin-header__quick-logout"
              title="End Session &amp; Logout"
            >
              <LogOut size={16} />
              <span className="admin-header__logout-label">Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="admin-layout__main" id="admin-main">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
