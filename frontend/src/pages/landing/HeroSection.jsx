import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImage from '../../assets/hero_fashion.jpg';
import './HeroSection.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  return (
    <section className="hero" aria-label="Hero">
      {/* Ambient Cyber Indigo Glow */}
      <div className="hero__ambient-glow" aria-hidden="true" />

      <div className="hero__inner">
        {/* Left: Headline, Badge, CTAs, Stats */}
        <motion.div
          className="hero__content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Shimmering Brand Pill Badge */}
          <motion.div variants={itemVariants}>
            <span className="hero__tag-badge">
              <Sparkles size={13} className="hero__tag-icon" />
              <span>GEN-Z STOREFRONT · CURATED STREETWEAR &amp; SIGNATURE FRAGRANCES</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 className="hero__headline" variants={itemVariants}>
            Define<br />
            Your<br />
            <span className="hero__headline-gradient">Presence.</span>
          </motion.h1>

          {/* Actions */}
          <motion.div className="hero__actions" variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link to="/shop" className="hero__cta-primary">
                <span>Explore Collection</span>
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link to="/categories" className="hero__cta-ghost">
                <span>Browse Categories</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div className="hero__stats" variants={itemVariants}>
            <div className="hero__stat">
              <span className="hero__stat-value">500+</span>
              <span className="hero__stat-label">Curated Pieces</span>
            </div>
            <div className="hero__stat-divider" aria-hidden="true" />
            <div className="hero__stat">
              <span className="hero__stat-value">100%</span>
              <span className="hero__stat-label">Authentic Extrait</span>
            </div>
            <div className="hero__stat-divider" aria-hidden="true" />
            <div className="hero__stat">
              <span className="hero__stat-value">Island-Wide</span>
              <span className="hero__stat-label">Fast Delivery</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Photography Frame with Floating Badges */}
        <motion.div
          className="hero__image-wrap"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero__image-backdrop-glow" aria-hidden="true" />

          <div className="hero__image-frame">
            <img
              src={heroImage}
              alt="Editorial portrait of model in luxury dark Gen-Z tailoring"
              className="hero__image"
              fetchpriority="high"
            />
          </div>

          {/* Floating Pill Badge 1 */}
          <motion.div
            className="hero__floating-pill hero__floating-pill--left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <ShieldCheck size={14} className="hero__floating-icon" />
            <span>100% Authentic Extracts</span>
          </motion.div>

          {/* Floating Pill Badge 2 */}
          <motion.div
            className="hero__floating-pill hero__floating-pill--right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
          >
            <Zap size={14} className="hero__floating-icon hero__floating-icon--cyan" />
            <span>Fast Colombo Courier Dispatch</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll-indicator" aria-hidden="true">
        <span className="hero__scroll-line" />
      </div>
    </section>
  );
}
