// SellerList.js
import React, { useState } from "react";
import Sidebar from "./sidebar"; 
import {
  FaSquare, // For unchecked checkboxes
  FaTrash, // Changed from FaTimes to FaTrash
  FaChevronDown, // Added to fix the ReferenceError

} from "react-icons/fa";
import { IconTrash, IconEdit } from "@tabler/icons-react";

const SellerList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "recent", label: "Recent Activity" },
  ];

  return (
    <div className="seller-app">
      <Sidebar activeItem="Seller List" />
      <div className="seller-dashboard">
        <div className="seller-content">
          <h2>Seller</h2>
          <div className="seller-header">
            <div className="seller-left-actions">
              <input
                type="text"
                className="seller-search-input"
                placeholder="Search Users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="seller-right-actions">
              <button className="seller-header-button">View Archived</button>
            </div>
          </div>
          <div className="seller-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="seller-header-actions-icon">
                      <FaSquare className="seller-checkbox-icon" />
                      Actions
                    </div>
                  </th>
                  <th>User ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Created at</th>
                  <th>Updated at</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td>
                      <div className="seller-action-icons">
                        <FaSquare className="seller-checkbox-icon" size={16} />
                        <IconTrash size={16} className="seller-delete-icon" />
                        <IconEdit size={16} className="seller-edit-icon" />
                      </div>
                    </td>
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
          <div className="seller-pagination">
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

export default SellerList;