import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../sass/components/_home.scss"; // Import the SCSS file for Home styles

export default function Home() {
  const navigate = useNavigate();

  // Function to handle navigation to other pages
  const goToPage = (path) => {
    navigate(path);
  };

  // Function to handle logout
  const handleLogout = () => {
    // Logic for logging out, like clearing authentication data
    navigate("/"); // Navigate back to the Login page
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h2>Welcome to Saturnino College Admin</h2>

        {/* Navigation buttons */}
        <div className="navigation-buttons">
          <button className="nav-btn" onClick={() => goToPage("/about-us")}>
            About Us
          </button>
          <button className="nav-btn" onClick={() => goToPage("/contact-us")}>
            Contact Us
          </button>
          <button className="nav-btn" onClick={() => goToPage("/home")}>
            Home
          </button>
        </div>

        {/* Logout button */}
        <div className="logout-button">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
