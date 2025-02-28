import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "../topnavbar/TopNavbar";
import { FaSquare, FaChevronDown, FaCheckSquare } from "react-icons/fa";
import { IconTrash, IconEdit, IconRefresh } from "@tabler/icons-react";
import axios from "axios";
import "./../../../sass/components/_statusandcategory.scss";

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

const StatusAndCategory = () => {
  const [activeTab, setActiveTab] = useState("statuses"); // Default to Statuses tab
  const [statuses, setStatuses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToArchive, setItemToArchive] = useState(null);
  const [statusPagination, setStatusPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [categoryPagination, setCategoryPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("LaravelPassportToken");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const [statusActiveResponse, statusArchivedResponse, categoryActiveResponse, categoryArchivedResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/statuses", config),
          axios.get("http://127.0.0.1:8000/api/statuses/archived", config),
          axios.get("http://127.0.0.1:8000/api/categories", config),
          axios.get("http://127.0.0.1:8000/api/categories/archived", config),
        ]);

        const activeStatuses = statusActiveResponse.data.map(status => ({ ...status, archived: false }));
        const archivedStatuses = statusArchivedResponse.data.map(status => ({ ...status, archived: true }));
        const activeCategories = categoryActiveResponse.data.map(category => ({ ...category, archived: false }));
        const archivedCategories = categoryArchivedResponse.data.map(category => ({ ...category, archived: true }));

        setStatuses([...activeStatuses, ...archivedStatuses]);
        setCategories([...activeCategories, ...archivedCategories]);
      } catch (error) {
        console.error("Error fetching data:", error);
        console.log("Response:", error.response?.data);
        setStatuses([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredStatuses = statuses.filter((status) =>
    status.status_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    status.archived === showArchived
  );
  const filteredCategories = categories.filter((category) =>
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    category.archived === showArchived
  );

  const itemsPerPage = 10;
  const totalStatusPages = Math.ceil(filteredStatuses.length / itemsPerPage);
  const totalCategoryPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const currentStatuses = filteredStatuses.slice(
    (statusPagination.currentPage - 1) * itemsPerPage,
    statusPagination.currentPage * itemsPerPage
  );
  const currentCategories = filteredCategories.slice(
    (categoryPagination.currentPage - 1) * itemsPerPage,
    categoryPagination.currentPage * itemsPerPage
  );

  const toggleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    const currentItems = activeTab === "statuses" ? filteredStatuses : filteredCategories;
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentItems.map((item) => item.id));
    }
  };

  const handleToggleArchived = () => {
    setShowArchived((prev) => !prev);
    setStatusPagination({ ...statusPagination, currentPage: 1 });
    setCategoryPagination({ ...categoryPagination, currentPage: 1 });
    setSelectedItems([]);
  };

  const handleArchiveClick = (item) => {
    setItemToArchive(item);
    setIsConfirmModalOpen(true);
  };

  const handleArchiveConfirm = async () => {
    if (!itemToArchive) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const endpoint = activeTab === "statuses" ? "statuses" : "categories";
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/${endpoint}/${itemToArchive.id}/archive`,
        { archived: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        if (activeTab === "statuses") {
          setStatuses((prevStatuses) =>
            prevStatuses.map((status) =>
              status.id === itemToArchive.id ? { ...status, archived: true } : status
            )
          );
        } else {
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category.id === itemToArchive.id ? { ...category, archived: true } : category
            )
          );
        }
        setIsConfirmModalOpen(false);
        setItemToArchive(null);
      }
    } catch (error) {
      console.error("Error archiving item:", error);
    }
  };

  const handleRestoreItem = async (itemId) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const endpoint = activeTab === "statuses" ? "statuses" : "categories";
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/${endpoint}/${itemId}/archive`,
        { archived: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        if (activeTab === "statuses") {
          setStatuses((prevStatuses) =>
            prevStatuses.map((status) =>
              status.id === itemId ? { ...status, archived: false } : status
            )
          );
        } else {
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category.id === itemId ? { ...category, archived: false } : category
            )
          );
        }
      }
    } catch (error) {
      console.error("Error restoring item:", error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const endpoint = activeTab === "statuses" ? "statuses" : "categories";
      const requests = selectedItems.map((itemId) =>
        axios.patch(
          `http://127.0.0.1:8000/api/${endpoint}/${itemId}/archive`,
          { archived: action === "archive" },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await Promise.all(requests);
      if (activeTab === "statuses") {
        setStatuses((prevStatuses) =>
          prevStatuses.map((status) =>
            selectedItems.includes(status.id)
              ? { ...status, archived: action === "archive" }
              : status
          )
        );
      } else {
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            selectedItems.includes(category.id)
              ? { ...category, archived: action === "archive" }
              : category
          )
        );
      }
      setSelectedItems([]);
    } catch (error) {
      console.error(`Error ${action}ing items:`, error);
    }
  };

  const handleAddNewClick = () => {
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleItemAdd = async (newItem) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const endpoint = activeTab === "statuses" ? "statuses" : "categories";
      const response = await axios.post(
        `http://127.0.0.1:8000/api/${endpoint}`,
        newItem.formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        const addedItem = {
          id: response.data.item.id,
          [activeTab === "statuses" ? "status_name" : "category_name"]: response.data.item.name,
          created_at: response.data.item.created_at || new Date().toISOString(),
          updated_at: response.data.item.updated_at || new Date().toISOString(),
          archived: false,
        };
        if (activeTab === "statuses") {
          setStatuses((prevStatuses) => [addedItem, ...prevStatuses]);
        } else {
          setCategories((prevCategories) => [addedItem, ...prevCategories]);
        }
        setPagination({ currentPage: 1, totalPages: activeTab === "statuses" ? totalStatusPages : totalCategoryPages });
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding item:", error.response?.data || error.message);
    }
  };

  const handleStatusPageChange = (page) => {
    setStatusPagination({ ...statusPagination, currentPage: page });
  };

  const handleCategoryPageChange = (page) => {
    setCategoryPagination({ ...categoryPagination, currentPage: page });
  };

  return (
    <div className="app">
      <Sidebar activeItem="StatusAndCategory" />
      <div className="main-content-wrapper">
        <TopNavbar />
        <div className="statusandcategory-dashboard">
          <div className="statusandcategory-content">
            <h2>{showArchived ? "Archived Statuses & Categories" : "Statuses & Categories"}</h2>
            <div className="tabs">
              <button
                className={`tab-button ${activeTab === "statuses" ? "active" : ""}`}
                onClick={() => setActiveTab("statuses")}
              >
                Statuses
              </button>
              <button
                className={`tab-button ${activeTab === "categories" ? "active" : ""}`}
                onClick={() => setActiveTab("categories")}
              >
                Categories
              </button>
            </div>
            <div className="statusandcategory-header">
              <div className="left-actions">
                <input
                  type="text"
                  className="search-input"
                  placeholder={`Search ${activeTab === "statuses" ? "Statuses" : "Categories"}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="right-actions">
                {selectedItems.length > 0 && (
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
              </div>
            </div>

            {activeTab === "statuses" && (
              <>
                <div className="statusandcategory-table">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <div className="header-actions-icon">
                            <span onClick={toggleSelectAll} style={{ cursor: "pointer" }}>
                              {selectedItems.length === filteredStatuses.length && filteredStatuses.length > 0 ? (
                                <FaCheckSquare className="checkbox-icon" />
                              ) : (
                                <FaSquare className="checkbox-icon" />
                              )}
                            </span>
                            Actions
                          </div>
                        </th>
                        <th>ID</th>
                        <th>Status Name</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="loading-row">Loading statuses...</td>
                        </tr>
                      ) : currentStatuses.length > 0 ? (
                        currentStatuses.map((status) => (
                          <tr key={status.id}>
                            <td>
                              <div className="action-icons">
                                <span onClick={() => toggleSelectItem(status.id)} style={{ cursor: "pointer" }}>
                                  {selectedItems.includes(status.id) ? (
                                    <FaCheckSquare className="checkbox-icon" size={16} />
                                  ) : (
                                    <FaSquare className="checkbox-icon" size={16} />
                                  )}
                                </span>
                                {showArchived ? (
                                  <IconRefresh
                                    size={16}
                                    className="restore-icon"
                                    onClick={() => handleRestoreItem(status.id)}
                                  />
                                ) : (
                                  <IconTrash
                                    size={16}
                                    className="delete-icon"
                                    onClick={() => handleArchiveClick(status)}
                                  />
                                )}
                                <IconEdit size={16} className="edit-icon" />
                              </div>
                            </td>
                            <td>{status.id}</td>
                            <td>{status.status_name}</td>
                            <td>{formatDate(status.created_at)}</td>
                            <td>{formatDate(status.updated_at)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No statuses found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="statusandcategory-pagination">
                  <span>Page {statusPagination.currentPage} of {totalStatusPages}</span>
                  <button
                    onClick={() => handleStatusPageChange(statusPagination.currentPage - 1)}
                    disabled={statusPagination.currentPage <= 1}
                  >
                    {"<"}
                  </button>
                  {[...Array(totalStatusPages)].map((_, index) => (
                    <button
                      key={index}
                      className={statusPagination.currentPage === index + 1 ? "active" : ""}
                      onClick={() => handleStatusPageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handleStatusPageChange(statusPagination.currentPage + 1)}
                    disabled={statusPagination.currentPage >= totalStatusPages}
                  >
                    {">"}
                  </button>
                </div>
              </>
            )}

            {activeTab === "categories" && (
              <>
                <div className="statusandcategory-table">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <div className="header-actions-icon">
                            <span onClick={toggleSelectAll} style={{ cursor: "pointer" }}>
                              {selectedItems.length === filteredCategories.length && filteredCategories.length > 0 ? (
                                <FaCheckSquare className="checkbox-icon" />
                              ) : (
                                <FaSquare className="checkbox-icon" />
                              )}
                            </span>
                            Actions
                          </div>
                        </th>
                        <th>ID</th>
                        <th>Category Name</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="loading-row">Loading categories...</td>
                        </tr>
                      ) : currentCategories.length > 0 ? (
                        currentCategories.map((category) => (
                          <tr key={category.id}>
                            <td>
                              <div className="action-icons">
                                <span onClick={() => toggleSelectItem(category.id)} style={{ cursor: "pointer" }}>
                                  {selectedItems.includes(category.id) ? (
                                    <FaCheckSquare className="checkbox-icon" size={16} />
                                  ) : (
                                    <FaSquare className="checkbox-icon" size={16} />
                                  )}
                                </span>
                                {showArchived ? (
                                  <IconRefresh
                                    size={16}
                                    className="restore-icon"
                                    onClick={() => handleRestoreItem(category.id)}
                                  />
                                ) : (
                                  <IconTrash
                                    size={16}
                                    className="delete-icon"
                                    onClick={() => handleArchiveClick(category)}
                                  />
                                )}
                                <IconEdit size={16} className="edit-icon" />
                              </div>
                            </td>
                            <td>{category.id}</td>
                            <td>{category.category_name}</td>
                            <td>{formatDate(category.created_at)}</td>
                            <td>{formatDate(category.updated_at)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No categories found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="statusandcategory-pagination">
                  <span>Page {categoryPagination.currentPage} of {totalCategoryPages}</span>
                  <button
                    onClick={() => handleCategoryPageChange(categoryPagination.currentPage - 1)}
                    disabled={categoryPagination.currentPage <= 1}
                  >
                    {"<"}
                  </button>
                  {[...Array(totalCategoryPages)].map((_, index) => (
                    <button
                      key={index}
                      className={categoryPagination.currentPage === index + 1 ? "active" : ""}
                      onClick={() => handleCategoryPageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handleCategoryPageChange(categoryPagination.currentPage + 1)}
                    disabled={categoryPagination.currentPage >= totalCategoryPages}
                  >
                    {">"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isConfirmModalOpen && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <h3>Are you sure?</h3>
            <p>Do you want to archive "{activeTab === 'statuses' ? itemToArchive?.status_name : itemToArchive?.category_name}"?</p>
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
      {isAddModalOpen && (
        <AddItemModal onClose={handleModalClose} onSubmit={handleItemAdd} activeTab={activeTab} />
      )}
    </div>
  );
};

const AddItemModal = ({ onClose, onSubmit, activeTab }) => {
  const [formData, setFormData] = useState({
    name: '',
  });

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
      <div className="add-item-modal">
        <div className="modal-header">
          <h2>Add {activeTab === "statuses" ? "Status" : "Category"}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="field-group full-width">
                <label>{activeTab === "statuses" ? "Status Name" : "Category Name"}</label>
                <input
                  type="text"
                  name="name"
                  placeholder={activeTab === "statuses" ? "Status Name" : "Category Name"}
                  value={formData.name}
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
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StatusAndCategory;