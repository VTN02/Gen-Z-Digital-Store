import { useState } from 'react';
import { Star, Sparkles, CheckCircle2 } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import { submitCustomerReview } from '../services/review.service';
import { useToast } from '../../../context/ToastContext';
import './SubmitReviewModal.css';

export default function SubmitReviewModal({ isOpen, onClose }) {
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

      toast.success('Thank you! Your review has been submitted for moderation.');
      // Reset
      setName('');
      setEmail('');
      setTitle('');
      setComment('');
      setRating(5);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Your Experience"
      size="md"
    >
      <form onSubmit={handleSubmit} className="review-modal-form">
        <div className="review-modal-header">
          <div className="review-modal-tag">
            <Sparkles size={12} />
            <span>COMMUNITY FEEDBACK</span>
          </div>
          <p className="review-modal-desc">
            Help other gentlemen choose with confidence. Reviews are verified and published by our store team.
          </p>
        </div>

        {/* Rating stars */}
        <div className="review-star-select-wrap">
          <label className="review-form-label">Your Overall Rating *</label>
          <div className="review-star-row" role="radiogroup" aria-label="Star rating">
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  className="review-star-btn"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`${star} Star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    size={28}
                    className={`review-star-icon ${filled ? 'review-star-icon--filled' : ''}`}
                  />
                </button>
              );
            })}
            <span className="review-star-text">
              {rating === 5 && 'Outstanding'}
              {rating === 4 && 'Very Good'}
              {rating === 3 && 'Average'}
              {rating === 2 && 'Needs Improvement'}
              {rating === 1 && 'Poor'}
            </span>
          </div>
        </div>

        {/* Name & Email */}
        <div className="review-form-row">
          <div className="review-form-field">
            <label className="review-form-label">Full Name *</label>
            <input
              type="text"
              className={`review-form-input ${errors.name ? 'review-form-input--err' : ''}`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              placeholder="e.g. Kasun Perera"
            />
            {errors.name && <span className="review-form-err-msg">{errors.name}</span>}
          </div>

          <div className="review-form-field">
            <label className="review-form-label">Email (Optional)</label>
            <input
              type="email"
              className="review-form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kasun@example.com"
            />
          </div>
        </div>

        {/* Category */}
        <div className="review-form-field">
          <label className="review-form-label">Product Collection / Category</label>
          <select
            className="review-form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Men's Fashion">Men's Fashion &amp; Apparel</option>
            <option value="Boys' Fashion">Boys' Fashion &amp; Casuals</option>
            <option value="Fragrances & Perfumes">Fragrances &amp; Perfumes</option>
            <option value="Accessories">Accessories &amp; Leather</option>
          </select>
        </div>

        {/* Title */}
        <div className="review-form-field">
          <label className="review-form-label">Review Headline *</label>
          <input
            type="text"
            className={`review-form-input ${errors.title ? 'review-form-input--err' : ''}`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            placeholder="e.g. Noir EDP is pure luxury, lasting all day"
          />
          {errors.title && <span className="review-form-err-msg">{errors.title}</span>}
        </div>

        {/* Comment */}
        <div className="review-form-field">
          <label className="review-form-label">Detailed Comments *</label>
          <textarea
            className={`review-form-textarea ${errors.comment ? 'review-form-textarea--err' : ''}`}
            rows={3}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (errors.comment) setErrors({ ...errors, comment: '' });
            }}
            placeholder="Tell us about the fabric quality, sizing, scent longevity, packaging, and overall impression..."
          />
          {errors.comment && <span className="review-form-err-msg">{errors.comment}</span>}
        </div>

        {/* Verified buyer toggle */}
        <label className="review-verified-toggle">
          <input
            type="checkbox"
            checked={verifiedBuyer}
            onChange={(e) => setVerifiedBuyer(e.target.checked)}
          />
          <span className="review-verified-toggle-label">
            <CheckCircle2 size={15} className="review-verified-icon" />
            I purchased this product from Gen-Z Store
          </span>
        </label>

        {/* Actions */}
        <div className="review-modal-actions">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={submitting}
          >
            Submit Review for Verification
          </Button>
        </div>
      </form>
    </Modal>
  );
}
