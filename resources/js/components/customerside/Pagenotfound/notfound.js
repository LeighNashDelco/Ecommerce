// notfound.js
import React from 'react';
import './../../../../sass/components/notfound.scss';
import illustration from '../../../../../resources/sass/img/notfound.svg'; 
import Navbar from "../../customerside/Customer/topnav_login";
import Footer from "../footer/footer";

function NotFound() {
  return (
    <div className="not-found-page">
      <Navbar />
      <div className="not-found-content">
        <img src={illustration} alt="404 Illustration" className="not-found-illustration" />
        <p className="error-message">Looks like the page you're looking for doesn't exist.</p>
      </div>
      <Footer />
    </div>
  );
}

export default NotFound;