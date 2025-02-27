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
import "./../../../sass/components/_usersdashboard.scss";

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("Payment Management");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

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
    <div className="app">
      <Sidebar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        isSidebarExpanded={isSidebarExpanded}
        setIsSidebarExpanded={setIsSidebarExpanded}
      />
      <div
        className={`dashboard ${isSidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"}`}
      >
        <TopNavbar />

        {/* Stats Section */}
        <div className="stats">
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

        <div className="stats">
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
            <h2>₱{stats.total_earnings}</h2>
          </div>
          <div className="stat-box">
            <FaChartBar className="icon" />
            <p>Total Product Sales</p>
            <h2>{stats.total_product_sales}</h2>
          </div>
        </div>

        {/* Orders Section */}
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

          <div className="order-table">
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
                  <th>Product</th>
                  <th>Order Date</th>
                  <th>Qty</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders
                  .filter((order) =>
                    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order.product.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((order) => (
                    <tr key={order.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="checkbox"
                        />
                      </td>
                      <td>
                        <FaEye className="icon action-icon view-icon" />
                        <FaTrash className="icon action-icon delete-icon" />
                      </td>
                      <td>{order.customer}</td>
                      <td>{order.product}</td>
                      <td>{new Date(order.order_date).toLocaleDateString()}</td>
                      <td>{order.quantity}</td>
                      <td>₱{order.total_amount}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;