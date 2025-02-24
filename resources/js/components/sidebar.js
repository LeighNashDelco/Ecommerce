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
} from "react-icons/fa";

const Sidebar = ({ activeItem: propActiveItem }) => {
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [activeItem, setActiveItem] = useState(propActiveItem || "Dashboard"); // Default to "Dashboard" if no prop provided

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
    <div className="sidebar">
      <h2>ADMIN</h2>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.label}
            className={activeItem === item.label ? "active" : ""}
            onClick={() => navigate(item.path)}
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
                onClick={() => setActiveItem(item.label)}
                className={activeItem === item.label ? "active" : ""}
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