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
import "./../../../sass/components/seller.scss";

const SellerList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "top", label: "Top Sellers" },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const handleViewArchived = () => {
    navigate("/archived_sellers"); // Adjusted for sellers
  };

  return (
    <div className="app">
      <Sidebar activeItem="Seller List" />
      <div className="main-content-wrapper">
        <TopNavbar />
        <div className="seller-dashboard">
          <div className="seller-sellers">
            <h2>Seller List</h2>
            <div className="seller-sellers-header">
              <input
                type="text"
                className="search-input" // Standardized class name
                placeholder="Search Sellers"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="actions">
                <button className="action-button">Add New</button> {/* Placeholder for potential feature */}
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
            <div className="seller-seller-table">
              <table>
                <thead>
                  <tr>
                    <th>
                      <div className="header-actions-icon">
                        <FaSquare className="checkbox-icon" />
                        Actions
                      </div>
                    </th>
                    <th>Seller ID</th>
                    <th>Seller Name</th>
                    <th>Total Sales</th>
                    <th>Status</th>
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
            <div className="seller-pagination">
            <button>&lt;</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerList;