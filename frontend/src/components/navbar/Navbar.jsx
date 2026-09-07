import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search } from 'lucide-react';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Sticky scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" aria-label="Gen-Z Store home">
          <span className="navbar__logo-text">GEN-Z</span>
          <span className="navbar__logo-dot" aria-hidden="true">·</span>
        </Link>

        {/* Desktop nav */}
        <nav className="navbar__links" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          <button className="navbar__icon-btn" aria-label="Search">
            <Search size={18} />
          </button>
          <button className="navbar__icon-btn" aria-label="Account">
            <User size={18} />
          </button>
          <button className="navbar__icon-btn navbar__cart-btn" aria-label="Shopping cart">
            <ShoppingBag size={18} />
            <span className="navbar__cart-count">0</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            className="navbar__menu-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <nav
        id="mobile-menu"
        ref={menuRef}
        className={`navbar__mobile-menu ${menuOpen ? 'navbar__mobile-menu--open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {NAV_LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
            }
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </NavLink>
        ))}
        <div className="navbar__mobile-actions">
          <button className="navbar__mobile-action-btn">
            <User size={16} /> Account
          </button>
          <button className="navbar__mobile-action-btn">
            <ShoppingBag size={16} /> Cart (0)
          </button>
        </div>
      </nav>
    </header>
  );
}
