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
} from "react-icons/fa";

const Product = () => {
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [activeItem, setActiveItem] = useState("Products");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false); // State for filter dropdown

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "gaming", label: "Gaming" },
    { value: "wireless", label: "Wireless" },
    { value: "office", label: "Office" },
  ];

  return (
    <div className="app">
      <div className="sidebar">
        {/* Sidebar content remains unchanged */}
        <h2>ADMIN</h2>
        <ul>
          <li>
            <FaTachometerAlt />
            <span>Dashboard</span>
          </li>
          <li className="active">
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
          <li>
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
            </ul>
          )}
        </ul>
      </div>

      <div className="dashboard">
        <div className="products">
          <h2>Products</h2>
          <div className="products-header">
            <input
              type="text"
              className="search-input"
              placeholder="Search Products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="actions">
              <button className="action-button">Add New</button>
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
          <div className="product-table">
            <table>
              <thead>
                <tr>
                  <th>Actions</th>
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
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <span>Page 1 of 3</span>
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

export default Product;