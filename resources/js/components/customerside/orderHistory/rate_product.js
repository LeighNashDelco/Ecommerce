import React, { useState } from 'react';
import { IconStar } from '@tabler/icons-react';
import './../../../../sass/components/rate_product.scss';

const RateProduct = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleRatingHover = (value) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (rating > 0) {
      onSubmit({ rating, review });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="rate-product-modal-overlay">
      <div className="rate-product-modal-content">
        <h2>Overall Rating</h2>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= (hoverRating || rating);
            return (
              <span
                key={star}
                className={`star ${isFilled ? 'filled' : ''}`}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => handleRatingHover(star)}
                onMouseLeave={handleMouseLeave}
              >
                <IconStar
                  size={24}
                  fill={isFilled ? '#FF0000' : 'none'}
                  stroke={isFilled ? '#FF0000' : '#ccc'}
                />
              </span>
            );
          })}
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="review">Product Review</label>
          <textarea
            id="review"
            value={review}
            onChange={handleReviewChange}
            placeholder="Write your review here..."
            rows="4"
            required
          />
          <div className="button-group">
            <button type="submit" className="btn submit-btn" disabled={rating === 0}>
              Submit
            </button>
            <button type="button" className="btn cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RateProduct;