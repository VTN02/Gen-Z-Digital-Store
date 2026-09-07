import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const QUICK_LINKS = [
  { to: '/shop', label: 'Shop All' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

const CUSTOMER_LINKS = [
  { to: '/account', label: 'My Account' },
  { to: '/orders', label: 'My Orders' },
  { to: '/reviews', label: 'Reviews' },
];

export default function Footer() {
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  // Discreet admin entry — triple click on footer logo mark
  const handleLogoClick = () => {
    const next = logoClickCount + 1;
    setLogoClickCount(next);
    if (next >= 3) {
      setLogoClickCount(0);
      setAdminModalOpen(true);
    }
    // Reset counter after 2s of inactivity
    setTimeout(() => setLogoClickCount(0), 2000);
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(accessKey);
    if (result.success) {
      setAdminModalOpen(false);
      setAccessKey('');
      navigate('/admin/dashboard');
    } else {
      setError(result.message);
    }
  };

  const handleModalClose = () => {
    setAdminModalOpen(false);
    setAccessKey('');
    setError('');
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        {/* Brand column */}
        <div className="footer__brand">
          {/* Discreet admin entry — appears as brand logo mark, no "admin" label */}
          <button
            className="footer__logo-mark"
            onClick={handleLogoClick}
            aria-label="Gen-Z"
            title="Gen-Z"
          >
            <span className="footer__logo-text">GEN-Z</span>
            <span className="footer__logo-sub">Fashion &amp; Fragrance</span>
          </button>
          <p className="footer__tagline">
            Modern styles. Confident looks.<br />
            Everyday essentials and signature fragrances.
          </p>
          <div className="footer__social">
            <a href="#" className="footer__social-link" aria-label="Instagram" rel="noopener noreferrer">
              <Instagram size={18} />
            </a>
            <a href="#" className="footer__social-link" aria-label="Facebook" rel="noopener noreferrer">
              <Facebook size={18} />
            </a>
            <a href="#" className="footer__social-link" aria-label="YouTube / TikTok" rel="noopener noreferrer">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <nav className="footer__col" aria-label="Quick links">
          <h4 className="footer__col-title">Shop</h4>
          <ul className="footer__col-links">
            {QUICK_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="footer__link">{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Customer */}
        <nav className="footer__col" aria-label="Customer links">
          <h4 className="footer__col-title">Customer</h4>
          <ul className="footer__col-links">
            {CUSTOMER_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="footer__link">{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div className="footer__col">
          <h4 className="footer__col-title">Contact</h4>
          <ul className="footer__col-links">
            <li><a href="tel:+94XXXXXXXXX" className="footer__link">+94 XX XXX XXXX</a></li>
            <li><a href="https://wa.me/94XXXXXXXXX" className="footer__link" rel="noopener noreferrer">WhatsApp</a></li>
            <li><span className="footer__text">Colombo, Sri Lanka</span></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copy">
          &copy; {new Date().getFullYear()} Gen-Z Fashion &amp; Fragrance. All rights reserved.
        </p>
        <div className="footer__legal">
          <Link to="/privacy" className="footer__link footer__link--small">Privacy Policy</Link>
          <span aria-hidden="true">·</span>
          <Link to="/terms" className="footer__link footer__link--small">Terms of Service</Link>
        </div>
      </div>

      {/* Discreet admin access modal — no "Admin" or "Login" labels */}
      <Modal
        isOpen={adminModalOpen}
        onClose={handleModalClose}
        size="sm"
        hideClose={false}
      >
        <form onSubmit={handleAdminSubmit} className="admin-entry-form">
          <div className="admin-entry-form__logo">
            <span className="admin-entry-form__brand">GEN-Z</span>
            <span className="admin-entry-form__dot">·</span>
          </div>
          <div className="admin-entry-form__field">
            <label htmlFor="access-key" className="admin-entry-form__label">
              Access Key
            </label>
            <input
              id="access-key"
              type="password"
              className={`admin-entry-form__input ${error ? 'admin-entry-form__input--error' : ''}`}
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder="Enter access key"
              autoComplete="off"
              required
              autoFocus
            />
            {error && (
              <p className="admin-entry-form__error" role="alert">{error}</p>
            )}
          </div>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            Continue
          </Button>
        </form>
      </Modal>
    </footer>
  );
}
