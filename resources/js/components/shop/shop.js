import React, { useState } from 'react';
import './../../../sass/components/shop.scss';
import Navbar from "../Customer/topvar_notlogin";
import ShopGrid from "../ShopGrid/shopgrid";
import Footer from "../footer/footer";
import FilterSidebar from "../Filter/filter_sidebar"; // Import the new component

export default function Shop() {
  const [filters, setFilters] = useState({
    gamingMouse: false,
    wiredWirelessMouse: false,
    officeMouse: false,
    priceRange: [10, 80], // Updated initial range to 10-80
    brands: {
      attackShark: false,
      razer: false,
      logitech: false,
      hitscan: false,
      vxe: false,
    },
  });

  const handleCheckboxChange = (filterName) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  };

  const handleBrandChange = (brandName) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      brands: {
        ...prevFilters.brands,
        [brandName]: !prevFilters.brands[brandName],
      },
    }));
  };

  const handlePriceChange = (e) => {
    const [min, max] = e.target.value.split(',').map(Number);
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: [min, max],
    }));
  };

  const clearFilters = () => {
    setFilters({
      gamingMouse: false,
      wiredWirelessMouse: false,
      officeMouse: false,
      priceRange: [10, 80], // Reset to initial range
      brands: {
        attackShark: false,
        razer: false,
        logitech: false,
        hitscan: false,
        vxe: false,
      },
    });
  };

  return (
    <div className="shop-page-container">
      <Navbar />
      <div className="shop-content">
        <FilterSidebar
          filters={filters}
          handleCheckboxChange={handleCheckboxChange}
          handleBrandChange={handleBrandChange}
          handlePriceChange={handlePriceChange}
          clearFilters={clearFilters}
        />
        <ShopGrid />
      </div>
      <Footer />
    </div>
  );
}