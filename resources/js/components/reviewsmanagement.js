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

const ReviewsManagement = () => {
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [activeItem, setActiveItem] = useState("Reviews & Notifications"); // Changed to "Reviews & Notifications" as the active item
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "positive", label: "Positive" },
    { value: "negative", label: "Negative" },
    { value: "recent", label: "Recent Reviews" },
  ];

  return (
    <div className="reviewmanagement-app">
      <Sidebar activeItem="Reviews & Notifications" />
      <div className="reviewmanagement-dashboard">
        <div className="reviewmanagement-content">
          <h2>Review Management</h2>
          <div className="reviewmanagement-header">
            <div className="reviewmanagement-left-actions">
              <input
                type="text"
                className="reviewmanagement-search-input"
                placeholder="Search Reviews"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="reviewmanagement-right-actions">
              <button className="reviewmanagement-header-button">Notifications</button>
              <button className="reviewmanagement-header-button">View Archived</button>
            </div>
          </div>
          <div className="reviewmanagement-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="reviewmanagement-header-actions-icon">
                      <FaSquare className="reviewmanagement-checkbox-icon" />
                      Actions
                    </div>
                  </th>
                  <th>Product ID</th>
                  <th>Username</th>
                  <th>Rating</th>
                  <th>Created at</th>
                  <th>Updated at</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td>
                      <div className="reviewmanagement-action-icons">
                        <FaSquare className="reviewmanagement-checkbox-icon" />
                        <IconTrash size={16} className="reviewmanagement-delete-icon" />
                        <IconEdit size={16} className="reviewmanagement-edit-icon" />
                      </div>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="reviewmanagement-pagination">
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

export default ReviewsManagement;