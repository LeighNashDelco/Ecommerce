import React, { useState, useEffect } from 'react';
import './../../../sass/components/shop.scss';
import Navbar from "../Customer/topvar_notlogin";
import ShopGrid from "../ShopGrid/shopgrid";
import ShopFilter from "../ShopFilter/shop_filter";
import Footer from "../footer/footer"; // Footer import
import bannerAdPrimary from '../../../../resources/sass/img/banner1.svg';
import bannerAdSecondary from '../../../../resources/sass/img/banner2.svg';

export default function Shop() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerAdImages = [bannerAdPrimary, bannerAdSecondary];

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerAdImages.length);
    }, 5000);

    return () => clearInterval(bannerTimer);
  }, [bannerAdImages.length]);

  return (
    <div className="shop-page-container">
      <Navbar />
      <div className="banner-ad-container">
        <div className="banner-ad-slides">
          {bannerAdImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Banner Ad ${index + 1}`}
              className={`banner-ad-image ${
                index === currentBannerIndex ? 'active' : ''
              }`}
            />
          ))}
        </div>
      </div>
      <div className="shop-content">
        <ShopFilter />
        <ShopGrid />
      </div>
      <Footer />
    </div>
  );
}