import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./../../../../sass/components/order_complete.scss";
import orderIllustration from '../../../../../resources/sass/img/thankyou.svg'; 
import Footer from "../footer/footer";
import Navbar from "../../customerside/Customer/topnav_login";

function OrderComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, profileId, order } = location.state || {};
  const [errorMessage, setErrorMessage] = useState('');

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  return (
    <div className="order-complete-page">
      <Navbar />
      <div className="order-complete-content">
        {errorMessage && (
          <div style={{ color: '#ff4444', marginBottom: '20px', textAlign: 'center', fontSize: '16px' }}>
            {errorMessage}
          </div>
        )}
        <img src={orderIllustration} alt="Order Complete Illustration" className="order-illustration" />
        <h1 className="order-title">Thank You for Your Order!</h1>
        <p className="order-message">
          Your order has been successfully placed. We've sent a confirmation email with your order details.
          {order && order.id && (
            <>
              <br />
              Order ID: {order.id}
            </>
          )}
        </p>
        <button className="continue-shopping-btn" onClick={handleContinueShopping}>
          Continue Shopping
        </button>
      </div>
      <Footer /> 
    </div>
  );
}

export default OrderComplete;