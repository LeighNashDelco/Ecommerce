import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "../topnavbar/TopNavbar";
import { FaSquare, FaChevronDown } from "react-icons/fa";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import "./../../../sass/components/_roles.scss";

const Roles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="app">
      <Sidebar activeItem="Roles" />
      <TopNavbar />
      <div className="roles-dashboard">
        <div className="roles-container">
          <h2>Roles Management</h2>
          <div className="roles-header">
            <div className="left-actions">
              <input
                type="text"
                className="search-input"
                placeholder="Search Roles"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="right-actions">
              <button className="header-button">Add Role</button>
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
                    <li>Admin</li>
                    <li>Customer</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="roles-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="header-actions-icon">
                      <FaSquare className="checkbox-icon" /> Actions
                    </div>
                  </th>
                  <th>Role Name</th>
                  <th>Created At</th>
                  <th>Updated At</th>
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
                    <td>Role {index + 1}</td>
                    <td>2024-02-27</td>
                    <td>2024-02-27</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="roles-pagination">
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

export default Roles;