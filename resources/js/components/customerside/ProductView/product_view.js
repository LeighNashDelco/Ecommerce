import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import './../../../../sass/components/product_view.scss';
import pfpImage from '../../../../../resources/sass/img/pfp.svg';
import reviewImage1 from "../../../../../resources/sass/img/ATKCOLOR.svg";
import reviewImage2 from "../../../../../resources/sass/img/ATKCOLOR.svg";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileId, setProfileId] = useState(null);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('LaravelPassportToken')}`,
  });

  useEffect(() => {
    const fetchProfileAndProductData = async () => {
      try {
        // Fetch profile ID
        const token = localStorage.getItem('LaravelPassportToken');
        if (token) {
          const userResponse = await fetch('http://127.0.0.1:8000/api/user-profile', {
            headers: getAuthHeaders(),
          });
          if (!userResponse.ok) {
            throw new Error(`Failed to fetch user profile: ${userResponse.status} ${userResponse.statusText}`);
          }
          const userData = await userResponse.json();
          console.log('User Data:', userData); // Debug user data

          if (!userData.user?.id) {
            throw new Error('User ID not found in user profile response');
          }

          const profileResponse = await fetch(`http://127.0.0.1:8000/api/profiles/user/${userData.user.id}`, {
            headers: getAuthHeaders(),
          });
          if (!profileResponse.ok) {
            throw new Error(`Failed to fetch profile ID: ${profileResponse.status} ${profileResponse.statusText}`);
          }
          const profileData = await profileResponse.json();
          console.log('Profile Data:', profileData); // Debug profile data
          setProfileId(profileData.id || null);
        } else {
          console.log('No token found, proceeding as guest');
        }

        // Fetch product data
        const response = await fetch(`http://127.0.0.1:8000/api/shop-products/${id}`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const productData = data.success && data.data ? data.data : data;
        console.log('Product Data:', productData); // Debug product data

        if (productData.price && typeof productData.price === 'string') {
          productData.price = parseFloat(productData.price.replace(/,/g, ''));
        }
        setProduct(productData);

        if (productData?.profile_id) {
          try {
            const profileResponse = await fetch(`http://127.0.0.1:8000/api/profiles/${productData.profile_id}`, {
              headers: getAuthHeaders(),
            });
            if (!profileResponse.ok) {
              console.warn(`Seller profile fetch failed: ${profileResponse.status} ${profileResponse.statusText}`);
              setUserProfile(null);
            } else {
              const profileData = await profileResponse.json();
              console.log('Seller Profile Data:', profileData); // Debug seller profile
              setUserProfile(profileData);
            }
          } catch (profileError) {
            console.warn('Seller profile fetch error:', profileError);
            setUserProfile(null);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setProduct(null);
        setUserProfile(null);
        message.error({
          content: `Failed to load product details: ${error.message}`,
          style: { marginTop: '20px' },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndProductData();
  }, [id, navigate]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (product && quantity < (product.quantity || Infinity)) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    if (!profileId) {
      message.error({
        content: 'Please log in to add items to your cart.',
        style: { marginTop: '20px' },
      });
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/cart/add`, {
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

  const handleExpandClick = () => {
    console.log('Expand icon clicked - functionality to be added');
  };

  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.min(Math.max(rating, 0), 5);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  const fullName = userProfile
    ? [
        userProfile.first_name || '',
        userProfile.middle_name !== 'N/A' ? userProfile.middle_name : '',
        userProfile.last_name || '',
        userProfile.suffix !== 'N/A' ? userProfile.suffix : '',
      ].filter(Boolean).join(' ')
    : product.profile_name || 'Jeff23 Ogabang';

  const imageUrl = product.product_img ? `http://127.0.0.1:8000/${product.product_img}` : '';

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
                <div className="rating">{renderStars(5)}</div>
              </div>
              <p className="description">{product.description || 'No description available'}</p>
              <p className="quantity-available">Available: {product.quantity_available || 'N/A'}</p>
              <div className="quantity-controls">
                <button onClick={decreaseQuantity} disabled={quantity === 1}>-</button>
                <span>{quantity}</span>
                <button onClick={increaseQuantity} disabled={quantity >= (product.quantity || Infinity)}>+</button>
              </div>
              <div className="action-buttons">
                <button className="add-to-cart" onClick={handleAddToCart}>
                  Add to Cart: ₱{(product.price * quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </button>
                <button className="buy-now">
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
                <div className="overall-score">4.9 out of 5</div>
                <div className="rating">{renderStars(5)}</div>
                <div className="filter-buttons">
                  <button className="filter-btn active">All</button>
                  <button className="filter-btn">5 star (10)</button>
                  <button className="filter-btn">4 star (0)</button>
                  <button className="filter-btn">3 star (0)</button>
                  <button className="filter-btn">2 star (0)</button>
                  <button className="filter-btn">1 star (0)</button>
                </div>
                <button className="media-btn">With Media</button>
              </div>
              <div className="reviews-scroll">
                <div className="review">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img src={pfpImage} alt="Profile" className="pfp" />
                      <div>
                        <p className="reviewer-name">Kean D.</p>
                        <p className="review-date">December 12, 2024</p>
                      </div>
                    </div>
                    <div className="rating">{renderStars(5)}</div>
                  </div>
                  <p className="best-feature">Best Feature: Light and Smooth</p>
                  <p className="review-text">
                    I got it as a gift for a friend, and they absolutely loved it! They praised how smooth and precise it is, perfect for both work and gaming. It's lightweight and comfortable, making it ideal for long hours of use. Whether they're tackling a busy day at work or enjoying some downtime gaming, this mouse delivers every time. A versatile choice they now can't go without!
                  </p>
                  <div className="review-images">
                    <img src={reviewImage1} alt="Review Image 1" className="review-img" />
                    <img src={reviewImage2} alt="Review Image 2" className="review-img" />
                  </div>
                </div>
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