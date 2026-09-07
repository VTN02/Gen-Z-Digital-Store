import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Sparkles, Flame, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { getFeaturedProducts } from '../../services/mock/products.mock';
import { CardSkeleton } from '../../components/common/Loader';
import './FeaturedProducts.css';

function formatPrice(amount, currency = 'LKR') {
  return `${currency} ${amount.toLocaleString()}`;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function ProductCard({ product }) {
  const getBadgeClass = (badge) => {
    switch (badge) {
      case 'Best Seller':
        return 'product-badge--bestseller';
      case 'New':
        return 'product-badge--new';
      case 'Limited':
        return 'product-badge--limited';
      default:
        return 'product-badge--default';
    }
  };

  return (
    <motion.article
      className="modern-product-card"
      variants={cardVariants}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="modern-product-card__media">
        <div className="modern-product-card__visual">
          <div className="modern-product-card__mesh-bg" />
          <ShoppingBag size={38} strokeWidth={1.2} className="modern-product-card__icon" />
          <span className="modern-product-card__watermark">{product.category}</span>
        </div>

        {product.badge && (
          <span className={`modern-product-badge ${getBadgeClass(product.badge)}`}>
            {product.badge === 'Best Seller' && <Flame size={12} />}
            {product.badge === 'New' && <Sparkles size={12} />}
            <span>{product.badge}</span>
          </span>
        )}

        {!product.inStock && (
          <div className="modern-product-card__soldout">
            <span>Sold Out</span>
          </div>
        )}

        <div className="modern-product-card__actions">
          <button
            type="button"
            className="modern-action-btn"
            aria-label={`Quick view ${product.name}`}
            title="Quick view"
          >
            <Eye size={16} />
          </button>
          <button
            type="button"
            className="modern-action-btn modern-action-btn--primary"
            aria-label={`Add ${product.name} to cart`}
            title="Add to cart"
            disabled={!product.inStock}
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>

      <div className="modern-product-card__body">
        <span className="modern-product-card__category">{product.category}</span>
        <h3 className="modern-product-card__title">{product.name}</h3>

        <div className="modern-product-card__footer">
          <div className="modern-product-card__pricing">
            <span className="modern-product-card__price">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.originalPrice && (
              <span className="modern-product-card__compare-price">
                {formatPrice(product.originalPrice, product.currency)}
              </span>
            )}
          </div>
          <span className="modern-product-card__arrow">
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </motion.article>
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
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Unable to load featured collection.');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="featured section" aria-labelledby="featured-title">
      <div className="container">
        <motion.header
          className="featured__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="featured__header-left">
            <span className="featured__pill">
              <Sparkles size={13} />
              Curated Selection
            </span>
            <h2 id="featured-title" className="featured__title">
              Featured <span className="featured__title-highlight">Collection</span>
            </h2>
            <p className="featured__subtitle">
              Hand-picked precision garments and signature fragrances tailored for urban aesthetics.
            </p>
          </div>
          <Link to="/shop" className="featured__view-all">
            <span>Explore Catalog</span>
            <ArrowRight size={15} />
          </Link>
        </motion.header>

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
          <motion.div
            className="featured__grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </motion.div>
        )}

        <motion.div
          className="featured__bottom-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/shop" className="featured__cta-btn">
            <span>View All 150+ Drops &amp; Scents</span>
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
