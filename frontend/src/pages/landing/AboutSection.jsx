import { Link } from 'react-router-dom';
import brandStoryImg from '../../assets/brand_story.jpg';
import './AboutSection.css';

export default function AboutSection() {
  return (
    <section className="about section" aria-labelledby="about-title">
      <div className="container">
        <div className="about__inner">
          {/* Image column */}
          <div className="about__image-wrap">
            <img
              src={brandStoryImg}
              alt="Young man walking confidently in Colombo — Gen-Z brand story"
              className="about__image"
              loading="lazy"
            />
            <div className="about__image-tag" aria-hidden="true">
              <span className="about__image-tag-year">Est. 2024</span>
              <span className="about__image-tag-name">Gen-Z</span>
            </div>
          </div>

          {/* Text column */}
          <div className="about__content">
            <p className="section-label">Our Story</p>
            <div className="divider" />
            <h2 id="about-title" className="about__title">
              Fashion That<br />
              <em className="about__title-em">Reflects</em><br />
              Who You Are.
            </h2>
            <div className="about__body">
              <p>
                Gen-Z was built for the modern Sri Lankan man — young, confident,
                and unapologetically stylish. We curate fashion and fragrances
                that speak to your identity.
              </p>
              <p>
                From crisp everyday essentials to statement outerwear and
                signature scents, every piece in our collection is chosen with
                one goal: to make you look and feel your best.
              </p>
            </div>
            <div className="about__pillars">
              {[
                { label: 'Quality First', desc: 'Every product is carefully selected for quality and style.' },
                { label: 'Modern Aesthetic', desc: 'Contemporary fashion with a Sri Lankan identity.' },
                { label: 'Your Confidence', desc: 'Clothing and fragrances that elevate how you carry yourself.' },
              ].map(({ label, desc }) => (
                <div key={label} className="about__pillar">
                  <span className="about__pillar-dot" aria-hidden="true" />
                  <div>
                    <strong className="about__pillar-label">{label}</strong>
                    <p className="about__pillar-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/about" className="about__link">
              Learn More About Us <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
