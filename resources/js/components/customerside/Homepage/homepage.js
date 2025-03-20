import React, { useState, useEffect } from 'react';
import { message } from 'antd'; // Import Ant Design message
import './../../../../sass/components/homepage.scss';
import heroImage from '../../../../../resources/sass/img/heroimg.svg';
import LoggedinCustomerTopNavBar from "../Customer/topnav_login"; 
import LogoSlider from "../logos/logo_slider";
import Footer from "../footer/footer";
import OrdersCart from "../CartModals/orders_cart";

function Homepage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [profileId, setProfileId] = useState(null); // Added for cart functionality
  const productsPerPage = 15;

  const getAuthHeaders = () => {
    const token = localStorage.getItem('LaravelPassportToken');
    return token ? {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    } : { 'Content-Type': 'application/json' };
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProfileAndProducts = async () => {
      try {
        // Fetch profile ID
        const token = localStorage.getItem('LaravelPassportToken');
        if (token) {
          const userResponse = await fetch('http://127.0.0.1:8000/api/user-profile', {
            headers: getAuthHeaders(),
          });
          if (!userResponse.ok) throw new Error('Failed to fetch user profile');
          const userData = await userResponse.json();
          const profileResponse = await fetch(`http://127.0.0.1:8000/api/profiles/user/${userData.user.id}`, {
            headers: getAuthHeaders(),
          });
          if (!profileResponse.ok) throw new Error('Failed to fetch profile ID');
          const profileData = await profileResponse.json();
          if (isMounted) setProfileId(profileData.id);
        }

        // Fetch products
        const response = await fetch('http://127.0.0.1:8000/api/shop-products', {
          headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (isMounted) {
          setProducts(Array.isArray(result.data) ? result.data : []);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (isMounted) {
          setProducts([]);
          setLoading(false);
          message.error({
            content: 'Failed to load products. Please try again.',
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

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const handleAddToCart = async (productId) => {
    if (!profileId) {
      message.error({
        content: 'Please log in to add items to your cart.',
        style: { marginTop: '20px' },
      });
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
        content: `Failed to add item to cart: ${error.message}`,
        style: { marginTop: '20px' },
      });
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const ProductGrid = () => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = Array.isArray(products) ? products.slice(indexOfFirstProduct, indexOfLastProduct) : [];
    const totalPages = Math.ceil(products.length / productsPerPage) || 1;

    return (
      <div className="product-grid">
        <h2>Top Rated Products</h2>
        <div className="products-container">
          {loading ? (
            Array.from({ length: productsPerPage }).map((_, index) => (
              <div key={index} className="product-card skeleton">
                <div className="skeleton-image">
                  <svg
                    viewBox="0 0 16 20"
                    fill="#e5e7eb"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="skeleton-icon"
                  >
                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                  </svg>
                </div>
                <div className="product-info">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-price"></div>
                  <div className="skeleton-button"></div>
                </div>
              </div>
            ))
          ) : currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div key={product.id} className="product-card">
                {product.product_img ? (
                  <img 
                    src={`http://127.0.0.1:8000/${product.product_img}`} 
                    alt={product.product_name} 
                    className="product-img"
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                <div className="product-info">
                  <h3 data-long-name={product.product_name.length > 20 ? "true" : "false"}>
                    {product.product_name}
                  </h3>
                  <p>₱{parseFloat(product.price).toFixed(2)}</p> {/* Updated to ₱ */}
                  <button className="add-to-cart" onClick={() => handleAddToCart(product.id)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">No products available</div>
          )}
        </div>
        {!loading && totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-arrow"
            >
              &lt; {/* Fixed HTML entity */}
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-arrow"
            >
              &gt; {/* Fixed HTML entity */}
            </button>
          </div>
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
              <button className="add-to-cart-text" onClick={() => handleAddToCart(1)}> {/* Assuming product ID 1 */}
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