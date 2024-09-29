import React from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navs"; // Assuming Navs.js manages navigation links/buttons

export default function AboutUs() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logic for logging out, such as clearing authentication data
    navigate("/"); // Redirect to the Login page
  };

  return (
    <div className="about-us" style={{ padding: "20px", textAlign: "center" }}>
      <Navigation /> {/* Navigation component for navigating between pages */}
      <h1>About Us</h1>
      <p>We are dedicated to providing the best service possible.</p>
      {/* Add additional information about your service or organization here */}

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleLogout}>Logout</button> {/* Logout button */}
      </div>
    </div>
  );
}
