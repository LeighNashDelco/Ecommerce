import React from 'react';
import './../../../sass/components/filter_sidebar.scss';

const FilterSidebar = ({ filters, handleCheckboxChange, handleBrandChange, handlePriceChange, clearFilters }) => {
  return (
    <div className="shop-filter">
      <div className="shop-filter-content">
        <div className="shop-filter-section">
          <div className="shop-filter-section-title">PRODUCT CATEGORIES</div>
          <div className="shop-filter-categories">
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
        <div className="shop-filter-section">
          <div className="shop-filter-section-title">PRICE RANGE</div>
          <div className="shop-filter-price-range">
            <div className="price-range-text">$ {filters.priceRange[0]} - $ {filters.priceRange[1]}</div>
            <input
              type="range"
              min="10"
              max="80"
              value={filters.priceRange.join(',')}
              onChange={handlePriceChange}
              step="1" // Allows increments of 1
            />
          </div>
        </div>
        <div className="shop-filter-section">
          <div className="shop-filter-section-title">BRANDS</div>
          <div className="shop-filter-categories">
            <div className="shop-filter-category">
              <input
                type="checkbox"
                id="attackShark"
                checked={filters.brands.attackShark}
                onChange={() => handleBrandChange('attackShark')}
              />
              <span className="shop-filter-checkbox"></span>
              <span className="category-text">Attack Shark</span>
            </div>
            <div className="shop-filter-category">
              <input
                type="checkbox"
                id="razer"
                checked={filters.brands.razer}
                onChange={() => handleBrandChange('razer')}
              />
              <span className="shop-filter-checkbox"></span>
              <span className="category-text">Razer</span>
            </div>
            <div className="shop-filter-category">
              <input
                type="checkbox"
                id="logitech"
                checked={filters.brands.logitech}
                onChange={() => handleBrandChange('logitech')}
              />
              <span className="shop-filter-checkbox"></span>
              <span className="category-text">Logitech</span>
            </div>
            <div className="shop-filter-category">
              <input
                type="checkbox"
                id="hitscan"
                checked={filters.brands.hitscan}
                onChange={() => handleBrandChange('hitscan')}
              />
              <span className="shop-filter-checkbox"></span>
              <span className="category-text">Hitscan</span>
            </div>
            <div className="shop-filter-category">
              <input
                type="checkbox"
                id="vxe"
                checked={filters.brands.vxe}
                onChange={() => handleBrandChange('vxe')}
              />
              <span className="shop-filter-checkbox"></span>
              <span className="category-text">Vxe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;