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
  FaTruck, // Shipment
  FaWarehouse, // Inventory
  FaClipboardCheck, // Review
  FaUserShield, // Roles
} from "react-icons/fa";
import adminPhoto from "./../../../sass/img/aadmin.svg"; // Adjust path if needed
import "./../../../sass/components/_sidebar.scss";

const Sidebar = () => {
  const [adminDropdown, setAdminDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <div className="sidebar">
      <div className="admin-heading">
        <img src={adminPhoto} alt="Admin" className="admin-photo" />
      </div>
      
      <ul>
        <li className={isActive("/admindashboard")} onClick={() => navigate("/admindashboard")}>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </li>
        <li className={isActive("/products")} onClick={() => navigate("/products")}>
          <FaBoxOpen />
          <span>Products</span>
        </li>
        <li className={isActive("/orders")} onClick={() => navigate("/orders")}>
          <FaShoppingCart />
          <span>Orders</span>
        </li>
        <li className={isActive("/inventory")} onClick={() => navigate("/inventory")}>
          <FaWarehouse />
          <span>Inventory</span>
        </li>
        <li className={isActive("/shipment")} onClick={() => navigate("/shipment")}>
          <FaTruck />
          <span>Shipment</span>
        </li>
        <li className={isActive("/users")} onClick={() => navigate("/users")}>
          <FaUsers />
          <span>Users</span>
        </li>
        <li className={isActive("/customerlist")} onClick={() => navigate("/customerlist")}>
          <FaUser />
          <span>Customer List</span>
        </li>
        <li className={isActive("/adminlist")} onClick={() => navigate("/adminlist")}>
          <FaUser />
          <span>Admin List</span>
        </li>
        <li className={isActive("/reviewsandnotifications")} onClick={() => navigate("/reviewsandnotifications")}>
          <FaStar />
          <span>Reviews & Notifications</span>
        </li>

        <hr className="separator" />

        <div className="admin-settings-header" onClick={() => setAdminDropdown(!adminDropdown)}>
          <FaCog />
          <span>Admin Settings</span>
          <FaChevronDown className={adminDropdown ? "rotate-icon" : ""} />
        </div>

        {adminDropdown && (
          <ul className="dropdown">
            <li className={isActive("/paymentmanagement")} onClick={() => navigate("/paymentmanagement")}>
              <FaMoneyBill />
              <span>Payment Management</span>
            </li>
            <li className={isActive("/statusandcategory")} onClick={() => navigate("/statusandcategory")}>
              <FaChartBar />
              <span>Status & Category</span>
            </li>
            <li className={isActive("/helpandsupport")} onClick={() => navigate("/helpandsupport")}>
              <FaBell />
              <span>Help & Support</span>
            </li>
            <li className={isActive("/roles")} onClick={() => navigate("/roles")}>
              <FaUserShield />
              <span>Roles</span>
            </li>
          </ul>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
