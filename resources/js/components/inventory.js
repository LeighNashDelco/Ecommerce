import React, { useState } from "react";
import Sidebar from "./sidebar"; // Import the Sidebar component
import {
  FaSquare, // For unchecked checkboxes
  FaTrash, // Changed from FaTimes to FaTrash
  FaChevronDown, // Added to fix the ReferenceError
} from "react-icons/fa";
import { IconTrash, IconEdit } from "@tabler/icons-react"; // Import Tabler Icons for trash and edit

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Removed adminDropdown and activeItem state since Sidebar handles it
  const [filterValue, setFilterValue] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "low", label: "Low Stock" },
    { value: "high", label: "High Stock" },
    { value: "sold", label: "Sold Out" },
  ];

  return (
    <div className="app">
      <Sidebar activeItem="Inventory" /> {/* Use the Sidebar component with "Inventory" as active */}
      <div className="inventory-dashboard">
        <div className="inventory-orders">
          <h2>Inventory Management</h2>
          <div className="inventory-orders-header">
            <div className="left-actions">
              <input
                type="text"
                className="search-input"
                placeholder="Search Orders"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="right-actions">
              <button className="header-button">Inventory</button>
              <button className="header-button">View Archived</button>
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
          <div className="inventory-order-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="header-actions-icon">
                      <FaSquare className="checkbox-icon" />
                      Actions
                    </div>
                  </th>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Current Stock</th>
                  <th>Sold</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="inventory-pagination">
          <span>Page 1 of 1</span>
            <button>&lt;</button> {/* Using HTML entity for < */}
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>&gt;</button> {/* Using HTML entity for > */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;