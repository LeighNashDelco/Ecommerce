import React, { useState, useEffect } from 'react';
import './../../../../sass/components/shop.scss';
import Navbar from "../../customerside/Customer/topnav_login";
import ShopGrid from "../ShopGrid/shopgrid";
import Footer from "../footer/footer";
import FilterSidebar from "../Filter/filter_sidebar";

export default function Shop() {
  const [filters, setFilters] = useState({
    categories: {},
    brands: {},
  });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/shop-products'),
          fetch('http://127.0.0.1:8000/api/categories/active'),
          fetch('http://127.0.0.1:8000/api/brands'),
        ]);

        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        if (!brandsResponse.ok) throw new Error('Failed to fetch brands');

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();
        const brandsData = await brandsResponse.json();

        // Validate and set data
        setProducts(productsData.success && Array.isArray(productsData.data) ? productsData.data : []);
        setFilteredProducts(productsData.success && Array.isArray(productsData.data) ? productsData.data : []);
        // Modified to handle the "active" property
        setCategories(categoriesData.active && Array.isArray(categoriesData.active) ? categoriesData.active : []);
        setBrands(Array.isArray(brandsData) ? brandsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setProducts([]);
        setFilteredProducts([]);
        setCategories([]);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="shop-page-container">
      <Navbar />
      <div className="shop-content">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          products={products}
          setFilteredProducts={setFilteredProducts}
          categories={categories}
          brands={brands}
        />
        <ShopGrid products={filteredProducts} loading={loading} />
      </div>
      <Footer />
    </div>
  );
}