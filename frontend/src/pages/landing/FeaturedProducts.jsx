import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Tag } from 'lucide-react';
import { getFeaturedProducts } from '../../services/mock/products.mock';
import { CardSkeleton } from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import './FeaturedProducts.css';

function formatPrice(amount, currency = 'LKR') {
  return `${currency} ${amount.toLocaleString()}`;
}

function ProductCard({ product }) {
  const badgeVariantMap = {
    'Best Seller': 'accent',
    'New': 'success',
    'Limited': 'warning',
  };

  return (
    <article className="product-card" aria-label={product.name}>
      <div className="product-card__image-wrap">
        <div className="product-card__image-placeholder" aria-hidden="true">
          <ShoppingBag size={32} strokeWidth={1} />
        </div>
        {product.badge && (
          <div className="product-card__badge">
            <Badge variant={badgeVariantMap[product.badge] || 'neutral'}>
              {product.badge}
            </Badge>
          </div>
        )}
        {!product.inStock && (
          <div className="product-card__sold-out">
            <span>Sold Out</span>
          </div>
        )}
        <div className="product-card__actions" aria-label="Quick actions">
          <button
            className="product-card__action-btn"
            aria-label={`Add ${product.name} to cart`}
            disabled={!product.inStock}
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>

      <div className="product-card__info">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__pricing">
          <span className="product-card__price">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.originalPrice && (
            <span className="product-card__original-price">
              {formatPrice(product.originalPrice, product.currency)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getFeaturedProducts()
      .then((data) => { if (!cancelled) { setProducts(data); setLoading(false); } })
      .catch(() => { if (!cancelled) { setError('Unable to load products.'); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="featured section" aria-labelledby="featured-title">
      <div className="container">
        <header className="featured__header">
          <div className="featured__header-left">
            <p className="section-label">Hand-Picked</p>
            <div className="divider" />
            <h2 id="featured-title" className="featured__title">
              Featured Collection
            </h2>
          </div>
          <Link to="/shop" className="featured__view-all">
            View All <span aria-hidden="true">→</span>
          </Link>
        </header>

        {loading && <CardSkeleton count={4} />}

        {error && (
          <div className="featured__error" role="alert">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="featured__retry">
              Try again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="featured__grid">
            {products.map((p, i) => (
              <div
                key={p.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

        <div className="featured__cta">
          <Link to="/shop" className="featured__cta-link">
            <Tag size={14} />
            Explore the Full Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
