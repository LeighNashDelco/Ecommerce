import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../../../sass/components/payment_methods.scss';
import attackShark from '../../../../resources/sass/img/cartmouse.svg';
import creditCardLogos from '../../../../resources/sass/img/cardz.svg';
import paypalIllustration from '../../../../resources/sass/img/paypal.svg';
import paypalLogo from '../../../../resources/sass/img/payp_logo.svg';
import Navbar from "../Customer/topvar_notlogin";
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
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedPayment('creditCard');
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

  // Updated handlePlaceOrder to handle PayPal redirection
  const handlePlaceOrder = () => {
    if (isPaypalSelected) {
      // Redirect to PayPal login page
      window.location.href = 'https://www.paypal.com/signin';
    } else {
      // Navigate to OrderComplete for other payment methods
      navigate('/order_complete');
    }
  };

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
                <p>John Doe</p>
                <p>1234 Sample Street, Barangay 123</p>
                <p>Manila, Metro Manila, 1000</p>
                <p>Philippines</p>
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
              <div className="cart-item">
                <a href="#" className="product-link">
                  <img src={attackShark} alt="Attack Shark X3" className="cart-item-image" />
                </a>
                <div className="cart-item-details">
                  <p>Attack Shark X3</p>
                  <p>Quantity: 1</p>
                  <p className="cart-item-price">₱2,000</p>
                </div>
                <button className="remove-btn">Remove</button>
              </div>
              <div className="cart-item">
                <a href="#" className="product-link">
                  <img src={attackShark} alt="Attack Shark X3" className="cart-item-image" />
                </a>
                <div className="cart-item-details">
                  <p>Attack Shark X3</p>
                  <p>Quantity: 1</p>
                  <p className="cart-item-price">₱2,000</p>
                </div>
                <button className="remove-btn">Remove</button>
              </div>
              <div className="cart-item">
                <a href="#" className="product-link">
                  <img src={attackShark} alt="Attack Shark X3" className="cart-item-image" />
                </a>
                <div className="cart-item-details">
                  <p>Attack Shark X3</p>
                  <p>Quantity: 1</p>
                  <p className="cart-item-price">₱2,000</p>
                </div>
                <button className="remove-btn">Remove</button>
              </div>
              <div className="order-summary">
                <div className="summary-item">
                  <span>Subtotal</span>
                  <span>₱6,000</span>
                </div>
                <div className="summary-item">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>₱6,000</span>
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
                  'Place order'
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