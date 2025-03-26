import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./../../../sass/components/topvar_notlogin.scss";
import logoImage from "../../../../resources/sass/img/mainlogo.svg";
import { FaShoppingBag } from 'react-icons/fa';
import { IconSearch, IconMenu2, IconX, IconChevronDown } from '@tabler/icons-react';
import Search from '../Search/search'; // Import the Search component

function CustomerNavbar({ onCartClick, cartCount = 0 }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isSupportDropdownOpen, setIsSupportDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State for search bar visibility

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleShopClick = (e) => {
    e.preventDefault();
    navigate('/shop');
    setIsMenuOpen(false);
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    navigate('/about_us');
    setIsMenuOpen(false);
  };

  const handleStartSellingClick = (e) => {
    e.preventDefault();
    navigate('/register');
    setIsMenuOpen(false);
  };

  const handleGamingMouseClick = (e) => {
    e.preventDefault();
    navigate('/shop/gaming-mouse');
    setIsMenuOpen(false);
    setIsShopDropdownOpen(false);
  };

  const handleWiredWirelessMouseClick = (e) => {
    e.preventDefault();
    navigate('/shop/wired-wireless-mouse');
    setIsMenuOpen(false);
    setIsShopDropdownOpen(false);
  };

  const handleOfficeMouseClick = (e) => {
    e.preventDefault();
    navigate('/shop/office-mouse');
    setIsMenuOpen(false);
    setIsShopDropdownOpen(false);
  };

  const handleGetHelpClick = (e) => {
    e.preventDefault();
    navigate('/support/get-help');
    setIsMenuOpen(false);
    setIsSupportDropdownOpen(false);
  };

  const handleVeroStoreSupportClick = (e) => {
    e.preventDefault();
    navigate('/support/vero-store-support');
    setIsMenuOpen(false);
    setIsSupportDropdownOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsShopDropdownOpen(false);
    setIsSupportDropdownOpen(false);
    setIsSearchOpen(false); // Close search bar when opening mobile menu
  };

  const toggleShopDropdown = (e) => {
    e.preventDefault();
    setIsShopDropdownOpen(!isShopDropdownOpen);
    setIsSupportDropdownOpen(false);
  };

  const toggleSupportDropdown = (e) => {
    e.preventDefault();
    setIsSupportDropdownOpen(!isSupportDropdownOpen);
    setIsShopDropdownOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false); // Close mobile menu when opening search bar
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
          <div className="dropdown">
            <a
              href="#support"
              className={`customer-nav-link ${isSupportDropdownOpen ? 'active' : ''}`}
              onClick={toggleSupportDropdown}
            >
              Support
              <IconChevronDown size={16} className={`dropdown-icon ${isSupportDropdownOpen ? 'open' : ''}`} />
            </a>
            <div className={`dropdown-menu ${isSupportDropdownOpen ? 'open' : ''}`}>
              <a href="#get-help" className="dropdown-item" onClick={handleGetHelpClick}>Get Help</a>
              <a href="#vero-store-support" className="dropdown-item" onClick={handleVeroStoreSupportClick}>Vero Store Support</a>
            </div>
          </div>
        </nav>
        <div className="customer-auth-section">
          <a href="#search" className="customer-search-icon" onClick={(e) => { e.preventDefault(); toggleSearch(); }}>
            <IconSearch size={24} />
          </a>
          <a href="#cart" className="customer-cart-icon" onClick={(e) => { e.preventDefault(); onCartClick(); }}>
            <FaShoppingBag />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </a>
          <a href="#login" className="customer-login-button" onClick={handleLoginClick}>
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
          <div className="mobile-dropdown">
            <a
              href="#shop"
              className={`customer-nav-link ${isShopDropdownOpen ? 'active' : ''}`}
              onClick={toggleShopDropdown}
            >
              SHOP
              <IconChevronDown size={18} className={`dropdown-icon ${isShopDropdownOpen ? 'open' : ''}`} />
            </a>
            <div className={`mobile-dropdown-menu ${isShopDropdownOpen ? 'open' : ''}`}>
              <a href="#gaming-mouse" className="mobile-dropdown-item" onClick={(e) => { handleGamingMouseClick(e); toggleMenu(); }}>Gaming Mouse</a>
              <a href="#wired-wireless-mouse" className="mobile-dropdown-item" onClick={(e) => { handleWiredWirelessMouseClick(e); toggleMenu(); }}>Wired & Wireless Mouse</a>
              <a href="#office-mouse" className="mobile-dropdown-item" onClick={(e) => { handleOfficeMouseClick(e); toggleMenu(); }}>Office Mouse</a>
            </div>
          </div>
          <a href="#start-selling" className="customer-nav-link" onClick={(e) => { handleStartSellingClick(e); toggleMenu(); }}>START SELLING</a>
          <a href="#about" className="customer-nav-link" onClick={(e) => { handleAboutClick(e); toggleMenu(); }}>ABOUT</a>
          <div className="mobile-dropdown">
            <a
              href="#support"
              className={`customer-nav-link ${isSupportDropdownOpen ? 'active' : ''}`}
              onClick={toggleSupportDropdown}
            >
              SUPPORT
              <IconChevronDown size={18} className={`dropdown-icon ${isSupportDropdownOpen ? 'open' : ''}`} />
            </a>
            <div className={`mobile-dropdown-menu ${isSupportDropdownOpen ? 'open' : ''}`}>
              <a href="#get-help" className="mobile-dropdown-item" onClick={(e) => { handleGetHelpClick(e); toggleMenu(); }}>Get Help</a>
              <a href="#vero-store-support" className="mobile-dropdown-item" onClick={(e) => { handleVeroStoreSupportClick(e); toggleMenu(); }}>Vero Store Support</a>
            </div>
          </div>
          <a href="#login" className="customer-nav-link" onClick={(e) => { handleLoginClick(e); toggleMenu(); }}>LOGIN</a>
        </nav>
      </div>

      {/* Render the Search component */}
      <Search isOpen={isSearchOpen} onClose={toggleSearch} />
    </header>
  );
}

export default CustomerNavbar;