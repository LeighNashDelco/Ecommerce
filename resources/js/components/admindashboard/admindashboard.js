import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./../sidebar/Sidebar";
import TopNavbar from "./../topnavbar/TopNavbar";
import {
  FaBoxOpen,
  FaShoppingCart,
  FaUser,
  FaMoneyBill,
  FaChartBar,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import "./../../../sass/components/_admindashboard.scss";

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [stats, setStats] = useState({
    total_customers: 0,
    total_sellers: 0,
    total_admins: 0,
    total_products: 0,
    total_orders: 0,
    total_earnings: 0,
    total_product_sales: 0,
  });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/dashboard/totals")
      .then((response) => setStats(response.data))
      .catch((error) => console.error("Error fetching totals:", error));

    axios
      .get("http://127.0.0.1:8000/api/dashboard/orders")
      .then((response) => setOrders(response.data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order.id));
    }
  };

  const handleSelectOrder = (id) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((orderId) => orderId !== id)
        : [...prevSelected, id]
    );
  };

  return (
    <div className="app-container">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <main className="dashboard-content">
        <TopNavbar />
        <div className="dashboard">
          {/* Desktop View: Two rows of stats */}
          <div className="stats desktop-stats">
            <div className="stat-box">
              <FaUser className="icon" />
              <p>Total Customers</p>
              <h2>{stats.total_customers}</h2>
            </div>
            <div className="stat-box">
              <FaUser className="icon" />
              <p>Total Sellers</p>
              <h2>{stats.total_sellers}</h2>
            </div>
            <div className="stat-box">
              <FaUser className="icon" />
              <p>Total Admins</p>
              <h2>{stats.total_admins}</h2>
            </div>
          </div>

          <div className="stats desktop-stats">
            <div className="stat-box">
              <FaBoxOpen className="icon" />
              <p>Total Products</p>
              <h2>{stats.total_products}</h2>
            </div>
            <div className="stat-box">
              <FaShoppingCart className="icon" />
              <p>Total Orders</p>
              <h2>{stats.total_orders}</h2>
            </div>
            <div className="stat-box">
              <FaMoneyBill className="icon" />
              <p>Total Earnings</p>
              <h2>${stats.total_earnings}</h2>
            </div>
            <div className="stat-box">
              <FaChartBar className="icon" />
              <p>Total Product Sales</p>
              <h2>{stats.total_product_sales}</h2>
            </div>
          </div>

          {/* Mobile View: Total Customers standalone, then two per row */}
          <div className="stats standalone mobile-only">
            <div className="stat-box">
              <FaUser className="icon" />
              <p>Total Customers</p>
              <h2>{stats.total_customers}</h2>
            </div>
          </div>

          <div className="stats two-per-row mobile-only">
            <div className="stat-row">
              <div className="stat-box">
                <FaUser className="icon" />
                <p>Total Sellers</p>
                <h2>{stats.total_sellers}</h2>
              </div>
              <div className="stat-box">
                <FaUser className="icon" />
                <p>Total Admins</p>
                <h2>{stats.total_admins}</h2>
              </div>
            </div>
            <div className="stat-row">
              <div className="stat-box">
                <FaBoxOpen className="icon" />
                <p>Total Products</p>
                <h2>{stats.total_products}</h2>
              </div>
              <div className="stat-box">
                <FaShoppingCart className="icon" />
                <p>Total Orders</p>
                <h2>{stats.total_orders}</h2>
              </div>
            </div>
            <div className="stat-row">
              <div className="stat-box">
                <FaMoneyBill className="icon" />
                <p>Total Earnings</p>
                <h2>${stats.total_earnings}</h2>
              </div>
              <div className="stat-box">
                <FaChartBar className="icon" />
                <p>Total Product Sales</p>
                <h2>{stats.total_product_sales}</h2>
              </div>
            </div>
          </div>

          <div className="orders">
            <h3>Today's New Orders</h3>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search Orders"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Desktop Table View */}
            <div className="order-table desktop-only">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedOrders.length === orders.length}
                        className="checkbox"
                      />
                    </th>
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
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => handleSelectOrder(order.id)}
                            className="checkbox"
                          />
                        </td>
                        <td className="action-icons">
                          <FaEye className="action-icon" />
                          <FaTrash className="action-icon" />
                        </td>
                        <td>{order.customer}</td>
                        <td>{order.id}</td>
                        <td className="date-data">{order.date}</td>
                        <td className="quantity-data">{order.quantity}</td>
                        <td>${order.amount}</td>
                        <td>{order.status}</td>
                        <td className="payment-status-data">{order.payment_status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">No orders found</td>
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
                      <span className="order-status">Status: {order.status}</span>
                    </div>
                    <div className="order-card-body">
                      <p><strong>Customer:</strong> {order.customer}</p>
                      <p><strong>Date:</strong> {order.date}</p>
                      <p><strong>Quantity:</strong> {order.quantity}</p>
                      <p><strong>Amount:</strong> ${order.amount}</p>
                      <p><strong>Payment:</strong> {order.payment_status}</p>
                    </div>
                    <div className="order-card-actions">
                      <span className="action-icon separate-icon">
                        <FaEye className="action-icon" />
                      </span>
                      <span className="action-icon separate-icon">
                        <FaTrash className="action-icon" />
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

export default AdminDashboard;