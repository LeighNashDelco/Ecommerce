import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import adminPhoto from "../../imgs/aadmin.svg";

const Sidebar = ({ activeItem: propActiveItem }) => {
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [activeItem, setActiveItem] = useState(propActiveItem || "Dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Start collapsed on mobile
  const navigate = useNavigate();

  const menuItems = [
    { icon: <FaTachometerAlt />, label: "Dashboard", path: "/admindashboard" },
    { icon: <FaBoxOpen />, label: "Products", path: "/product" },
    { icon: <FaShoppingCart />, label: "Orders", path: "/orders" },
    { icon: <FaClipboardList />, label: "Inventory", path: "/inventory" },
    { icon: <FaUsers />, label: "Users", path: "/users" },
    { icon: <FaUser />, label: "Customer List", path: "/customer" },
    { icon: <FaUser />, label: "Seller List", path: "/seller" },
    { icon: <FaUser />, label: "Admin List", path: "/adminlist" },
    { icon: <FaStar />, label: "Reviews & Notifications", path: "/reviewsmanagement" },
  ];

  const adminSettingsItems = [
    { icon: <FaMoneyBill />, label: "Payment Management" },
    { icon: <FaChartBar />, label: "Status & Category" },
    { icon: <FaBell />, label: "Help & Support" },
    { icon: <FaUserShield />, label: "Roles" },
  ];

  return (
    <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : 'expanded'}`}>
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
        <img 
          src={adminPhoto}
          alt="Admin Logo"
          className="admin-photo"
        />
      </div>
      <ul className="sidebar-menu">  
        {menuItems.map((item) => (
          <li
            key={item.label}
            className={activeItem === item.label ? "active" : ""}
            onClick={() => {
              navigate(item.path);
              setIsSidebarCollapsed(true); // Close after click on mobile
            }}
          >
            {item.icon} {/* Icons always visible on desktop, conditional on mobile */}
            <span>{item.label}</span>
          </li>
        ))}
        <hr className="separator" />
        <div
          className="admin-settings-header"
          onClick={() => setAdminDropdown(!adminDropdown)}
        >
          <FaCog /> {/* Icon always visible on desktop */}
          <span>Admin Settings</span>
          <FaChevronDown className={adminDropdown ? "rotate-icon" : ""} />
        </div>
        {adminDropdown && (
          <ul className="dropdown">
            {adminSettingsItems.map((item) => (
              <li
                key={item.label}
                onClick={() => {
                  setActiveItem(item.label);
                  setIsSidebarCollapsed(true); // Close after click on mobile
                }}
                className={activeItem === item.label ? "active" : ""}
              >
                {item.icon} {/* Icons always visible on desktop */}
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