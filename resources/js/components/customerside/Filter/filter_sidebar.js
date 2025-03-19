import React from 'react';
import './../../../../sass/components/filter_sidebar.scss';

const FilterSidebar = ({ filters, setFilters, products, setFilteredProducts, categories, brands }) => {
  // Ensure props are defined with fallback values to prevent undefined errors
  const safeProducts = Array.isArray(products) ? products : [];
  const safeCategories = Array.isArray(categories) ? categories.filter(cat => cat.archived === false) : []; // Only show archived: false for categories
  const safeBrands = Array.isArray(brands) ? brands.filter(br => br.archived === 0) : []; // Only show archived: 0 for brands
  const safeFilters = filters || { categories: {}, brands: {} };

  const handleCheckboxChange = (categoryId) => {
    const id = Number(categoryId);
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        categories: {
          ...prev.categories,
          [id]: !prev.categories[id],
        },
      };
      updateFilteredProducts(newFilters);
      return newFilters;
    });
  };

  const handleBrandChange = (brandId) => {
    const id = Number(brandId);
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        brands: {
          ...prev.brands,
          [id]: !prev.brands[id],
        },
      };
      updateFilteredProducts(newFilters);
      return newFilters;
    });
  };

  const updateFilteredProducts = (currentFilters) => {
    const validFilters = {
      categories: currentFilters.categories || {},
      brands: currentFilters.brands || {},
    };

    // If no filters are selected, show all products
    const noCategoriesSelected = Object.keys(validFilters.categories).every((key) => !validFilters.categories[key]);
    const noBrandsSelected = Object.keys(validFilters.brands).every((key) => !validFilters.brands[key]);

    if (noCategoriesSelected && noBrandsSelected) {
      setFilteredProducts(safeProducts);
    } else {
      const filtered = safeProducts.filter((product) => {
        const productCategoryId = product.category_id !== undefined ? Number(product.category_id) : null;
        const productBrandId = product.brand_id !== undefined ? Number(product.brand_id) : null;

        // Category match: true if no categories selected or product matches at least one selected category
        const categoryMatch =
          noCategoriesSelected ||
          Object.keys(validFilters.categories).some(
            (catId) => validFilters.categories[catId] && productCategoryId === Number(catId)
          );

        // Brand match: true if no brands selected or product matches at least one selected brand
        const brandMatch =
          noBrandsSelected ||
          Object.keys(validFilters.brands).some(
            (brandId) => validFilters.brands[brandId] && productBrandId === Number(brandId)
          );

        return categoryMatch && brandMatch;
      });
      setFilteredProducts(filtered);
    }
  };

  const getCategoryProductCount = (categoryId) => {
    const id = Number(categoryId);
    return safeProducts.filter((product) => Number(product.category_id) === id).length;
  };

  const getBrandProductCount = (brandId) => {
    const id = Number(brandId);
    return safeProducts.filter((product) => Number(product.brand_id) === id).length;
  };

  return (
    <div className="shop-filter">
      <div className="shop-filter-content">
        <div className="shop-filter-section">
          <div className="shop-filter-section-title">PRODUCT CATEGORIES</div>
          <div className="shop-filter-categories">
            {safeCategories.length > 0 ? (
              safeCategories.map((category) => (
                <div className="shop-filter-category" key={category.id}>
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={safeFilters.categories[category.id] || false}
                    onChange={() => handleCheckboxChange(category.id)}
                  />
                  <span className="shop-filter-checkbox"></span>
                  <span className="category-text">
                    {category.category_name || 'Unknown'} ({getCategoryProductCount(category.id)})
                  </span>
                </div>
              ))
            ) : (
              <div className="shop-filter-category">No categories available</div>
            )}
          </div>
        </div>
        <div className="shop-filter-section">
          <div className="shop-filter-section-title">BRANDS</div>
          <div className="shop-filter-categories">
            {safeBrands.length > 0 ? (
              safeBrands.map((brand) => (
                <div className="shop-filter-category" key={brand.id}>
                  <input
                    type="checkbox"
                    id={`brand-${brand.id}`}
                    checked={safeFilters.brands[brand.id] || false}
                    onChange={() => handleBrandChange(brand.id)}
                  />
                  <span className="shop-filter-checkbox"></span>
                  <span className="category-text">
                    {brand.brand_name || 'Unknown'} ({getBrandProductCount(brand.id)})
                  </span>
                </div>
              ))
            ) : (
              <div className="shop-filter-category">No brands available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;