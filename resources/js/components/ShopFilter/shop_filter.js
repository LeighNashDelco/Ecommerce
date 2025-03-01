import React, { useState } from 'react';
import './../../../sass/components/shop_filter.scss';

function ShopFilter() {
  const [filters, setFilters] = useState({
    allMouse: true,
    gamingMouse: false,
    wiredWirelessMouse: false,
    officeMouse: false,
  });

  const handleCheckboxChange = (filterName) => {
    setFilters((prevFilters) => {
      if (filterName === 'allMouse') {
        return {
          allMouse: true,
          gamingMouse: false,
          wiredWirelessMouse: false,
          officeMouse: false,
        };
      } else {
        return {
          ...prevFilters,
          allMouse: false,
          [filterName]: !prevFilters[filterName],
        };
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      allMouse: true,
      gamingMouse: false,
      wiredWirelessMouse: false,
      officeMouse: false,
    });
  };

  return (
    <div className="shop-filter">
      <div className="shop-filter-header">
        <div className="filter-title">
          <h2>Filters</h2>
          <a href="#" className="shop-filter-clear" onClick={(e) => { e.preventDefault(); clearFilters(); }}>
            Clear filters
          </a>
        </div>
      </div>
      <div className="shop-filter-content">
        <div className="shop-filter-section-title">Categories</div>
        <div className="shop-filter-categories">
          <div className="shop-filter-category">
            <input
              type="checkbox"
              id="allMouse"
              checked={filters.allMouse}
              onChange={() => handleCheckboxChange('allMouse')}
            />
            <span className="shop-filter-checkbox"></span>
            <span className="category-text">All Mouse</span>
          </div>
          <div className="shop-filter-category">
            <input
              type="checkbox"
              id="gamingMouse"
              checked={filters.gamingMouse}
              onChange={() => handleCheckboxChange('gamingMouse')}
            />
            <span className="shop-filter-checkbox"></span>
            <span className="category-text">Gaming Mouse</span>
          </div>
          <div className="shop-filter-category">
            <input
              type="checkbox"
              id="wiredWirelessMouse"
              checked={filters.wiredWirelessMouse}
              onChange={() => handleCheckboxChange('wiredWirelessMouse')}
            />
            <span className="shop-filter-checkbox"></span>
            <span className="multi-line-text category-text">Wired &<br />Wireless Mouse</span>
          </div>
          <div className="shop-filter-category">
            <input
              type="checkbox"
              id="officeMouse"
              checked={filters.officeMouse}
              onChange={() => handleCheckboxChange('officeMouse')}
            />
            <span className="shop-filter-checkbox"></span>
            <span className="category-text">Office Mouse</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopFilter;