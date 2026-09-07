import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, ArrowLeft, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/common/Button';
import './AdminLogin.css';

export default function AdminLogin() {
  const [accessKey, setAccessKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already logged in, navigate straight to dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accessKey.trim()) {
      setError('Please enter your admin access key.');
      return;
    }

    setError('');
    const res = await login(accessKey);
    if (res.success) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError(res.message || 'Invalid access key. Verification failed.');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg-glow" aria-hidden="true" />

      <div className="admin-login-card">
        {/* Top Back Link */}
        <Link to="/" className="admin-login-back-link">
          <ArrowLeft size={16} />
          <span>Return to Storefront</span>
        </Link>

        {/* Brand Header */}
        <div className="admin-login-header">
          <div className="admin-login-badge-wrap">
            <span className="admin-login-badge">
              <Shield size={14} className="admin-login-badge-icon" />
              RESTRICTED PORTAL
            </span>
          </div>

          <h1 className="admin-login-title">
            GEN-Z <span className="admin-login-title-gold">STORE</span>
          </h1>
          <p className="admin-login-subtitle">
            Executive administration &amp; operations management console.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field">
            <label htmlFor="admin-key-input" className="admin-login-label">
              <Lock size={14} />
              <span>Admin Access Key</span>
            </label>

            <div className="admin-login-input-wrap">
              <input
                id="admin-key-input"
                type={showKey ? 'text' : 'password'}
                className={`admin-login-input ${error ? 'admin-login-input--error' : ''}`}
                value={accessKey}
                onChange={(e) => {
                  setAccessKey(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter master access key"
                autoComplete="off"
                autoFocus
              />
              <button
                type="button"
                className="admin-login-eye-btn"
                onClick={() => setShowKey(!showKey)}
                aria-label={showKey ? 'Hide access key' : 'Show access key'}
                tabIndex={-1}
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div className="admin-login-error" role="alert">
                <span>{error}</span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            className="admin-login-submit"
          >
            Authenticate &amp; Enter Dashboard
          </Button>

          <div className="admin-login-footer-info">
            <Sparkles size={13} className="gold-accent-icon" />
            <span>Authorized store operators and administration staff only</span>
          </div>
        </form>
      </div>
    </div>
  );
}
