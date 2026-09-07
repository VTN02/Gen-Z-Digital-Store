import './Badge.css';

const VARIANTS = ['success', 'warning', 'error', 'info', 'neutral', 'accent'];

/**
 * Status badge.
 * @param {string} variant - 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'accent'
 */
export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span className={`badge badge--${variant} ${className}`}>
      {children}
    </span>
  );
}
