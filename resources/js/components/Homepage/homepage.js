import React from 'react';
import './../../../sass/components/homepage.scss';
import productImage from '../../../../resources/sass/img/heroimage.svg';
import Navbar from "../Customer/topvar_notlogin";
import LogoSlider from "../logos/logo_slider";
import Footer from "../footer/footer";
import ProductGrid from "../ProductGrid/product_grid";

function Homepage() {
  return (
    <div className="homepage-customer">
      <Navbar />
      <div className="content-wrapper">
        <div className="product-container">
          <div className="product-details">
            <h1 className="product-title">X5 BLACK & WHITE</h1>
            <h2 className="product-subtitle">Attack Shark’s High Performance Wireless Gaming Mouse</h2>
            <p className="product-description">
              Experience unmatched precision with the ultra-lightweight 49g design and tri-mode connectivity for ultimate flexibility. Featuring RGB lighting, 4000 DPI precision, and up to 80 hours of battery life, the X5 is built for peak performance and comfort in every game.
            </p>
            <div className="product-price">₱1,088 PHP</div>
            <div className="product-buttons">
              <button className="add-to-cart-button">Add to Cart</button>
              <button className="show-more-button">Show more</button>
            </div>
          </div>
          <img src={productImage} alt="X5 Black & White Mouse" className="product-image" />
        </div>
        <LogoSlider />
        <div className="product-grid-wrapper">
          <ProductGrid />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Homepage;