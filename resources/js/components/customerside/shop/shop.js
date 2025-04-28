import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import './../../../../sass/components/shop.scss';
import Navbar from "../../customerside/Customer/topnav_login";
import ShopGrid from "../ShopGrid/shopgrid";
import Footer from "../footer/footer";
import FilterSidebar from "../Filter/filter_sidebar";
import OrdersCart from "../CartModals/orders_cart";

export default function Shop() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ categories: {}, brands: {} });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const isMounted = useRef(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('LaravelPassportToken');
    return token ? {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    } : { 'Content-Type': 'application/json' };
  };

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('LaravelPassportToken');
      if (!token || !profileId) {
        setCartCount(0);
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/cart/count', {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cart count');
      }
      const data = await response.json();
      if (data.success) {
        setCartCount(data.count || 0);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    }
  };

  const fetchFast = async (url, options) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
      }
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Non-JSON response from ${url}`);
      }
      return response;
    } catch (error) {
      console.error(`Error fetching ${url}: ${error.message}`);
      return null;
    }
  };

  const fetchReviews = async (productIds) => {
    const ratingsMap = {};
    const promises = productIds.map(async (id) => {
      const response = await fetchFast(`http://127.0.0.1:8000/api/reviews/product/${id}`, { headers: getAuthHeaders() });
      if (response) {
        const data = await response.json();
        ratingsMap[id] = data.success && Array.isArray(data.data) && data.data.length > 0
          ? data.data.reduce((sum, review) => sum + (review.rating || 0), 0) / data.data.length
          : 0;
      } else {
        ratingsMap[id] = 0;
      }
    });
    await Promise.all(promises);

    if (isMounted.current) {
      setRatings(prev => ({ ...prev, ...ratingsMap }));
    }
    return ratingsMap;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let profileIdTemp = null;
        const token = localStorage.getItem('LaravelPassportToken');
        if (token) {
          const userResponse = await fetchFast('http://127.0.0.1:8000/api/user-profile', { headers: getAuthHeaders() });
          if (userResponse) {
            const userData = await userResponse.json();
            if (userData.user?.id) {
              const profileResponse = await fetchFast(`http://127.0.0.1:8000/api/profiles/user/${userData.user.id}`, { headers: getAuthHeaders() });
              if (profileResponse) {
                profileIdTemp = (await profileResponse.json()).id;
              }
            }
          }
        }

        const cachedProducts = localStorage.getItem('shopProducts');
        let productsData = cachedProducts ? JSON.parse(cachedProducts) : null;

        if (!productsData) {
          const productsResponse = await fetchFast('http://127.0.0.1:8000/api/shop-products', { headers: getAuthHeaders() });
          productsData = productsResponse ? await productsResponse.json() : { success: false, data: [] };
          if (isMounted.current) localStorage.setItem('shopProducts', JSON.stringify(productsData));
        }

        const validProducts = productsData.success && Array.isArray(productsData.data) ? productsData.data : [];
        const activeProductIds = validProducts.map(p => p.id);

        if (isMounted.current) {
          setProfileId(profileIdTemp);
          setProducts(validProducts);
          setFilteredProducts(validProducts);

          // Initialize filters based on categories and brands
          const initialFilters = {
            categories: validProducts.reduce((acc, product) => {
              if (product.category_id != null) {
                acc[product.category_id] = false;
              }
              return acc;
            }, {}),
            brands: validProducts.reduce((acc, product) => {
              if (product.brand_id != null) {
                acc[product.brand_id] = false;
              }
              return acc;
            }, {}),
          };
          setFilters(initialFilters);
        }

        if (profileIdTemp) {
          await fetchCartCount();
        }

        const cachedCategories = localStorage.getItem('shopCategories');
        const cachedBrands = localStorage.getItem('shopBrands');

        const fetchSecondaryData = async () => {
          const [categoriesResponse, brandsResponse] = await Promise.all([
            cachedCategories ? null : fetchFast('http://127.0.0.1:8000/api/categories/active', { headers: getAuthHeaders() }),
            cachedBrands ? null : fetchFast('http://127.0.0.1:8000/api/brands', { headers: getAuthHeaders() }),
          ]);

          const categoriesData = cachedCategories ? JSON.parse(cachedCategories) : (categoriesResponse ? await categoriesResponse.json() : { active: [] });
          const brandsData = cachedBrands ? JSON.parse(cachedBrands) : (brandsResponse ? await brandsResponse.json() : []);

          if (isMounted.current) {
            setCategories(categoriesData.active && Array.isArray(categoriesData.active) ? categoriesData.active : []);
            setBrands(Array.isArray(brandsData) ? brandsData : []);
            if (!cachedCategories) localStorage.setItem('shopCategories', JSON.stringify(categoriesData));
            if (!cachedBrands) localStorage.setItem('shopBrands', JSON.stringify(brandsData));
          }

          if (activeProductIds.length > 0) {
            await fetchReviews(activeProductIds);
          } else if (validProducts.length === 0) {
            message.info('No products available to display.');
          }
        };

        fetchSecondaryData();
      } catch (error) {
        console.error('Error fetching shop data:', error.message);
        if (isMounted.current) {
          setProducts([]);
          setFilteredProducts([]);
          setRatings({});
          setCategories([]);
          setBrands([]);
          message.error({
            content: 'Oops! Something went wrong while loading the shop. Please try again.',
            style: { marginTop: '20px' },
          });
        }
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted.current = false;
    };
  }, [navigate]);

  useEffect(() => {
    if (profileId) {
      fetchCartCount();
    }
  }, [profileId, isCartOpen]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const closeCart = () => setIsCartOpen(false);

  return (
    <div className="shop-page-container">
      <Navbar onCartClick={toggleCart} cartCount={cartCount} />
      <div className="shop-content">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          products={products}
          setFilteredProducts={setFilteredProducts}
          categories={categories}
          brands={brands}
        />
        <ShopGrid
          products={filteredProducts}
          ratings={ratings}
          loading={loading}
          profileId={profileId}
          fetchReviews={fetchReviews}
          cartCount={cartCount}
          setCartCount={setCartCount}
          fetchCartCount={fetchCartCount}
        />
      </div>
      <OrdersCart isOpen={isCartOpen} onClose={closeCart} profileId={profileId} />
      <Footer />
    </div>
  );
}