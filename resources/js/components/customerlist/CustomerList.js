import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "./../topnavbar/TopNavbar";
import {
  FaSquare,
  FaTrash,
  FaChevronDown,
} from "react-icons/fa";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import "./../../../sass/components/_customerlist.scss";

const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "recent", label: "Recent Activity" },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="customer-app">
      <Sidebar activeItem="Customer List" />
      <TopNavbar />
      <div className="customer-dashboard">
        <div className="customer-content">
          <h2>Customer</h2>
          <div className="customer-header">
            <input
              type="text"
              className="customer-search-input"
              placeholder="Search Users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="customer-actions">
              <button className="customer-action-button">View Archived</button>
            </div>
          </div>
          <div className="customer-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="customer-header-actions-icon">
                      <FaSquare className="customer-checkbox-icon" />
                      Actions
                    </div>
                  </th>
                  <th>User ID</th>
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
                      <div className="customer-action-icons">
                        <FaSquare className="customer-checkbox-icon" size={16} />
                        <IconTrash size={16} className="customer-delete-icon" />
                        <IconEdit size={16} className="customer-edit-icon" />
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
          <div className="customer-pagination">
            <span>Page 1 of 1</span>
            <button>&lt;</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;