import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSquare, FaChevronDown } from "react-icons/fa";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "../topnavbar/TopNavbar";
import "./../../../sass/components/_usersdashboard.scss";

const UsersDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/getUserList", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include if using Laravel Passport
        },
      })
      .then((response) => {
        console.log("Fetched Users:", response.data); // Debugging
        setUsers(response.data.users);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const filterOptions = [
    { value: "all", label: "All Users" },
    { value: "Admin", label: "Admins" },
    { value: "Customer", label: "Customer" },
    { value: "Seller", label: "Seller" },
  ];

  const filteredUsers =
    filterValue === "all"
      ? users
      : users.filter((user) => user.role_name === filterValue);


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(dateString));
  };

  return (
    <div className="app">
      <Sidebar activeItem="Users" />
      <TopNavbar />
      <div className="user-dashboard">
        <div className="user-users">
          <h2>User Management</h2>
          <div className="user-users-header">
            <div className="left-actions">
              <input
                type="text"
                className="search-users-input"
                placeholder="Search Users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="right-actions">
              <button className="action-button">Add User</button>
              <button className="action-button">View Archived</button>
              <div className="filter-container">
                <button
                  className="filter-button"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <span>Filter</span>
                  <FaChevronDown />
                </button>
                {filterOpen && (
                  <ul className="filter-dropdown">
                    {filterOptions.map((option) => (
                      <li
                        key={option.value}
                        onClick={() => {
                          setFilterValue(option.value);
                          setFilterOpen(false);
                        }}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="user-user-table">
            <table>
              <thead>
                <tr>
                  <th>Actions</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="action-icons">
                          <FaSquare className="checkbox-icon" size={16} />
                          <IconTrash size={16} className="delete-icon" />
                          <IconEdit size={16} className="edit-icon" />
                        </div>
                      </td>
                      <td>{user.username}</td>
                      <td>{user.role_name}</td>
                      <td>{user.email}</td>
                      <td>{formatDate(user.created_at)}</td>
                      <td>{formatDate(user.updated_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="user-pagination">
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

export default UsersDashboard;
