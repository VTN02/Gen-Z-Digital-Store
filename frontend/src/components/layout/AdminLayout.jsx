import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ToastContainer from '../common/Toast';
import './AdminLayout.css';

/**
 * AdminLayout
 * Protected wrapper for all admin pages.
 * Redirects to home if not authenticated.
 * Stage 2 will add the sidebar and admin header here.
 */
export default function AdminLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-layout">
      {/* Admin sidebar and header will be added in Stage 2 */}
      <main className="admin-layout__main" id="admin-main">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
}
