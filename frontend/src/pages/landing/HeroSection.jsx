import { Link } from 'react-router-dom';
import heroImage from '../../assets/hero_fashion.jpg';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero" aria-label="Hero">
      <div className="hero__inner">
        {/* Left: text content */}
        <div className="hero__content">
          <p className="hero__label section-label animate-fade-up">
            New Collection 2026
          </p>
          <h1 className="hero__headline animate-fade-up anim-delay-1">
            Define<br />
            Your<br />
            <em className="hero__headline-em">Style.</em>
          </h1>
          <p className="hero__subheading animate-fade-up anim-delay-2">
            Men's fashion &amp; signature fragrances.<br />
            Curated for the modern generation.
          </p>
          <div className="hero__actions animate-fade-up anim-delay-3">
            <Link to="/shop" className="hero__cta-primary">
              Shop Collection
            </Link>
            <Link to="/categories" className="hero__cta-ghost">
              Explore Categories
            </Link>
          </div>
          <div className="hero__stats animate-fade-up anim-delay-4">
            <div className="hero__stat">
              <span className="hero__stat-value">500+</span>
              <span className="hero__stat-label">Products</span>
            </div>
            <div className="hero__stat-divider" aria-hidden="true" />
            <div className="hero__stat">
              <span className="hero__stat-value">50+</span>
              <span className="hero__stat-label">Brands</span>
            </div>
            <div className="hero__stat-divider" aria-hidden="true" />
            <div className="hero__stat">
              <span className="hero__stat-value">5★</span>
              <span className="hero__stat-label">Rated</span>
            </div>
          </div>
        </div>

        {/* Right: image */}
        <div className="hero__image-wrap animate-fade-up anim-delay-2">
          <div className="hero__image-frame">
            <img
              src={heroImage}
              alt="Young man in modern dark fashion — Gen-Z brand"
              className="hero__image"
              fetchpriority="high"
            />
          </div>
          <div className="hero__image-accent" aria-hidden="true" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll-indicator" aria-hidden="true">
        <span className="hero__scroll-line" />
        <span className="hero__scroll-text">Scroll</span>
      </div>
    </section>
  );
}
