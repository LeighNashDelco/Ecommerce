import React, { useState } from 'react';
import './../../../sass/components/checkout_address.scss';
import attackShark from '../../../../resources/sass/img/cartmouse.svg';
import Navbar from "../Customer/topvar_notlogin";
import Footer from "../footer/footer";

function CheckoutAddress() {
  const [couponCode, setCouponCode] = useState(''); // Added for consistency, though not used here
  const [activeStep, setActiveStep] = useState('Address'); // Track active step for navigation

  const handleStepClick = (step) => {
    setActiveStep(step);
    // You can add navigation logic here (e.g., routing to different pages for each step)
    console.log(`Navigating to ${step} step`);
  };

  return (
    <div className="checkout-address-page-container">
      <Navbar />
      <div className="checkout-address-content">
        <div className="checkout-address-body">
          <div className="top-section">
            <div className="shipping-information">
              <h1>Checkout</h1>
              <p>Not ready to checkout? <a href="#">Continue Shopping</a></p>
              <div className="address-steps">
                <span 
                  className={`step ${activeStep === 'Address' ? 'active' : ''}`} 
                  onClick={() => handleStepClick('Address')}
                >
                  Address
                </span>
                <span> — </span>
                <span 
                  className={`step ${activeStep === 'Shipping' ? 'active' : ''}`} 
                  onClick={() => handleStepClick('Shipping')}
                >
                  Shipping
                </span>
                <span> — </span>
                <span 
                  className={`step ${activeStep === 'Payment' ? 'active' : ''}`} 
                  onClick={() => handleStepClick('Payment')}
                >
                  Payment
                </span>
              </div>
              <h2>Shipping Information</h2>
              <div className="shipping-fields">
                <div className="field-row">
                  <input type="text" placeholder="First Name" className="input-field" />
                  <input type="text" placeholder="Middle Name" className="input-field" />
                  <input type="text" placeholder="Suffix" className="input-field" />
                </div>
                <input type="text" placeholder="Last Name" className="input-field last-name-field" />
                <input type="text" placeholder="Address" className="input-field address-field" />
                <input type="text" placeholder="Apartment, suite, etc (optional)" className="input-field apartment-field" />
                <div className="field-row">
                  <select className="input-field select-field country-field">
                    <option value="">Country</option>
                    <option value="Philippines">Philippines</option>
                    <option value="USA">USA</option>
                  </select>
                  <select className="input-field select-field city-field">
                    <option value="">City</option>
                    <option value="Butuan City">Butuan City</option>
                    <option value="Minneapolis">Minneapolis</option>
                  </select>
                  <input type="text" placeholder="Zipcode" className="input-field" />
                </div>
              </div>
              <button className="continue-checkout-btn">Continue to checkout</button>
            </div>
            <div className="cart-details">
              <h2>Your cart</h2>
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
                  <span>₱2,000</span>
                </div>
                <div className="summary-item">
                  <span>Shipping</span>
                  <span>Calculated at the next step</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>₱2,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CheckoutAddress;