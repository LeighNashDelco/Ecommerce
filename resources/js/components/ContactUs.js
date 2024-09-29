import React from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navs"; // Assuming Navs.js manages navigation links/buttons

export default function ContactUs() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logic for logging out, such as clearing authentication data
    navigate("/"); // Redirect to the Login page
  };

  return (
    <div className="contact-us" style={{ padding: "20px", textAlign: "center" }}>
      <Navigation /> {/* Navigation component for navigating between pages */}
      <h1>Contact Us</h1>
      <p>Feel free to reach out to us for any inquiries.</p>
      {/* Add your contact form or contact details here */}
      
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleLogout}>Logout</button> {/* Logout button */}
      </div>
    </div>
  );
}
