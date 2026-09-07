import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Compass, HeartHandshake, ArrowRight } from 'lucide-react';
import brandStoryImg from '../../assets/brand_story.jpg';
import './AboutSection.css';

const PILLARS = [
  {
    icon: ShieldCheck,
    label: 'Artisanal Craftsmanship',
    desc: 'Precision tailoring using premium fabrics tested for the tropical Sri Lankan climate.',
  },
  {
    icon: Compass,
    label: 'Modern Global Silhouette',
    desc: 'Contemporary streetwear and sharp tailored silhouettes that rival international runways.',
  },
  {
    icon: HeartHandshake,
    label: 'Uncompromising Identity',
    desc: 'Curated scents and apparel engineered to inspire self-expression and poise.',
  },
];

export default function AboutSection() {
  return (
    <section className="about section" aria-labelledby="about-title">
      <div className="container">
        <div className="about__inner">
          {/* Visual Column */}
          <motion.div
            className="about__visual-wrap"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="about__ambient-glow" />
            <div className="about__image-frame">
              <img
                src={brandStoryImg}
                alt="Gen-Z urban streetwear and artisanal fragrance in Colombo"
                className="about__image"
                loading="lazy"
              />
              <div className="about__image-gradient-overlay" />

              <motion.div
                className="about__floating-badge"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <span className="about__badge-sub">GEN-Z ORIGINS</span>
                <span className="about__badge-title">Est. 2024 · Colombo</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            className="about__content"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="about__pill">
              <Sparkles size={13} />
              The Brand Odyssey
            </span>

            <h2 id="about-title" className="about__title">
              Fashion That <br />
              <span className="about__title-gradient">Reflects Power</span> <br />
              &amp; Authenticity.
            </h2>

            <div className="about__body">
              <p>
                Gen-Z was founded with an unyielding vision: to redefine contemporary Sri Lankan
                masculine fashion and personal scent. We reject the generic, handpicking only
                avant-garde silhouettes and complex aromatic extractions.
              </p>
              <p>
                Whether it is effortless daily apparel or a signature woody oud designed to leave an
                unforgettable impression, every item in our catalog represents confidence, precision,
                and modern prestige.
              </p>
            </div>

            <div className="about__pillars">
              {PILLARS.map(({ icon: Icon, label, desc }, idx) => (
                <motion.div
                  key={label}
                  className="about__pillar-card"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                  whileHover={{ x: 6 }}
                >
                  <div className="about__pillar-icon">
                    <Icon size={18} />
                  </div>
                  <div className="about__pillar-text">
                    <h3 className="about__pillar-title">{label}</h3>
                    <p className="about__pillar-desc">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="about__action-row">
              <Link to="/about" className="about__cta-btn">
                <span>Discover Our Heritage</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
