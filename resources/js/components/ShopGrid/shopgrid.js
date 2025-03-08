import React, { useState } from 'react';
import './../../../sass/components/shopgrid.scss';
import mouse1 from "../../../../resources/sass/img/ATKA2.svg";
import mouse2 from "../../../../resources/sass/img/ATKBLACK.svg";
import mouse3 from "../../../../resources/sass/img/ATKCOLOR.svg";
import mouse4 from "../../../../resources/sass/img/ATKG2.svg";
import mouse5 from "../../../../resources/sass/img/ATKWHITE.svg";
import mouse6 from "../../../../resources/sass/img/ATKX5.svg";
import mouse7 from "../../../../resources/sass/img/ht.svg";
import mouse8 from "../../../../resources/sass/img/slimblack.svg";
import mouse9 from "../../../../resources/sass/img/yellow.svg";
import mouse10 from "../../../../resources/sass/img/redrazer.svg";
import mouse11 from "../../../../resources/sass/img/yellow.svg";
import mouse12 from "../../../../resources/sass/img/green.svg";
import mouse13 from "../../../../resources/sass/img/ATKA2.svg";
import mouse14 from "../../../../resources/sass/img/ATKBLACK.svg";
import mouse15 from "../../../../resources/sass/img/ATKX5.svg";
import mouse16 from "../../../../resources/sass/img/ATKA2.svg";
import mouse17 from "../../../../resources/sass/img/ATKBLACK.svg";
import mouse18 from "../../../../resources/sass/img/ATKCOLOR.svg";
import mouse19 from "../../../../resources/sass/img/ATKG2.svg";
import mouse20 from "../../../../resources/sass/img/ATKWHITE.svg";
import mouse21 from "../../../../resources/sass/img/ATKX5.svg";
import mouse22 from "../../../../resources/sass/img/ht.svg";
import mouse23 from "../../../../resources/sass/img/slimblack.svg";
import mouse24 from "../../../../resources/sass/img/yellow.svg";
import mouse25 from "../../../../resources/sass/img/redrazer.svg";
import mouse26 from "../../../../resources/sass/img/yellow.svg";
import mouse27 from "../../../../resources/sass/img/green.svg";
import mouse28 from "../../../../resources/sass/img/ATKA2.svg";
import mouse29 from "../../../../resources/sass/img/ATKX5.svg";
import mouse30 from "../../../../resources/sass/img/ATKCOLOR.svg";

const StarRating = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (star) => {
    setHoverRating(star);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (star) => {
    if (onRatingChange) {
      onRatingChange(star);
    }
  };

  return (
    <div className="shop-grid-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

function ShopGrid() {
  const allProducts = [
    { id: 1, img: mouse1, name: "Attack Shark X3", price: "₱2,000", rating: 5 },
    { id: 2, img: mouse2, name: "Attack Shark X3", price: "₱2,000", rating: 5 },
    { id: 3, img: mouse3, name: "Attack Shark X3", price: "₱2,000", rating: 5 },
    { id: 4, img: mouse4, name: "Attack Shark X3", price: "₱2,000", rating: 5 },
    { id: 5, img: mouse5, name: "Attack Shark X3", price: "₱2,000", rating: 5 },
    { id: 6, img: mouse6, name: "Attack Shark X3", price: "₱2,000", rating: 5 },
    { id: 7, img: mouse7, name: "Attack Shark X3", price: "₱2,000", rating: 5 },
    { id: 8, img: mouse8, name: "Attack Shark X3", price: "₱2,000", rating: 5 },
    { id: 9, img: mouse9, name: "Attack Shark X3", price: "₱2,000", rating: 5 },
    { id: 10, img: mouse10, name: "Attack Shark X3", price: "₱2,000", rating: 5 },
    { id: 11, img: mouse11, name: "Attack Shark X3", price: "₱2,000", rating: 5 },
    { id: 12, img: mouse12, name: "Attack Shark X3", price: "₱2,000", rating: 5 },
    { id: 13, img: mouse13, name: "Attack Shark X3", price: "₱2,000", rating: 5 },
    { id: 14, img: mouse14, name: "Attack Shark X3", price: "₱2,000", rating: 5 },
    { id: 15, img: mouse15, name: "Attack Shark X3", price: "₱2,000", rating: 5 },
    { id: 16, img: mouse16, name: "Blaze Mouse Pro", price: "₱2,200", rating: 4 },
    { id: 17, img: mouse17, name: "Thunder Mouse Elite", price: "₱2,300", rating: 4 },
    { id: 18, img: mouse18, name: "Shadow Mouse X1", price: "₱2,100", rating: 5 },
    { id: 19, img: mouse19, name: "Fire Mouse G2", price: "₱2,400", rating: 3 },
    { id: 20, img: mouse20, name: "Ice Mouse V3", price: "₱2,250", rating: 4 },
    { id: 21, img: mouse21, name: "Storm Mouse R5", price: "₱2,500", rating: 5 },
    { id: 22, img: mouse22, name: "Nova Mouse Z", price: "₱2,150", rating: 4 },
    { id: 23, img: mouse23, name: "Eclipse Mouse T3", price: "₱2,300", rating: 3 },
    { id: 24, img: mouse24, name: "Aurora Mouse Q4", price: "₱2,200", rating: 5 },
    { id: 25, img: mouse25, name: "Phantom Mouse S2", price: "₱2,450", rating: 4 },
    { id: 26, img: mouse26, name: "Lunar Mouse P1", price: "₱2,150", rating: 4 },
    { id: 27, img: mouse27, name: "Solar Mouse K7", price: "₱2,300", rating: 5 },
    { id: 28, img: mouse28, name: "Titan Mouse X5", price: "₱2,600", rating: 4 },
    { id: 29, img: mouse29, name: "Cosmo Mouse Y3", price: "₱2,200", rating: 3 },
    { id: 30, img: mouse30, name: "Galaxy Mouse R9", price: "₱2,500", rating: 5 },
  ];

  const [visibleCount, setVisibleCount] = useState(15);
  const [sortBy, setSortBy] = useState('newest');

  const handleRatingChange = (productId, newRating) => {
    console.log(`Product ${productId} rated ${newRating}`);
  };

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 15);
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (productId) => {
    console.log(`Product image clicked - Product ID: ${productId}`);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    // Add sorting logic here if needed
  };

  // Calculate the number of products currently displayed
  const displayedProductsCount = Math.min(allProducts.length, visibleCount);

  return (
    <div className="shop-grid-wrapper">
      <div className="shop-grid-container">
        <div className="shop-grid-header">
          <div className="available-products">
            Available Products: {displayedProductsCount}
          </div>
          <div className="sort-view-container">
            <div>
              <label>Sort by</label>
              <select value={sortBy} onChange={handleSortChange}>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>
        <div className="shop-grid-products">
          {allProducts.slice(0, visibleCount).map((product) => (
            <div className="shop-grid-card" key={product.id}>
              <a href="#" onClick={() => handleProductClick(product.id)} className="product-link">
                <img src={product.img} alt={`Mouse ${product.id}`} className="product-image" />
              </a>
              <div className="shop-grid-info">
                <StarRating
                  rating={product.rating}
                  onRatingChange={(newRating) => handleRatingChange(product.id, newRating)}
                />
                <h3>{product.name}</h3>
                <p>{product.price}</p>
                <button className="shop-grid-add-to-cart">Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {visibleCount < allProducts.length && (
        <button className="shop-grid-show-more" onClick={handleShowMore}>
          Show more
        </button>
      )}
      {visibleCount > 15 && (
        <button className="shop-grid-back-to-top" onClick={handleBackToTop}>
          <span className="arrow">↑</span> Top
        </button>
      )}
    </div>
  );
}

export default ShopGrid;