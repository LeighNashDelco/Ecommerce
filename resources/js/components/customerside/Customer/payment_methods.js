import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../../../../sass/components/payment_methods.scss';
import attackShark from '../../../../../resources/sass/img/cartmouse.svg';
import creditCardLogos from '../../../../../resources/sass/img/cardz.svg';
import paypalIllustration from '../../../../../resources/sass/img/paypal.svg';
import paypalLogo from '../../../../../resources/sass/img/payp_logo.svg';
import Navbar from "../../customerside/Customer/topnav_login";
import Footer from "../footer/footer";

function PaymentMethods() {
  const [activeStep, setActiveStep] = useState('Payment');
  const [selectedPayment, setSelectedPayment] = useState('creditCard');
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [cardDetails, setCardDetails] = useState({
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });
  const [showCvcTooltip, setShowCvcTooltip] = useState(false);
  const [isPaypalSelected, setIsPaypalSelected] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('LaravelPassportToken');
    return token ? {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    } : { 'Content-Type': 'application/json' };
  };

  useEffect(() => {
    setSelectedPayment('creditCard');

    const profileId = localStorage.getItem('profileId');

    if (!profileId) {
      setLoading(false);
      return;
    }

    const fetchCartItems = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/cart/${profileId}`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data = await response.json();
        setCartItems(data.success && Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCartItems([]);
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/profiles/${profileId}`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      }
    };

    Promise.all([fetchCartItems(), fetchProfile()]).finally(() => setLoading(false));
  }, []);

  const handleStepClick = (step) => {
    setActiveStep(step);
    console.log(`Navigating to ${step} step`);
  };

  const handlePaymentSelect = (method) => {
    setSelectedPayment(method);
    setCardDetails({ cardholderName: '', cardNumber: '', expiry: '', cvc: '' });
    setIsPaypalSelected(method === 'paypal');
    console.log(`Selected payment method: ${method}`);
  };

  const handleShippingSelect = (method) => {
    setSelectedShipping(method);
    console.log(`Selected shipping method: ${method}`);
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    if (name === 'expiry') {
      handleExpiryChange(value);
    } else {
      setCardDetails(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleExpiryChange = (value) => {
    let cleanedValue = value.replace(/[^0-9/]/g, '');
    if (cleanedValue.length > 2 && !cleanedValue.includes('/')) {
      cleanedValue = cleanedValue.slice(0, 2) + '/' + cleanedValue.slice(2);
    }
    if (cleanedValue.length > 7) {
      cleanedValue = cleanedValue.slice(0, 7);
    }
    const monthMatch = cleanedValue.match(/^(\d{1,2})\/?/);
    if (monthMatch) {
      const month = parseInt(monthMatch[1], 10);
      if (month > 12) {
        cleanedValue = '12' + cleanedValue.slice(2);
      }
    }
    const yearMatch = cleanedValue.match(/\/(\d{0,4})$/);
    if (yearMatch && yearMatch[1].length > 4) {
      cleanedValue = cleanedValue.slice(0, -1);
    }
    setCardDetails(prev => ({ ...prev, expiry: cleanedValue }));
  };

  const handleRemoveItem = async (productId) => {
    const profileId = localStorage.getItem('profileId');
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/cart/remove`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ profile_id: profileId, product_id: productId }),
      });
      if (!response.ok) throw new Error('Failed to remove item');
      setCartItems((prevItems) => prevItems.filter((i) => i.product_id !== productId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handlePlaceOrder = async () => {
    const profileId = localStorage.getItem('profileId');
    if (!profileId) {
      alert('Please log in to place an order.');
      return;
    }
  
    if (cartItems.length === 0) {
      alert('Your cart is empty. Add items before placing an order.');
      return;
    }
  
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingCost = selectedShipping === 'priority' ? 50 : 0;
    const grandTotal = totalPrice + shippingCost;
  
    const orderData = {
      profile_id: parseInt(profileId, 10),
      shipping_method: selectedShipping,
      items: cartItems.map(item => ({
        product_id: parseInt(item.product_id, 10),
        quantity: parseInt(item.quantity, 10),
        price: Number(item.price),
      })),
      total_amount: grandTotal,
      payment_method: selectedPayment === 'creditCard' ? 'credit_card' : selectedPayment === 'paypal' ? 'paypal' : 'cash_on_delivery',
    };
  
    console.log('Sending order data:', orderData);
  
    if (selectedPayment === 'paypal') {
      localStorage.setItem('pendingOrder', JSON.stringify(orderData));
      window.location.href = 'https://www.paypal.com/signin';
    } else {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/orders', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(orderData),
        });
  
        console.log('Response status:', response.status); // Debug status
        const responseText = await response.text(); // Get raw text
        console.log('Raw response:', responseText); // Log raw response
  
        const responseData = JSON.parse(responseText); // Attempt to parse as JSON
        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to place order');
        }
  
        console.log('Order placed successfully:', responseData);
        setCartItems([]);
        navigate('/order_complete');
      } catch (error) {
        console.error('Error placing order:', error.message);
        alert(`Failed to place order: ${error.message}`);
      }
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingCost = selectedShipping === 'priority' ? 50 : 0;
  const grandTotal = totalPrice + shippingCost;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="payment-methods-page-container">
      <Navbar />
      <div className="payment-methods-content">
        <div className="payment-methods-body">
          <div className="top-section">
            <div className="payment-information">
              <h1>Checkout</h1>
              <div className="delivery-address">
                <h3>Delivery Address</h3>
                {profile ? (
                  <>
                    <p>
                      {profile.first_name}{' '}
                      {profile.middlename && profile.middlename !== 'N/A' ? `${profile.middlename} ` : ''}
                      {profile.last_name}{' '}
                      {profile.suffix && profile.suffix !== 'N/A' ? profile.suffix : ''}
                    </p>
                    <p>{profile.street}</p>
                    <p>{`${profile.city}, ${profile.province}, ${profile.postal_code}`}</p>
                    <p>{profile.country}</p>
                  </>
                ) : (
                  <p>No profile data available</p>
                )}
                <button className="change-btn">Change</button>
              </div>
              <div className="payment-details">
                <h3>Payment Method</h3>
                <div className="payment-methods">
                  <button 
                    className={`payment-button ${selectedPayment === 'creditCard' ? 'active' : ''}`}
                    onClick={() => handlePaymentSelect('creditCard')}
                  >
                    Credit card
                  </button>
                  <button 
                    className={`payment-button ${selectedPayment === 'paypal' ? 'active' : ''}`}
                    onClick={() => handlePaymentSelect('paypal')}
                  >
                    Paypal
                  </button>
                  <button 
                    className={`payment-button ${selectedPayment === 'cashOnDelivery' ? 'active' : ''}`}
                    onClick={() => handlePaymentSelect('cashOnDelivery')}
                  >
                    Cash on Delivery
                  </button>
                </div>
                <h3>Payment Details</h3>
                {selectedPayment === 'creditCard' && (
                  <>
                    <div className="card-logos">
                      <img src={creditCardLogos} alt="Credit Card Logos" className="card-logo" />
                    </div>
                    <div className="credit-debit-details">
                      <input 
                        type="text" 
                        name="cardNumber" 
                        value={cardDetails.cardNumber} 
                        onChange={handleCardChange} 
                        placeholder="Card Number" 
                        className="card-input"
                      />
                      <div className="expiry-cvc">
                        <input 
                          type="text" 
                          name="expiry" 
                          value={cardDetails.expiry} 
                          onChange={handleCardChange} 
                          placeholder="Expiration Date (MM / YY)" 
                          className="card-input expiry-input"
                        />
                        <div className="cvc-container">
                          <input 
                            type="text" 
                            name="cvc" 
                            value={cardDetails.cvc} 
                            onChange={handleCardChange} 
                            placeholder="Security Code" 
                            className="card-input cvc-input"
                          />
                          <span 
                            className="cvc-help"
                            onMouseEnter={() => setShowCvcTooltip(true)}
                            onMouseLeave={() => setShowCvcTooltip(false)}
                          >
                            ?
                            {showCvcTooltip && (
                              <div className="cvc-tooltip">
                                3-digit security code usually found on the back of your card.
                              </div>
                            )}
                          </span>
                        </div>
                      </div>
                      <input 
                        type="text" 
                        name="cardholderName" 
                        value={cardDetails.cardholderName} 
                        onChange={handleCardChange} 
                        placeholder="Name on card" 
                        className="card-input"
                      />
                    </div>
                  </>
                )}
                {selectedPayment === 'paypal' && (
                  <div className="paypal-details">
                    <img src={paypalIllustration} alt="PayPal Illustration" className="paypal-illustration" />
                    <p className="paypal-text">
                      After clicking "Pay with PayPal", you will be redirected to PayPal to complete your purchase securely.
                    </p>
                  </div>
                )}
                {selectedPayment === 'cashOnDelivery' && (
                  <p className="cash-on-delivery-text">
                    Pay with cash upon delivery. Please have exact change ready.
                  </p>
                )}
              </div>
              <div className="shipping-method">
                <h3>Shipping Method</h3>
                <label className="shipping-option">
                  <input 
                    type="radio" 
                    name="shipping" 
                    value="standard" 
                    checked={selectedShipping === 'standard'}
                    onChange={() => handleShippingSelect('standard')}
                  />
                  <div className="shipping-content">
                    <span className="shipping-text">Standard Shipping - 5-7 Business Days</span>
                    <span className="shipping-price">Free</span>
                  </div>
                </label>
                <label className="shipping-option">
                  <input 
                    type="radio" 
                    name="shipping" 
                    value="priority" 
                    checked={selectedShipping === 'priority'}
                    onChange={() => handleShippingSelect('priority')}
                  />
                  <div className="shipping-content">
                    <span className="shipping-text">Priority Shipping - 2-3 Business Days</span>
                    <span className="shipping-price">₱50</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="cart-details">
              <h2>Order Summary</h2>
              {cartItems.length === 0 ? (
                <p className="empty-cart">Your cart is empty</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.product_id} className="cart-item">
                    <div className="cart-item-image-wrapper">
                      <img 
                        src={item.product_img ? `http://127.0.0.1:8000/${item.product_img}` : attackShark} 
                        alt={item.product_name} 
                        className="cart-item-image" 
                      />
                    </div>
                    <div className="cart-item-details">
                      <p className="cart-item-name">{item.product_name}</p>
                      <p className="cart-item-quantity">Quantity: {item.quantity}</p>
                      <p className="cart-item-price">₱{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <button 
                      className="remove-btn" 
                      onClick={() => handleRemoveItem(item.product_id)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
              <div className="order-summary">
                <div className="summary-item">
                  <span>Subtotal</span>
                  <span>₱{totalPrice.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `₱${shippingCost.toLocaleString()}`}</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>₱{grandTotal.toLocaleString()}</span>
                </div>
              </div>
              <button 
                className={`place-order-btn ${isPaypalSelected ? 'paypal-btn' : ''}`}
                onClick={handlePlaceOrder}
              >
                {isPaypalSelected ? (
                  <>
                    <span>Pay with</span>
                    <img src={paypalLogo} alt="PayPal Logo" className="paypal-logo" />
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PaymentMethods;