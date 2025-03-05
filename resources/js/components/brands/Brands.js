import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "../topnavbar/TopNavbar";
import { FaSquare, FaCheckSquare } from "react-icons/fa";
import { IconTrash, IconEdit, IconRefresh } from "@tabler/icons-react";
import axios from "axios";
import "./../../../sass/components/_brands.scss";

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

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [brandToArchive, setBrandToArchive] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("LaravelPassportToken");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const [activeResponse, archivedResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/brands/active", config),
          axios.get("http://127.0.0.1:8000/api/brands/archived", config),
        ]);

        const activeBrands = activeResponse.data.map(brand => ({ ...brand, archived: false }));
        const archivedBrands = archivedResponse.data.map(brand => ({ ...brand, archived: true }));
        setBrands([...activeBrands, ...archivedBrands]);
      } catch (error) {
        console.error("Error fetching brands:", error);
        console.log("Response:", JSON.stringify(error.response?.data || error.message));
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBrands = brands.filter((brand) =>
    brand.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    brand.archived === showArchived
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const currentBrands = filteredBrands.slice(
    (pagination.currentPage - 1) * itemsPerPage,
    pagination.currentPage * itemsPerPage
  );

  const toggleSelectBrand = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedBrands.length === filteredBrands.length) {
      setSelectedBrands([]);
    } else {
      setSelectedBrands(filteredBrands.map((brand) => brand.id));
    }
  };

  const handleToggleArchived = () => {
    setShowArchived((prev) => !prev);
    setPagination({ ...pagination, currentPage: 1 });
    setSelectedBrands([]);
  };

  const handleArchiveClick = (brand) => {
    setBrandToArchive(brand);
    setIsConfirmModalOpen(true);
  };

  const handleArchiveConfirm = async () => {
    if (!brandToArchive) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/brands/${brandToArchive.id}/archive`,
        { archived: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setBrands((prevBrands) =>
          prevBrands.map((brand) =>
            brand.id === brandToArchive.id ? { ...brand, archived: true } : brand
          )
        );
        setIsConfirmModalOpen(false);
        setBrandToArchive(null);
      }
    } catch (error) {
      console.error("Error archiving brand:", error);
    }
  };

  const handleRestoreBrand = async (brandId) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/brands/${brandId}/archive`,
        { archived: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setBrands((prevBrands) =>
          prevBrands.map((brand) =>
            brand.id === brandId ? { ...brand, archived: false } : brand
          )
        );
      }
    } catch (error) {
      console.error("Error restoring brand:", error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedBrands.length === 0) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const requests = selectedBrands.map((brandId) =>
        axios.patch(
          `http://127.0.0.1:8000/api/brands/${brandId}/archive`,
          { archived: action === "archive" },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await Promise.all(requests);
      setBrands((prevBrands) =>
        prevBrands.map((brand) =>
          selectedBrands.includes(brand.id)
            ? { ...brand, archived: action === "archive" }
            : brand
        )
      );
      setSelectedBrands([]);
    } catch (error) {
      console.error(`Error ${action}ing brands:`, error);
    }
  };

  const handleAddNewClick = () => {
    setIsEditMode(false);
    setBrandToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (brand) => {
    setIsEditMode(true);
    setBrandToEdit(brand);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setBrandToEdit(null);
  };

  const handleBrandAdd = async (newBrand) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      console.log("Adding brand payload:", newBrand.formData);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/brands",
        newBrand.formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        const addedBrand = {
          id: response.data.brand.id,
          brand_name: response.data.brand.brand_name,
          created_at: response.data.brand.created_at || new Date().toISOString(),
          updated_at: response.data.brand.updated_at || new Date().toISOString(),
          archived: false,
        };
        console.log("Added brand:", addedBrand);
        setBrands((prevBrands) => [addedBrand, ...prevBrands]);
        setPagination({ ...pagination, currentPage: 1, totalPages: Math.ceil((brands.length + 1) / itemsPerPage) });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding brand:", JSON.stringify(error.response?.data || error.message));
    }
  };

  const handleBrandUpdate = async (updatedBrand) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const payload = {
        brand_name: updatedBrand.formData.brand_name,
      };
      console.log("Submitting Brand update payload:", payload);
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/brands/${brandToEdit.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        const editedBrand = {
          id: response.data.brand.id,
          brand_name: response.data.brand.brand_name,
          created_at: brandToEdit.created_at,
          updated_at: response.data.brand.updated_at || new Date().toISOString(),
          archived: brandToEdit.archived,
        };
        setBrands((prevBrands) =>
          prevBrands.map((brand) => (brand.id === editedBrand.id ? editedBrand : brand))
        );
        setIsModalOpen(false);
        setBrandToEdit(null);
        console.log("Brand updated successfully:", editedBrand);
      }
    } catch (error) {
      console.error("Error updating brand:", JSON.stringify(error.response?.data || error.message));
    }
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  return (
    <div className="app">
      <Sidebar activeItem="Brands" />
      <div className="main-content-wrapper">
        <TopNavbar />
        <div className="brands-dashboard">
          <div className="brands-content">
            <h2>{showArchived ? "Archived Brands" : "Brands"}</h2>
            <div className="brands-header">
              <div className="left-actions">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search Brands"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="right-actions">
                {selectedBrands.length > 0 && (
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
            <div className="brands-table">
              <table>
                <thead>
                  <tr>
                    <th>
                      <div className="header-actions-icon">
                        <span onClick={toggleSelectAll} style={{ cursor: "pointer" }}>
                          {selectedBrands.length === filteredBrands.length && filteredBrands.length > 0 ? (
                            <FaCheckSquare className="checkbox-icon" />
                          ) : (
                            <FaSquare className="checkbox-icon" />
                          )}
                        </span>
                        Actions
                      </div>
                    </th>
                    <th>ID</th>
                    <th>Brand Name</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="loading-row">Loading brands...</td>
                    </tr>
                  ) : currentBrands.length > 0 ? (
                    currentBrands.map((brand) => (
                      <tr key={brand.id}>
                        <td>
                          <div className="action-icons">
                            <span onClick={() => toggleSelectBrand(brand.id)} style={{ cursor: "pointer" }}>
                              {selectedBrands.includes(brand.id) ? (
                                <FaCheckSquare className="checkbox-icon" size={16} />
                              ) : (
                                <FaSquare className="checkbox-icon" size={16} />
                              )}
                            </span>
                            {showArchived ? (
                              <IconRefresh
                                size={16}
                                className="restore-icon"
                                onClick={() => handleRestoreBrand(brand.id)}
                              />
                            ) : (
                              <IconTrash
                                size={16}
                                className="delete-icon"
                                onClick={() => handleArchiveClick(brand)}
                              />
                            )}
                            <IconEdit
                              size={16}
                              className="edit-icon"
                              onClick={() => handleEditClick(brand)}
                            />
                          </div>
                        </td>
                        <td>{brand.id}</td>
                        <td>{brand.brand_name}</td>
                        <td>{formatDate(brand.created_at)}</td>
                        <td>{formatDate(brand.updated_at)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No brands found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="brands-pagination">
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
      </div>

      {isConfirmModalOpen && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <h3>Are you sure?</h3>
            <p>Do you want to archive "{brandToArchive?.brand_name}"?</p>
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
        <BrandModal
          onClose={handleModalClose}
          onSubmit={isEditMode ? handleBrandUpdate : handleBrandAdd}
          isEdit={isEditMode}
          initialData={brandToEdit}
        />
      )}
    </div>
  );
};

const BrandModal = ({ onClose, onSubmit, isEdit = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    brand_name: isEdit && initialData ? initialData.brand_name : '',
  });

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        brand_name: initialData.brand_name,
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
      <div className="add-brand-modal">
        <div className="modal-header">
          <h2>{isEdit ? "Edit Brand" : "Add Brand"}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="field-group full-width">
                <label>Brand Name</label>
                <input
                  type="text"
                  name="brand_name"
                  placeholder="Brand Name"
                  value={formData.brand_name}
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

export default Brands;