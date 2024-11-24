import React, { useState } from "react";
import "../../sass/components/TopNavbar.scss";
import { FaUserCircle, FaCaretDown, FaSearch } from "react-icons/fa"; // Profile and Dropdown icons
import { FaPaperPlane, FaBell, FaBars, FaSun, FaMoon } from "react-icons/fa"; // Add FaBars for the mobile menu toggle
import Sidebar from "../components/Sidebar"; // Import Sidebar component

const TopNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // State for light/dark mode
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // State for sidebar visibility

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Placeholder for future theme logic
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible); // Toggle sidebar visibility
  };

  return (
    <div className={`top-navbar ${isSidebarVisible ? "sidebar-visible" : ""}`}>
      {/* Sidebar Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars size={24} /> {/* Using FaBars as the hamburger menu icon */}
      </button>

      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarVisible} />

      {/* Search Bar */}
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>

      {/* Profile and Icons */}
      <div className="profile">
        {/* Light/Dark Mode Toggle */}
        <div className="light-dark-toggle" onClick={toggleTheme}>
          <div className={`switch ${isDarkMode ? "on" : "off"}`}>
            <div className="toggle"></div>
          </div>
        </div>

        {/* Message Icon */}
        <FaPaperPlane className="message-icon" />

        {/* Notification Icon */}
        <FaBell className="notification-icon" />

        {/* Separator */}
        <div className="icon-separator"></div>

        {/* Profile Icon and Dropdown */}
        <FaUserCircle className="profile-icon" onClick={toggleDropdown} />
        <FaCaretDown className="dropdown-icon" onClick={toggleDropdown} />

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <ul>
              <li>Profile</li>
              <li>Settings</li>
              <li>Logout</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNavbar;
