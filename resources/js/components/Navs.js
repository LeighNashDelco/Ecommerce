import React from "react";
import { Link } from "react-router-dom";

export default function Navs() {
  return (
    <nav>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        <li>
          <Link to="/home">Home</Link> {/* Navigate to Home page */}
        </li>
        <li>
          <Link to="/about-us">About Us</Link> {/* Navigate to About Us page */}
        </li>
        <li>
          <Link to="/contact-us">Contact Us</Link> {/* Navigate to Contact Us page */}
        </li>
      </ul>
    </nav>
  );
}
