import React, { useState, useEffect } from 'react';
import axios from "axios";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "../topnavbar/TopNavbar";
import { FaSquare, FaChevronDown, FaCheckSquare } from "react-icons/fa";
import { IconTrash, IconEdit, IconRefresh } from "@tabler/icons-react";
import UserModal from "./UserModal";
import "./../../../sass/components/_usersdashboard.scss";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date(dateString));
};

const UsersDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToArchive, setUserToArchive] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [roles, setRoles] = useState([]);

  const filterOptions = [
    { value: "all", label: "All Users" },
    { value: "Admin", label: "Admins" },
    { value: "Customer", label: "Customers" },
    { value: "Seller", label: "Sellers" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("LaravelPassportToken");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const [activeResponse, archivedResponse, rolesResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/users", config),
          axios.get("http://127.0.0.1:8000/api/users/archived", config),
          axios.get("http://127.0.0.1:8000/api/roles", config),
        ]);

        console.log("Active Users Response:", activeResponse.data);
        console.log("Archived Users Response:", archivedResponse.data);

        const activeUsers = activeResponse.data.map(user => ({ ...user, archived: false }));
        const archivedUsers = archivedResponse.data.map(user => ({ ...user, archived: true }));
        setUsers([...activeUsers, ...archivedUsers]);
        setRoles(rolesResponse.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        console.log("Response:", error.response?.data);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterValue === "all" || user.role_name?.toLowerCase() === filterValue.toLowerCase();
    const matchesArchived = user.archived === showArchived;
    return matchesSearch && matchesFilter && matchesArchived;
  });

  const toggleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  const handleToggleArchived = () => {
    setShowArchived((prev) => !prev);
    setPagination({ ...pagination, currentPage: 1 });
    setSelectedUsers([]);
  };

  const handleArchiveClick = (user) => {
    setUserToArchive(user);
    setIsConfirmModalOpen(true);
  };

  const handleArchiveConfirm = async () => {
    if (!userToArchive) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/users/${userToArchive.id}/archive`,
        { archived: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userToArchive.id ? { ...user, archived: true } : user
          )
        );
        setIsConfirmModalOpen(false);
        setUserToArchive(null);
      }
    } catch (error) {
      console.error("Error archiving user:", error);
    }
  };

  const handleRestoreUser = async (userId) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/users/${userId}/archive`,
        { archived: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) { // Fixed status check from 201 to 200 for PATCH
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, archived: false } : user
          )
        );
      }
    } catch (error) {
      console.error("Error restoring user:", error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const requests = selectedUsers.map((userId) =>
        axios.patch(
          `http://127.0.0.1:8000/api/users/${userId}/archive`,
          { archived: action === "archive" },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await Promise.all(requests);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedUsers.includes(user.id)
            ? { ...user, archived: action === "archive" }
            : user
        )
      );
      setSelectedUsers([]);
    } catch (error) {
      console.error(`Error ${action}ing users:`, error);
    }
  };

  const handleAddNewClick = () => {
    setIsEditMode(false);
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = async (user) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      console.log("Token:", token); // Debug token
      const response = await axios.get(`http://127.0.0.1:8000/api/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("User data fetched for edit:", response.data);
      setUserToEdit({
        ...user,
        first_name: response.data.first_name || '',
        middlename: response.data.middlename || '',
        last_name: response.data.last_name || '',
        suffix: response.data.suffix || '',
        gender: response.data.gender || '',
        role_id: response.data.role_name ? roles.find(r => r.role_name === response.data.role_name)?.id || '' : '',
      });
      setIsEditMode(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching user for edit:", error);
      console.log("Error response:", error.response?.data);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setUserToEdit(null);
  };

  const handleUserAdd = async (newUser) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register",
        newUser,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 201) {
        console.log("Response data:", response.data);
        const addedUser = {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          role_name: roles.find((r) => r.id === parseInt(newUser.get('role_id')))?.role_name || "Unknown",
          profile_img: null, // No profile_img on add
          created_at: response.data.user.created_at || new Date().toISOString(),
          updated_at: response.data.user.updated_at || new Date().toISOString(),
          archived: false,
        };
        console.log("Added user object:", addedUser);
        setUsers((prevUsers) => {
          const updatedUsers = [addedUser, ...prevUsers];
          console.log("Updated users state:", updatedUsers);
          return updatedUsers;
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding user:", error.response?.data || error.message);
      console.log("Full error response:", error.response);
    }
  };

  const handleUserUpdate = async (updatedUser) => {
    try {
        const token = localStorage.getItem("LaravelPassportToken");
        console.log("Sending update with token:", token);

        const formDataEntries = {};
        for (let [key, value] of updatedUser.entries()) {
            formDataEntries[key] = value instanceof File ? value.name : value;
        }
        console.log("Update payload (FormData contents):", formDataEntries);

        const response = await axios.post(
            `http://127.0.0.1:8000/api/users/${userToEdit.id}`,
            updatedUser,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        if (response.status === 200) {
            console.log("Full response from update:", response.data);
            setUsers((prevUsers) => {
                const newUsers = prevUsers.map((user) =>
                    user.id === response.data.id ? { ...response.data } : user
                );
                console.log("Updated users state:", newUsers);
                return newUsers;
            });
            setIsModalOpen(false);
            setIsEditMode(false);
            setUserToEdit(null);
            console.log("User updated successfully:", response.data);
            console.log("Expected image URL:", `${baseImageUrl}${response.data.profile_img}`);
        }
    } catch (error) {
        console.error("Error updating user:", error.response?.data || error.message);
        console.log("Full error response:", error.response);
    }
};
  const usersPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (pagination.currentPage - 1) * usersPerPage,
    pagination.currentPage * usersPerPage
  );

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const baseImageUrl = "http://127.0.0.1:8000/";

  return (
    <div className="app">
      <Sidebar activeItem="Users" />
      <TopNavbar />
      <div className="usersdashboard-dashboard">
        <div className="usersdashboard-content">
          <h2>{showArchived ? "Archived Users" : "User Management"}</h2>
          <div className="usersdashboard-header">
            <div className="left-actions">
              <input
                type="text"
                className="search-input"
                placeholder="Search Users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="right-actions">
              {selectedUsers.length > 0 && (
                <button
                  className="header-button archive-all-button"
                  onClick={() => handleBulkAction(showArchived ? "restore" : "archive")}
                >
                  {showArchived ? "Restore All" : "Archive All"}
                </button>
              )}
              <button className="header-button" onClick={handleAddNewClick}>
                Add New
              </button>
              <button className="header-button" onClick={handleToggleArchived}>
                {showArchived ? "View Active" : "View Archived"}
              </button>
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

          <div className="usersdashboard-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="header-actions-icon">
                      <span onClick={toggleSelectAll} style={{ cursor: "pointer" }}>
                        {selectedUsers.length === filteredUsers.length && filteredUsers.length > 0 ? (
                          <FaCheckSquare className="checkbox-icon" />
                        ) : (
                          <FaSquare className="checkbox-icon" />
                        )}
                      </span>
                      Actions
                    </div>
                  </th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="loading-row">Loading users...</td>
                  </tr>
                ) : currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="action-icons">
                          <span onClick={() => toggleSelectUser(user.id)} style={{ cursor: "pointer" }}>
                            {selectedUsers.includes(user.id) ? (
                              <FaCheckSquare className="checkbox-icon" size={16} />
                            ) : (
                              <FaSquare className="checkbox-icon" size={16} />
                            )}
                          </span>
                          {showArchived ? (
                            <IconRefresh
                              size={16}
                              className="restore-icon"
                              onClick={() => handleRestoreUser(user.id)}
                            />
                          ) : (
                            <IconTrash
                              size={16}
                              className="delete-icon"
                              onClick={() => handleArchiveClick(user)}
                            />
                          )}
                          <IconEdit
                            size={16}
                            className="edit-icon"
                            onClick={() => handleEditClick(user)}
                          />
                        </div> {/* Added closing div tag */}
                      </td>
                      <td className="username-cell">
  <img
    src={user.profile_img ? `${baseImageUrl}${user.profile_img}` : `${baseImageUrl}images/pfp/default.png`}
    alt="Profile"
    className="profile-picture"
    onError={(e) => {
      console.log("Image load failed for:", `${baseImageUrl}${user.profile_img}`);
      e.target.src = `${baseImageUrl}images/pfp/default.png`;
    }}
  />
  {user.username || "N/A"}
</td>
                      <td>{user.role_name || "N/A"}</td>
                      <td>{user.email || "N/A"}</td>
                      <td>{formatDate(user.created_at)}</td>
                      <td>{formatDate(user.updated_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No {showArchived ? "archived" : "active"} users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="usersdashboard-pagination">
            <span>Page {pagination.currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
            >
              {"<"}
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={pagination.currentPage === index + 1 ? "active" : ""}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= totalPages}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>

      {isConfirmModalOpen && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <h3>Are you sure?</h3>
            <p>Do you want to archive "{userToArchive?.username}"?</p>
            <div className="confirm-modal-buttons">
              <button className="confirm-button" onClick={handleArchiveConfirm}>
                Yes, Archive
              </button>
              <button className="cancel-button" onClick={() => setIsConfirmModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <UserModal
          onClose={handleModalClose}
          onSubmit={isEditMode ? handleUserUpdate : handleUserAdd}
          isEdit={isEditMode}
          initialData={userToEdit}
        />
      )}
    </div>
  );
};

export default UsersDashboard;