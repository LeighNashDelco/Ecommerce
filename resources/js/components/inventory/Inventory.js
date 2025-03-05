import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "../topnavbar/TopNavbar";
import { FaSquare, FaChevronDown, FaCheckSquare } from "react-icons/fa";
import { IconTrash, IconEdit, IconRefresh } from "@tabler/icons-react";
import axios from "axios";
import "./../../../sass/components/_inventory.scss"; // Adjust path as needed

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

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToArchive, setProductToArchive] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("LaravelPassportToken");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const [activeResponse, archivedResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/inventory", config),
          axios.get("http://127.0.0.1:8000/api/inventory/archived", config),
        ]);

        const activeProducts = activeResponse.data.map(product => ({ ...product, archived: false }));
        const archivedProducts = archivedResponse.data.map(product => ({ ...product, archived: true }));
        setProducts([...activeProducts, ...archivedProducts]);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        console.log("Response:", JSON.stringify(error.response?.data || error.message));
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    product.archived === showArchived
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (pagination.currentPage - 1) * itemsPerPage,
    pagination.currentPage * itemsPerPage
  );

  const toggleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((product) => product.id));
    }
  };

  const handleToggleArchived = () => {
    setShowArchived((prev) => !prev);
    setPagination({ ...pagination, currentPage: 1 });
    setSelectedProducts([]);
  };

  const handleArchiveClick = (product) => {
    setProductToArchive(product);
    setIsConfirmModalOpen(true);
  };

  const handleArchiveConfirm = async () => {
    if (!productToArchive) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/inventory/${productToArchive.id}/archive`,
        { archived: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productToArchive.id ? { ...product, archived: true } : product
          )
        );
        setIsConfirmModalOpen(false);
        setProductToArchive(null);
      }
    } catch (error) {
      console.error("Error archiving product:", error);
    }
  };

  const handleRestoreProduct = async (productId) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/inventory/${productId}/archive`,
        { archived: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId ? { ...product, archived: false } : product
          )
        );
      }
    } catch (error) {
      console.error("Error restoring product:", error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const requests = selectedProducts.map((productId) =>
        axios.patch(
          `http://127.0.0.1:8000/api/inventory/${productId}/archive`,
          { archived: action === "archive" },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await Promise.all(requests);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          selectedProducts.includes(product.id)
            ? { ...product, archived: action === "archive" }
            : product
        )
      );
      setSelectedProducts([]);
    } catch (error) {
      console.error(`Error ${action}ing products:`, error);
    }
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  return (
    <div className="app">
      <Sidebar activeItem="InventoryManagement" />
      <div className="main-content-wrapper">
        <TopNavbar />
        <div className="inventorymanagement-dashboard">
          <div className="inventorymanagement-content">
            <h2>{showArchived ? "Archived Inventory" : "Inventory Management"}</h2>
            <div className="inventorymanagement-header">
              <div className="left-actions">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search Products"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="right-actions">
                {selectedProducts.length > 0 && (
                  <button
                    className="header-button archive-all-button"
                    onClick={() => handleBulkAction(showArchived ? "restore" : "archive")}
                  >
                    {showArchived ? "Restore All" : "Archive All"}
                  </button>
                )}
                <button className="header-button" onClick={handleToggleArchived}>
                  {showArchived ? "View Active" : "View Archived"}
                </button>
              </div>
            </div>
            <div className="inventorymanagement-table">
              <table>
                <thead>
                  <tr>
                    <th>
                      <div className="header-actions-icon">
                        <span onClick={toggleSelectAll} style={{ cursor: "pointer" }}>
                          {selectedProducts.length === filteredProducts.length && filteredProducts.length > 0 ? (
                            <FaCheckSquare className="checkbox-icon" />
                          ) : (
                            <FaSquare className="checkbox-icon" />
                          )}
                        </span>
                        Actions
                      </div>
                    </th>
                    <th>Product Image</th>
                    <th>Product Name</th>
                    <th>Current Stock</th>
                    <th>Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="loading-row">Loading inventory...</td>
                    </tr>
                  ) : currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="action-icons">
                            <span onClick={() => toggleSelectProduct(product.id)} style={{ cursor: "pointer" }}>
                              {selectedProducts.includes(product.id) ? (
                                <FaCheckSquare className="checkbox-icon" size={16} />
                              ) : (
                                <FaSquare className="checkbox-icon" size={16} />
                              )}
                            </span>
                            {showArchived ? (
                              <IconRefresh
                                size={16}
                                className="restore-icon"
                                onClick={() => handleRestoreProduct(product.id)}
                              />
                            ) : (
                              <IconTrash
                                size={16}
                                className="delete-icon"
                                onClick={() => handleArchiveClick(product)}
                              />
                            )}
                            <IconEdit size={16} className="edit-icon" />
                          </div>
                        </td>
                        <td>
                          {product.product_img ? (
                            <img
                              src={product.product_img}
                              alt={product.product_name}
                              style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td>{product.product_name}</td>
                        <td>{product.quantity}</td>
                        <td>{product.sold || 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No products found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="inventorymanagement-pagination">
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
            <p>Do you want to archive "{productToArchive?.product_name}"?</p>
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

export default InventoryManagement;