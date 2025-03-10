import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./../sidebar/Sidebar";
import TopNavbar from "./../topnavbar/TopNavbar";
import { FaSquare, FaChevronDown, FaCheckSquare } from "react-icons/fa";
import { IconTrash, IconEdit, IconRefresh } from "@tabler/icons-react";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import "./../../../sass/components/_products.scss";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [filterLabel, setFilterLabel] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [categories, setCategories] = useState([{ value: "all", label: "All" }]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToArchive, setProductToArchive] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [error, setError] = useState(null);

  const productsPerPage = 8;

  const setAuthHeader = () => {
    const token = localStorage.getItem("LaravelPassportToken");
    if (!token) {
      setError("No token found. Please log in.");
      return false;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return true;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!setAuthHeader()) return;
      try {
        const { data } = await axios.get("http://127.0.0.1:8000/api/products");
        setProducts(
          data.map((product) => ({
            ...product,
            archived: Boolean(product.archived),
            id: product.id || Date.now(), // Fallback ID if missing
          }))
        );
        setError(null); // Clear error on success
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products.");
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!setAuthHeader()) return;
      try {
        const { data } = await axios.get("http://127.0.0.1:8000/api/categories");
        console.log("Categories API Response:", data);
        const fetchedCategories = Array.isArray(data)
          ? data.map((cat) => ({
              value: cat.category_name || "Unknown",
              label: cat.category_name || "Unknown",
            }))
          : [];
        console.log("Mapped Categories:", fetchedCategories);
        setCategories([{ value: "all", label: "All" }, ...fetchedCategories]);
        setError(null); // Clear error on success
      } catch (err) {
        console.error("Error fetching categories:", err.response || err.message);
        setError(err.response?.data?.message || "Failed to fetch categories.");
        setCategories([{ value: "all", label: "All" }]);
      }
    };
    fetchCategories();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterValue === "all" || product.category === filterValue) &&
      product.archived === showArchived
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;
  const currentProducts = filteredProducts.slice(
    (pagination.currentPage - 1) * productsPerPage,
    pagination.currentPage * productsPerPage
  );

  const handleFilterSelect = (value, label) => {
    setFilterValue(value);
    setFilterLabel(label);
    setFilterOpen(false);
    setPagination((prev) => ({ ...prev, currentPage: 1, totalPages }));
  };

  const toggleModal = (type, state, product = null) => {
    if (type === "add") setIsAddModalOpen(state);
    if (type === "edit") {
      setIsEditModalOpen(state);
      setProductToEdit(state ? product : null);
    }
    if (type === "confirm") {
      setIsConfirmModalOpen(state);
      setProductToArchive(state ? product : null);
    }
  };

  const handleProductAdd = async (newProduct) => {
    if (!setAuthHeader()) return;
    try {
      const { data, status } = await axios.post(
        "http://127.0.0.1:8000/api/products",
        newProduct,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (status === 201) {
        setProducts((prev) => [data, ...prev]);
        toggleModal("add", false);
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product.");
    }
  };

  const handleProductEdit = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    toggleModal("edit", false);
    setError(null);
  };

  const handleArchive = async (productId, archive) => {
    if (!setAuthHeader()) return;
    try {
      const { status } = await axios.patch(
        `http://127.0.0.1:8000/api/products/${productId}/archive`,
        { archived: archive }
      );
      if (status === 200) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, archived: archive } : p))
        );
        toggleModal("confirm", false);
        setError(null);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || `Failed to ${archive ? "archive" : "restore"} product.`
      );
    }
  };

  const handleBulkAction = async (action) => {
    if (!selectedProducts.length || !setAuthHeader()) return;
    try {
      await Promise.all(
        selectedProducts.map((id) =>
          axios.patch(`http://127.0.0.1:8000/api/products/${id}/archive`, {
            archived: action === "archive",
          })
        )
      );
      setProducts((prev) =>
        prev.map((p) =>
          selectedProducts.includes(p.id) ? { ...p, archived: action === "archive" } : p
        )
      );
      setSelectedProducts([]);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} products.`);
    }
  };

  const toggleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === filteredProducts.length
        ? []
        : filteredProducts.map((p) => p.id).filter(Boolean) // Ensure valid IDs
    );
  };

  const handleToggleArchived = () => {
    setShowArchived((prev) => !prev);
    setPagination((prev) => ({ ...prev, currentPage: 1, totalPages }));
    setSelectedProducts([]);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  return (
    <div className="app">
      <Sidebar activeItem="Products" />
      <TopNavbar />
      <div className="product-dashboard">
        <div className="product-products">
          <h2>{showArchived ? "Archived Products" : "Products"}</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="product-products-header">
            <div className="left-actions">
              <input
                type="text"
                className="search-input"
                placeholder="Search Products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value || "")}
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
              <button className="header-button" onClick={() => toggleModal("add", true)}>
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
                  <span>{filterLabel}</span>
                  <FaChevronDown />
                </button>
                {filterOpen && (
                  <ul className="filter-dropdown">
                    {categories.map((option) => (
                      <li
                        key={option.value}
                        onClick={() => handleFilterSelect(option.value, option.label)}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="product-product-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="header-actions-icon">
                      <span onClick={toggleSelectAll} style={{ cursor: "pointer" }}>
                        {selectedProducts.length === filteredProducts.length &&
                        filteredProducts.length > 0 ? (
                          <FaCheckSquare className="checkbox-icon" />
                        ) : (
                          <FaSquare className="checkbox-icon" />
                        )}
                      </span>
                      Actions
                    </div>
                  </th>
                  <th>Seller</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <tr key={product.id || Math.random()}> {/* Fallback key */}
                      <td>
                        <div className="action-icons">
                          <span
                            onClick={() => toggleSelectProduct(product.id)}
                            style={{ cursor: "pointer" }}
                          >
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
                              onClick={() => handleArchive(product.id, false)}
                            />
                          ) : (
                            <IconTrash
                              size={16}
                              className="delete-icon"
                              onClick={() => toggleModal("confirm", true, product)}
                            />
                          )}
                          <IconEdit
                            size={16}
                            className="edit-icon"
                            onClick={() => toggleModal("edit", true, product)}
                          />
                        </div>
                      </td>
                      <td>{product.profile_name || "N/A"}</td>
                      <td>
                        {product.product_img ? (
                          <img
                            src={product.product_img}
                            alt={product.product_name || "Product"}
                            className="product-image"
                            style={{ width: "3rem", height: "3rem", objectFit: "cover" }}
                            onError={(e) => (e.target.src = "/fallback-image.jpg")} // Fallback image
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td>{product.product_name || "Unnamed"}</td>
                      <td>{product.category || "Uncategorized"}</td>
                      <td>{product.brand || "N/A"}</td>
                      <td>
                        ₱{(product.price || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td>{product.quantity ?? "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">
                      {products.length === 0
                        ? "No products available"
                        : "No matching products found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="product-pagination">
            <span>
              Page {pagination.currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
            >
              &lt;
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={pagination.currentPage === i + 1 ? "active" : ""}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
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
      {isAddModalOpen && (
        <AddProductModal onClose={() => toggleModal("add", false)} onSubmit={handleProductAdd} />
      )}
      {isEditModalOpen && productToEdit && (
        <EditProductModal
          onClose={() => toggleModal("edit", false)}
          onEdit={handleProductEdit}
          product={productToEdit}
        />
      )}
      {isConfirmModalOpen && productToArchive && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <h3>Confirm Archive</h3>
            <p>Archive "{productToArchive.product_name || "this product"}"?</p>
            <div className="confirm-modal-buttons">
              <button
                className="confirm-button"
                onClick={() => handleArchive(productToArchive.id, true)}
              >
                Yes
              </button>
              <button className="cancel-button" onClick={() => toggleModal("confirm", false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;