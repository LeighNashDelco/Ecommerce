import React, { useState } from "react";
import Sidebar from "./sidebar"; // Import your Sidebar component
import {
  FaBoxOpen,
  FaShoppingCart,
  FaMoneyBill,
  FaChartBar,
  FaUser,
} from "react-icons/fa";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="app">
      {/* Replace inline sidebar with Sidebar component */}
      <Sidebar activeItem="Dashboard" />

      {/* Dashboard content */}
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