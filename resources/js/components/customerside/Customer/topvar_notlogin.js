import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./../../../../sass/components/topvar_notlogin.scss";
import logoImage from "../../../../../resources/sass/img/mainlogo.svg";
import { FaShoppingBag } from 'react-icons/fa';
import { IconSearch, IconMenu2, IconX } from '@tabler/icons-react';

function CustomerNavbar({ onCartClick, cartCount = 0 }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate('/'); // Navigate to the Homepage (root route)
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const handleShopClick = (e) => {
    e.preventDefault();
    navigate('/shop');
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    navigate('/about_us');
  };

  const handleStartSellingClick = (e) => {
    e.preventDefault();
    navigate('/register'); // Navigate to the Register page
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="customer-topbar">
      <div className="customer-topbar-container">
        <div className="customer-mobile-menu" onClick={toggleMenu}>
          <IconMenu2 size={24} color="#ffffff" />
        </div>
        <div className="customer-logo">
          <img src={logoImage} alt="Customer Logo" className="customer-logo-img" />
        </div>
        <nav className={`customer-nav-links ${isMenuOpen ? 'open' : ''}`}>
          <a href="#home" className="customer-nav-link" onClick={handleHomeClick}>Home</a>
          <a href="#shop" className="customer-nav-link" onClick={handleShopClick}>Shop</a> 
          <a href="#start-selling" className="customer-nav-link" onClick={handleStartSellingClick}>Start Selling</a>
          <a href="#about" className="customer-nav-link" onClick={handleAboutClick}>About</a>
        </nav>
        <div className="customer-auth-section">
          <a href="#search" className="customer-search-icon" onClick={(e) => e.preventDefault()}>
            <IconSearch size={24} />
          </a>
          <a href="#cart" className="customer-cart-icon" onClick={(e) => { e.preventDefault(); onCartClick(); }}>
            <FaShoppingBag />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </a>
          <a
            href="#login"
            className="customer-login-button"
            onClick={handleLoginClick}
          >
            Login
          </a>
        </div>
      </div>
    
      <div className={`customer-mobile-overlay ${isMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="customer-mobile-exit" onClick={toggleMenu}>
          <IconX size={24} color="#ffffff" />
        </div>
        <nav className="customer-mobile-nav">
          <a href="#home" className="customer-nav-link" onClick={(e) => { handleHomeClick(e); toggleMenu(); }}>HOME</a>
          <a href="#shop" className="customer-nav-link" onClick={(e) => { handleShopClick(e); toggleMenu(); }}>SHOP</a>
          <a href="#start-selling" className="customer-nav-link" onClick={(e) => { handleStartSellingClick(e); toggleMenu(); }}>START SELLING</a>
          <a href="#about" className="customer-nav-link" onClick={(e) => { handleAboutClick(e); toggleMenu(); }}>ABOUT</a>
          <a href="#login" className="customer-nav-link" onClick={(e) => { handleLoginClick(e); toggleMenu(); }}>LOGIN</a>
        </nav>
      </div>
    </header>
  );
}

export default CustomerNavbar;