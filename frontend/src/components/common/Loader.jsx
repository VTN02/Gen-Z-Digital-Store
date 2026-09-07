import './Loader.css';

/** Spinning loader */
export function Spinner({ size = 'md', className = '' }) {
  return (
    <div className={`spinner spinner--${size} ${className}`} role="status" aria-label="Loading">
      <div className="spinner__ring" />
    </div>
  );
}

/** Page-level centered loader */
export function PageLoader() {
  return (
    <div className="page-loader">
      <Spinner size="lg" />
    </div>
  );
}

/** Skeleton shimmer block */
export function Skeleton({ width = '100%', height = '16px', className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/** Card skeleton for product/supplier cards */
export function CardSkeleton({ count = 4 }) {
  return (
    <div className="card-skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-skeleton">
          <Skeleton height="240px" className="card-skeleton__image" />
          <div className="card-skeleton__content">
            <Skeleton height="14px" width="60%" />
            <Skeleton height="20px" width="80%" />
            <Skeleton height="14px" width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Spinner;
