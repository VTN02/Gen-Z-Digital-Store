import { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, Sparkles, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPublicReviews } from '../../services/review.service';
import SubmitReviewModal from '../../components/common/SubmitReviewModal';
import './ReviewsSection.css';

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchReviews = () => {
    getPublicReviews().then((data) => {
      setReviews(data || []);
    });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <section className="reviews-section section" aria-labelledby="reviews-title">
      <div className="container">
        {/* Header */}
        <motion.header
          className="reviews-section__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="reviews-section__header-left">
            <span className="reviews-section__pill">
              <Sparkles size={13} />
              Community Voice
            </span>
            <h2 id="reviews-title" className="reviews-section__title">
              What The Vanguard <span className="reviews-section__title-highlight">Says.</span>
            </h2>
            <p className="reviews-section__subtitle">
              Authentic experiences shared by our discerning patrons across Colombo and all 25 districts in Sri Lanka.
            </p>
          </div>

          {/* KPI rating box & submit button */}
          <div className="reviews-section__kpi-wrap">
            <div className="reviews-section__score-box">
              <div className="reviews-section__score-num">4.9</div>
              <div className="reviews-section__score-meta">
                <div className="reviews-section__stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="cyan-star-icon" />
                  ))}
                </div>
                <span className="reviews-section__count">180+ Verified Ratings</span>
              </div>
            </div>

            <motion.button
              type="button"
              className="reviews-section__submit-btn"
              onClick={() => setModalOpen(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageSquarePlus size={16} />
              <span>Submit Your Review</span>
            </motion.button>
          </div>
        </motion.header>

        {/* Reviews Grid */}
        <motion.div
          className="reviews-section__grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {reviews.slice(0, 3).map((review) => (
            <motion.article
              key={review.id}
              className="review-card"
              variants={cardVariants}
              whileHover={{ y: -6 }}
            >
              <div className="review-card__header">
                <div className="review-card__rating">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} size={14} className="cyan-star-icon" />
                  ))}
                </div>
                <Quote size={20} className="review-card__quote-icon" />
              </div>

              <h3 className="review-card__headline">{review.title}</h3>
              <p className="review-card__body">"{review.comment}"</p>

              {review.productName && (
                <div className="review-card__product">
                  <span className="review-card__product-tag">{review.productName}</span>
                </div>
              )}

              <div className="review-card__footer">
                <div className="review-card__avatar">
                  {review.customerName ? review.customerName.charAt(0).toUpperCase() : 'G'}
                </div>
                <div className="review-card__author-info">
                  <div className="review-card__author-row">
                    <span className="review-card__name">{review.customerName}</span>
                    {review.verifiedBuyer && (
                      <span className="review-card__verified" title="Verified Customer">
                        <CheckCircle2 size={13} />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                  <span className="review-card__meta">
                    {review.location || review.productCategory || 'Customer'}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* Submit Review Modal */}
      <SubmitReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitted={fetchReviews}
      />
    </section>
  );
}
