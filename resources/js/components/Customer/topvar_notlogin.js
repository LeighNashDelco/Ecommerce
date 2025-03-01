import React from 'react';
import "./../../../sass/components/topvar_notlogin.scss"; // Updated SCSS file path and name
import logoImage from "../../../../resources/sass/img/mainlogo.svg"; // Keeping your image import path
import { FaShoppingBag } from 'react-icons/fa'; // For the cart/bag icon

function CustomerNavbar() {
  return (
    <header className="customer-topbar">
      <div className="customer-topbar-container">
        <div className="customer-logo">
          <img src={logoImage} alt="Customer Logo" className="customer-logo-img" /> 
        </div>
        <nav className="customer-nav-links">
          <a href="#home" className="customer-nav-link">Home</a>
          <a href="#shop" className="customer-nav-link">Shop</a>
          <a href="#start-selling" className="customer-nav-link">Start Selling</a>
          <a href="#about" className="customer-nav-link">About</a>
        </nav>
        <div className="customer-auth-section">
          <a href="#cart" className="customer-cart-icon">
            <FaShoppingBag />
          </a>
          <a href="#login" className="customer-login-button">
            Login {/* Removed the IconLogin */}
          </a>
        </div>
      </div>
    </header>
  );
}

export default CustomerNavbar;