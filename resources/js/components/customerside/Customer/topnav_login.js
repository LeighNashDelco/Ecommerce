import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaCaretDown } from 'react-icons/fa';
import { IconSearch, IconMenu2, IconX } from '@tabler/icons-react';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import axios from 'axios';
import "./../../../../sass/components/topnav_login.scss";
import logoImage from "../../../../../resources/sass/img/mainlogo.svg";

function LoggedinCustomerTopNavBar({ onCartClick, cartCount = 0 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImg, setProfileImg] = useState("default-profile.png");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("LaravelPassportToken");
    if (token) {
      setIsLoggedIn(true);
      fetchProfileImage(token);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        console.log("Click outside, closing dropdown");
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProfileImage = async (token) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/user-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileImg(response.data.profile?.profile_img || "default-profile.png");
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = (e) => {
    e.stopPropagation();
    console.log("Clicked dropdown icon, toggling to:", !isDropdownOpen);
    setIsDropdownOpen(prev => !prev);
  };

  // Modified to navigate to /customerprofile
  const handleProfileSettings = () => {
    navigate("/customerprofile");
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    console.log("🔹 Logging out...");
    localStorage.clear();
    sessionStorage.clear();
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 200);
  };

  const navigateAndClose = (path) => (e) => {
    e.preventDefault();
    navigate(path);
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const navLinks = [
    { href: "#home", text: "Home", path: "/" },
    { href: "#shop", text: "Shop", path: "/shop" },
    { href: "#start-selling", text: "Start Selling", path: "/register" },
    { href: "#about", text: "About", path: "/about_us" },
  ];

  const mobileNavLinks = [
    ...navLinks,
    ...(isLoggedIn 
      ? [
          { href: "#profile", text: "PROFILE", path: "/customerprofile" }, // Updated this too for consistency
          { href: "#logout", text: "LOGOUT", onClick: handleLogout }
        ]
      : [{ href: "#login", text: "LOGIN", path: "/login" }])
  ];

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
          {navLinks.map(link => (
            <a 
              key={link.href}
              href={link.href} 
              className="customer-nav-link" 
              onClick={navigateAndClose(link.path)}
            >
              {link.text}
            </a>
          ))}
        </nav>

        <div className="customer-auth-section">
          <a href="#search" className="customer-search-icon" onClick={(e) => e.preventDefault()}>
            <IconSearch size={24} />
          </a>
          
          <a 
            href="#cart" 
            className="customer-cart-icon" 
            onClick={(e) => { e.preventDefault(); onCartClick(); }}
          >
            <FaShoppingBag />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </a>

          {isLoggedIn ? (
            <div className="profile-circle" ref={dropdownRef}>
              <img
                src={profileImg}
                alt="Profile"
                className="profile-icon"
                onError={(e) => (e.target.src = "default-profile.png")}
              />
              <div className="dropdown-toggle">
                <FaCaretDown 
                  className="dropdown-icon" 
                  onClick={toggleDropdown}
                  aria-label="Toggle profile menu"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === "Enter" && toggleDropdown()}
                />
                {isDropdownOpen && (
                  <div className={`dropdown-menu ${isDropdownOpen ? "open" : ""}`}>
                    <ul>
                      <li onClick={handleProfileSettings} tabIndex={0} onKeyPress={(e) => e.key === "Enter" && handleProfileSettings()}>
                        <UserOutlined className="dropdown-icon-item" />
                        <span>Profile Settings</span>
                      </li>
                      <li onClick={handleLogout} tabIndex={0} onKeyPress={(e) => e.key === "Enter" && handleLogout()}>
                        <LogoutOutlined className="dropdown-icon-item" />
                        <span>Logout</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <a
              href="#login"
              className="customer-login-button"
              onClick={navigateAndClose('/login')}
            >
              Login
            </a>
          )}
        </div>
      </div>

      <div className={`customer-mobile-overlay ${isMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="customer-mobile-exit" onClick={toggleMenu}>
          <IconX size={24} color="#ffffff" />
        </div>
        <nav className="customer-mobile-nav">
          {mobileNavLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="customer-nav-link"
              onClick={link.onClick || navigateAndClose(link.path)}
            >
              {link.text}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default LoggedinCustomerTopNavBar;