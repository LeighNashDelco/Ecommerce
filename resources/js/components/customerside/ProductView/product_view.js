import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import './../../../../sass/components/product_view.scss';
import Navbar from "../../customerside/Customer/topnav_login";
import Footer from '../footer/footer';
import OrdersCart from '../CartModals/orders_cart';
import { IconExternalLink, IconStar } from '@tabler/icons-react';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [filterRating, setFilterRating] = useState(null);
  const [showMediaOnly, setShowMediaOnly] = useState(false);

  const baseImageUrl = "http://127.0.0.1:8000/";
  const defaultProfileImage = `${baseImageUrl}images/pfp/default.png`;

  const getAuthHeaders = () => {
    const token = localStorage.getItem('LaravelPassportToken');
    return token ? {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    } : { 'Content-Type': 'application/json' };
  };

  const fetchWithRetry = async (url, options, retries = 3, baseDelay = 2000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.status === 429) {
          const delay = baseDelay * (i + 1);
          console.warn(`429 Too Many Requests for ${url}, retrying (${i + 1}/${retries}) in ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        if (response.status === 401) {
          console.warn(`401 Unauthorized for ${url}, proceeding as guest`);
          return null;
        }
        if (!response.ok) {
          const text = await response.text();
          if (text.startsWith('<!DOCTYPE')) {
            throw new Error('Server returned HTML instead of JSON, likely a server error');
          }
          throw new Error(`HTTP ${response.status} - ${text}`);
        }
        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        return response;
      } catch (error) {
        if (i === retries - 1) {
          console.error(`Failed to fetch ${url} after ${retries} retries:`, error.message);
          return null;
        }
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProfileAndProductData = async () => {
      try {
        const token = localStorage.getItem('LaravelPassportToken');
        if (token) {
          const userResponse = await fetchWithRetry(`${baseImageUrl}api/user-profile`, { headers: getAuthHeaders() });
          if (userResponse) {
            const userData = await userResponse.json();
            console.log('User Data:', userData);
            if (userData.user?.id) {
              const profileResponse = await fetchWithRetry(`${baseImageUrl}api/profiles/user/${userData.user.id}`, { headers: getAuthHeaders() });
              if (profileResponse) {
                const profileData = await profileResponse.json();
                console.log('Profile Data:', profileData);
                if (isMounted) setProfileId(profileData.id || null);
              }
            }
          }
        } else {
          console.log('No token found, proceeding as guest');
        }

        const productResponse = await fetchWithRetry(`${baseImageUrl}api/shop-products/${id}`, { headers: getAuthHeaders() });
        if (!productResponse) {
          throw new Error('Failed to fetch product after retries');
        }
        const productData = await productResponse.json();
        const finalProductData = productData.success && productData.data ? productData.data : productData;
        console.log('Product Data:', finalProductData);

        if (finalProductData.price && typeof finalProductData.price === 'string') {
          finalProductData.price = parseFloat(finalProductData.price.replace(/,/g, ''));
        }
        if (isMounted) setProduct(finalProductData);

        const reviewsResponse = await fetchWithRetry(`${baseImageUrl}api/reviews/product/${id}`, { headers: getAuthHeaders() });
        if (!reviewsResponse) {
          console.warn(`Reviews fetch failed for product ${id}, setting empty reviews`);
          if (isMounted) setReviews([]);
        } else {
          const reviewsData = await reviewsResponse.json();
          console.log('Reviews Data:', reviewsData);
          if (isMounted) setReviews(reviewsData.success && reviewsData.data ? reviewsData.data : reviewsData);
        }

        if (token && finalProductData?.profile_id) {
          const profileResponse = await fetchWithRetry(`${baseImageUrl}api/profiles/${finalProductData.profile_id}`, { headers: getAuthHeaders() });
          if (profileResponse) {
            const profileData = await profileResponse.json();
            console.log('Seller Profile Data:', profileData);
            if (isMounted) setUserProfile(profileData);
          } else {
            console.log(`Seller profile fetch skipped or failed for profile_id ${finalProductData.profile_id}, using product.profile_name`);
          }
        } else {
          console.log('Guest mode or no profile_id, using product.profile_name');
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
        if (isMounted) {
          setError(error.message);
          setProduct(null);
          setUserProfile(null);
          setReviews([]);
          message.error({
            content: `Oops! Couldn’t load product details: ${error.message}. Try refreshing.`,
            style: { marginTop: '20px' },
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfileAndProductData();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (product && quantity < (product.quantity_available || Infinity)) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    if (!profileId) {
      message.warning({
        content: 'Please log in to add items to your cart.',
        style: { marginTop: '20px' },
      });
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${baseImageUrl}api/cart/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ profile_id: profileId, product_id: id, quantity }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add to cart');
      setIsCartOpen(true);
      message.success({
        content: 'Item added to cart successfully!',
        style: { marginTop: '20px' },
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      message.error({
        content: `Failed to add item to cart: ${error.message}`,
        style: { marginTop: '20px' },
      });
    }
  };

  const handleBuyNow = () => {
    if (!profileId) {
      message.warning({
        content: 'Please log in to buy items.',
        style: { marginTop: '20px' },
      });
      navigate('/login');
      return;
    }
    console.log('Buy Now clicked - implement checkout logic here');
    message.info('Checkout functionality to be implemented.');
  };

  const handleExpandClick = () => {
    console.log('Expand icon clicked - functionality to be added');
  };

  const renderStars = (rating) => {
    const totalStars = 5;
    const parsedRating = parseFloat(rating) || 0;
    const filledStars = Math.min(Math.max(Math.round(parsedRating), 0), 5);
    const emptyStars = totalStars - filledStars;

    return (
      <>
        {Array(filledStars).fill().map((_, index) => (
          <IconStar key={`filled-${index}`} size={18} fill="#ff0000" color="#ff0000" />
        ))}
        {Array(emptyStars).fill().map((_, index) => (
          <IconStar key={`empty-${index}`} size={18} fill="none" color="#ccc" />
        ))}
      </>
    );
  };

  const calculateRatingStats = () => {
    if (reviews.length === 0) {
      return { averageRating: 0, ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }

    const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    const averageRating = parseFloat((totalRating / reviews.length).toFixed(1));
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingCounts[review.rating] += 1;
      }
    });

    return { averageRating, ratingCounts };
  };

  const { averageRating, ratingCounts } = calculateRatingStats();

  const filteredReviews = reviews.filter((review) => {
    const matchesRating = filterRating ? review.rating === filterRating : true;
    const matchesMedia = showMediaOnly ? review.photo : true;
    return matchesRating && matchesMedia;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  const getFullName = (user) => {
    if (user?.profile) {
      return [
        user.profile.first_name || '',
        user.profile.middlename !== 'N/A' ? user.profile.middlename : '',
        user.profile.last_name || '',
        user.profile.suffix !== 'N/A' ? user.profile.suffix : '',
      ].filter(Boolean).join(' ');
    }
    if (user) {
      return [
        user.first_name || '',
        user.middlename !== 'N/A' ? user.middlename : '',
        user.last_name || '',
        user.suffix !== 'N/A' ? user.suffix : '',
      ].filter(Boolean).join(' ');
    }
    return 'Anonymous';
  };

  // Silent loading: render nothing until data is ready
  if (loading) return null;
  if (error) return <div className="error">Error: {error}</div>;
  if (!product) return <div className="not-found">Product not found</div>;

  const fullName = userProfile
    ? [
        userProfile.first_name || '',
        userProfile.middlename !== 'N/A' ? userProfile.middlename : '',
        userProfile.last_name || '',
        userProfile.suffix !== 'N/A' ? userProfile.suffix : '',
      ].filter(Boolean).join(' ')
    : product.profile_name || 'Unknown Seller';

  const imageUrl = product.product_img ? `${baseImageUrl}${product.product_img.replace(/^\//, '')}` : '';

  return (
    <div className="product-view-page">
      <Navbar onCartClick={toggleCart} />
      <div className="content-wrapper">
        <div className="product-view-container">
          <div className="product-section">
            <div className="product-image">
              <img src={imageUrl} alt={product.product_name} />
            </div>
            <div className="product-details">
              <div className="product-title-container">
                <h1>{product.product_name}</h1>
                <div className="expand-icon" onClick={handleExpandClick}>
                  <IconExternalLink size={24} strokeWidth={1.5} color="#000" />
                </div>
              </div>
              <p className="company">{fullName}</p>
              <div className="price-rating">
                <span className="price">₱{product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                <div className="rating">{renderStars(averageRating)}</div>
              </div>
              <p className="description">{product.description || 'No description available'}</p>
              <p className="quantity-available">Available: {product.quantity_available || 'N/A'}</p>
              <div className="quantity-controls">
                <button onClick={decreaseQuantity} disabled={quantity === 1}>-</button>
                <span>{quantity}</span>
                <button onClick={increaseQuantity} disabled={quantity >= (product.quantity_available || Infinity)}>+</button>
              </div>
              <div className="action-buttons">
                <button className="add-to-cart" onClick={handleAddToCart} disabled={!profileId}>
                  Add to Cart: ₱{(product.price * quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </button>
                <button className="buy-now" onClick={handleBuyNow} disabled={!profileId}>
                  Buy Now: ₱{(product.price * quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </button>
              </div>
              <div className="shipping-info">
                <span className="shipping-hover">Free standard shipping</span>
                <span className="shipping-hover">Free Returns</span>
              </div>
            </div>
          </div>
          <div className="reviews-container">
            <div className="reviews-section">
              <h2>Reviews</h2>
              <div className="overall-rating">
                <div className="overall-score">{averageRating} out of 5</div>
                <div className="rating">{renderStars(averageRating)}</div>
                <div className="filter-buttons">
                  <button
                    className={`filter-btn ${filterRating === null ? 'active' : ''}`}
                    onClick={() => setFilterRating(null)}
                  >
                    All
                  </button>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      className={`filter-btn ${filterRating === star ? 'active' : ''}`}
                      onClick={() => setFilterRating(star)}
                    >
                      {star} star ({ratingCounts[star]})
                    </button>
                  ))}
                </div>
                <button
                  className={`media-btn ${showMediaOnly ? 'active' : ''}`}
                  onClick={() => setShowMediaOnly(!showMediaOnly)}
                >
                  With Media
                </button>
              </div>
              <div className="reviews-scroll">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => {
                    const reviewerName = getFullName(review.user);

                    return (
                      <div className="review" key={review.id}>
                        <div className="review-header">
                          <div className="reviewer-info">
                            <img
                              src={
                                review.user?.profile?.profile_img
                                  ? `${baseImageUrl}${review.user.profile.profile_img.replace(/^\//, '')}`
                                  : defaultProfileImage
                              }
                              alt="Profile"
                              className="pfp"
                              onError={(e) => {
                                console.log("Image load failed:", review.user?.profile?.profile_img);
                                e.target.src = defaultProfileImage;
                              }}
                            />
                            <div>
                              <p className="reviewer-name">{reviewerName}</p>
                              <p className="review-date">{formatDate(review.created_at)}</p>
                            </div>
                          </div>
                          <div className="rating">{renderStars(review.rating)}</div>
                        </div>
                        <p className="review-text">{review.comment || 'No comment provided.'}</p>
                        <div className="review-images">
                          {review.photo ? (
                            <img
                              src={`${baseImageUrl}${review.photo.replace(/^\//, '')}`}
                              alt="Review Image"
                              className="review-img"
                              onError={(e) => {
                                console.log("Review image load failed:", review.photo);
                                e.target.style.display = 'none';
                                e.target.parentElement.querySelector('.no-photo').style.display = 'block';
                              }}
                            />
                          ) : null}
                          <span className="no-photo" style={{ display: review.photo ? 'none' : 'block' }}>
                            No Photo
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-reviews">
                    <p>No reviews found for this product.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <OrdersCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} profileId={profileId} />
    </div>
  );
};

export default ProductView;