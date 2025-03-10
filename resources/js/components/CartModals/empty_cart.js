import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../../../sass/components/empty_cart.scss';
import emptyCartIllustration from '../../../../resources/sass/img/emptyCart.svg'; 

function EmptyCart({ isOpen, onClose }) {
  const navigate = useNavigate();

  
  const handleContinueShopping = () => {
    onClose(); 
    navigate('/'); 
  };

  return (
    <div className={`empty-cart-modal ${isOpen ? 'open' : ''}`}>
      <div className="empty-cart-modal-content">
        <button className="empty-cart-close-button" onClick={onClose}>✖</button>
        <div className="empty-cart-illustration">
          <img src={emptyCartIllustration} alt="Empty Cart Illustration" />
        </div>
        <p className="empty-cart-message">Your cart is empty</p>
        <button className="empty-cart-continue-button" onClick={handleContinueShopping}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default EmptyCart;