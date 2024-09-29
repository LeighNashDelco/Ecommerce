import React from "react";
import { useNavigate } from "react-router-dom";

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
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Home Page</h2>
      {/* Navigation buttons */}
      <button onClick={() => goToPage("/about-us")}>Go to About Us</button>
      <button onClick={() => goToPage("/contact-us")}>Go to Contact Us</button>
      <button onClick={() => goToPage("/home")}>Go to Home</button> {/* This stays on Home */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleLogout}>Logout</button> {/* Logout button */}
      </div>
    </div>
  );
}
