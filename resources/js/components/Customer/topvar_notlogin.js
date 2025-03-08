import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "./../../../sass/components/topvar_notlogin.scss"; // Updated SCSS file path and name
import logoImage from "../../../../resources/sass/img/mainlogo.svg"; // Keeping your image import path
import { FaShoppingBag } from 'react-icons/fa'; // For the cart/bag icon

function CustomerNavbar({ onCartClick, cartCount = 0 }) {
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle Login button click
  const handleLoginClick = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    navigate('/login'); // Navigate to the Login page
  };

  return (
    <header className="customer-topbar">
      <div className="customer-topbar-container">
        <div className="customer-logo-and-nav">
          <div className="customer-logo">
            <img src={logoImage} alt="Customer Logo" className="customer-logo-img" /> 
          </div>
          <nav className="customer-nav-links">
            <a href="#home" className="customer-nav-link">Home</a>
            <a href="#shop" className="customer-nav-link">Shop</a>
            <a href="#start-selling" className="customer-nav-link">Start Selling</a>
            <a href="#about" className="customer-nav-link">About</a>
          </nav>
        </div>
        <div className="customer-auth-section">
          <a href="#cart" className="customer-cart-icon" onClick={(e) => { e.preventDefault(); onCartClick(); }}>
            <FaShoppingBag />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>} {/* Show count if items exist */}
          </a>
          <a
            href="#login"
            className="customer-login-button"
            onClick={handleLoginClick} // Add onClick handler for navigation
          >
            Login
          </a>
        </div>
      </div>
    </header>
  );
}

export default CustomerNavbar;