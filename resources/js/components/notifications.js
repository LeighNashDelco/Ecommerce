import React, { useState } from "react";
import Sidebar from "./sidebar"; // Assuming this is the correct path to your Sidebar component
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
  FaSquare,
  FaUserShield,
} from "react-icons/fa";
import { IconTrash, IconEdit } from "@tabler/icons-react";

const Notifications = () => {
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [activeItem, setActiveItem] = useState("Reviews & Notifications"); // Set as the active item
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "unread", label: "Unread" },
    { value: "read", label: "Read" },
    { value: "recent", label: "Recent" },
  ];

  return (
    <div className="notifications-app">
      <Sidebar activeItem="Reviews & Notifications" />
      <div className="notifications-dashboard">
        <div className="notifications-content">
          <h2>Notifications</h2>
          <div className="notifications-header">
            <div className="notifications-left-actions">
              <input
                type="text"
                className="notifications-search-input"
                placeholder="Search Notifications"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="notifications-right-actions">
              <button className="notifications-header-button">Review Management</button>
              <button className="notifications-header-button">Add New</button>
              <button 
                className="notifications-header-button" 
                onClick={() => setFilterOpen(!filterOpen)}
              >
                Filter <FaChevronDown style={{ marginLeft: "5px" }} /> {/* Added margin for spacing */}
              </button>
              {filterOpen && (
                <div className="notifications-filter-dropdown">
                  {filterOptions.map((option) => (
                    <div 
                      key={option.value} 
                      className="notifications-filter-option"
                      onClick={() => {
                        setFilterValue(option.value);
                        setFilterOpen(false);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="notifications-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="notifications-header-actions-icon">
                      <FaSquare className="notifications-checkbox-icon" />
                      Actions
                    </div>
                  </th>
                  <th>Notification ID</th>
                  <th>Message</th>
                  <th>Type</th>
                  <th>Created at</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td>
                      <div className="notifications-action-icons">
                        <FaSquare className="notifications-checkbox-icon" />
                        <IconTrash size={16} className="notifications-delete-icon" />
                        <IconEdit size={16} className="notifications-edit-icon" />
                      </div>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="notifications-pagination">
          <span>Page 1 of 1</span>
            <button>&lt;</button> {/* Using HTML entity for < */}
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>&gt;</button> {/* Using HTML entity for > */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;