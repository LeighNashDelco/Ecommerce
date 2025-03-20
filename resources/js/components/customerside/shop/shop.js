import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd'; // Import Ant Design message
import './../../../../sass/components/shop.scss';
import Navbar from "../../customerside/Customer/topnav_login";
import ShopGrid from "../ShopGrid/shopgrid";
import Footer from "../footer/footer";
import FilterSidebar from "../Filter/filter_sidebar";
import OrdersCart from "../CartModals/orders_cart";

export default function Shop() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    categories: {},
    brands: {},
  });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
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

  useEffect(() => {
    const fetchProfileAndData = async () => {
      try {
        const token = localStorage.getItem('LaravelPassportToken');
        if (token) {
          const userResponse = await fetch('http://127.0.0.1:8000/api/user-profile', {
            headers: getAuthHeaders(),
          });
          if (!userResponse.ok) {
            const errorData = await userResponse.json();
            console.error('User profile fetch failed:', userResponse.status, errorData);
            throw new Error('Failed to fetch user profile');
          }
          const userData = await userResponse.json();
          if (isMounted) {
            console.log('User Profile Data:', userData);
            const profileResponse = await fetch(`http://127.0.0.1:8000/api/profiles/user/${userData.user.id}`, {
              headers: getAuthHeaders(),
            });
            if (!profileResponse.ok) throw new Error('Failed to fetch profile ID');
            const profileData = await profileResponse.json();
            console.log('Profile Data:', profileData);
            setProfileId(profileData.id);
            if (!profileData.id) {
              console.error('profile_id not found in profile response');
            }
          }
        } else {
          console.log('No token found, proceeding as guest');
        }

        const [productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/shop-products', { headers: getAuthHeaders() }),
          fetch('http://127.0.0.1:8000/api/categories/active', { headers: getAuthHeaders() }),
          fetch('http://127.0.0.1:8000/api/brands', { headers: getAuthHeaders() }),
        ]);

        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        if (!brandsResponse.ok) throw new Error('Failed to fetch brands');

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();
        const brandsData = await brandsResponse.json();

        if (isMounted) {
          setProducts(productsData.success && Array.isArray(productsData.data) ? productsData.data : []);
          setFilteredProducts(productsData.success && Array.isArray(productsData.data) ? productsData.data : []);
          setCategories(categoriesData.active && Array.isArray(categoriesData.active) ? categoriesData.active : []);
          setBrands(Array.isArray(brandsData) ? brandsData : []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (isMounted) {
          setProducts([]);
          setFilteredProducts([]);
          setCategories([]);
          setBrands([]);
          message.error({
            content: 'Failed to load shop data. Please try again.',
            style: { marginTop: '20px' },
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfileAndData();

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
          loading={loading}
          profileId={profileId}
        />
      </div>
      <OrdersCart
        isOpen={isCartOpen}
        onClose={closeCart}
        profileId={profileId}
      />
      <Footer />
    </div>
  );
}