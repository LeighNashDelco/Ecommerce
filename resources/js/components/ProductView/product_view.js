import React, { useState } from 'react';
import './../../../sass/components/product_view.scss';
import mouseImage from '../../../../resources/sass/img/ATKG2.svg';
import Navbar from '../Customer/topvar_notlogin';
import Footer from '../footer/footer';
import OrdersCart from '../CartModals/orders_cart';
import { IconExternalLink } from '@tabler/icons-react'; 

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

  
  const handleExpandClick = () => {
    console.log('Expand icon clicked - functionality to be added');
   
  };

  return (
    <div className="product-view-page">
      <Navbar onCartClick={toggleCart} />
      <div className="content-wrapper">
        <div className="product-view-container">
          {/* Product Section */}
          <div className="product-section">
            <div className="product-image">
              <img src={mouseImage} alt="Attack Shark X3" />
            </div>
            <div className="product-details">
              <div className="product-title-container">
                <h1>Attack Shark X3</h1>
                <div className="expand-icon" onClick={handleExpandClick}>
                  <IconExternalLink size={24} strokeWidth={1.5} color="#000" />
                </div>
              </div>
              <p className="company">Delco. Company</p>
              <div className="price-rating">
                <span className="price">${2000}</span>
                <div className="rating">
                  <span>★★★★★</span>
                </div>
              </div>
              <p className="description">
                Logitech MX Master 3S: Comfortable, quiet, and precise. Designed for smooth tracking and better productivity anywhere.
              </p>
              <div className="quantity-controls">
                <button onClick={decreaseQuantity} disabled={quantity === 1}>-</button>
                <span>{quantity}</span>
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

          {/* Reviews Section */}
          <div className="reviews-section">
            <h2>Reviews</h2>
            <div className="overall-rating">
              <span>★★★★★</span>
              <span>5 Reviews</span>
            </div>
            <div className="rating-breakdown">
              <p>5 Stars --- (5)</p>
              <p>5 Stars --- (1)</p>
              <p>5 Stars --- (1)</p>
              <p>5 Stars --- (0)</p>
              <p>5 Stars --- (0)</p>
            </div>
            <div className="review">
              <div className="review-header">
                <span>★★★★★</span>
                <h3>IMPRESSIVE AND RELIABLE MOUSE!</h3>
                <p className="review-date">December 12, 2024</p>
                <p className="reviewer-name">Kean D.</p>
              </div>
              <p className="review-text">
                IMPRESSIVE AND RELIABLE MOUSE! I got it as a gift for a friend, and they absolutely loved it! They praised how smooth and precise it is, perfect for both work and gaming. It's lightweight and comfortable, making it ideal for long hours of use. Whether they're tackling a busy day at work or enjoying some downtime gaming, this mouse delivers every time. A versatile choice they now can't go without!
              </p>
              <p className="review-helpful">
                Was this review helpful? Yes (4) No (0) <a href="#">Flag as inappropriate</a>
              </p>
            </div>
            <div className="review">
              <div className="review-header">
                <span>★★★★★</span>
                <h3>IMPRESSIVE AND RELIABLE MOUSE!</h3>
                <p className="review-date">January 18, 2025</p>
                <p className="reviewer-name">Ryan M.</p>
              </div>
              <p className="review-text">
                IMPRESSIVE AND RELIABLE MOUSE! I got it as a gift for a friend, and they absolutely loved it! They praised how smooth and precise it is, perfect for both work and gaming. It's lightweight and comfortable, making it ideal for long hours of use. Whether they're tackling a busy day at work or enjoying some downtime gaming, this mouse delivers every time. A versatile choice they now can't go without!
              </p>
              <p className="review-helpful">
                Was this review helpful? Yes (4) No (0) <a href="#">Flag as inappropriate</a>
              </p>
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