import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import './../../../../sass/components/shopgrid.scss';
import OrdersCart from "../CartModals/orders_cart";
import { IconStar } from '@tabler/icons-react';

const renderStars = (rating) => {
  const totalStars = 5;
  const parsedRating = parseFloat(rating) || 0;
  const filledStars = Math.min(Math.max(Math.round(parsedRating), 0), 5);
  const emptyStars = totalStars - filledStars;

  return (
    <div className="shop-grid-stars">
      {Array(Math.max(filledStars, 0)).fill().map((_, index) => (
        <IconStar key={`filled-${index}`} size={18} fill="#ff0000" color="#ff0000" />
      ))}
      {Array(Math.max(emptyStars, 0)).fill().map((_, index) => (
        <IconStar key={`empty-${index}`} size={18} fill="none" color="#ccc" />
      ))}
    </div>
  );
};

const ShopGrid = ({ products = [], ratings = {}, loading, profileId, fetchReviews }) => {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(15);
  const [sortBy, setSortBy] = useState('newest');
  const [sortedProducts, setSortedProducts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('LaravelPassportToken');
    return token ? {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    } : { 'Content-Type': 'application/json' };
  };

  useEffect(() => {
    console.log('Ratings in ShopGrid:', ratings);
    if (!Array.isArray(products)) {
      setSortedProducts([]);
      return;
    }
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
  }, [sortBy, products, ratings]);

  const handleShowMore = async () => {
    const newVisibleCount = visibleCount + 5;
    const newProductIds = sortedProducts.slice(visibleCount, newVisibleCount).map(p => p.id);
    if (newProductIds.length > 0) {
      await fetchReviews(newProductIds);
    }
    setVisibleCount(newVisibleCount);
  };

  const handleBackToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const handleSortChange = (e) => setSortBy(e.target.value);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const handleAddToCart = async (productId) => {
    if (!profileId) {
      message.error({ content: 'Please log in to add items to your cart.', style: { marginTop: '20px' } });
      navigate('/login');
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/cart/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ profile_id: profileId, product_id: productId, quantity: 1 }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add to cart');
      setIsCartOpen(true);
      message.success({ content: 'Item added to cart successfully!', style: { marginTop: '20px' } });
    } catch (error) {
      console.error('Error adding to cart:', error);
      message.error({ content: `Failed to add item to cart: ${error.message}`, style: { marginTop: '20px' } });
    }
  };

  if (loading || !Array.isArray(products)) {
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
          <span className="available-products">Available Products: {sortedProducts.length}</span>
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
              <Link to={`/shop/product/${product.id}`} className="product-link">
                {product.product_img ? (
                  <img src={product.product_img} alt={product.product_name} className="product-image" />
                ) : (
                  <div className="no-image-placeholder">
                    <span>No Image</span>
                  </div>
                )}
              </Link>
              <div className="shop-grid-info">
                {renderStars(ratings[product.id] || 0)}
                <h3 className="product-name">{product.product_name}</h3>
                <p className="product-price">₱{parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                <button className="shop-grid-add-to-cart" onClick={() => handleAddToCart(product.id)}>
                  Add to cart
                </button>
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
      <OrdersCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} profileId={profileId} />
    </div>
  );
};

export default ShopGrid;