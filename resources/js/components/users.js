import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaClipboardList,
  FaStar,
  FaBell,
  FaCog,
  FaMoneyBill,
  FaChartBar,
  FaUser,
  FaChevronDown,
  FaSquare, // For unchecked checkboxes
  FaTrash, // Changed from FaTimes to FaTrash
  FaUserShield,
} from "react-icons/fa";

const Users = () => {
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [activeItem, setActiveItem] = useState("Users");
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
      <div className="sidebar">
        <h2>ADMIN</h2>
        <ul>
          <li>
            <FaTachometerAlt />
            <span>Dashboard</span>
          </li>
          <li>
            <FaBoxOpen />
            <span>Products</span>
          </li>
          <li>
            <FaShoppingCart />
            <span>Orders</span>
          </li>
          <li>
            <FaClipboardList />
            <span>Inventory</span>
          </li>
          <li className="active">
            <FaUsers />
            <span>Users</span>
          </li>
          <li>
            <FaUser />
            <span>Customer List</span>
          </li>
          <li>
            <FaUser />
            <span>Seller List</span>
          </li>
          <li>
            <FaUser />
            <span>Admin List</span>
          </li>
          <li>
            <FaStar />
            <span>Reviews & Notifications</span>
          </li>
          <hr className="separator" />
          <div
            className="admin-settings-header"
            onClick={() => setAdminDropdown(!adminDropdown)}
          >
            <FaCog />
            <span>Admin Settings</span>
            <FaChevronDown className={adminDropdown ? "rotate-icon" : ""} />
          </div>
          {adminDropdown && (
            <ul className="dropdown">
              <li
                onClick={() => setActiveItem("Payment Management")}
                className={
                  activeItem === "Payment Management" ? "active payment-management" : ""
                }
              >
                <FaMoneyBill />
                <span>Payment Management</span>
              </li>
              <li
                onClick={() => setActiveItem("Status & Category")}
                className={activeItem === "Status & Category" ? "active" : ""}
              >
                <FaChartBar />
                <span>Status & Category</span>
              </li>
              <li
                onClick={() => setActiveItem("Help & Support")}
                className={activeItem === "Help & Support" ? "active" : ""}
              >
                <FaBell />
                <span>Help & Support</span>
              </li>
              <li
                onClick={() => setActiveItem("Roles")}
                className={activeItem === "Roles" ? "active" : ""}
              >
                <FaUserShield />
                <span>Roles</span>
              </li>
            </ul>
          )}
        </ul>
      </div>

      <div className="dashboard">
        <div className="users">
          <h2>Users</h2>
          <div className="users-header">
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
          <div className="user-table">
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
                        <FaTrash className="delete-icon" /> {/* Changed from FaTimes to FaTrash */}
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
          <div className="pagination">
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