import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Sparkles,
  MessageCircle,
  Truck,
  Headphones,
  ArrowRight,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { motion } from 'framer-motion';
import SubmitReviewModal from '../../components/common/SubmitReviewModal';
import './ContactSection.css';

const BENEFITS = [
  {
    icon: Award,
    title: 'Certified Artisanal',
    desc: 'Each piece is hand-inspected for stitching integrity and material longevity.',
  },
  {
    icon: Sparkles,
    title: 'Curated Drops',
    desc: 'Trend-forward, high-octane capsules released in strictly limited runs.',
  },
  {
    icon: MessageCircle,
    title: 'Direct WhatsApp Concierge',
    desc: 'Rapid seamless checkout and bespoke sizing guidance directly via WhatsApp.',
  },
  {
    icon: Truck,
    title: 'Island-Wide Express',
    desc: 'Rapid door-to-door delivery across Colombo and all 25 districts in Sri Lanka.',
  },
  {
    icon: Headphones,
    title: 'VIP Care Support',
    desc: 'Attentive support to assist you from inquiry through post-delivery satisfaction.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ContactSection() {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  return (
    <>
      {/* Why Choose Us */}
      <section className="benefits section" aria-labelledby="benefits-title">
        <div className="container">
          <motion.header
            className="benefits__header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="benefits__pill">
              <ShieldCheck size={13} />
              The Standard
            </span>
            <h2 id="benefits-title" className="benefits__title">
              The Gen-Z <span className="benefits__title-highlight">Advantage</span>
            </h2>
            <p className="benefits__subtitle">
              More than an apparel store. An elevated digital ecosystem engineered for the modern vanguard.
            </p>
          </motion.header>

          <motion.div
            className="benefits__grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                className="benefit-card"
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
              >
                <div className="benefit-card__icon" aria-hidden="true">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h3 className="benefit-card__title">{title}</h3>
                <p className="benefit-card__desc">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modern CTA Banner */}
      <section className="cta-banner" aria-labelledby="cta-title">
        <div className="cta-banner__glow cta-banner__glow--left" />
        <div className="cta-banner__glow cta-banner__glow--right" />

        <div className="container">
          <motion.div
            className="cta-banner__inner"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="cta-banner__content">
              <span className="cta-banner__pill">
                <Sparkles size={13} />
                Limited Capsule Drops
              </span>
              <h2 id="cta-title" className="cta-banner__title">
                Elevate Your Presence <br />
                <span className="cta-banner__title-gradient">Today.</span>
              </h2>
              <p className="cta-banner__subtitle">
                Explore the latest drops and signature scents tailored exclusively for those who command the room.
              </p>
            </div>

            <div className="cta-banner__actions">
              <Link to="/shop" className="cta-banner__btn-primary">
                <span>Explore Drops</span>
                <ArrowRight size={15} />
              </Link>
              <button
                type="button"
                className="cta-banner__btn-review"
                onClick={() => setReviewModalOpen(true)}
              >
                <Star size={14} className="cyan-star-icon" />
                <span>Write a Review</span>
              </button>
              <a
                href="https://wa.me/94XXXXXXXXX"
                className="cta-banner__btn-ghost"
                rel="noopener noreferrer"
              >
                <MessageCircle size={15} />
                <span>WhatsApp Order</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Submit Review Modal */}
      <SubmitReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />
    </>
  );
}
