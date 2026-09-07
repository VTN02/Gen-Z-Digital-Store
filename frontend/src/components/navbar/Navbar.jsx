import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search } from 'lucide-react';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/categories', label: 'Categories' },
  { to: '/reviews', label: 'Reviews', isSection: true },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Sticky scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
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
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleLinkClick = (e, link) => {
    if (link.isSection) {
      const element = document.getElementById('reviews-title');
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setMenuOpen(false);
      } else if (location.pathname !== '/') {
        e.preventDefault();
        navigate('/#reviews-title');
        setMenuOpen(false);
      }
    } else {
      setMenuOpen(false);
    }
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" aria-label="Gen-Z Store home">
          <span className="navbar__logo-text">GEN-Z</span>
          <span className="navbar__logo-dot" aria-hidden="true">
            ·
          </span>
        </Link>

        {/* Desktop nav menu */}
        <nav className="navbar__links" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={(e) => handleLinkClick(e, link)}
              className={({ isActive }) =>
                `navbar__link ${isActive && !link.isSection ? 'navbar__link--active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          <button type="button" className="navbar__icon-btn" aria-label="Search Catalog" title="Search">
            <Search size={18} />
          </button>
          <button type="button" className="navbar__icon-btn" aria-label="User Account" title="Account">
            <User size={18} />
          </button>
          <button
            type="button"
            className="navbar__icon-btn navbar__cart-btn"
            aria-label="Shopping bag"
            title="Cart"
          >
            <ShoppingBag size={18} />
            <span className="navbar__cart-count">0</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
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
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `navbar__mobile-link ${isActive && !link.isSection ? 'navbar__mobile-link--active' : ''}`
            }
            onClick={(e) => handleLinkClick(e, link)}
          >
            {link.label}
          </NavLink>
        ))}
        <div className="navbar__mobile-actions">
          <button type="button" className="navbar__mobile-action-btn">
            <User size={16} /> Account
          </button>
          <button type="button" className="navbar__mobile-action-btn">
            <ShoppingBag size={16} /> Bag (0)
          </button>
        </div>
      </nav>
    </header>
  );
}
