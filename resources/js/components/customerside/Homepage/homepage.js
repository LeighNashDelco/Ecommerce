import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import './../../../../sass/components/homepage.scss';
import heroImage from '../../../../../resources/sass/img/heroimg.svg';
import LoggedinCustomerTopNavBar from "../Customer/topnav_login"; 
import LogoSlider from "../logos/logo_slider";
import Footer from "../footer/footer";
import OrdersCart from "../CartModals/orders_cart";
import { IconStar } from '@tabler/icons-react';

const renderStars = (rating) => {
  const totalStars = 5;
  const parsedRating = parseFloat(rating) || 0;
  const filledStars = Math.min(Math.max(Math.round(parsedRating), 0), 5);
  const emptyStars = totalStars - filledStars;

  return (
    <div className="product-stars">
      {Array(filledStars).fill().map((_, index) => (
        <IconStar key={`filled-${index}`} size={18} fill="#ff0000" color="#ff0000" />
      ))}
      {Array(emptyStars).fill().map((_, index) => (
        <IconStar key={`empty-${index}`} size={18} fill="none" color="#ccc" />
      ))}
    </div>
  );
};

function Homepage() {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(15);
  const [sortBy, setSortBy] = useState('newest');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('LaravelPassportToken');
    return token ? {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    } : { 'Content-Type': 'application/json' };
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    let isMounted = true;

    const fetchProfileAndProducts = async () => {
      try {
        const token = localStorage.getItem('LaravelPassportToken');
        let cachedProfileId = null;
        let cachedProducts = null;
        let cachedRatings = null;

        const cachedUser = localStorage.getItem('user');
        const cachedShopProducts = localStorage.getItem('shopProducts');
        const cachedShopRatings = localStorage.getItem('shopRatings');

        if (token && cachedUser) {
          const userData = JSON.parse(cachedUser);
          const cachedProfile = localStorage.getItem('profileId');
          if (cachedProfile) {
            cachedProfileId = cachedProfile;
          } else {
            let profileResponse;
            let attempts = 0;
            const maxAttempts = 3;

            while (attempts < maxAttempts) {
              profileResponse = await fetch(`http://127.0.0.1:8000/api/profiles/user/${userData.id}`, {
                headers: getAuthHeaders(),
              });

              if (profileResponse.status === 429) {
                attempts++;
                await delay(1000 * attempts);
                continue;
              }

              if (!profileResponse.ok) throw new Error('Failed to fetch profile ID');
              break;
            }

            const profileData = await profileResponse.json();
            cachedProfileId = profileData.id;
            localStorage.setItem('profileId', cachedProfileId);
          }
          if (isMounted) setProfileId(cachedProfileId);
        }

        if (cachedShopProducts && cachedShopRatings) {
          cachedProducts = JSON.parse(cachedShopProducts).data || [];
          cachedRatings = JSON.parse(cachedShopRatings);
        }

        let productsArray = [];
        if (cachedProducts) {
          productsArray = cachedProducts;
        } else {
          const productsResponse = await fetch('http://127.0.0.1:8000/api/shop-products', {
            headers: getAuthHeaders(),
          });
          const productsResult = await productsResponse.json();
          productsArray = Array.isArray(productsResult.data) ? productsResult.data : [];
          localStorage.setItem('shopProducts', JSON.stringify(productsResult));
        }

        const productsWithRatings = [];
        for (const product of productsArray) {
          let averageRating = 0;
          if (cachedRatings && cachedRatings[product.id] !== undefined) {
            averageRating = cachedRatings[product.id];
          } else {
            try {
              const reviewsResponse = await fetch(
                `http://127.0.0.1:8000/api/reviews/product/${product.id}`,
                { headers: getAuthHeaders() }
              );

              if (reviewsResponse.status === 429) {
                await delay(1000);
                continue;
              }

              const reviewsData = await reviewsResponse.json();
              const reviews = Array.isArray(reviewsData) ? reviewsData : reviewsData.data || [];
              averageRating = reviews.length > 0
                ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length
                : 0;

              const updatedRatings = cachedRatings ? { ...cachedRatings } : {};
              updatedRatings[product.id] = averageRating;
              localStorage.setItem('shopRatings', JSON.stringify(updatedRatings));
            } catch (error) {
              console.error(`Error fetching reviews for product ${product.id}:`, error);
              averageRating = 0;
            }
            await delay(100);
          }

          if (averageRating >= 4) {
            productsWithRatings.push({ ...product, averageRating });
          }
        }

        if (isMounted) {
          setProducts(productsWithRatings);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (isMounted) {
          setProducts([]);
          setLoading(false);
          message.error({
            content: 'Failed to load products. Please try again later.',
            style: { marginTop: '20px' },
          });
        }
      }
    };

    fetchProfileAndProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
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
        sorted.sort((a, b) => parseFloat(b.price) - parseFloat(b.price));
        break;
      case 'newest':
        sorted.sort((a, b) => b.id - a.id);
        break;
      default:
        sorted.sort((a, b) => b.averageRating - a.averageRating);
        break;
    }
    setSortedProducts(sorted);
  }, [sortBy, products]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const handleAddToCart = async (productId) => {
    if (!profileId) {
      message.error({
        content: 'Please log in to add items to your cart.',
        style: { marginTop: '20px' },
      });
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/cart/add', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ profile_id: profileId, product_id: productId, quantity: 1 }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add to cart');
      setIsCartOpen(true);
      message.success({
        content: 'Item added to cart successfully!',
        style: { marginTop: '20px' },
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      message.error({
        content: 'Failed to add item to cart. Please try again.',
        style: { marginTop: '20px' },
      });
    }
  };

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  const handleBackToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleSortChange = (e) => setSortBy(e.target.value);

  const ProductGrid = () => {
    return (
      <div className="product-grid">
        <h2 className="product-grid-title">Top Rated Products</h2>
        <div className="product-grid-header">
          <span className="available-products">
            {loading ? 'Available Products: Loading...' : `Available Products: ${sortedProducts.length}`}
          </span>
          <div className="sort-view-container">
            <label>Sort by</label>
            <select value={sortBy} onChange={handleSortChange} disabled={loading}>
              <option value="newest">Newest</option>
              <option value="price-high">High to Low</option>
              <option value="price-low">Low to High</option>
            </select>
          </div>
        </div>
        <div className="products-container">
          {loading ? (
            Array.from({ length: 15 }).map((_, index) => (
              <div key={index} className="product-card skeleton">
                <div className="skeleton-image"></div>
                <div className="product-info">
                  <div className="skeleton-stars"></div>
                  <div className="skeleton-title"></div>
                  <div className="skeleton-price"></div>
                  <div className="skeleton-button"></div>
                </div>
              </div>
            ))
          ) : sortedProducts.length > 0 ? (
            sortedProducts.slice(0, visibleCount).map((product) => (
              <div key={product.id} className="product-card">
                <Link to={`/shop/product/${product.id}`} className="product-link">
                  {product.product_img ? (
                    <img 
                      src={`http://127.0.0.1:8000/${product.product_img}`} 
                      alt={product.product_name} 
                      className="product-img"
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </Link>
                <div className="product-info">
                  {renderStars(product.averageRating)}
                  <h3 className="product-name">{product.product_name}</h3>
                  <p className="product-price">
                    ₱{parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <button className="add-to-cart" onClick={() => handleAddToCart(product.id)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">No top-rated products available</div>
          )}
        </div>
        {visibleCount < sortedProducts.length && !loading && (
          <button className="show-more" onClick={handleShowMore}>
            Show More
          </button>
        )}
        {visibleCount > 15 && !loading && (
          <button className="back-to-top" onClick={handleBackToTop}>
            <span className="arrow">↑</span> Top
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="homepage-customer">
      <LoggedinCustomerTopNavBar onCartClick={toggleCart} />
      <div className="content-wrapper">
        <div className="hero-section">
          <img src={heroImage} alt="Razer Viper V3 Pro Faker Edition" className="hero-image" />
          <div className="hero-text">
            <h1 className="hero-title">RAZER VIPER V3 PRO FAKER EDITION</h1>
            <div className="hero-buttons">
              <button className="learn-more-text">Learn More</button>
              <button className="add-to-cart-text" onClick={() => handleAddToCart(1)}>
                Add to Cart
              </button>
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
      <OrdersCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} profileId={profileId} />
    </div>
  );
}

export default Homepage;