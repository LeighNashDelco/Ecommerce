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
  FaUserShield, // Added for Roles
} from "react-icons/fa";

const Dashboard = () => {
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [activeItem, setActiveItem] = useState("Payment Management");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>ADMIN</h2>
        <ul>
          <li className="active">
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
                className={`${
                  activeItem === "Payment Management" ? "active payment-management" : ""
                }`}
                onClick={() => setActiveItem("Payment Management")}
              >
                <FaMoneyBill />
                <span>Payment Management</span>
              </li>
              <li
                className={activeItem === "Status & Category" ? "active" : ""}
                onClick={() => setActiveItem("Status & Category")}
              >
                <FaChartBar />
                <span>Status & Category</span>
              </li>
              <li
                className={activeItem === "Help & Support" ? "active" : ""}
                onClick={() => setActiveItem("Help & Support")}
              >
                <FaBell />
                <span>Help & Support</span>
              </li>
              <li
                className={activeItem === "Roles" ? "active" : ""}
                onClick={() => setActiveItem("Roles")}
              >
                <FaUserShield />
                <span>Roles</span>
              </li>
            </ul>
          )}
        </ul>
      </div>

      {/* Dashboard */}
      <div className="dashboard">
        <div className="stats">
          <div className="stat-box">
            <FaUser className="icon" />
            <p>Total Customers</p>
            <h2>0</h2>
          </div>
          <div className="stat-box">
            <FaUser className="icon" />
            <p>Total Sellers</p>
            <h2>0</h2>
          </div>
          <div className="stat-box">
            <FaUser className="icon" />
            <p>Total Admin</p>
            <h2>0</h2>
          </div>
        </div>

        <div className="stats">
          <div className="stat-box">
            <FaBoxOpen className="icon" />
            <p>Total Products</p>
            <h2>0</h2>
          </div>
          <div className="stat-box">
            <FaShoppingCart className="icon" />
            <p>Total Orders</p>
            <h2>0</h2>
          </div>
          <div className="stat-box">
            <FaMoneyBill className="icon" />
            <p>Total Earnings</p>
            <h2>0</h2>
          </div>
          <div className="stat-box">
            <FaChartBar className="icon" />
            <p>Total Product Sale</p>
            <h2>0</h2>
          </div>
        </div>

        <div className="orders">
          <h3>Today's New Orders</h3>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search Products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Actions</th>
                  <th>Customer</th>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Order Status</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>{/* Empty tbody as in original */}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;