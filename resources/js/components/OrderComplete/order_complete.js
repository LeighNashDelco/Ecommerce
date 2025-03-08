import React from 'react';
import "./../../../sass/components/order_complete.scss";
import orderIllustration from '../../../../resources/sass/img/thankyou.svg'; // Placeholder SVG import (replace with your actual SVG path)
import Footer from "../footer/footer";
import Navbar from "../Customer/topvar_notlogin";
function OrderComplete() {
  return (
    <div className="order-complete-page">
        <Navbar />
      <div className="order-complete-content">
        <img src={orderIllustration} alt="Order Complete Illustration" className="order-illustration" />
        <h1 className="order-title">Thank You for Your Order!</h1>
        <p className="order-message">
          Your order has been successfully placed. We've sent a confirmation email with your order details.
        </p>
        <button className="continue-shopping-btn">Continue Shopping</button>
      </div>
      <Footer /> {/* Assuming Footer is imported and available from your previous setup */}
    </div>
  );
}

export default OrderComplete;