import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaCaretDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../../../sass/components/_topnavbar.scss";

const TopNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Handle outside click to close dropdown
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

  const handleLogout = async () => {
    try {
        const token = localStorage.getItem("LaravelPassportToken");
        if (!token) {
            console.error("❌ No token found. Redirecting to login...");
            navigate("/homepage");
            return;
        }

        await axios.post(
            "http://127.0.0.1:8000/api/logout",
            {},
            {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                withCredentials: true, // ✅ Ensure cookies/session data are sent
            }
        );

        console.log("✅ Successfully logged out.");

        localStorage.removeItem("LaravelPassportToken");
        localStorage.removeItem("user");
        sessionStorage.clear();

        navigate("/admindashboard");
    } catch (error) {
        console.error("❌ Logout failed:", error);
        if (error.response) {
            console.error("Server response:", error.response.data);
        }
    }
};



  return (
    <div className="top-navbar">
      <div className="profile">
        {/* Profile Icon */}
        <FaUserCircle className="profile-icon" />

        {/* Dropdown Button */}
        <FaCaretDown className="dropdown-button" onClick={toggleDropdown} ref={dropdownRef} />

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <ul>
              <li>Profile Settings</li>
              <li onClick={handleLogout}>Logout</li> {/* ✅ Logout function updated */}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNavbar;
