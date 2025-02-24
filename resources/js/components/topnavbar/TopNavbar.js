import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaCaretDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./../../../sass/components/_topnavbar.scss";

const TopNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    console.log("🔹 Logging out...");
    localStorage.clear();
    sessionStorage.clear();

    setIsDropdownOpen(false);

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 200);
  };

  return (
    <div className="top-navbar">
      <div className="profile">
        {/* Profile Icon (NOT Clickable) */}
        <FaUserCircle className="profile-icon" />

        {/* Dropdown Button (ONLY Clickable Element) */}
        <FaCaretDown className="dropdown-button" onClick={toggleDropdown} ref={dropdownRef} />

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <ul>
              <li>Profile Settings</li>
              <li onClick={handleLogout}>Logout</li> {/* ✅ Now working */}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNavbar;
