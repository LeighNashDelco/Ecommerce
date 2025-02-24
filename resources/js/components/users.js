import React, { useState } from "react";

import Sidebar from "./sidebar";
import {
  FaSquare, // For unchecked checkboxes
  FaTrash, // Changed from FaTimes to FaTrash
  FaChevronDown, // Added to fix the ReferenceError
} from "react-icons/fa";
import { IconTrash, IconEdit } from "@tabler/icons-react";

console.log("Rendering Users component");

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "admin", label: "Admin" },
    { value: "customer", label: "Customer" },
    { value: "seller", label: "Seller" },
  ];

  return (
    <div className="app">
      <Sidebar activeItem="Users" />
      <div className="user-dashboard">
        <div className="user-users">
          <h2>Users</h2>
          <div className="user-users-header">
            <div className="header-actions">
              <input
                type="text"
                className="search-users-input"
                placeholder="Search Users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="right-actions">
                <button className="action-button">View Archived</button>
                <button className="action-button">Add users</button>
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
          </div>
          <div className="user-user-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="header-actions-icon">
                      <FaSquare className="checkbox-icon" />
                      Actions
                    </div>
                  </th>
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
                      <div className="action-icons">
                        <FaSquare className="checkbox-icon" />
                        <FaTrash className="delete-icon" />
                      </div>
                    </td>
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
          <div className="user-pagination">
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

export default Users;