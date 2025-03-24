import React, { useState, useEffect } from 'react';
import { IconStar } from '@tabler/icons-react';
import './../../../../sass/components/rate_product.scss';

const RateProduct = ({ isOpen, onClose, onSubmit, orderId, productId }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [image, setImage] = useState(null); // Single image for simplicity
  const [imagePreview, setImagePreview] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('LaravelPassportToken');
        if (!token) {
          throw new Error('No token found. Please login.');
        }

        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userData = await response.json();
        setUserId(userData.id);
      } catch (err) {
        setError(err.message);
      }
    };

    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

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

  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Only take the first file
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (rating === 0 || !userId) {
      setError('Please provide a rating and ensure you are logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('product_id', productId);
    formData.append('user_id', userId);
    formData.append('rating', rating);
    formData.append('comment', review);
    if (image) {
      formData.append('photo', image); // Single photo field
    }

    try {
      const token = localStorage.getItem('LaravelPassportToken');
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || JSON.stringify(errorData.errors) || 'Failed to submit review');
      }

      const result = await response.json();
      onSubmit({ rating, review, image: result.photo });
      setRating(0);
      setReview('');
      setImage(null);
      setImagePreview(null);
      setError(null);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="rate-product-modal-overlay">
      <div className="rate-product-modal-content">
        <h2>Rate Product</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="rating-section">
          <label>Rating</label>
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
                    size={28}
                    fill={isFilled ? '#FF0000' : 'none'}
                    stroke={isFilled ? '#FF0000' : '#ccc'}
                  />
                </span>
              );
            })}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="review-section">
            <label htmlFor="review">Your Review</label>
            <textarea
              id="review"
              value={review}
              onChange={handleReviewChange}
              placeholder="Share your thoughts about the product..."
              rows="4"
              required
            />
          </div>
          <div className="photo-section">
            <label htmlFor="photo">Upload Photo (optional)</label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handleImageChange}
              className="photo-input"
            />
            {imagePreview && (
              <div className="photo-preview-container">
                <div className="photo-preview">
                  <img src={imagePreview} alt="Preview" />
                  <span className="remove-photo" onClick={handleRemoveImage}>
                    ×
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="button-group">
            <button
              type="submit"
              className="btn submit-btn"
              disabled={rating === 0 || !userId}
            >
              Submit Review
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