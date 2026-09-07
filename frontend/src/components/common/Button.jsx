import './Button.css';

/**
 * Shared Button component.
 *
 * @param {string} variant - 'primary' | 'secondary' | 'ghost' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} loading - Shows spinner when true
 * @param {boolean} fullWidth - Makes button full width
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${loading ? 'btn--loading' : ''} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className="btn__spinner" aria-hidden="true" />
      )}
      <span className={loading ? 'btn__content--hidden' : 'btn__content'}>
        {children}
      </span>
    </button>
  );
}
