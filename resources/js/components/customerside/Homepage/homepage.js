import React, { useState, useEffect } from 'react';
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
  const productsPerPage = 15; // 5 columns x 3 rows

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/shop-products');
        const result = await response.json();
        if (isMounted) {
          setProducts(Array.isArray(result.data) ? result.data : []);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        if (isMounted) {
          setProducts([]);
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = Array.isArray(products) ? products.slice(indexOfFirstProduct, indexOfLastProduct) : [];
  const totalPages = Math.ceil(products.length / productsPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const ProductGrid = () => {
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
                  <p>${parseFloat(product.price).toFixed(2)}</p>
                  <button className="add-to-cart">Add to Cart</button>
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
              &lt; {/* Use HTML entity for < */}
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
              &gt; {/* Use HTML entity for > */}
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
              <button className="add-to-cart-text">Add to cart</button>
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
      <OrdersCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default Homepage;