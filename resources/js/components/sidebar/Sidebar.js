import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  FaTruck,
  FaWarehouse,
  FaClipboardCheck,
  FaUserShield,
  FaBars,
  FaTimes,
  FaTag, // Added for Brands icon
} from "react-icons/fa";
import adminPhoto from "./../../../sass/img/aadmin.svg";
import "./../../../sass/components/_sidebar.scss";

const Sidebar = ({ children }) => {
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active" : "");

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="main-container">
      {/* Overlay for mobile */}
      <div
        className={`overlay ${isSidebarExpanded ? "active" : ""}`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar with toggle button */}
      <div className="sidebar-wrapper">
        <div className={`sidebar ${isSidebarExpanded ? "expanded" : ""}`}>
          <div className="sidebar-header">
            <div className="admin-heading">
              <img src={adminPhoto} alt="Admin" className="admin-photo" />
            </div>
            {isSidebarExpanded && (
              <button className="sidebar-toggle inside" onClick={toggleSidebar}>
                {isSidebarExpanded ? (
                  <FaTimes className="toggle-icon" />
                ) : (
                  <FaBars className="toggle-icon" />
                )}
              </button>
            )}
          </div>

          <ul>
            <li
              className={isActive("/admindashboard")}
              onClick={() => navigate("/admindashboard")}
            >
              <FaTachometerAlt />
              <span>Dashboard</span>
            </li>
            <li
              className={isActive("/products")}
              onClick={() => navigate("/products")}
            >
              <FaBoxOpen />
              <span>Products</span>
            </li>
            <li
              className={isActive("/orders")}
              onClick={() => navigate("/orders")}
            >
              <FaShoppingCart />
              <span>Orders</span>
            </li>
            <li
              className={isActive("/inventory")}
              onClick={() => navigate("/inventory")}
            >
              <FaWarehouse />
              <span>Inventory</span>
            </li>
            <li
              className={isActive("/shipment")}
              onClick={() => navigate("/shipment")}
            >
              <FaTruck />
              <span>Shipment</span>
            </li>
            <li
              className={isActive("/users")}
              onClick={() => navigate("/users")}
            >
              <FaUsers />
              <span>Users</span>
            </li>
            <li
              className={isActive("/customerlist")}
              onClick={() => navigate("/customerlist")}
            >
              <FaUser />
              <span>Customer List</span>
            </li>
            <li
              className={isActive("/adminlist")}
              onClick={() => navigate("/adminlist")}
            >
              <FaUser />
              <span>Admin List</span>
            </li>
            <li
              className={isActive("/reviewsandnotifications")}
              onClick={() => navigate("/reviewsandnotifications")}
            >
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
                  className={isActive("/paymentmanagement")}
                  onClick={() => navigate("/paymentmanagement")}
                >
                  <FaMoneyBill />
                  <span>Payment Management</span>
                </li>
                <li
                  className={isActive("/statusandcategory")}
                  onClick={() => navigate("/statusandcategory")}
                >
                  <FaChartBar />
                  <span>Status & Category</span>
                </li>
                <li
                  className={isActive("/helpandsupport")}
                  onClick={() => navigate("/helpandsupport")}
                >
                  <FaBell />
                  <span>Help & Support</span>
                </li>
                <li
                  className={isActive("/roles")}
                  onClick={() => navigate("/roles")}
                >
                  <FaUserShield />
                  <span>Roles</span>
                </li>
                <li
                  className={isActive("/brands")} // New Brands item
                  onClick={() => navigate("/brands")}
                >
                  <FaTag />
                  <span>Brands</span>
                </li>
              </ul>
            )}
          </ul>
        </div>
        {!isSidebarExpanded && (
          <button className="sidebar-toggle outside" onClick={toggleSidebar}>
            {isSidebarExpanded ? (
              <FaTimes className="toggle-icon" />
            ) : (
              <FaBars className="toggle-icon" />
            )}
          </button>
        )}
      </div>

      {/* Content area */}
      <div className="content">{children}</div>
    </div>
  );
};

export default Sidebar;