import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "../topnavbar/TopNavbar";
import { FaSquare, FaChevronDown, FaCheckSquare } from "react-icons/fa";
import { IconTrash, IconEdit, IconRefresh } from "@tabler/icons-react";
import "./../../../sass/components/_adminlist.scss";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [adminToArchive, setAdminToArchive] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "admin", label: "Admin" },
    { value: "moderator", label: "Moderator" },
    // Add more role types as needed
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("LaravelPassportToken");
        const [activeResponse, archivedResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/admins", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/admins/archived", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const activeAdmins = activeResponse.data.map(admin => ({ ...admin, archived: false }));
        const archivedAdmins = archivedResponse.data.map(admin => ({ ...admin, archived: true }));
        setAdmins([...activeAdmins, ...archivedAdmins]);
      } catch (error) {
        console.error("Error fetching admins:", error);
        setAdmins([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch = admin.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterValue === "all" || admin.role_name?.toLowerCase() === filterValue;
    const matchesArchived = admin.archived === showArchived;
    return matchesSearch && matchesFilter && matchesArchived;
  });

  const toggleSelectAdmin = (adminId) => {
    setSelectedAdmins((prev) =>
      prev.includes(adminId)
        ? prev.filter((id) => id !== adminId)
        : [...prev, adminId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedAdmins.length === filteredAdmins.length) {
      setSelectedAdmins([]);
    } else {
      setSelectedAdmins(filteredAdmins.map((admin) => admin.id));
    }
  };

  const handleToggleArchived = () => {
    setShowArchived((prev) => !prev);
    setPagination({ ...pagination, currentPage: 1 });
    setSelectedAdmins([]);
  };

  const handleArchiveClick = (admin) => {
    setAdminToArchive(admin);
    setIsConfirmModalOpen(true);
  };

  const handleArchiveConfirm = async () => {
    if (!adminToArchive) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const response = await axios.patch(
        `http://localhost:8000/api/admins/${adminToArchive.id}/archive`,
        { archived: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setAdmins((prevAdmins) =>
          prevAdmins.map((admin) =>
            admin.id === adminToArchive.id ? { ...admin, archived: true } : admin
          )
        );
        setIsConfirmModalOpen(false);
        setAdminToArchive(null);
      }
    } catch (error) {
      console.error("Error archiving admin:", error);
    }
  };

  const handleRestoreAdmin = async (adminId) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const response = await axios.patch(
        `http://localhost:8000/api/admins/${adminId}/archive`,
        { archived: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setAdmins((prevAdmins) =>
          prevAdmins.map((admin) =>
            admin.id === adminId ? { ...admin, archived: false } : admin
          )
        );
      }
    } catch (error) {
      console.error("Error restoring admin:", error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedAdmins.length === 0) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const requests = selectedAdmins.map((adminId) =>
        axios.patch(
          `http://localhost:8000/api/admins/${adminId}/archive`,
          { archived: action === "archive" },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await Promise.all(requests);
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          selectedAdmins.includes(admin.id)
            ? { ...admin, archived: action === "archive" }
            : admin
        )
      );
      setSelectedAdmins([]);
    } catch (error) {
      console.error(`Error ${action}ing admins:`, error);
    }
  };

  const adminsPerPage = 5;
  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);
  const currentAdmins = filteredAdmins.slice(
    (pagination.currentPage - 1) * adminsPerPage,
    pagination.currentPage * adminsPerPage
  );

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  return (
    <div className="app">
      <Sidebar activeItem="Admin List" />
      <TopNavbar />
      <div className="adminlist-dashboard">
        <div className="adminlist-content">
          <h2>{showArchived ? "Archived Admins" : "Admin List"}</h2>
          <div className="adminlist-header">
            <div className="left-actions">
              <input
                type="text"
                className="search-input"
                placeholder="Search Admins"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="right-actions">
              {selectedAdmins.length > 0 && (
                <button
                  className="header-button archive-all-button"
                  onClick={() => handleBulkAction(showArchived ? "restore" : "archive")}
                >
                  {showArchived ? "Restore All" : "Archive All"}
                </button>
              )}
              <button className="header-button">Add New</button>
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

          <div className="adminlist-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="header-actions-icon">
                      <span onClick={toggleSelectAll} style={{ cursor: "pointer" }}>
                        {selectedAdmins.length === filteredAdmins.length && filteredAdmins.length > 0 ? (
                          <FaCheckSquare className="checkbox-icon" />
                        ) : (
                          <FaSquare className="checkbox-icon" />
                        )}
                      </span>
                      Actions
                    </div>
                  </th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="loading-row">Loading admins...</td>
                  </tr>
                ) : currentAdmins.length > 0 ? (
                  currentAdmins.map((admin) => (
                    <tr key={admin.id}>
                      <td>
                        <div className="action-icons">
                          <span onClick={() => toggleSelectAdmin(admin.id)} style={{ cursor: "pointer" }}>
                            {selectedAdmins.includes(admin.id) ? (
                              <FaCheckSquare className="checkbox-icon" size={16} />
                            ) : (
                              <FaSquare className="checkbox-icon" size={16} />
                            )}
                          </span>
                          {showArchived ? (
                            <IconRefresh
                              size={16}
                              className="restore-icon"
                              onClick={() => handleRestoreAdmin(admin.id)}
                            />
                          ) : (
                            <IconTrash
                              size={16}
                              className="delete-icon"
                              onClick={() => handleArchiveClick(admin)}
                            />
                          )}
                          <IconEdit size={16} className="edit-icon" />
                        </div>
                      </td>
                      <td>{admin.username || "N/A"}</td>
                      <td>{admin.email || "N/A"}</td>
                      <td>{admin.role_name || "N/A"}</td>
                      <td>{formatDate(admin.created_at)}</td>
                      <td>{formatDate(admin.updated_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No {showArchived ? "archived" : "active"} admins found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="adminlist-pagination">
            <span>Page {pagination.currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
            >
              &lt;
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
              &gt;
            </button>
          </div>
        </div>
      </div>

      {isConfirmModalOpen && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <h3>Are you sure?</h3>
            <p>Do you want to archive "{adminToArchive?.username}"?</p>
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
    </div>
  );
};

export default AdminList;