import React, { useState, useEffect } from "react";
import Sidebar from "./../sidebar/Sidebar";
import { FaSquare, FaTrash, FaChevronDown } from "react-icons/fa";
import ProductModal from "./Product_modal";
import axios from "axios";
import "./../../../sass/components/_products.scss";
import "./../../../sass/components/_products_modal.scss";
import TopNavbar from "./../topnavbar/TopNavbar";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "Gaming Mouse", label: "Gaming Mouse" },
    { value: "Wireless Mouse", label: "Wireless Mouse" },
    { value: "Office Mouse", label: "Office Mouse" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products");
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProducts([]);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterValue === "all" || product.category === filterValue)
  );

  const handleAddNewClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleProductAdd = async (newProduct) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/products", newProduct);
  
      if (response.status === 201) {
        const addedProduct = response.data; 
        
  
        setProducts((prevProducts) => [addedProduct, ...prevProducts]);
        setIsModalOpen(false); 
      } else {
        console.error("Failed to add product. Response status:", response.status);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  
  
  // Pagination logic
  const productsPerPage = 8;

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const currentPageProducts = filteredProducts.slice(
    (pagination.currentPage - 1) * productsPerPage,
    pagination.currentPage * productsPerPage
  );

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  return (
    <div className="app">
      <TopNavbar />
      <Sidebar activeItem="Products" />
      <div className="product-dashboard">
        <div className="product-products">
          <h2>Products</h2>
          <div className="product-products-header">
            <input
              type="text"
              className="search-input"
              placeholder="Search Products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="actions">
              <button className="action-button" onClick={handleAddNewClick}>
                Add New
              </button>
              <button className="action-button">View Archived</button>
              <div className="filter-container">
                <button
                  className="filter-button"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <span>Filter</span>
                  <FaChevronDown />
                </button>
                {filterOpen && (
                  <ul className="filter-dropdown">
                    {filterOptions.map((option) => (
                      <li
                        key={option.value}
                        onClick={() => {
                          setFilterValue(option.value);
                          setFilterOpen(false);
                        }}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="product-product-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="header-actions-icon">
                      <FaSquare className="checkbox-icon" />
                      Actions
                    </div>
                  </th>
                  <th>Seller</th>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {currentPageProducts.length > 0 ? (
                  currentPageProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="action-icons">
                          <FaSquare className="checkbox-icon" size={16} />
                          <FaTrash size={16} className="delete-icon" />
                        </div>
                      </td>
                      <td>{product.profile_name}</td>
                      <td>
                        <img
                          src={product.product_img}
                          alt={product.product_name}
                          className="product-image"
                          style={{ width: '3rem', height: '3rem', objectFit: 'cover' }}
                        />
                      </td>
                      <td>{product.product_name}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                      <td>₱{product.price}</td>
                      <td>{product.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No products found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="product-pagination">
            <span>Page {pagination.currentPage} of {totalPages}</span>
            <button 
              onClick={() => handlePageChange(pagination.currentPage - 1)} 
              disabled={pagination.currentPage <= 1}
            >
              &lt;
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={pagination.currentPage === index + 1 ? "active" : ""}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button 
              onClick={() => handlePageChange(pagination.currentPage + 1)} 
              disabled={pagination.currentPage >= totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && <ProductModal onClose={handleModalClose} onAdd={handleProductAdd} />}
    </div>
  );
};

export default Product;
