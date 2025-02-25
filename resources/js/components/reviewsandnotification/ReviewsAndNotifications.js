import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Routing imports
import Sidebar from "../sidebar/Sidebar"; // Assuming this matches your project structure
import {
  FaSquare, // For unchecked checkboxes
  FaChevronDown, // Dropdown icon (included for consistency)
} from "react-icons/fa"; // Icon imports
import { IconTrash, IconEdit } from "@tabler/icons-react"; // Additional icons
import "./../../../sass/components/reviews&notif.scss"; // SCSS file

const ReviewsAndNotifications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all"); // Included for potential future use
  const [filterOpen, setFilterOpen] = useState(false); // Included for potential future use

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "positive", label: "Positive" },
    { value: "negative", label: "Negative" },
    { value: "recent", label: "Recent Reviews" },
  ];

  const navigate = useNavigate(); // For navigation
  const location = useLocation(); // For location tracking

  return (
    <div className="reviewsnotifications-app">
      <Sidebar activeItem="Reviews & Notifications" />
      <div className="reviewsnotifications-dashboard">
        <div className="reviewsnotifications-content">
          <h2>Reviews & Notifications</h2>
          <div className="reviewsnotifications-header">
            <div className="reviewsnotifications-left-actions">
              <input
                type="text"
                className="reviewsnotifications-search-input"
                placeholder="Search Reviews"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="reviewsnotifications-right-actions">
              <button className="reviewsnotifications-header-button">Notifications</button>
              <button className="reviewsnotifications-header-button">View Archived</button>
            </div>
          </div>
          <div className="reviewsnotifications-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="reviewsnotifications-header-actions-icon">
                      <FaSquare className="reviewsnotifications-checkbox-icon" />
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
                      <div className="reviewsnotifications-action-icons">
                        <FaSquare className="reviewsnotifications-checkbox-icon" size={16} />
                        <IconTrash size={16} className="reviewsnotifications-delete-icon" />
                        <IconEdit size={16} className="reviewsnotifications-edit-icon" />
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
          <div className="reviewsnotifications-pagination">
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

export default ReviewsAndNotifications;