// Customer.js
import React, { useState } from "react";
import Sidebar from "./sidebar"; // Assuming this is the correct path to your Sidebar component
import {
  FaSquare, // For unchecked checkboxes
  FaTrash, // Changed from FaTimes to FaTrash
  FaChevronDown, // Added to fix the ReferenceError
} from "react-icons/fa";
import { IconTrash, IconEdit } from "@tabler/icons-react";

const Customer = () => {
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
    <div className="customer-app">
      <Sidebar activeItem="Customer List" />
      <div className="customer-dashboard">
        <div className="customer-content">
          <h2>Customer</h2>
          <div className="customer-header">
            <input
              type="text"
              className="customer-search-input"
              placeholder="Search Users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="customer-actions">
              <button className="customer-action-button">View Archived</button>
            </div>
          </div>
          <div className="customer-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="customer-header-actions-icon">
                      <FaSquare className="customer-checkbox-icon" />
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
                      <div className="customer-action-icons">
                        <FaSquare className="customer-checkbox-icon" />
                        <IconTrash size={16} className="customer-delete-icon" />
                        <IconEdit size={16} className="customer-edit-icon" />
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
          <div className="customer-pagination">
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

export default Customer;