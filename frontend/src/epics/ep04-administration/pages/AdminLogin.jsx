import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, ArrowLeft, Lock, Sparkles, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/common/Button';
import './AdminLogin.css';

export default function AdminLogin() {
  const [accessKey, setAccessKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const { login, loading, isAuthenticated, initializing } = useAuth();
  const navigate = useNavigate();

  // If already authenticated and not waiting for session check, redirect to dashboard
  if (!initializing && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const keyToSubmit = accessKey.trim();
    if (!keyToSubmit) {
      setError('Please enter your admin access key.');
      return;
    }

    setError('');
    const res = await login(keyToSubmit);
    if (res.success) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError(res.message || 'Invalid access key. Verification failed.');
    }
  };

  const handleQuickFill = () => {
    setAccessKey('GENZ-ADMIN-2026');
    setError('');
  };

  return (
    <div className="admin-login-page">
      {/* Background ambient electric indigo / cyan glow (Zero Gold) */}
      <div className="admin-login-ambient-glow admin-login-ambient-glow--indigo" aria-hidden="true" />
      <div className="admin-login-ambient-glow admin-login-ambient-glow--cyan" aria-hidden="true" />

      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top Back Link */}
        <Link to="/" className="admin-login-back-link" title="Back to storefront">
          <ArrowLeft size={16} />
          <span>Return to Storefront</span>
        </Link>

        {/* Brand Header */}
        <div className="admin-login-header">
          <div className="admin-login-badge-wrap">
            <span className="admin-login-badge">
              <Shield size={13} className="admin-login-badge-icon" />
              RESTRICTED PORTAL
            </span>
          </div>

          <h1 className="admin-login-title">
            GEN-Z <span className="admin-login-title-accent">CONSOLE</span>
          </h1>
          <p className="admin-login-subtitle">
            Executive administration, vendor procurement &amp; operational oversight.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
          <div className="admin-login-field">
            <div className="admin-login-label-row">
              <label htmlFor="admin-key-input" className="admin-login-label">
                <Lock size={14} className="admin-login-label-icon" />
                <span>Admin Master Key</span>
              </label>

              <button
                type="button"
                className="admin-login-quickfill-btn"
                onClick={handleQuickFill}
                title="Auto-fill development access key"
              >
                <KeyRound size={12} />
                <span>Quick Fill Key</span>
              </button>
            </div>

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
                placeholder="Enter access key (GENZ-ADMIN-2026)"
                autoComplete="current-password"
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
              <motion.div
                className="admin-login-error"
                role="alert"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span>{error}</span>
              </motion.div>
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
            Authenticate &amp; Enter Console
          </Button>

          <div className="admin-login-footer-info">
            <Sparkles size={13} className="admin-login-info-icon" />
            <span>Authorized store operators and administration personnel only</span>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
