import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "../topnavbar/TopNavbar";
import { FaSquare, FaChevronDown, FaCheckSquare } from "react-icons/fa";
import { IconTrash, IconEdit, IconRefresh } from "@tabler/icons-react";
import axios from "axios";
import "./../../../sass/components/_reviewsandnotification.scss";

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
  const [activeTab, setActiveTab] = useState("reviews"); // Default to Reviews tab
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("LaravelPassportToken");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const [reviewActiveResponse, reviewArchivedResponse, notificationActiveResponse, notificationArchivedResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/reviews", config),
          axios.get("http://127.0.0.1:8000/api/reviews/archived", config),
          axios.get("http://127.0.0.1:8000/api/notifications", config),
          axios.get("http://127.0.0.1:8000/api/notifications/archived", config),
        ]);

        const activeReviews = reviewActiveResponse.data.map(review => ({ ...review, archived: false }));
        const archivedReviews = reviewArchivedResponse.data.map(review => ({ ...review, archived: true }));
        const activeNotifications = notificationActiveResponse.data.map(notification => ({ ...notification, archived: false }));
        const archivedNotifications = notificationArchivedResponse.data.map(notification => ({ ...notification, archived: true }));

        setReviews([...activeReviews, ...archivedReviews]);
        setNotifications([...activeNotifications, ...archivedNotifications]);
      } catch (error) {
        console.error("Error fetching data:", error);
        console.log("Response:", error.response?.data);
        setReviews([]);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredReviews = reviews.filter((review) =>
    (review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     review.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    review.archived === showArchived
  );
  const filteredNotifications = notifications.filter((notification) =>
    (notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
     notification.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
    notification.archived === showArchived
  );

  const itemsPerPage = 10;
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
      console.error("Error archiving item:", error);
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
      console.error("Error restoring item:", error);
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
        const addedItem = response.data.item;
        addedItem.archived = false;
        if (activeTab === "reviews") {
          setReviews((prevReviews) => [addedItem, ...prevReviews]);
        } else {
          setNotifications((prevNotifications) => [addedItem, ...prevNotifications]);
        }
        setPagination({ currentPage: 1, totalPages: activeTab === "reviews" ? totalReviewPages : totalNotificationPages });
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding item:", error.response?.data || error.message);
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
            <div className="reviewsandnotification-header">
              <div className="left-actions">
                <input
                  type="text"
                  className="search-input"
                  placeholder={`Search ${activeTab === "reviews" ? "Reviews" : "Notifications"}`}
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

            {activeTab === "reviews" && (
              <>
                <div className="reviewsandnotification-table">
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
                        <th>Product</th>
                        <th>Profile</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="8" className="loading-row">Loading reviews...</td>
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
                                <IconEdit size={16} className="edit-icon" />
                              </div>
                            </td>
                            <td>{review.id}</td>
                            <td>{review.product?.name || "N/A"}</td>
                            <td>{review.profile?.name || "N/A"}</td>
                            <td>{review.rating}</td>
                            <td>{review.comment}</td>
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
                  <span>Page {reviewPagination.currentPage} of {totalReviewPages}</span>
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
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <div className="header-actions-icon">
                            <span onClick={toggleSelectAll} style={{ cursor: "pointer" }}>
                              {selectedItems.length === filteredNotifications.length && filteredNotifications.length > 0 ? (
                                <FaCheckSquare className="checkbox-icon" />
                              ) : (
                                <FaSquare className="checkbox-icon" />
                              )}
                            </span>
                            Actions
                          </div>
                        </th>
                        <th>ID</th>
                        <th>Profile</th>
                        <th>Message</th>
                        <th>FAQ</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="9" className="loading-row">Loading notifications...</td>
                        </tr>
                      ) : currentNotifications.length > 0 ? (
                        currentNotifications.map((notification) => (
                          <tr key={notification.id}>
                            <td>
                              <div className="action-icons">
                                <span onClick={() => toggleSelectItem(notification.id)} style={{ cursor: "pointer" }}>
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
                                <IconEdit size={16} className="edit-icon" />
                              </div>
                            </td>
                            <td>{notification.id}</td>
                            <td>{notification.profile?.name || "N/A"}</td>
                            <td>{notification.message}</td>
                            <td>{notification.faq?.question || "N/A"}</td>
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
                  <span>Page {notificationPagination.currentPage} of {totalNotificationPages}</span>
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
            <p>Do you want to archive "{activeTab === 'reviews' ? itemToArchive?.comment : itemToArchive?.message}"?</p>
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
  const [formData, setFormData] = useState(
    activeTab === "reviews"
      ? { product_id: '', profile_id: '', rating: '', comment: '' }
      : { profile_id: '', message: '', faqs_id: '', type: '', status: '' }
  );

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
          <h2>Add {activeTab === "reviews" ? "Review" : "Notification"}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              {activeTab === "reviews" ? (
                <>
                  <div className="field-group full-width">
                    <label>Product ID</label>
                    <input
                      type="number"
                      name="product_id"
                      placeholder="Product ID"
                      value={formData.product_id}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="field-group full-width">
                    <label>Profile ID</label>
                    <input
                      type="number"
                      name="profile_id"
                      placeholder="Profile ID"
                      value={formData.profile_id}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
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
                </>
              ) : (
                <>
                  <div className="field-group full-width">
                    <label>Profile ID</label>
                    <input
                      type="number"
                      name="profile_id"
                      placeholder="Profile ID"
                      value={formData.profile_id}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="field-group full-width">
                    <label>Message</label>
                    <textarea
                      name="message"
                      placeholder="Message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="field-group full-width">
                    <label>FAQ ID</label>
                    <input
                      type="number"
                      name="faqs_id"
                      placeholder="FAQ ID"
                      value={formData.faqs_id}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  <div className="field-group full-width">
                    <label>Type</label>
                    <input
                      type="text"
                      name="type"
                      placeholder="Type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="field-group full-width">
                    <label>Status</label>
                    <input
                      type="text"
                      name="status"
                      placeholder="Status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                </>
              )}
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

export default ReviewsAndNotification;