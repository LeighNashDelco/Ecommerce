import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "./../topnavbar/TopNavbar";
import {
  FaSquare,
  FaTrash,
  FaChevronDown,
} from "react-icons/fa";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import "./../../../sass/components/product.scss";
import ProductModal from "./../products/product_modal";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "gaming", label: "Gaming" },
    { value: "wireless", label: "Wireless" },
    { value: "office", label: "Office" },
  ];

  const handleAddNewClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleViewArchived = () => {
    navigate("/archived_products");
  };

  return (
    <div className="app">
      <Sidebar activeItem="Products" />
      <div className="main-content-wrapper">
        <TopNavbar />
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
                <button className="action-button" onClick={handleViewArchived}>
                  View Archived
                </button>
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
                    <th>Product Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Created at</th>
                    <th>Updated at</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, index) => (
                    <tr key={index}>
                      <td>
                        <div className="action-icons">
                          <FaSquare className="checkbox-icon" size={16} />
                          <IconTrash size={16} className="delete-icon" />
                          <IconEdit size={16} className="edit-icon" />
                        </div>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="product-pagination">
              <span>Page 1 of 1</span>
              <button>&lt;</button>
              <button className="active">1</button>
              <button>2</button>
              <button>3</button>
              <button>&gt;</button>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && <ProductModal onClose={handleModalClose} />}
    </div>
  );
};

export default Products;