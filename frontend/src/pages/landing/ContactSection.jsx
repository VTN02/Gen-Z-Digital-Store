import { Link } from 'react-router-dom';
import { Award, Sparkles, MessageCircle, Truck, Headphones } from 'lucide-react';
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
    </>
  );
}
