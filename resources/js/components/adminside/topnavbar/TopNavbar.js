import React, { useState, useEffect, useRef } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../../../../sass/components/_topnavbar.scss";

const TopNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileImg, setProfileImg] = useState("default-profile.png");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileImage = async () => {
      const token = localStorage.getItem("LaravelPassportToken");
      if (!token) {
        console.error("No token found, user is not authenticated.");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/user-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfileImg(response.data.profile?.profile_img || "default-profile.png");
      } catch (error) {
        console.error("Error fetching profile image:", error.response?.data || error.message);
      }
    };

    fetchProfileImage();
  }, []);

  const toggleDropdown = () => {
    console.log("Toggling dropdown:", !isDropdownOpen);
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        console.log("Clicked outside, closing dropdown");
        setIsDropdownOpen(false);
      }
      console.log("Dropdown Ref:", dropdownRef.current); // Debug the DOM structure
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileSettings = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
  };

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
        <img
          src={profileImg}
          alt="Profile"
          className="profile-icon"
          onError={(e) => (e.target.src = "default-profile.png")}
        />
        <div
          className={`dropdown-toggle ${isDropdownOpen ? "open" : ""}`}
          ref={dropdownRef}
          onClick={toggleDropdown}
        >
          <FaCaretDown className="dropdown-icon" />
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <ul>
                <li onClick={handleProfileSettings}>Profile Settings</li>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;