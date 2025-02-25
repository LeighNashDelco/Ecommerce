import React, { useState } from "react";
import Sidebar from "./sidebar";

import {
  FaBoxOpen,
  FaShoppingCart,
  FaMoneyBill,
  FaChartBar,
  FaUser,
  FaEye, // Import eye icon
  FaTrash, // Import trash icon
} from "react-icons/fa";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data for demonstration (replace with your actual data)
  const orders = [
    {
      id: "ORD001",
      customer: "John Doe",
      date: "2025-02-24",
      quantity: 2,
      amount: "$50.00",
      orderStatus: "Pending",
      paymentStatus: "Unpaid",
    },
    // Add more sample orders as needed
  ];

  return (
    <div className="app-container">
      <Sidebar activeItem="Dashboard" />

      <main className="dashboard-content">
        <div className="dashboard">
          {/* Desktop View: Original two rows of stats */}
          <div className="stats desktop-stats">
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

          <div className="stats desktop-stats">
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

          {/* Mobile View: "Total Customers" as standalone, then six cards in two per row */}
          <div className="stats standalone mobile-only">
            <div className="stat-box">
              <FaUser className="icon" />
              <p>Total Customers</p>
              <h2>0</h2>
            </div>
          </div>

          <div className="stats two-per-row mobile-only">
            <div className="stat-row">
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
            <div className="stat-row">
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
            </div>
            <div className="stat-row">
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
            {/* Desktop Table View */}
            <div className="order-table desktop-only">
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
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id} className="order-row">
                        <td className="action-icons">
                          <div className="icon-container">
                            <FaEye className="action-icon" /> {/* Eye icon for view */}
                            <FaTrash className="action-icon" /> {/* Trash icon for delete */}
                          </div>
                        </td>
                        <td>{order.customer}</td>
                        <td>{order.id}</td>
                        <td className="date-data">{order.date}</td>
                        <td className="quantity-data">{order.quantity}</td>
                        <td>{order.amount}</td>
                        <td>{order.orderStatus}</td>
                        <td className="payment-status-data">{order.paymentStatus}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">No orders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Mobile Card View */}
            <div className="order-cards mobile-only">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-card-header">
                      <span className="order-id">Order ID: {order.id}</span>
                      <span className="order-status">Status: {order.orderStatus}</span>
                    </div>
                    <div className="order-card-body">
                      <p><strong>Customer:</strong> {order.customer}</p>
                      <p><strong>Date:</strong> {order.date}</p>
                      <p><strong>Quantity:</strong> {order.quantity}</p>
                      <p><strong>Amount:</strong> {order.amount}</p>
                      <p><strong>Payment:</strong> {order.paymentStatus}</p>
                    </div>
                    <div className="order-card-actions">
                      <span className="action-icon separate-icon">
                        <FaEye className="action-icon" /> {/* Eye icon for view */}
                      </span>
                      <span className="action-icon separate-icon">
                        <FaTrash className="action-icon" /> {/* Trash icon for delete */}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No orders found</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;