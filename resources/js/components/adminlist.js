import React, { useState } from "react";
import Sidebar from "./sidebar"; // Assuming this is the correct path to your Sidebar component
import {
  FaSquare,
  FaTrash,
  FaChevronDown,
} from "react-icons/fa";
import { IconTrash, IconEdit } from "@tabler/icons-react";

const AdminList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "recent", label: "Recent Activity" },
  ];

  return (
    <div className="adminlist-app">
      <Sidebar activeItem="Admin List" />
      <div className="adminlist-dashboard">
        <div className="adminlist-content">
          <h2>List of Admins</h2>
          <div className="adminlist-header">
            <input
              type="text"
              className="adminlist-search-input"
              placeholder="Search Admins"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="adminlist-actions">
              <button className="adminlist-action-button">View Archived</button>
            </div>
          </div>
          <div className="adminlist-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="adminlist-header-actions-icon">
                      <FaSquare className="adminlist-checkbox-icon" />
                      Actions
                    </div>
                  </th>
                  <th>Admin ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Created at</th>
                  <th>Updated at</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td>
                      <div className="adminlist-action-icons">
                        <FaSquare className="adminlist-checkbox-icon" />
                        <IconTrash size={16} className="adminlist-delete-icon" />
                        <IconEdit size={16} className="adminlist-edit-icon" />
                      </div>
                    </td>
                    <td></td>
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
          <div className="adminlist-pagination">
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

export default AdminList;