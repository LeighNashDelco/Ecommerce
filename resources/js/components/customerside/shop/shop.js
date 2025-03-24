import React, { useState, useEffect } from 'react';
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
  let isMounted = true;

  const getAuthHeaders = () => {
    const token = localStorage.getItem('LaravelPassportToken');
    return token ? {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    } : { 'Content-Type': 'application/json' };
  };

  const fetchFast = async (url, options) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        console.warn(`Failed to fetch ${url}: ${response.status}`);
        return null;
      }
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn(`Non-JSON response from ${url}`);
        return null;
      }
      return response;
    } catch (error) {
      console.warn(`Error fetching ${url}: ${error.message}`);
      return null;
    }
  };

  const fetchReviews = async (productIds) => {
    const ratingsMap = {};
    const cachedRatings = JSON.parse(localStorage.getItem('shopRatings') || '{}');
    
    // Use cached ratings if available
    productIds.forEach(id => {
      if (cachedRatings[id] !== undefined) {
        ratingsMap[id] = cachedRatings[id];
      }
    });

    // Fetch only uncached reviews in parallel
    const uncachedIds = productIds.filter(id => cachedRatings[id] === undefined);
    if (uncachedIds.length > 0) {
      const promises = uncachedIds.map(async (id) => {
        const response = await fetchFast(`http://127.0.0.1:8000/api/reviews/product/${id}`, { headers: getAuthHeaders() });
        if (response) {
          const data = await response.json();
          console.log(`Reviews for product ${id}:`, data);
          ratingsMap[id] = data.success && Array.isArray(data.data) && data.data.length > 0
            ? data.data.reduce((sum, review) => sum + (review.rating || 0), 0) / data.data.length
            : 0;
        } else {
          ratingsMap[id] = 0;
        }
      });
      await Promise.all(promises);
    }

    console.log('Updated Ratings:', ratingsMap);
    if (isMounted) {
      setRatings(prev => ({ ...prev, ...ratingsMap }));
      localStorage.setItem('shopRatings', JSON.stringify({ ...ratings, ...ratingsMap }));
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
            console.log('User Data:', userData);
            if (userData.user?.id) {
              const profileResponse = await fetchFast(`http://127.0.0.1:8000/api/profiles/user/${userData.user.id}`, { headers: getAuthHeaders() });
              if (profileResponse) {
                profileIdTemp = (await profileResponse.json()).id;
                console.log('Profile ID:', profileIdTemp);
              }
            }
          }
        } else {
          console.log('No token found, proceeding as guest');
        }

        // Load cached data or fetch products first (critical path)
        const cachedProducts = localStorage.getItem('shopProducts');
        let productsData = cachedProducts ? JSON.parse(cachedProducts) : null;

        if (!productsData) {
          const productsResponse = await fetchFast('http://127.0.0.1:8000/api/shop-products', { headers: getAuthHeaders() });
          productsData = productsResponse ? await productsResponse.json() : { success: false, data: [] };
          if (isMounted) localStorage.setItem('shopProducts', JSON.stringify(productsData));
        }

        const validProducts = productsData.success && Array.isArray(productsData.data) ? productsData.data : [];
        console.log('Active Products:', validProducts);
        const activeProductIds = validProducts.map(p => p.id);

        if (isMounted) {
          setProfileId(profileIdTemp);
          setProducts(validProducts);
          setFilteredProducts(validProducts);
        }

        // Fetch categories, brands, and reviews in parallel after products
        const cachedCategories = localStorage.getItem('shopCategories');
        const cachedBrands = localStorage.getItem('shopBrands');

        const fetchSecondaryData = async () => {
          const [categoriesResponse, brandsResponse] = await Promise.all([
            cachedCategories ? null : fetchFast('http://127.0.0.1:8000/api/categories/active', { headers: getAuthHeaders() }),
            cachedBrands ? null : fetchFast('http://127.0.0.1:8000/api/brands', { headers: getAuthHeaders() }),
          ]);

          const categoriesData = cachedCategories ? JSON.parse(cachedCategories) : (categoriesResponse ? await categoriesResponse.json() : { active: [] });
          const brandsData = cachedBrands ? JSON.parse(cachedBrands) : (brandsResponse ? await brandsResponse.json() : []);

          if (isMounted) {
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

        fetchSecondaryData(); // Run in background, doesn’t block loading
      } catch (error) {
        console.error('Error fetching shop data:', error.message);
        if (isMounted) {
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
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const closeCart = () => setIsCartOpen(false);

  return (
    <div className="shop-page-container">
      <Navbar onCartClick={toggleCart} />
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
        />
      </div>
      <OrdersCart isOpen={isCartOpen} onClose={closeCart} profileId={profileId} />
      <Footer />
    </div>
  );
}