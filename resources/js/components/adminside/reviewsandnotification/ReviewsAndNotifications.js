import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "../topnavbar/TopNavbar";
import { FaSquare, FaCheckSquare } from "react-icons/fa";
import { IconTrash, IconEdit, IconRefresh, IconPlus, IconEye, IconSearch } from "@tabler/icons-react";
import axios from "axios";
import NotificationModalModule from "./NotificationModal";
import "./../../../../sass/components/_reviewsandnotification.scss";

// ReviewModal (updated)
const ReviewModal = ({ onClose, onSubmit, isEdit = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    product_id: isEdit && initialData ? initialData.product_id || "" : "",
    profile_id: isEdit && initialData ? initialData.profile_id || "" : "",
    rating: isEdit && initialData ? initialData.rating || "" : "",
    comment: isEdit && initialData ? initialData.comment || "" : "",
  });
  const [products, setProducts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [profileSearch, setProfileSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("LaravelPassportToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [productsRes, profilesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/products", config),
          axios.get("http://127.0.0.1:8000/api/profiles", config),
        ]);
        setProducts(productsRes.data);
        setProfiles(profilesRes.data);

        if (isEdit && initialData) {
          const product = productsRes.data.find(p => p.id === initialData.product_id);
          const profile = profilesRes.data.find(p => p.id === initialData.profile_id);
          setProductSearch(product ? product.product_name : "");
          setProfileSearch(profile ? profile.full_name : "");
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchData();

    if (isEdit && initialData) {
      setFormData({
        product_id: initialData.product_id || "",
        profile_id: initialData.profile_id || "",
        rating: initialData.rating || "",
        comment: initialData.comment || "",
      });
    }
  }, [isEdit, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSelect = (product) => {
    setFormData((prev) => ({ ...prev, product_id: product.id }));
    setProductSearch(product.product_name);
    setShowProductDropdown(false);
  };

  const handleProfileSelect = (profile) => {
    setFormData((prev) => ({ ...prev, profile_id: profile.id }));
    setProfileSearch(profile.full_name);
    setShowProfileDropdown(false);
  };

  const filteredProducts = products.filter((p) =>
    p.product_name.toLowerCase().includes(productSearch.toLowerCase())
  );
  const filteredProfiles = profiles.filter((p) =>
    p.full_name.toLowerCase().includes(profileSearch.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ formData });
  };

  return (
    <div className="modal-overlay">
      <div className="add-item-modal">
        <div className="modal-header">
          <h2>{isEdit ? "Edit Review" : "Add Review"}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="field-group full-width" style={{ position: "relative" }}>
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setShowProductDropdown(true);
                  }}
                  onFocus={() => setShowProductDropdown(true)}
                  className="input-field"
                  required
                />
                {showProductDropdown && filteredProducts.length > 0 && (
                  <ul style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #ccc", position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", zIndex: 10, listStyle: "none", padding: 0, margin: 0 }}>
                    {filteredProducts.map((product) => (
                      <li
                        key={product.id}
                        onClick={() => handleProductSelect(product)}
                        style={{ padding: "5px 10px", cursor: "pointer" }}
                      >
                        {product.product_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="field-group full-width" style={{ position: "relative" }}>
                <label>User Name</label>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={profileSearch}
                  onChange={(e) => {
                    setProfileSearch(e.target.value);
                    setShowProfileDropdown(true);
                  }}
                  onFocus={() => setShowProfileDropdown(true)}
                  className="input-field"
                  required
                />
                {showProfileDropdown && filteredProfiles.length > 0 && (
                  <ul style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #ccc", position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", zIndex: 10, listStyle: "none", padding: 0, margin: 0 }}>
                    {filteredProfiles.map((profile) => (
                      <li
                        key={profile.id}
                        onClick={() => handleProfileSelect(profile)}
                        style={{ padding: "5px 10px", cursor: "pointer" }}
                      >
                        {profile.full_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="field-group full-width">
                <label>Rating</label>
                <input
                  type="number"
                  name="rating"
                  placeholder="Rating (1-5)"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="input-field"
                  min="1"
                  max="5"
                  required
                />
              </div>
              <div className="field-group full-width">
                <label>Comment</label>
                <textarea
                  name="comment"
                  placeholder="Comment"
                  value={formData.comment}
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

// NotificationModal (updated import handling)
const NotificationModal = NotificationModalModule && NotificationModalModule.default 
    ? NotificationModalModule.default 
    : NotificationModalModule;

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

const ReviewsAndNotification = () => {
  const [activeTab, setActiveTab] = useState("reviews");
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToArchive, setItemToArchive] = useState(null);
  const [reviewPagination, setReviewPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [notificationPagination, setNotificationPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("LaravelPassportToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [reviewActiveResponse, reviewArchivedResponse, notificationActiveResponse, notificationArchivedResponse, productsRes, profilesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/reviews", config),
          axios.get("http://127.0.0.1:8000/api/reviews/archived", config),
          axios.get("http://127.0.0.1:8000/api/notifications", config),
          axios.get("http://127.0.0.1:8000/api/notifications/archived", config),
          axios.get("http://127.0.0.1:8000/api/products", config),
          axios.get("http://127.0.0.1:8000/api/profiles", config),
        ]);

        console.log("Products Response:", productsRes.data);
        console.log("Profiles Response:", profilesRes.data);
        console.log("Reviews Active Response:", reviewActiveResponse.data);
        console.log("Notifications Active Response:", notificationActiveResponse.data);

        const productsMap = productsRes.data.reduce((acc, p) => ({ ...acc, [p.id]: p.product_name }), {});
        const profilesMap = profilesRes.data.reduce((acc, p) => ({ ...acc, [p.id]: p.full_name }), {});

        const activeReviews = reviewActiveResponse.data.map((review) => ({
          ...review,
          archived: false,
          product_name: productsMap[review.product_id] || `Unknown Product (ID: ${review.product_id})`,
          user_name: profilesMap[review.profile_id] || `Unknown User (ID: ${review.profile_id})`,
        }));
        const archivedReviews = reviewArchivedResponse.data.map((review) => ({
          ...review,
          archived: true,
          product_name: productsMap[review.product_id] || `Unknown Product (ID: ${review.product_id})`,
          user_name: profilesMap[review.profile_id] || `Unknown User (ID: ${review.profile_id})`,
        }));
        const activeNotifications = notificationActiveResponse.data.map((notification) => ({
          ...notification,
          archived: false,
          user_name: profilesMap[notification.profile_id] || `Unknown User (ID: ${notification.profile_id})`,
        }));
        const archivedNotifications = notificationArchivedResponse.data.map((notification) => ({
          ...notification,
          archived: true,
          user_name: profilesMap[notification.profile_id] || `Unknown User (ID: ${notification.profile_id})`,
        }));

        setReviews([...activeReviews, ...archivedReviews]);
        setNotifications([...activeNotifications, ...archivedNotifications]);
        setReviewPagination({
          currentPage: 1,
          totalPages: Math.ceil((activeReviews.length + archivedReviews.length) / 10),
        });
        setNotificationPagination({
          currentPage: 1,
          totalPages: Math.ceil((activeNotifications.length + archivedNotifications.length) / 10),
        });
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
        setReviews([]);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const itemsPerPage = 10;
  const filteredReviews = reviews.filter(
    (review) =>
      (review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.user_name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      review.archived === showArchived
  );
  const filteredNotifications = reviews.filter(
    (notification) =>
      (notification.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.user_name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      notification.archived === showArchived
  );

  const totalReviewPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const totalNotificationPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const currentReviews = filteredReviews.slice(
    (reviewPagination.currentPage - 1) * itemsPerPage,
    reviewPagination.currentPage * itemsPerPage
  );
  const currentNotifications = filteredNotifications.slice(
    (notificationPagination.currentPage - 1) * itemsPerPage,
    notificationPagination.currentPage * itemsPerPage
  );

  const toggleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    const currentItems = activeTab === "reviews" ? filteredReviews : filteredNotifications;
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentItems.map((item) => item.id));
    }
  };

  const handleToggleArchived = () => {
    setShowArchived((prev) => !prev);
    setReviewPagination({ ...reviewPagination, currentPage: 1 });
    setNotificationPagination({ ...notificationPagination, currentPage: 1 });
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
      const endpoint = activeTab === "reviews" ? "reviews" : "notifications";
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/${endpoint}/${itemToArchive.id}/archive`,
        { archived: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        if (activeTab === "reviews") {
          setReviews((prevReviews) =>
            prevReviews.map((review) =>
              review.id === itemToArchive.id ? { ...review, archived: true } : review
            )
          );
        } else {
          setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
              notification.id === itemToArchive.id ? { ...notification, archived: true } : notification
            )
          );
        }
        setIsConfirmModalOpen(false);
        setItemToArchive(null);
      }
    } catch (error) {
      console.error("Error archiving item:", error.response?.data || error.message);
    }
  };

  const handleRestoreItem = async (itemId) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const endpoint = activeTab === "reviews" ? "reviews" : "notifications";
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/${endpoint}/${itemId}/archive`,
        { archived: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        if (activeTab === "reviews") {
          setReviews((prevReviews) =>
            prevReviews.map((review) =>
              review.id === itemId ? { ...review, archived: false } : review
            )
          );
        } else {
          setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
              notification.id === itemId ? { ...notification, archived: false } : notification
            )
          );
        }
      }
    } catch (error) {
      console.error("Error restoring item:", error.response?.data || error.message);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const endpoint = activeTab === "reviews" ? "reviews" : "notifications";
      const requests = selectedItems.map((itemId) =>
        axios.patch(
          `http://127.0.0.1:8000/api/${endpoint}/${itemId}/archive`,
          { archived: action === "archive" },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await Promise.all(requests);
      if (activeTab === "reviews") {
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            selectedItems.includes(review.id)
              ? { ...review, archived: action === "archive" }
              : review
          )
        );
      } else {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            selectedItems.includes(notification.id)
              ? { ...notification, archived: action === "archive" }
              : notification
          )
        );
      }
      setSelectedItems([]);
    } catch (error) {
      console.error(`Error ${action}ing items:`, error.response?.data || error.message);
    }
  };

  const handleAddNewClick = () => {
    setIsEditMode(false);
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (item) => {
    setIsEditMode(true);
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setItemToEdit(null);
  };

  const handleItemAdd = async (newItem) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const endpoint = activeTab === "reviews" ? "reviews" : "notifications";
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
        const addedItem = { ...response.data, archived: false };
        if (activeTab === "reviews") {
          const productsRes = await axios.get("http://127.0.0.1:8000/api/products", { headers: { Authorization: `Bearer ${token}` } });
          const profilesRes = await axios.get("http://127.0.0.1:8000/api/profiles", { headers: { Authorization: `Bearer ${token}` } });
          const productsMap = productsRes.data.reduce((acc, p) => ({ ...acc, [p.id]: p.product_name }), {});
          const profilesMap = profilesRes.data.reduce((acc, p) => ({ ...acc, [p.id]: p.full_name }), {});
          addedItem.product_name = productsMap[addedItem.product_id] || `Unknown Product (ID: ${addedItem.product_id})`;
          addedItem.user_name = profilesMap[addedItem.profile_id] || `Unknown User (ID: ${addedItem.profile_id})`;
          setReviews((prevReviews) => [addedItem, ...prevReviews]);
          setReviewPagination({
            currentPage: 1,
            totalPages: Math.ceil((reviews.length + 1) / itemsPerPage),
          });
        } else {
          const profilesRes = await axios.get("http://127.0.0.1:8000/api/profiles", { headers: { Authorization: `Bearer ${token}` } });
          const profilesMap = profilesRes.data.reduce((acc, p) => ({ ...acc, [p.id]: p.full_name }), {});
          addedItem.user_name = profilesMap[addedItem.profile_id] || `Unknown User (ID: ${addedItem.profile_id})`;
          setNotifications((prevNotifications) => [addedItem, ...prevNotifications]);
          setNotificationPagination({
            currentPage: 1,
            totalPages: Math.ceil((notifications.length + 1) / itemsPerPage),
          });
        }
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding item:", error.response?.data || error.message);
    }
  };

  const handleItemUpdate = async (updatedItem) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const endpoint = activeTab === "reviews" ? "reviews" : "notifications";
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/${endpoint}/${itemToEdit.id}`,
        updatedItem.formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        const updatedData = response.data;
        if (activeTab === "reviews") {
          const productsRes = await axios.get("http://127.0.0.1:8000/api/products", { headers: { Authorization: `Bearer ${token}` } });
          const profilesRes = await axios.get("http://127.0.0.1:8000/api/profiles", { headers: { Authorization: `Bearer ${token}` } });
          const productsMap = productsRes.data.reduce((acc, p) => ({ ...acc, [p.id]: p.product_name }), {});
          const profilesMap = profilesRes.data.reduce((acc, p) => ({ ...acc, [p.id]: p.full_name }), {});
          updatedData.product_name = productsMap[updatedData.product_id] || `Unknown Product (ID: ${updatedData.product_id})`;
          updatedData.user_name = profilesMap[updatedData.profile_id] || `Unknown User (ID: ${updatedData.profile_id})`;
          setReviews((prevReviews) =>
            prevReviews.map((review) =>
              review.id === updatedData.id ? { ...review, ...updatedData } : review
            )
          );
        } else {
          const profilesRes = await axios.get("http://127.0.0.1:8000/api/profiles", { headers: { Authorization: `Bearer ${token}` } });
          const profilesMap = profilesRes.data.reduce((acc, p) => ({ ...acc, [p.id]: p.full_name }), {});
          updatedData.user_name = profilesMap[updatedData.profile_id] || `Unknown User (ID: ${updatedData.profile_id})`;
          setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
              notification.id === updatedData.id ? { ...notification, ...updatedData } : notification
            )
          );
        }
        setIsModalOpen(false);
        setItemToEdit(null);
      }
    } catch (error) {
      console.error("Error updating item:", error.response?.data || error.message);
    }
  };

  const handleReviewPageChange = (page) => {
    setReviewPagination({ ...reviewPagination, currentPage: page });
  };

  const handleNotificationPageChange = (page) => {
    setNotificationPagination({ ...notificationPagination, currentPage: page });
  };

  return (
    <div className="app">
      <Sidebar activeItem="ReviewsAndNotification" />
      <div className="main-content-wrapper">
        <TopNavbar />
        <div className="reviewsandnotification-dashboard">
          <div className="reviewsandnotification-content">
            <h2>{showArchived ? "Archived Reviews & Notifications" : "Reviews & Notifications"}</h2>
            <div className="reviewsandnotification-header">
              <div className="left-actions">
                <div className="search-container">
                  <IconSearch size={20} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder={`Search ${activeTab === "reviews" ? "Reviews" : "Notifications"}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="right-actions">
                {selectedItems.length > 0 && (
                  <button
                    className="header-button archive-all-button"
                    onClick={() => handleBulkAction(showArchived ? "restore" : "archive")}
                  >
                    <IconRefresh size={20} className="button-icon" />
                    <span className="button-text">{showArchived ? "Restore All" : "Archive All"}</span>
                  </button>
                )}
                <button className="header-button" onClick={handleAddNewClick}>
                  <IconPlus size={20} className="button-icon" />
                  <span className="button-text">Add New</span>
                </button>
                <button className="header-button" onClick={handleToggleArchived}>
                  <IconEye size={20} className="button-icon" />
                  <span className="button-text">{showArchived ? "View Active" : "View Archived"}</span>
                </button>
              </div>
            </div>

            {activeTab === "reviews" && (
              <>
                <div className="reviewsandnotification-table">
                  <div className="tabs">
                    <button
                      className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
                      onClick={() => setActiveTab("reviews")}
                    >
                      Reviews
                    </button>
                    <button
                      className={`tab-button ${activeTab === "notifications" ? "active" : ""}`}
                      onClick={() => setActiveTab("notifications")}
                    >
                      Notifications
                    </button>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <div className="header-actions-icon">
                            <span onClick={toggleSelectAll} style={{ cursor: "pointer" }}>
                              {selectedItems.length === filteredReviews.length && filteredReviews.length > 0 ? (
                                <FaCheckSquare className="checkbox-icon" />
                              ) : (
                                <FaSquare className="checkbox-icon" />
                              )}
                            </span>
                            Actions
                          </div>
                        </th>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>User Name</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="8" className="loading-row">
                            Loading reviews...
                          </td>
                        </tr>
                      ) : currentReviews.length > 0 ? (
                        currentReviews.map((review) => (
                          <tr key={review.id}>
                            <td>
                              <div className="action-icons">
                                <span onClick={() => toggleSelectItem(review.id)} style={{ cursor: "pointer" }}>
                                  {selectedItems.includes(review.id) ? (
                                    <FaCheckSquare className="checkbox-icon" size={16} />
                                  ) : (
                                    <FaSquare className="checkbox-icon" size={16} />
                                  )}
                                </span>
                                {showArchived ? (
                                  <IconRefresh
                                    size={16}
                                    className="restore-icon"
                                    onClick={() => handleRestoreItem(review.id)}
                                  />
                                ) : (
                                  <IconTrash
                                    size={16}
                                    className="delete-icon"
                                    onClick={() => handleArchiveClick(review)}
                                  />
                                )}
                                <IconEdit
                                  size={16}
                                  className="edit-icon"
                                  onClick={() => handleEditClick(review)}
                                />
                              </div>
                            </td>
                            <td>{review.id}</td>
                            <td>{review.product_name}</td>
                            <td>{review.user_name}</td>
                            <td>{review.rating}</td>
                            <td>{review.comment || "N/A"}</td>
                            <td>{formatDate(review.created_at)}</td>
                            <td>{formatDate(review.updated_at)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8">No reviews found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="reviewsandnotification-pagination">
                  <span>
                    Page {reviewPagination.currentPage} of {totalReviewPages}
                  </span>
                  <button
                    onClick={() => handleReviewPageChange(reviewPagination.currentPage - 1)}
                    disabled={reviewPagination.currentPage <= 1}
                  >
                    {"<"}
                  </button>
                  {[...Array(totalReviewPages)].map((_, index) => (
                    <button
                      key={index}
                      className={reviewPagination.currentPage === index + 1 ? "active" : ""}
                      onClick={() => handleReviewPageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handleReviewPageChange(reviewPagination.currentPage + 1)}
                    disabled={reviewPagination.currentPage >= totalReviewPages}
                  >
                    {">"}
                  </button>
                </div>
              </>
            )}

            {activeTab === "notifications" && (
              <>
                <div className="reviewsandnotification-table">
                  <div className="tabs">
                    <button
                      className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
                      onClick={() => setActiveTab("reviews")}
                    >
                      Reviews
                    </button>
                    <button
                      className={`tab-button ${activeTab === "notifications" ? "active" : ""}`}
                      onClick={() => setActiveTab("notifications")}
                    >
                      Notifications
                    </button>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <div className="header-actions-icon">
                            <span onClick={toggleSelectAll} style={{ cursor: "pointer" }}>
                              {selectedItems.length === filteredNotifications.length &&
                              filteredNotifications.length > 0 ? (
                                <FaCheckSquare className="checkbox-icon" />
                              ) : (
                                <FaSquare className="checkbox-icon" />
                              )}
                            </span>
                            Actions
                          </div>
                        </th>
                        <th>ID</th>
                        <th>User Name</th>
                        <th>Message</th>
                        <th>FAQ ID</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="9" className="loading-row">
                            Loading notifications...
                          </td>
                        </tr>
                      ) : currentNotifications.length > 0 ? (
                        currentNotifications.map((notification) => (
                          <tr key={notification.id}>
                            <td>
                              <div className="action-icons">
                                <span
                                  onClick={() => toggleSelectItem(notification.id)}
                                  style={{ cursor: "pointer" }}
                                >
                                  {selectedItems.includes(notification.id) ? (
                                    <FaCheckSquare className="checkbox-icon" size={16} />
                                  ) : (
                                    <FaSquare className="checkbox-icon" size={16} />
                                  )}
                                </span>
                                {showArchived ? (
                                  <IconRefresh
                                    size={16}
                                    className="restore-icon"
                                    onClick={() => handleRestoreItem(notification.id)}
                                  />
                                ) : (
                                  <IconTrash
                                    size={16}
                                    className="delete-icon"
                                    onClick={() => handleArchiveClick(notification)}
                                  />
                                )}
                                <IconEdit
                                  size={16}
                                  className="edit-icon"
                                  onClick={() => handleEditClick(notification)}
                                />
                              </div>
                            </td>
                            <td>{notification.id}</td>
                            <td>{notification.user_name}</td>
                            <td>{notification.message}</td>
                            <td>{notification.faqs_id || "N/A"}</td>
                            <td>{notification.type}</td>
                            <td>{notification.status}</td>
                            <td>{formatDate(notification.created_at)}</td>
                            <td>{formatDate(notification.updated_at)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9">No notifications found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="reviewsandnotification-pagination">
                  <span>
                    Page {notificationPagination.currentPage} of {totalNotificationPages}
                  </span>
                  <button
                    onClick={() => handleNotificationPageChange(notificationPagination.currentPage - 1)}
                    disabled={notificationPagination.currentPage <= 1}
                  >
                    {"<"}
                  </button>
                  {[...Array(totalNotificationPages)].map((_, index) => (
                    <button
                      key={index}
                      className={notificationPagination.currentPage === index + 1 ? "active" : ""}
                      onClick={() => handleNotificationPageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handleNotificationPageChange(notificationPagination.currentPage + 1)}
                    disabled={notificationPagination.currentPage >= totalNotificationPages}
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
            <p>
              Do you want to archive "
              {activeTab === "reviews" ? itemToArchive?.comment : itemToArchive?.message}"?
            </p>
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

      {isModalOpen && activeTab === "reviews" && (
        <ReviewModal
          onClose={handleModalClose}
          onSubmit={isEditMode ? handleItemUpdate : handleItemAdd}
          isEdit={isEditMode}
          initialData={itemToEdit}
        />
      )}
      {isModalOpen && activeTab === "notifications" && (
        <>
          {typeof NotificationModal === "function" ? (
            <NotificationModal
              onClose={handleModalClose}
              onSubmit={isEditMode ? handleItemUpdate : handleItemAdd}
              isEdit={isEditMode}
              initialData={itemToEdit}
            />
          ) : (
            <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "white", padding: "20px", border: "1px solid red" }}>
              Error: NotificationModal is not a component
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewsAndNotification;