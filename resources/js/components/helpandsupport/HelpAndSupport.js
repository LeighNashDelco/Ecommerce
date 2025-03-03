import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "../topnavbar/TopNavbar";
import { FaSquare, FaChevronDown, FaCheckSquare } from "react-icons/fa";
import { IconTrash, IconEdit, IconRefresh } from "@tabler/icons-react";
import axios from "axios";
import "./../../../sass/components/_helpandsupport.scss";

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

const HelpAndSupport = () => {
  const [faqs, setFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [selectedFaqs, setSelectedFaqs] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [faqToArchive, setFaqToArchive] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("LaravelPassportToken");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const [activeResponse, archivedResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/helpandsupport", config),
          axios.get("http://127.0.0.1:8000/api/helpandsupport/archived", config),
        ]);

        const activeFaqs = activeResponse.data.map(faq => ({ ...faq, archived: false }));
        const archivedFaqs = archivedResponse.data.map(faq => ({ ...faq, archived: true }));
        setFaqs([...activeFaqs, ...archivedFaqs]);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        console.log("Response:", error.response?.data);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredFaqs = faqs.filter((faq) =>
    (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchTerm.toLowerCase())) &&
    faq.archived === showArchived
  );

  const toggleSelectFaq = (faqId) => {
    setSelectedFaqs((prev) =>
      prev.includes(faqId) ? prev.filter((id) => id !== faqId) : [...prev, faqId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedFaqs.length === filteredFaqs.length) {
      setSelectedFaqs([]);
    } else {
      setSelectedFaqs(filteredFaqs.map((faq) => faq.id));
    }
  };

  const handleToggleArchived = () => {
    setShowArchived((prev) => !prev);
    setPagination({ ...pagination, currentPage: 1 });
    setSelectedFaqs([]);
  };

  const handleArchiveClick = (faq) => {
    setFaqToArchive(faq);
    setIsConfirmModalOpen(true);
  };

  const handleArchiveConfirm = async () => {
    if (!faqToArchive) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/helpandsupport/${faqToArchive.id}/archive`,
        { archived: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setFaqs((prevFaqs) =>
          prevFaqs.map((faq) =>
            faq.id === faqToArchive.id ? { ...faq, archived: true } : faq
          )
        );
        setIsConfirmModalOpen(false);
        setFaqToArchive(null);
      }
    } catch (error) {
      console.error("Error archiving FAQ:", error);
    }
  };

  const handleRestoreFaq = async (faqId) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/helpandsupport/${faqId}/archive`,
        { archived: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setFaqs((prevFaqs) =>
          prevFaqs.map((faq) =>
            faq.id === faqId ? { ...faq, archived: false } : faq
          )
        );
      }
    } catch (error) {
      console.error("Error restoring FAQ:", error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedFaqs.length === 0) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const requests = selectedFaqs.map((faqId) =>
        axios.patch(
          `http://127.0.0.1:8000/api/helpandsupport/${faqId}/archive`,
          { archived: action === "archive" },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await Promise.all(requests);
      setFaqs((prevFaqs) =>
        prevFaqs.map((faq) =>
          selectedFaqs.includes(faq.id)
            ? { ...faq, archived: action === "archive" }
            : faq
        )
      );
      setSelectedFaqs([]);
    } catch (error) {
      console.error(`Error ${action}ing FAQs:`, error);
    }
  };

  const handleAddNewClick = () => {
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleFaqAdd = async (newFaq) => {
    try {
        const token = localStorage.getItem("LaravelPassportToken");
        const payload = {
            question: newFaq.formData.question,
            answer: newFaq.formData.answer,
            category_id: parseInt(newFaq.formData.category_id, 10), // Convert to integer
        };
        console.log("Submitting FAQ payload:", payload);
        const response = await axios.post(
            "http://127.0.0.1:8000/api/helpandsupport",
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.status === 201) {
            const addedFaq = {
                id: response.data.faq.id,
                question: response.data.faq.question,
                answer: response.data.faq.answer,
                category: { name: response.data.faq.category_name },
                created_at: response.data.faq.created_at || new Date().toISOString(),
                updated_at: response.data.faq.updated_at || new Date().toISOString(),
                archived: false,
            };
            setFaqs((prevFaqs) => [addedFaq, ...prevFaqs]);
            setPagination({ ...pagination, currentPage: 1 });
            setIsAddModalOpen(false);
        }
    } catch (error) {
        console.error("Error adding FAQ:", JSON.stringify(error.response?.data || error.message));
    }
};

  const faqsPerPage = 10;
  const totalPages = Math.ceil(filteredFaqs.length / faqsPerPage);
  const currentFaqs = filteredFaqs.slice(
    (pagination.currentPage - 1) * faqsPerPage,
    pagination.currentPage * faqsPerPage
  );

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  return (
    <div className="app">
      <Sidebar activeItem="HelpAndSupport" />
      <div className="main-content-wrapper">
        <TopNavbar />
        <div className="helpandsupport-dashboard">
          <div className="helpandsupport-content">
            <h2>{showArchived ? "Archived FAQs" : "Help & Support"}</h2>
            <div className="helpandsupport-header">
              <div className="left-actions">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search Questions or Answers"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="right-actions">
                {selectedFaqs.length > 0 && (
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
            <div className="helpandsupport-table">
              <table>
                <thead>
                  <tr>
                    <th>
                      <div className="header-actions-icon">
                        <span onClick={toggleSelectAll} style={{ cursor: "pointer" }}>
                          {selectedFaqs.length === filteredFaqs.length && filteredFaqs.length > 0 ? (
                            <FaCheckSquare className="checkbox-icon" />
                          ) : (
                            <FaSquare className="checkbox-icon" />
                          )}
                        </span>
                        Actions
                      </div>
                    </th>
                    <th>ID</th>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Category</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="loading-row">Loading FAQs...</td>
                    </tr>
                  ) : currentFaqs.length > 0 ? (
                    currentFaqs.map((faq) => (
                      <tr key={faq.id}>
                        <td>
                          <div className="action-icons">
                            <span onClick={() => toggleSelectFaq(faq.id)} style={{ cursor: "pointer" }}>
                              {selectedFaqs.includes(faq.id) ? (
                                <FaCheckSquare className="checkbox-icon" size={16} />
                              ) : (
                                <FaSquare className="checkbox-icon" size={16} />
                              )}
                            </span>
                            {showArchived ? (
                              <IconRefresh
                                size={16}
                                className="restore-icon"
                                onClick={() => handleRestoreFaq(faq.id)}
                              />
                            ) : (
                              <IconTrash
                                size={16}
                                className="delete-icon"
                                onClick={() => handleArchiveClick(faq)}
                              />
                            )}
                            <IconEdit size={16} className="edit-icon" />
                          </div>
                        </td>
                        <td>{faq.id}</td>
                        <td>{faq.question}</td>
                        <td>{faq.answer}</td>
                        <td>{faq.category?.name || "N/A"}</td>
                        <td>{formatDate(faq.created_at)}</td>
                        <td>{formatDate(faq.updated_at)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">No FAQs found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="helpandsupport-pagination">
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
            <p>Do you want to archive "{faqToArchive?.question}"?</p>
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
        <AddFaqModal onClose={handleModalClose} onSubmit={handleFaqAdd} />
      )}
    </div>
  );
};

const AddFaqModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category_id: '1', // Default to General category (ID 1)
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
      <div className="add-faq-modal">
        <div className="modal-header">
          <h2>Add FAQ</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="field-group full-width">
                <label>Question</label>
                <input
                  type="text"
                  name="question"
                  placeholder="Question"
                  value={formData.question}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="field-group full-width">
                <label>Answer</label>
                <textarea
                  name="answer"
                  placeholder="Answer"
                  value={formData.answer}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="field-group full-width">
                <label>Category</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="1">General</option>
                  <option value="2">Billing</option>
                  <option value="3">Technical</option>
                </select>
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

export default HelpAndSupport;