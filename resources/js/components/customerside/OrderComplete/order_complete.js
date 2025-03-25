import React, { useEffect, useState } from 'react';
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

  const getAuthHeaders = () => {
    const token = localStorage.getItem('LaravelPassportToken');
    return token ? {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    } : { 'Content-Type': 'application/json' };
  };

  useEffect(() => {
    const deleteSelectedCartItems = async () => {
      if (!items || items.length === 0) {
        setErrorMessage('No items provided. Unable to clear cart.');
        return;
      }
      if (!profileId) {
        setErrorMessage('No profile ID provided. Unable to clear cart.');
        return;
      }

      try {
        await Promise.all(
          items.map(item =>
            fetch(`http://127.0.0.1:8000/api/cart/remove`, {
              method: 'DELETE',
              headers: getAuthHeaders(),
              body: JSON.stringify({ profile_id: profileId, product_id: item.product_id }),
            }).then(res => {
              if (!res.ok) throw new Error(`Failed to delete item ${item.product_id}`);
              return res.json();
            })
          )
        );
        console.log('Successfully deleted selected cart items:', items);
      } catch (error) {
        console.error('Error deleting selected cart items:', error);
        setErrorMessage('Failed to remove ordered items from cart. Please check your cart manually.');
      }
    };

    deleteSelectedCartItems();
  }, [items, profileId]);

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