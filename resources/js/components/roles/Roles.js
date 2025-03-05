import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "../topnavbar/TopNavbar";
import { FaSquare, FaChevronDown, FaCheckSquare } from "react-icons/fa";
import { IconTrash, IconEdit, IconRefresh } from "@tabler/icons-react";
import axios from "axios";
import "./../../../sass/components/_roles.scss";

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

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [roleToArchive, setRoleToArchive] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState(null);

  const filterOptions = [
    { value: "all", label: "All Roles" },
    { value: "Admin", label: "Admin" },
    { value: "Customer", label: "Customer" },
    { value: "Seller", label: "Seller" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("LaravelPassportToken");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const [activeResponse, archivedResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/roleslist", config),
          axios.get("http://127.0.0.1:8000/api/roleslist/archived", config),
        ]);

        const activeRoles = activeResponse.data.map(role => ({ ...role, archived: false }));
        const archivedRoles = archivedResponse.data.map(role => ({ ...role, archived: true }));
        setRoles([...activeRoles, ...archivedRoles]);
      } catch (error) {
        console.error("Error fetching roles:", error);
        console.log("Response:", error.response?.data);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredRoles = roles.filter((role) => {
    const matchesSearch = role.role_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterValue === "all" || role.role_name.toLowerCase() === filterValue.toLowerCase();
    const matchesArchived = role.archived === showArchived;
    return matchesSearch && matchesFilter && matchesArchived;
  });

  const toggleSelectRole = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRoles.length === filteredRoles.length) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(filteredRoles.map((role) => role.id));
    }
  };

  const handleToggleArchived = () => {
    setShowArchived((prev) => !prev);
    setPagination({ ...pagination, currentPage: 1 });
    setSelectedRoles([]);
  };

  const handleArchiveClick = (role) => {
    setRoleToArchive(role);
    setIsConfirmModalOpen(true);
  };

  const handleArchiveConfirm = async () => {
    if (!roleToArchive) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/roleslist/${roleToArchive.id}/archive`,
        { archived: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setRoles((prevRoles) =>
          prevRoles.map((role) =>
            role.id === roleToArchive.id ? { ...role, archived: true } : role
          )
        );
        setIsConfirmModalOpen(false);
        setRoleToArchive(null);
      }
    } catch (error) {
      console.error("Error archiving role:", error);
    }
  };

  const handleRestoreRole = async (roleId) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/roleslist/${roleId}/archive`,
        { archived: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setRoles((prevRoles) =>
          prevRoles.map((role) =>
            role.id === roleId ? { ...role, archived: false } : role
          )
        );
      }
    } catch (error) {
      console.error("Error restoring role:", error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedRoles.length === 0) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const requests = selectedRoles.map((roleId) =>
        axios.patch(
          `http://127.0.0.1:8000/api/roleslist/${roleId}/archive`,
          { archived: action === "archive" },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await Promise.all(requests);
      setRoles((prevRoles) =>
        prevRoles.map((role) =>
          selectedRoles.includes(role.id)
            ? { ...role, archived: action === "archive" }
            : role
        )
      );
      setSelectedRoles([]);
    } catch (error) {
      console.error(`Error ${action}ing roles:`, error);
    }
  };

  const handleAddNewClick = () => {
    setIsEditMode(false);
    setRoleToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (role) => {
    setIsEditMode(true);
    setRoleToEdit(role);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setRoleToEdit(null);
  };

  const handleRoleAdd = async (newRole) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/roleslist",
        newRole.formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        const addedRole = {
          id: response.data.role.id,
          role_name: response.data.role.role_name,
          created_at: response.data.role.created_at || new Date().toISOString(),
          updated_at: response.data.role.updated_at || new Date().toISOString(),
          archived: false,
        };
        setRoles((prevRoles) => [addedRole, ...prevRoles]);
        setPagination({ ...pagination, currentPage: 1 });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding role:", error.response?.data || error.message);
    }
  };

  const handleRoleUpdate = async (updatedRole) => {
    try {
        const token = localStorage.getItem("LaravelPassportToken");
        const payload = {
            role_name: updatedRole.formData.role_name,
        };
        console.log("Submitting Role update payload:", payload);
        const response = await axios.patch(
            `http://127.0.0.1:8000/api/roleslist/${roleToEdit.id}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.status === 200) {
            const editedRole = {
                id: response.data.role.id,
                role_name: response.data.role.role_name,
                created_at: roleToEdit.created_at,
                updated_at: response.data.role.updated_at || new Date().toISOString(),
                archived: roleToEdit.archived,
            };
            setRoles((prevRoles) =>
                prevRoles.map((role) => (role.id === editedRole.id ? editedRole : role))
            );
            setIsModalOpen(false); // Ensure this runs
            setRoleToEdit(null);   // Ensure this runs
            console.log("Role updated successfully:", editedRole);
        }
    } catch (error) {
        console.error("Error updating role:", JSON.stringify(error.response?.data || error.message));
        console.log("Response status:", error.response?.status);
        console.log("Response data:", error.response?.data);
        // Optionally keep modal open on error to show feedback
    }
};

  const rolesPerPage = 10;
  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);
  const currentPageRoles = filteredRoles.slice(
    (pagination.currentPage - 1) * rolesPerPage,
    pagination.currentPage * rolesPerPage
  );

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  return (
    <div className="app">
      <Sidebar activeItem="Roles" />
      <TopNavbar />
      <div className="roles-dashboard">
        <div className="roles-container">
          <h2>{showArchived ? "Archived Roles" : "Roles Management"}</h2>
          <div className="roles-header">
            <div className="left-actions">
              <input
                type="text"
                className="search-input"
                placeholder="Search Roles"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="right-actions">
              {selectedRoles.length > 0 && (
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
          <div className="roles-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="header-actions-icon">
                      <span onClick={toggleSelectAll} style={{ cursor: "pointer" }}>
                        {selectedRoles.length === filteredRoles.length && filteredRoles.length > 0 ? (
                          <FaCheckSquare className="checkbox-icon" />
                        ) : (
                          <FaSquare className="checkbox-icon" />
                        )}
                      </span>
                      Actions
                    </div>
                  </th>
                  <th>Role ID</th>
                  <th>Role Name</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="loading-row">Loading roles...</td>
                  </tr>
                ) : currentPageRoles.length > 0 ? (
                  currentPageRoles.map((role) => (
                    <tr key={role.id}>
                      <td>
                        <div className="action-icons">
                          <span onClick={() => toggleSelectRole(role.id)} style={{ cursor: "pointer" }}>
                            {selectedRoles.includes(role.id) ? (
                              <FaCheckSquare className="checkbox-icon" size={16} />
                            ) : (
                              <FaSquare className="checkbox-icon" size={16} />
                            )}
                          </span>
                          {showArchived ? (
                            <IconRefresh
                              size={16}
                              className="restore-icon"
                              onClick={() => handleRestoreRole(role.id)}
                            />
                          ) : (
                            <IconTrash
                              size={16}
                              className="delete-icon"
                              onClick={() => handleArchiveClick(role)}
                            />
                          )}
                          <IconEdit
                            size={16}
                            className="edit-icon"
                            onClick={() => handleEditClick(role)}
                          />
                        </div>
                      </td>
                      <td>{role.id}</td>
                      <td>{role.role_name}</td>
                      <td>{formatDate(role.created_at)}</td>
                      <td>{formatDate(role.updated_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      {roles.length === 0
                        ? "No roles available"
                        : "No roles match the current filters"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="roles-pagination">
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
            <p>Do you want to archive "{roleToArchive?.role_name}"?</p>
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
        <RoleModal
          onClose={handleModalClose}
          onSubmit={isEditMode ? handleRoleUpdate : handleRoleAdd}
          isEdit={isEditMode}
          initialData={roleToEdit}
        />
      )}
    </div>
  );
};

const RoleModal = ({ onClose, onSubmit, isEdit = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    role_name: isEdit && initialData ? initialData.role_name : '',
  });

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        role_name: initialData.role_name,
      });
    }
  }, [isEdit, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ formData });
  };

  return (
    <div className="modal-overlay">
      <div className="add-role-modal">
        <div className="modal-header">
          <h2>{isEdit ? "Edit Role" : "Add Role"}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="field-group full-width">
                <label>Role Name</label>
                <input
                  type="text"
                  name="role_name"
                  placeholder="Role Name"
                  value={formData.role_name}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="button-group">
                <button type="button" className="cancel-button" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  {isEdit ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Roles;