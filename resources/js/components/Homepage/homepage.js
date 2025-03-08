// Homepage.jsx
import React, { useState } from 'react';
import './../../../sass/components/homepage.scss';
import heroImage from '../../../../resources/sass/img/heroimg.svg';
import Navbar from "../Customer/topvar_notlogin";
import LogoSlider from "../logos/logo_slider";
import Footer from "../footer/footer";
import ProductGrid from "../ProductGrid/product_grid";
import OrdersCart from "../CartModals/orders_cart";

function Homepage() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="homepage-customer">
      <Navbar onCartClick={toggleCart} />
      <div className="content-wrapper">
        <div className="hero-section">
          <img src={heroImage} alt="Razer Viper V3 Pro Faker Edition" className="hero-image" />
          <div className="hero-text">
            <h1 className="hero-title">RAZER VIPER V3 PRO FAKER EDITION</h1>
            <div className="hero-buttons">
              <button className="learn-more-text">Learn More </button>
              <button className="add-to-cart-text">Add to cart </button>
            </div>
          </div>
        </div>
        <LogoSlider />
        <div className="video-section">
          <video autoPlay loop muted playsInline className="fullscreen-video">
            <source src="/assets/V3PRO.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="product-grid-wrapper">
          <ProductGrid />
        </div>
      </div>
      <Footer />
      <OrdersCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default Homepage;