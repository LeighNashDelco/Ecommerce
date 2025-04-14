import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import './../../../../sass/components/shopgrid.scss';
import OrdersCart from "../CartModals/orders_cart";
import { IconStar } from '@tabler/icons-react';
import { debounce } from 'lodash';

const renderStars = (rating) => {
  const totalStars = 5;
  const parsedRating = parseFloat(rating) || 0;
  const filledStars = Math.min(Math.max(Math.round(parsedRating), 0), 5);
  return (
    <div className="shop-grid-stars">
      {Array(filledStars).fill().map((_, i) => (
        <IconStar key={`filled-${i}`} size={16} fill="#ff0000" color="#ff0000" />
      ))}
      {Array(totalStars - filledStars).fill().map((_, i) => (
        <IconStar key={`empty-${i}`} size={16} fill="none" color="#ccc" />
      ))}
    </div>
  );
};

const ShopGrid = ({ products = [], ratings = {}, loading, profileId, fetchReviews, cartCount, setCartCount }) => {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(15);
  const [sortBy, setSortBy] = useState('newest');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('LaravelPassportToken');
    return token ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } : { 'Content-Type': 'application/json' };
  };

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('LaravelPassportToken');
      if (!token) return;
      const response = await fetch('http://127.0.0.1:8000/api/cart/count', { headers: getAuthHeaders() });
      const data = await response.json();
      if (response.ok) {
        setCartCount(data.count || 0);
      } else if (response.status === 401) {
        message.error('Session expired. Please log in again.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const sortedProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
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
    }
    return sorted;
  }, [products, sortBy]);

  useEffect(() => {
    fetchCartCount();
  }, []);

  const handleShowMore = debounce(async () => {
    const newVisibleCount = visibleCount + 5;
    const newProductIds = sortedProducts.slice(visibleCount, newVisibleCount).map(p => p.id);
    if (newProductIds.length > 0) {
      await fetchReviews(newProductIds);
    }
    setVisibleCount(newVisibleCount);
  }, 300);

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
      await fetchCartCount();
      message.success({ content: 'Item added to cart!', style: { marginTop: '20px' } });
    } catch (error) {
      message.error({ content: `Failed to add item to cart: ${error.message}`, style: { marginTop: '20px' } });
    }
  };

  if (loading) {
    return (
      <div className="shop-grid-wrapper">
        <div className="shop-grid-container">
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
          <span className="available-products">Products: {sortedProducts.length}</span>
          <div className="sort-view-container">
            <label htmlFor="sort-select">Sort by</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
            >
              <option value="newest">Newest</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
            </select>
          </div>
        </div>
        <div className="shop-grid-products">
          {sortedProducts.slice(0, visibleCount).map((product) => (
            <div className="shop-grid-card" key={product.id}>
              <Link to={`/shop/product/${product.id}`} className="product-link">
                {product.product_img ? (
                  <div className="product-image-container">
                    <img
                      src={product.product_img}
                      alt={product.product_name}
                      className="product-image"
                      onError={(e) => (e.target.src = '/fallback-image.png')}
                    />
                  </div>
                ) : (
                  <div className="no-image-placeholder">
                    <span>No Image</span>
                  </div>
                )}
              </Link>
              <div className="shop-grid-info">
                {renderStars(ratings[product.id] || 0)}
                <h3 className="product-name">{product.product_name}</h3>
                <p className="product-price">
                  ₱{parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <button
                  className="shop-grid-add-to-cart"
                  onClick={() => handleAddToCart(product.id)}
                  aria-label={`Add ${product.product_name} to cart`}
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
        {visibleCount < sortedProducts.length && (
          <button
            className="shop-grid-show-more"
            onClick={handleShowMore}
            aria-label="Show more products"
          >
            Show more
          </button>
        )}
        {visibleCount > 15 && (
          <button
            className="shop-grid-back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
          >
            <span className="arrow">↑</span> Top
          </button>
        )}
      </div>
      <OrdersCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} profileId={profileId} />
    </div>
  );
};

export default ShopGrid;