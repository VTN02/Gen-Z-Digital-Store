import { Routes, Route } from 'react-router-dom';
import StorefrontLayout from '../components/layout/StorefrontLayout';
import AdminLayout from '../components/layout/AdminLayout';
import LandingPage from '../pages/landing/LandingPage';

/**
 * Application routes.
 *
 * Stage 1: Landing page + Admin auth guard placeholder
 * Stage 2+: Admin dashboard, EP-03, EP-04, Supplier pages
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public / Storefront ─────────────────────────────────────── */}
      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<LandingPage />} />
        {/* EP-01 routes (Developer 1) — placeholders */}
        <Route path="/shop" element={<ComingSoon title="Shop" />} />
        <Route path="/categories" element={<ComingSoon title="Categories" />} />
        {/* EP-02 routes (Developer 2) — placeholders */}
        <Route path="/account" element={<ComingSoon title="My Account" />} />
        <Route path="/orders" element={<ComingSoon title="My Orders" />} />
        {/* Shared pages */}
        <Route path="/about" element={<ComingSoon title="About Us" />} />
        <Route path="/contact" element={<ComingSoon title="Contact" />} />
        <Route path="/reviews" element={<ComingSoon title="Reviews" />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ── Admin (protected — requires auth) ──────────────────────── */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Stage 2: admin dashboard, deliveries, reviews, suppliers */}
        <Route index element={<ComingSoon title="Admin Dashboard" />} />
        <Route path="dashboard" element={<ComingSoon title="Admin Dashboard" />} />
        <Route path="deliveries" element={<ComingSoon title="Delivery Management" />} />
        <Route path="reviews" element={<ComingSoon title="Review Management" />} />
        <Route path="suppliers" element={<ComingSoon title="Supplier Management" />} />
        <Route path="staff" element={<ComingSoon title="Staff Management" />} />
        <Route path="settings" element={<ComingSoon title="Store Settings" />} />
        <Route path="audit-logs" element={<ComingSoon title="Audit Logs" />} />
      </Route>
    </Routes>
  );
}

/** Minimal placeholder for routes not yet implemented */
function ComingSoon({ title }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '1rem',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(2rem, 6vw, 4rem)',
        fontWeight: '300',
        color: 'var(--color-text-primary)',
        letterSpacing: '-0.02em',
      }}>
        {title}
      </h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Coming Soon — Stage 2
      </p>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '1rem',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '6rem', fontWeight: '300', color: 'var(--color-border)', lineHeight: 1 }}>404</span>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: '300', color: 'var(--color-text-primary)' }}>
        Page Not Found
      </h1>
      <a href="/" style={{ color: 'var(--color-accent)', fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        ← Back to Home
      </a>
    </div>
  );
}
