import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";
import Login from "./LoginPage/Login"; // Corrected import path for Login component

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Login is the default route */}
        <Route path="home" element={<Home />} /> {/* Home page after login */}
        <Route path="about-us" element={<AboutUs />} />
        <Route path="contact-us" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}

if (document.getElementById("root")) {
  ReactDOM.render(<Routers />, document.getElementById("root"));
}
