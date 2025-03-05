import React, { useState, useEffect } from "react";
import Sidebar from "./../sidebar/Sidebar";
import TopNavbar from "./../topnavbar/TopNavbar";
import { FaSquare, FaChevronDown, FaCheckSquare } from "react-icons/fa";
import { IconTrash, IconEdit, IconRefresh } from "@tabler/icons-react";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import axios from "axios";
import "./../../../sass/components/_products.scss";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToArchive, setProductToArchive] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [showArchived, setShowArchived] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "Gaming Mouse", label: "Gaming Mouse" },
    { value: "Wireless Mouse", label: "Wireless Mouse" },
    { value: "Office Mouse", label: "Office Mouse" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("LaravelPassportToken");
        const response = await axios.get("http://127.0.0.1:8000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedProducts = response.data.map((product) => ({
          ...product,
          archived: Boolean(product.archived) === true,
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProducts([]);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterValue === "all" || product.category === filterValue;
    const matchesArchived = product.archived === showArchived;
    return matchesSearch && matchesFilter && matchesArchived;
  });

  const handleAddNewClick = () => {
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setProductToEdit(null);
  };

  const handleProductAdd = async (newProduct) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      if (!token) throw new Error("No token found. Please log in.");
      console.log("Adding product with FormData:", Array.from(newProduct.entries()));
      const response = await axios.post(
        "http://127.0.0.1:8000/api/products",
        newProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        const addedProduct = response.data;
        console.log("Added product:", addedProduct);
        setProducts((prevProducts) => [addedProduct, ...prevProducts]);
        handleModalClose();
      }
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error.message);
    }
  };

  const handleEditClick = (product) => {
    console.log("Editing product:", product);
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };

  const handleProductEdit = (updatedProduct) => {
    console.log("Updated product from backend:", updatedProduct);
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    handleModalClose();
  };

  const handleArchiveClick = (product) => {
    setProductToArchive(product);
    setIsConfirmModalOpen(true);
  };

  const handleArchiveConfirm = async () => {
    if (!productToArchive) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      if (!token) throw new Error("No token found. Please log in.");
      console.log("Archiving URL:", `http://127.0.0.1:8000/api/products/${productToArchive.id}/archive`);
      console.log("Payload:", { archived: true });
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/products/${productToArchive.id}/archive`,
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
      console.error("Error archiving product:", error.response?.data || error.message);
      alert(error.message || "Failed to archive product.");
    }
  };

  const handleRestoreProduct = async (productId) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      if (!token) throw new Error("No token found. Please log in.");
      console.log("Restoring URL:", `http://127.0.0.1:8000/api/products/${productId}/archive`);
      console.log("Payload:", { archived: false });
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/products/${productId}/archive`,
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
      console.error("Error restoring product:", error.response?.data || error.message);
      alert(error.message || "Failed to restore product.");
    }
  };

  const toggleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((product) => product.id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      if (!token) throw new Error("No token found. Please log in.");
      const requests = selectedProducts.map((productId) =>
        axios.patch(
          `http://127.0.0.1:8000/api/products/${productId}/archive`,
          { archived: action === "archive" },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      console.log("Bulk action URLs:", selectedProducts.map((id) => `http://127.0.0.1:8000/api/products/${id}/archive`));
      console.log("Payload:", { archived: action === "archive" });
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
      console.error(`Error ${action}ing products:`, error.response?.data || error.message);
      alert(`Failed to ${action} products.`);
    }
  };

  const handleToggleArchived = () => {
    setShowArchived((prev) => !prev);
    setPagination({ ...pagination, currentPage: 1 });
    setSelectedProducts([]);
  };

  const productsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentPageProducts = filteredProducts.slice(
    (pagination.currentPage - 1) * productsPerPage,
    pagination.currentPage * productsPerPage
  );

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  return (
    <div className="app">
      <Sidebar activeItem="Products" />
      <TopNavbar />
      <div className="product-dashboard">
        <div className="product-products">
          <h2>{showArchived ? "Archived Products" : "Products"}</h2>
          <div className="product-products-header">
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
          <div className="product-product-table">
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
                  <th>Seller</th>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {currentPageProducts.length > 0 ? (
                  currentPageProducts.map((product) => (
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
                          <IconEdit
                            size={16}
                            className="edit-icon"
                            onClick={() => handleEditClick(product)}
                          />
                        </div>
                      </td>
                      <td>{product.profile_name}</td>
                      <td>
                        {product.product_img ? (
                          <img
                            src={product.product_img}
                            alt={product.product_name}
                            className="product-image"
                            style={{ width: "3rem", height: "3rem", objectFit: "cover" }}
                          />
                        ) : (
                          <div>No Image</div>
                        )}
                      </td>
                      <td>{product.product_name}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                      <td>₱{product.price}</td>
                      <td>{product.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">
                      {products.length === 0
                        ? "No products available"
                        : "No products match the current filters"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="product-pagination">
            <span>Page {pagination.currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
            >
&gt;            </button>
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
&gt;            </button>
          </div>
        </div>
      </div>
      {isAddModalOpen && <AddProductModal onClose={handleModalClose} onSubmit={handleProductAdd} />}
      {isEditModalOpen && (
        <EditProductModal
          onClose={handleModalClose}
          onEdit={handleProductEdit} // Changed from onSubmit to onEdit
          product={productToEdit}
        />
      )}
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

export default Product;