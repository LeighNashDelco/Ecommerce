// Orders.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "../topnavbar/TopNavbar";
import { FaSquare, FaChevronDown, FaCheckSquare } from "react-icons/fa";
import { IconTrash, IconEdit, IconSearch, IconPlus, IconEye, IconRefresh, IconArchive } from "@tabler/icons-react";
import "./../../../../sass/components/_ordersdashboard.scss"; // Updated SCSS import

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(dateString));
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [selectedFilterLabel, setSelectedFilterLabel] = useState("All Orders");
  const [filterOpen, setFilterOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [orderToArchive, setOrderToArchive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("LaravelPassportToken");
        console.log("Token used:", token);
        if (!token) {
          throw new Error("No authentication token found");
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const response = await axios.get("http://127.0.0.1:8000/api/orders", config);
        console.log("Orders response:", response.data);
        setOrders(response.data.map(order => ({
          ...order,
          archived: order.status_id === 5 // Assuming status_id 5 is "Cancelled" and treated as archived
        })));
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    
    const matchesFilter = filterValue === "all" || order.status_id === parseInt(filterValue);
    const matchesArchived = order.archived === showArchived;
    return matchesSearch && matchesFilter && matchesArchived;
  });

  const toggleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id));
    }
  };

  const handleToggleArchived = () => {
    setShowArchived((prev) => !prev);
    setPagination({ ...pagination, currentPage: 1 });
    setSelectedOrders([]);
  };

  const handleArchiveClick = (order) => {
    setOrderToArchive(order);
    setIsConfirmModalOpen(true);
  };

  const handleArchiveConfirm = async () => {
    if (!orderToArchive) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const response = await axios.post(
        `http://127.0.0.1:8000/api/orders/${orderToArchive.id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderToArchive.id ? { ...order, archived: true, status_id: 5 } : order
          )
        );
        setIsConfirmModalOpen(false);
        setOrderToArchive(null);
      }
    } catch (error) {
      console.error("Error archiving order:", error);
    }
  };

  const handleRestoreOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/orders/${orderId}/restore`, // Hypothetical endpoint
        { status_id: 1 }, // Restore to "Pending"
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, archived: false, status_id: 1 } : order
          )
        );
      }
    } catch (error) {
      console.error("Error restoring order:", error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedOrders.length === 0) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const requests = selectedOrders.map((orderId) =>
        axios[action === "archive" ? "post" : "patch"](
          `http://127.0.0.1:8000/api/orders/${orderId}/${action === "archive" ? "cancel" : "restore"}`,
          action === "archive" ? {} : { status_id: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await Promise.all(requests);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          selectedOrders.includes(order.id)
            ? { ...order, archived: action === "archive", status_id: action === "archive" ? 5 : 1 }
            : order
        )
      );
      setSelectedOrders([]);
    } catch (error) {
      console.error(`Error ${action}ing orders:`, error);
    }
  };

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "1", label: "Pending" },
    { value: "2", label: "Processing" }, // Adjusted to match your statuses
    { value: "3", label: "Shipped" },
    { value: "4", label: "Delivered" },
    { value: "5", label: "Cancelled" }, // Added Cancelled
  ];

  const ordersPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (pagination.currentPage - 1) * ordersPerPage,
    pagination.currentPage * ordersPerPage
  );

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const handleFilterSelect = (value, label) => {
    setFilterValue(value);
    setSelectedFilterLabel(label);
    setFilterOpen(false);
  };

  return (
    <div className="app">
      <Sidebar activeItem="Orders" />
      <TopNavbar />
      <div className="ordersdashboard-dashboard">
        <div className="ordersdashboard-content">
          <h2>{showArchived ? "Archived Orders" : "Order Management"}</h2>
          <div className="ordersdashboard-header">
            <div className="left-actions">
              <div className="search-container">
                <IconSearch size={20} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search Orders"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="right-actions">
              {selectedOrders.length > 0 && (
                <button
                  className="header-button archive-all-button"
                  onClick={() => handleBulkAction(showArchived ? "restore" : "archive")}
                >
                  <IconArchive size={20} className="button-icon" />
                  <span className="button-text">{showArchived ? "Restore All" : "Archive All"}</span>
                </button>
              )}
              <button className="header-button">
                <IconPlus size={20} className="button-icon" />
                <span className="button-text">Add New</span>
              </button>
              <button className="header-button" onClick={handleToggleArchived}>
                <IconEye size={20} className="button-icon" />
                <span className="button-text">{showArchived ? "View Active" : "View Archived"}</span>
              </button>
              <div className="filter-container">
                <button className="filter-button" onClick={() => setFilterOpen(!filterOpen)}>
                  <span>{selectedFilterLabel}</span>
                  <FaChevronDown />
                </button>
                {filterOpen && (
                  <ul className="filter-dropdown">
                    {statusOptions.map((status) => (
                      <li
                        key={status.value}
                        onClick={() => handleFilterSelect(status.value, status.label)}
                      >
                        {status.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="ordersdashboard-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="header-actions-icon">
                      <span onClick={toggleSelectAll} style={{ cursor: "pointer" }}>
                        {selectedOrders.length === filteredOrders.length && filteredOrders.length > 0 ? (
                          <FaCheckSquare className="checkbox-icon" />
                        ) : (
                          <FaSquare className="checkbox-icon" />
                        )}
                      </span>
                      Actions
                    </div>
                  </th>
                  <th>User Name</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Order Date</th>
                  <th>Est. Delivery</th>
                  <th>Payment Method</th>
                  <th>Shipping Method</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="loading-row">
                      Loading orders...
                    </td>
                  </tr>
                ) : currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <div className="action-icons">
                          <span onClick={() => toggleSelectOrder(order.id)} style={{ cursor: "pointer" }}>
                            {selectedOrders.includes(order.id) ? (
                              <FaCheckSquare className="checkbox-icon" size={16} />
                            ) : (
                              <FaSquare className="checkbox-icon" size={16} />
                            )}
                          </span>
                          {showArchived ? (
                            <IconRefresh
                              size={16}
                              className="restore-icon"
                              onClick={() => handleRestoreOrder(order.id)}
                            />
                          ) : (
                            <IconTrash
                              size={16}
                              className="delete-icon"
                              onClick={() => handleArchiveClick(order)}
                            />
                          )}
                          <IconEdit size={16} className="edit-icon" />
                        </div>
                      </td>
                      <td>{order.user?.name || "N/A"}</td>
                      <td>{order.product?.name || "N/A"}</td>
                      <td>{order.quantity}</td>
                      <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                      <td>{statusOptions.find(s => s.value === order.status_id.toString())?.label || "N/A"}</td>
                      <td>{formatDate(order.order_date)}</td>
                      <td>{formatDate(order.estimated_delivery_date)}</td>
                      <td>{order.payment_method || "N/A"}</td>
                      <td>{order.shipping_method || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10">No {showArchived ? "archived" : "active"} orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="ordersdashboard-pagination">
            <span>Page {pagination.currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
            >
              {"<"}
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={pagination.currentPage === index + 1 ? "active" : ""}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= totalPages}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>

      {isConfirmModalOpen && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <h3>Are you sure?</h3>
            <p>Do you want to archive Order #{orderToArchive?.id}?</p>
            <div className="confirm-modal-buttons">
              <button className="confirm-button" onClick={handleArchiveConfirm}>
                Yes, Archive
              </button>
              <button className="cancel-button" onClick={() => setIsConfirmModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;