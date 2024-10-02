import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUserGraduate, FaEnvelope, FaSignOutAlt, FaBars } from "react-icons/fa"; // Importing icons
import "../../../sass/components/_home.scss"; // Import the SCSS file for Home styles

// Logo URL imported from _urls.scss
const logoUrl = 'https://cdn.discordapp.com/attachments/725332328494399539/1290644340326010910/logo_1.png?ex=66fd35b5&is=66fbe435&hm=58a50ad98cb5874b4688b24469ff66749587c4e5fbb6fc492367c72f92c519e4&';

const LoadingScreen = () => (
  <div className="loading-screen">
    <img src={logoUrl} alt="Logo" className="loading-logo" />
    <div className="loader">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  </div>
);

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // State to manage loading screen visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for toggling sidebar

  // Function to handle navigation to other pages
  const goToPage = (path) => {
    setLoading(true); // Show loading screen
    setTimeout(() => {
      navigate(path); // Navigate after a short delay to simulate loading
      setLoading(false); // Hide loading screen
    }, 1000); // Adjust the timeout as needed
  };

  // Function to handle logout
  const handleLogout = () => {
    setLoading(true); // Show loading screen
    setTimeout(() => {
      navigate("/"); // Navigate back to the Login page
      setLoading(false); // Hide loading screen
    }, 1000); // Adjust the timeout as needed
  };

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="home-container">
      {loading && <LoadingScreen />} {/* Show loading screen if loading is true */}
      {isSidebarOpen && (
        <div className="sidebar">
          <img src={logoUrl} alt="Logo" className="logo" />
          <nav className="navbar nav-wrapper">
            <ul className="sidebar-menu navbar-nav">
              <li className="nav-item">
                <a onClick={() => goToPage("/enrollment")} className="nav-link">
                  <FaUserGraduate />
                  <span className="nav-text">ENROLLMENT</span>
                </a>
              </li>
              <li className="nav-item">
                <a onClick={() => goToPage("/contact-us")} className="nav-link">
                  <FaEnvelope />
                  <span className="nav-text">CONTACT US</span>
                </a>
              </li>
              <li className="nav-item">
                <a onClick={() => goToPage("/about-us")} className="nav-link">
                  <FaHome />
                  <span className="nav-text">ABOUT US</span>
                </a>
              </li>
              <li className="nav-item">
                <a onClick={handleLogout} className="nav-link">
                  <FaSignOutAlt />
                  <span className="nav-text">LOGOUT</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
      <div className="main-content">
        <nav className="top-navbar">
          <button className="toggle-button" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <h2>Welcome to Saturnino College Admin</h2>
        </nav>
        <div className="home-content">
          {/* Additional content can go here */}
        </div>
      </div>
    </div>
  );
}
