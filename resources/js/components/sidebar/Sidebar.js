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
  FaUserShield,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import "./../../../sass/components/_sidebar.scss";
import adminPhoto from "../../../../resources/sass/img/aadmin.svg";

const Sidebar = ({ activeItem: propActiveItem }) => {
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [activeItem, setActiveItem] = useState(propActiveItem || "Dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <FaTachometerAlt />, label: "Dashboard", path: "/admindashboard" },
    { icon: <FaBoxOpen />, label: "Products", path: "/products" },
    { icon: <FaShoppingCart />, label: "Orders", path: "/orders" },
    { icon: <FaClipboardList />, label: "Inventory", path: "/inventory" },
    { icon: <FaUsers />, label: "Users", path: "/users" },
    { icon: <FaUser />, label: "Customer List", path: "/customerlist" },
    { icon: <FaUser />, label: "Seller List", path: "/sellerlist" },
    { icon: <FaUser />, label: "Admin List", path: "/adminlist" },
    { icon: <FaStar />, label: "Reviews & Notifications", path: "/reviewsandnotifications" },
  ];

  const adminSettingsItems = [
    { icon: <FaMoneyBill />, label: "Payment Management", path: "/paymentmanagement" },
    { icon: <FaChartBar />, label: "Status & Category", path: "/statusandcategory" },
    { icon: <FaBell />, label: "Help & Support", path: "/helpandsupport" },
    { icon: <FaUserShield />, label: "Roles", path: "/roles" },
  ];

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : "expanded"}`}>
      <div className="sidebar-header">
        <div className="mobile-toggle">
          {isSidebarCollapsed ? (
            <FaBars
              className="toggle-icon"
              onClick={() => setIsSidebarCollapsed(false)}
            />
          ) : (
            <FaTimes
              className="toggle-icon"
              onClick={() => setIsSidebarCollapsed(true)}
            />
          )}
        </div>
        <img src={adminPhoto} alt="Admin Logo" className="admin-photo" />
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.label}
            className={isActive(item.path)}
            onClick={() => {
              navigate(item.path);
              setActiveItem(item.label);
              setIsSidebarCollapsed(true); // Close on mobile
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
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
            {adminSettingsItems.map((item) => (
              <li
                key={item.label}
                className={isActive(item.path)}
                onClick={() => {
                  navigate(item.path);
                  setActiveItem(item.label);
                  setIsSidebarCollapsed(true); // Close on mobile
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;