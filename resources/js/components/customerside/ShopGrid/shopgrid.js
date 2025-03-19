import React, { useState, useEffect } from 'react';
import './../../../../sass/components/shopgrid.scss';

const StarRating = ({ rating }) => {
  return (
    <div className="shop-grid-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`star ${star <= rating ? 'filled' : ''}`}>
          ★
        </span>
      ))}
    </div>
  );
};

const ShopGrid = ({ products, loading }) => {
  const [visibleCount, setVisibleCount] = useState(15);
  const [sortBy, setSortBy] = useState('newest');
  const [sortedProducts, setSortedProducts] = useState(products);

  useEffect(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'newest':
        sorted.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }
    setSortedProducts(sorted);
  }, [sortBy, products]);

  const handleShowMore = () => setVisibleCount((prev) => prev + 5);
  const handleBackToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const handleProductClick = (productId) => console.log(`Product ID: ${productId} clicked`);
  const handleSortChange = (e) => setSortBy(e.target.value);

  const displayedProductsCount = Math.min(sortedProducts.length, visibleCount);

  if (loading) {
    return (
      <div className="shop-grid-wrapper">
        <div className="shop-grid-container">
          <div className="shop-grid-header">
            <span className="available-products">Available Products: Loading...</span>
            <div className="sort-view-container">
              <label>Sort by</label>
              <select value={sortBy} onChange={handleSortChange} disabled>
                <option value="newest">Newest</option>
                <option value="price-high">High to Low</option>
                <option value="price-low">Low to High</option>
              </select>
            </div>
          </div>
          <div className="shop-grid-products">
            {/* Render 15 skeleton cards to match initial visibleCount */}
            {Array.from({ length: 15 }).map((_, index) => (
              <div className="shop-grid-card skeleton" key={index}>
                <div className="skeleton-image"></div>
                <div className="shop-grid-info">
                  <div className="skeleton-stars"></div>
                  <div className="skeleton-name"></div>
                  <div className="skeleton-price"></div>
                  <div className="skeleton-button"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-grid-wrapper">
      <div className="shop-grid-container">
        <div className="shop-grid-header">
          <span className="available-products">Available Products: {displayedProductsCount}</span>
          <div className="sort-view-container">
            <label>Sort by</label>
            <select value={sortBy} onChange={handleSortChange}>
              <option value="newest">Newest</option>
              <option value="price-high">High to Low</option>
              <option value="price-low">Low to High</option>
            </select>
          </div>
        </div>
        <div className="shop-grid-products">
          {sortedProducts.slice(0, visibleCount).map((product) => (
            <div className="shop-grid-card" key={product.id}>
              <a href="#" onClick={() => handleProductClick(product.id)} className="product-link">
                {product.product_img ? (
                  <img src={product.product_img} alt={product.product_name} className="product-image" />
                ) : (
                  <div className="no-image-placeholder">
                    <span>No Image</span>
                  </div>
                )}
              </a>
              <div className="shop-grid-info">
                <StarRating rating={5} />
                <h3 className="product-name">{product.product_name}</h3>
                <p className="product-price">₱{product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                <button className="shop-grid-add-to-cart">Add to cart</button>
              </div>
            </div>
          ))}
        </div>
        {visibleCount < sortedProducts.length && (
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
    </div>
  );
};

export default ShopGrid;