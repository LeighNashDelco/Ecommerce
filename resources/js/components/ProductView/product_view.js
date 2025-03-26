import React, { useState } from 'react';
import './../../../sass/components/product_view.scss';
import mouseImage from '../../../../resources/sass/img/ATKG2.svg';
import pfpImage from '../../../../resources/sass/img/pfp.svg';
import reviewImage1 from "../../../../resources/sass/img/ATKCOLOR.svg";
import reviewImage2 from "../../../../resources/sass/img/ATKCOLOR.svg";
import Navbar from '../Customer/topvar_notlogin';
import Footer from '../footer/footer';
import OrdersCart from '../CartModals/orders_cart';
import { IconArrowLeft, IconExternalLink, IconStar } from '@tabler/icons-react';

const ProductView = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleQuantityClick = () => {
    // Toggle between increasing and decreasing on click
    // For simplicity, let's make it increase on click; you can modify this behavior
    setQuantity(quantity + 1);
  };

  const handleExpandClick = () => {
    console.log('Icon clicked - functionality to be added');
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

  return (
    <div className="product-view-page">
      <Navbar onCartClick={toggleCart} />
      <div className="content-wrapper">
        <div className="product-view-container">
          {/* Product Section */}
          <div className="product-section">
            <div className="expand-icon" onClick={handleExpandClick}>
              <IconExternalLink className="icon-desktop" size={24} strokeWidth={1.5} color="#000" />
              <IconArrowLeft className="icon-mobile" size={24} strokeWidth={1.5} color="#000" />
            </div>
            <div className="product-image">
              <img src={mouseImage} alt="Attack Shark X3" />
            </div>
            <div className="product-details">
              <div className="product-title-container">
                <h1>Attack Shark X3</h1>
              </div>
              <p className="company">Delco. Company</p>
              <div className="price-rating">
                <span className="price">${2000}</span>
                <div className="rating">
                  {renderStars(5)}
                  <span className="review-count">26 reviews</span>
                </div>
              </div>
              <p className="description">
                Logitech MX Master 3S: Comfortable, quiet, and precise. Designed for smooth tracking and better productivity anywhere.
              </p>
              <div className="quantity-controls">
                <button onClick={decreaseQuantity} disabled={quantity === 1}>-</button>
                <span onClick={handleQuantityClick} style={{ cursor: 'pointer' }}>{quantity}</span>
                <button onClick={increaseQuantity}>+</button>
              </div>
              <div className="action-buttons">
                <button className="add-to-cart">Add to Cart: ${2000 * quantity}</button>
                <button className="buy-now">Buy Now: ${2000 * quantity}</button>
              </div>
              <div className="shipping-info">
                <span className="shipping-hover">Free standard shipping</span>
                <span className="shipping-hover">Free Returns</span>
              </div>
            </div>
          </div>

          {/* Reviews Section (unchanged) */}
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
                <div className="review">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img src={pfpImage} alt="Profile" className="pfp" />
                      <div>
                        <p className="reviewer-name">Ryan M.</p>
                        <p className="review-date">January 18, 2025</p>
                      </div>
                    </div>
                    <div className="rating">{renderStars(5)}</div>
                  </div>
                  <p className="best-feature">Best Feature: Light and Smooth</p>
                  <p className="review-text">
                    I got it as a gift for a friend, and they absolutely loved it! They praised how smooth and precise it is, perfect for both work and gaming. It's lightweight and comfortable, making it ideal for long hours of use. Whether they're tackling a busy day at work or enjoying some downtime gaming, this mouse delivers every time. A versatile choice they now can't go without!
                  </p>
                </div>
                <div className="review">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img src={pfpImage} alt="Profile" className="pfp" />
                      <div>
                        <p className="reviewer-name">Sarah L.</p>
                        <p className="review-date">February 5, 2025</p>
                      </div>
                    </div>
                    <div className="rating">{renderStars(5)}</div>
                  </div>
                  <p className="best-feature">Best Feature: Precision</p>
                  <p className="review-text">
                    This mouse is a game-changer! The precision is unmatched, and it’s so comfortable to use for long sessions. Highly recommend it for gamers and professionals alike!
                  </p>
                </div>
                <div className="review">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img src={pfpImage} alt="Profile" className="pfp" />
                      <div>
                        <p className="reviewer-name">Mike T.</p>
                        <p className="review-date">February 15, 2025</p>
                      </div>
                    </div>
                    <div className="rating">{renderStars(5)}</div>
                  </div>
                  <p className="best-feature">Best Feature: Ergonomic Design</p>
                  <p className="review-text">
                    Got this for my office work, and it’s been a delight. Smooth tracking and ergonomic design make it worth every penny!
                  </p>
                </div>
                <div className="review">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img src={pfpImage} alt="Profile" className="pfp" />
                      <div>
                        <p className="reviewer-name">Emma R.</p>
                        <p className="review-date">March 1, 2025</p>
                      </div>
                    </div>
                    <div className="rating">{renderStars(5)}</div>
                  </div>
                  <p className="best-feature">Best Feature: Build Quality</p>
                  <p className="review-text">
                    Bought this as a gift, and my brother loves it! Great build quality and performance for the price.
                  </p>
                </div>
                <div className="review">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img src={pfpImage} alt="Profile" className="pfp" />
                      <div>
                        <p className="reviewer-name">John K.</p>
                        <p className="review-date">March 8, 2025</p>
                      </div>
                    </div>
                    <div className="rating">{renderStars(5)}</div>
                  </div>
                  <p className="best-feature">Best Feature: Design</p>
                  <p className="review-text">
                    The design is sleek, and the performance is top-notch. Perfect for both work and casual gaming!
                  </p>
                </div>
                <div className="review">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img src={pfpImage} alt="Profile" className="pfp" />
                      <div>
                        <p className="reviewer-name">Lisa P.</p>
                        <p className="review-date">March 10, 2025</p>
                      </div>
                    </div>
                    <div className="rating">{renderStars(4)}</div>
                  </div>
                  <p className="best-feature">Best Feature: Performance</p>
                  <p className="review-text">
                    Great mouse, but the battery life could be better. Otherwise, it’s a fantastic product!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <OrdersCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default ProductView;