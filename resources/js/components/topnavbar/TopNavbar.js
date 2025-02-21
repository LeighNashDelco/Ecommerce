import React, { useState } from "react";
import "./../../../sass/components/_topnavbar.scss";

const TopNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="top-navbar">
      <div className="profile" onClick={toggleDropdown}>
        <img
          src="https://via.placeholder.com/40" // Replace with actual profile image URL
          alt="Profile"
          className="profile-img"
        />
        {dropdownOpen && (
          <div className="dropdown-menu">
            <ul>
              <li>Profile Settings</li>
              <li>Logout</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNavbar;