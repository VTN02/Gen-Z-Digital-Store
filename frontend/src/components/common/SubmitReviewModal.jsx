import { useState } from 'react';
import { Star, Sparkles, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { submitCustomerReview } from '../../services/review.service';
import { useToast } from '../../context/ToastContext';
import './SubmitReviewModal.css';

export default function SubmitReviewModal({ isOpen, onClose, onSubmitted }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState("Men's Fashion");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [verifiedBuyer, setVerifiedBuyer] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const toast = useToast();

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Your name is required.';
    if (!title.trim()) errs.title = 'Review headline is required.';
    if (!comment.trim()) errs.comment = 'Please write a brief comment.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await submitCustomerReview({
        customerName: name,
        customerEmail: email,
        productCategory: category,
        rating,
        title,
        comment,
        verifiedBuyer,
      });

      toast.success('Thank you! Your verified review has been submitted for moderation.');
      setName('');
      setEmail('');
      setTitle('');
      setComment('');
      setRating(5);
      if (onSubmitted) onSubmitted();
      onClose();
    } catch {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modern-review-modal-backdrop" onClick={onClose}>
        <motion.div
          className="modern-review-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className="modern-review-modal__top">
            <div>
              <span className="modern-review-modal__tag">
                <Sparkles size={12} />
                COMMUNITY FEEDBACK
              </span>
              <h2 className="modern-review-modal__title">Share Your Experience</h2>
            </div>
            <button
              type="button"
              className="modern-review-modal__close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          <p className="modern-review-modal__desc">
            Help other gentlemen choose with poise. Reviews are authenticated and displayed across the storefront.
          </p>

          <form onSubmit={handleSubmit} className="modern-review-modal__form">
            {/* Star Rating Select */}
            <div className="modern-review-star-wrap">
              <label className="modern-review-label">Your Overall Rating *</label>
              <div className="modern-review-star-row" role="radiogroup" aria-label="Star rating">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      className="modern-review-star-btn"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`${star} Star${star > 1 ? 's' : ''}`}
                    >
                      <Star
                        size={26}
                        className={`modern-review-star-icon ${
                          filled ? 'modern-review-star-icon--filled' : ''
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="modern-review-star-feedback">
                  {rating === 5 && 'Outstanding Experience (5/5)'}
                  {rating === 4 && 'Very Impressive (4/5)'}
                  {rating === 3 && 'Good Standard (3/5)'}
                  {rating === 2 && 'Needs Attention (2/5)'}
                  {rating === 1 && 'Unsatisfactory (1/5)'}
                </span>
              </div>
            </div>

            {/* Name & Email */}
            <div className="modern-review-row">
              <div className="modern-review-field">
                <label className="modern-review-label">Full Name *</label>
                <input
                  type="text"
                  className={`modern-review-input ${errors.name ? 'modern-review-input--err' : ''}`}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="e.g. Kasun Perera"
                />
                {errors.name && <span className="modern-review-err">{errors.name}</span>}
              </div>

              <div className="modern-review-field">
                <label className="modern-review-label">City / Email (Optional)</label>
                <input
                  type="text"
                  className="modern-review-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. Colombo 07"
                />
              </div>
            </div>

            {/* Category */}
            <div className="modern-review-field">
              <label className="modern-review-label">Product Department</label>
              <select
                className="modern-review-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Men's Fashion">Men's Fashion &amp; Apparel</option>
                <option value="Fragrances & Perfumes">Fragrances &amp; Oud Extrait</option>
                <option value="Boys' Fashion">Boys' Modern Streetwear</option>
                <option value="Accessories">Accessories &amp; Leather</option>
              </select>
            </div>

            {/* Title */}
            <div className="modern-review-field">
              <label className="modern-review-label">Review Headline *</label>
              <input
                type="text"
                className={`modern-review-input ${errors.title ? 'modern-review-input--err' : ''}`}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: '' });
                }}
                placeholder="e.g. Noir Oud Extrait lasts all day with incredible velvet drydown"
              />
              {errors.title && <span className="modern-review-err">{errors.title}</span>}
            </div>

            {/* Comments */}
            <div className="modern-review-field">
              <label className="modern-review-label">Your Honest Review *</label>
              <textarea
                className={`modern-review-textarea ${errors.comment ? 'modern-review-textarea--err' : ''}`}
                rows={3}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  if (errors.comment) setErrors({ ...errors, comment: '' });
                }}
                placeholder="Comment on tailoring fit, fabric longevity, scent sillage, unboxing packaging, or delivery speed..."
              />
              {errors.comment && <span className="modern-review-err">{errors.comment}</span>}
            </div>

            {/* Verified Buyer Checkbox */}
            <label className="modern-review-checkbox-label">
              <input
                type="checkbox"
                checked={verifiedBuyer}
                onChange={(e) => setVerifiedBuyer(e.target.checked)}
              />
              <span className="modern-review-checkbox-text">
                <CheckCircle2 size={15} className="modern-review-check-icon" />
                I am a verified customer of Gen-Z Digital Store
              </span>
            </label>

            {/* Action Buttons */}
            <div className="modern-review-modal__actions">
              <Button type="button" variant="secondary" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" loading={submitting}>
                Submit Review
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
