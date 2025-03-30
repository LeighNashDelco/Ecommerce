import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './../../../../sass/components/payment_methods.scss';
import attackShark from '../../../../../resources/sass/img/cartmouse.svg';
import creditCardLogos from '../../../../../resources/sass/img/cardz.svg';
import paypalIllustration from '../../../../../resources/sass/img/paypal.svg';
import paypalLogo from '../../../../../resources/sass/img/payp_logo.svg';
import Navbar from "../../customerside/Customer/topnav_login";
import Footer from "../footer/footer";

function PaymentMethods() {
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
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('LaravelPassportToken');
    return token ? {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    } : { 'Content-Type': 'application/json' };
  };

  useEffect(() => {
    const profileId = localStorage.getItem('profileId');
    const itemsFromState = location.state?.items || [];

    if (!profileId) {
      navigate('/login');
      return;
    }

    setCartItems(itemsFromState);

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
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [location.state, navigate]);

  const handlePaymentSelect = (method) => {
    setSelectedPayment(method);
    setCardDetails({ cardholderName: '', cardNumber: '', expiry: '', cvc: '' });
    setIsPaypalSelected(method === 'paypal');
    setErrorMessage('');
  };

  const handleShippingSelect = (method) => {
    setSelectedShipping(method);
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
    if (cleanedValue.length > 7) cleanedValue = cleanedValue.slice(0, 7);
    const monthMatch = cleanedValue.match(/^(\d{1,2})\/?/);
    if (monthMatch && parseInt(monthMatch[1], 10) > 12) {
      cleanedValue = '12' + cleanedValue.slice(2);
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
      setErrorMessage('Failed to remove item from cart. Please try again.');
    }
  };

  const deleteSelectedCartItems = async (selectedItems, profileId) => {
    try {
      const responses = await Promise.all(selectedItems.map(item =>
        fetch('http://127.0.0.1:8000/api/cart/remove', {
          method: 'DELETE',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            profile_id: profileId,
            product_id: item.product_id,
          }),
        }).then(res => {
          if (!res.ok && res.status !== 404) { // Ignore 404s since item might already be deleted
            throw new Error(`Failed to delete item ${item.product_id}: ${res.statusText}`);
          }
          return res.status === 204 ? {} : res.json(); // Handle no-content response
        })
      ));
      console.log('Cart items deleted:', responses);
      setCartItems([]); // Clear local state
    } catch (error) {
      console.error('Error deleting selected cart items:', error);
      setErrorMessage(`Failed to clear cart: ${error.message}. Order still placed successfully.`);
    }
  };

  const hasValidAddress = () => {
    return profile && 
           profile.street && profile.street.trim() !== '' && 
           profile.city && profile.city.trim() !== '' && 
           profile.province && profile.province.trim() !== '' && 
           profile.postal_code && profile.postal_code.trim() !== '' && 
           profile.country && profile.country.trim() !== '';
  };

  const getFullName = () => {
    if (!profile) return '';
    return `${profile.first_name} ${profile.middlename && profile.middlename !== 'N/A' ? profile.middlename + ' ' : ''}${profile.last_name} ${profile.suffix && profile.suffix !== 'N/A' ? profile.suffix : ''}`.trim();
  };

  const calculateTotals = () => {
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingCost = selectedShipping === 'priority' ? 50 : 0;
    const grandTotal = totalPrice + shippingCost;
    return { totalPrice, shippingCost, grandTotal };
  };

  const handlePlaceOrder = async () => {
    const profileId = localStorage.getItem('profileId');
    setErrorMessage('');

    if (!profileId) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty. Add items before placing an order.');
      return;
    }

    if (!hasValidAddress()) {
      setErrorMessage('Please provide a complete delivery address before placing an order.');
      return;
    }

    const { totalPrice, shippingCost, grandTotal } = calculateTotals();

    const orderData = {
      profile_id: parseInt(profileId, 10),
      shipping_method: selectedShipping,
      items: cartItems.map(item => ({
        product_id: parseInt(item.product_id || item.id, 10),
        quantity: parseInt(item.quantity, 10),
        price: Number(item.price),
      })),
      total_amount: grandTotal,
      payment_method: selectedPayment === 'creditCard' ? 'credit_card' : selectedPayment === 'paypal' ? 'paypal' : 'cash_on_delivery',
    };

    console.log('Order Data being sent (full):', JSON.stringify(orderData, null, 2));

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

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to place order');
        }

        console.log('Order Response:', responseData);

        // Delete cart items after successful order
        await deleteSelectedCartItems(cartItems, profileId);

        navigate('/order_complete', { state: { order: responseData, items: cartItems, profileId } });
      } catch (error) {
        console.error('Error placing order:', error);
        setErrorMessage(`Failed to place order: ${error.message}. Please try again.`);
      }
    }
  };

  const { totalPrice, shippingCost, grandTotal } = calculateTotals();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="payment-methods-page-container">
      <Navbar />
      <div className="payment-methods-content">
        <div className="payment-methods-body">
          <div className="top-section">
            <div className="payment-information">
              <h1>Checkout</h1>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div className="delivery-address">
                <h3>Delivery Address</h3>
                {profile ? (
                  hasValidAddress() ? (
                    <>
                      <p>{getFullName()}</p>
                      <p>{profile.street}</p>
                      <p>{`${profile.city}, ${profile.province}, ${profile.postal_code}`}</p>
                      <p>{profile.country}</p>
                    </>
                  ) : (
                    <p className="no-address">No valid address provided. Please update your profile.</p>
                  )
                ) : (
                  <p>No profile data available</p>
                )}
                <button
                  className="change-btn"
                  onClick={() => navigate('/customerprofile')}
                >
                  {hasValidAddress() ? 'Update' : 'Add Address'}
                </button>
              </div>
              <div className="payment-details">
                <h3>Payment Method</h3>
                <div className="payment-methods">
                  <button 
                    className={`payment-button ${selectedPayment === 'creditCard' ? 'active' : ''}`}
                    onClick={() => handlePaymentSelect('creditCard')}
                  >
                    Credit Card
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
                  <div className="credit-debit-details">
                    <img src={creditCardLogos} alt="Credit Card Logos" className="card-logo" />
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
                        placeholder="MM/YY" 
                        className="card-input expiry-input"
                      />
                      <div className="cvc-container">
                        <input 
                          type="text" 
                          name="cvc" 
                          value={cardDetails.cvc} 
                          onChange={handleCardChange} 
                          placeholder="CVC" 
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
                              3-digit security code on the back of your card.
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
                )}
                {selectedPayment === 'paypal' && (
                  <div className="paypal-details">
                    <img src={paypalIllustration} alt="PayPal Illustration" className="paypal-illustration" />
                    <p>You will be redirected to PayPal to complete your purchase securely.</p>
                  </div>
                )}
                {selectedPayment === 'cashOnDelivery' && (
                  <p>Pay with cash upon delivery. Please have exact change ready.</p>
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
                    <span>Standard Shipping (5-7 Business Days)</span>
                    <span>₱0</span>
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
                    <span>Priority Shipping (2-3 Business Days)</span>
                    <span>₱50</span>
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
                  <div key={item.product_id || item.id} className="cart-item">
                    <div className="cart-item-image-wrapper">
                      <img 
                        src={item.product_img ? `http://127.0.0.1:8000/${item.product_img}` : attackShark} 
                        alt={item.product_name || item.name} 
                        className="cart-item-image" 
                      />
                    </div>
                    <div className="cart-item-details">
                      <p className="cart-item-name">{item.product_name || item.name}</p>
                      <p className="cart-item-quantity">Quantity: {item.quantity}</p>
                      <p className="cart-item-price">₱{(item.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <button 
                      className="remove-btn" 
                      onClick={() => handleRemoveItem(item.product_id || item.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
              <div className="order-summary">
                <div className="summary-item">
                  <span>Subtotal</span>
                  <span>₱{totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="summary-item">
                  <span>Shipping</span>
                  <span>₱{shippingCost.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>₱{grandTotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
              <button 
                className={`place-order-btn ${isPaypalSelected ? 'paypal-btn' : ''}`}
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0 || !hasValidAddress()}
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