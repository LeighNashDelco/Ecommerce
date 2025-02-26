import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Sidebar from "./sidebar"; 
import {
  FaSquare,
  FaTrash, 
  FaChevronDown,
} from "react-icons/fa";
import { IconTrash, IconEdit } from "@tabler/icons-react"; 

const ArchivedProducts = () => {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filterValue, setFilterValue] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "gaming", label: "Gaming" },
    { value: "wireless", label: "Wireless" },
    { value: "office", label: "Office" },
  ];

  const handleViewActive = () => {
    navigate("/product"); // Navigate back to the Product page
  };

  return (
    <div className="archivedproduct-app">
      <Sidebar activeItem="Products" /> {/* Highlight "Products" in Sidebar */}
      <div className="archivedproduct-dashboard">
        <div className="archivedproduct-products">
          <h2>Archived Products</h2>
          <div className="archivedproduct-products-header">
            <input
              type="text"
              className="archivedproduct-search-input"
              placeholder="Search Products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="archivedproduct-actions">
              <button className="archivedproduct-action-button" onClick={handleViewActive}>
                View Active
              </button>
              <div className="archivedproduct-filter-container">
                <button
                  className="archivedproduct-filter-button"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <span>Filter</span>
                  <FaChevronDown />
                </button>
                {filterOpen && (
                  <ul className="archivedproduct-filter-dropdown">
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
          <div className="archivedproduct-product-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="archivedproduct-header-actions-icon">
                      <FaSquare className="archivedproduct-checkbox-icon" />
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
                      <div className="archivedproduct-action-icons">
                        <FaSquare className="archivedproduct-checkbox-icon" size={16} />
                        <IconTrash size={16} className="archivedproduct-delete-icon" />
                        <IconEdit size={16} className="archivedproduct-edit-icon" />
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
          <div className="archivedproduct-pagination">
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
  );
};

export default ArchivedProducts;