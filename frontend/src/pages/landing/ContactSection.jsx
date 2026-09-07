import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Sparkles, MessageCircle, Truck, Headphones, Star, MessageSquarePlus } from 'lucide-react';
import SubmitReviewModal from '../../epics/ep03-delivery-review/components/SubmitReviewModal';
import './ContactSection.css';

const BENEFITS = [
  {
    icon: Award,
    title: 'Quality Products',
    desc: 'Every item is hand-picked and quality-checked before it reaches you.',
  },
  {
    icon: Sparkles,
    title: 'Curated Styles',
    desc: 'Trend-forward fashion selected for the modern Sri Lankan lifestyle.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Ordering',
    desc: 'Order with ease directly through WhatsApp — no complicated checkout.',
  },
  {
    icon: Truck,
    title: 'Island-Wide Delivery',
    desc: 'Fast and reliable delivery across Sri Lanka.',
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    desc: 'Dedicated support to help you with every step of your purchase.',
  },
];

export default function ContactSection() {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  return (
    <>
      {/* Why Shop With Us */}
      <section className="benefits section" aria-labelledby="benefits-title">
        <div className="container">
          <header className="benefits__header">
            <p className="section-label">Why Choose Us</p>
            <div className="divider divider--center" />
            <h2 id="benefits-title" className="benefits__title">
              The Gen-Z Difference
            </h2>
            <p className="benefits__subtitle">
              More than a store. A curated experience for the modern generation.
            </p>
          </header>

          <div className="benefits__grid">
            {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="benefit-card animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="benefit-card__icon" aria-hidden="true">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="benefit-card__title">{title}</h3>
                <p className="benefit-card__desc">{desc}</p>
              </div>
            ))}
          </div>

          {/* Community Review Callout */}
          <div className="community-review-strip">
            <div className="community-review-strip__rating">
              <div className="community-review-strip__stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="gold-star-filled" />
                ))}
              </div>
              <span className="community-review-strip__score">4.9 / 5.0 Rating</span>
              <span className="community-review-strip__count">· Verified Customer Reviews</span>
            </div>
            <button
              className="community-review-strip__btn"
              onClick={() => setReviewModalOpen(true)}
            >
              <MessageSquarePlus size={15} />
              <span>Submit a Customer Review</span>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner" aria-labelledby="cta-title">
        <div className="container">
          <div className="cta-banner__inner">
            <div className="cta-banner__content">
              <p className="section-label">Ready?</p>
              <h2 id="cta-title" className="cta-banner__title">
                Define Your Style Today.
              </h2>
              <p className="cta-banner__subtitle">
                Explore the latest collection and find pieces that speak to who you are.
              </p>
            </div>
            <div className="cta-banner__actions">
              <Link to="/shop" className="cta-banner__btn-primary">
                Explore Collection
              </Link>
              <button
                className="cta-banner__btn-review"
                onClick={() => setReviewModalOpen(true)}
              >
                <Star size={14} />
                <span>Write a Review</span>
              </button>
              <a
                href="https://wa.me/94XXXXXXXXX"
                className="cta-banner__btn-ghost"
                rel="noopener noreferrer"
              >
                Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Review Submission Modal */}
      <SubmitReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />
    </>
  );
}
