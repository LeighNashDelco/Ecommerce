import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "./../topnavbar/TopNavbar";
import { FaSquare, FaChevronDown, FaCheckSquare } from "react-icons/fa";
import { IconTrash, IconEdit, IconRefresh } from "@tabler/icons-react";
import CustomerModal from "./CustomerModal"; // New modal
import "./../../../sass/components/_customerlist.scss";

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

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [customerToArchive, setCustomerToArchive] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const navigate = useNavigate();

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "customer", label: "Customer" },
  ];

  const baseImageUrl = "http://127.0.0.1:8000/"; // Matches full path in DB (images/pfp/<filename>)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("LaravelPassportToken");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const [activeResponse, archivedResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/customers", config),
          axios.get("http://127.0.0.1:8000/api/customers/archived", config),
        ]);

        console.log("Active Customers:", activeResponse.data);
        console.log("Archived Customers:", archivedResponse.data);

        const activeCustomers = activeResponse.data.map(customer => ({ ...customer, archived: false }));
        const archivedCustomers = archivedResponse.data.map(customer => ({ ...customer, archived: true }));
        setCustomers([...activeCustomers, ...archivedCustomers]);
      } catch (error) {
        console.error("Error fetching customers:", error);
        console.log("Response:", error.response?.data);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterValue === "all" || customer.role_name?.toLowerCase() === filterValue;
    const matchesArchived = customer.archived === showArchived;
    return matchesSearch && matchesFilter && matchesArchived;
  });

  const toggleSelectCustomer = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map((customer) => customer.id));
    }
  };

  const handleToggleArchived = () => {
    setShowArchived((prev) => !prev);
    setPagination({ ...pagination, currentPage: 1 });
    setSelectedCustomers([]);
  };

  const handleArchiveClick = (customer) => {
    setCustomerToArchive(customer);
    setIsConfirmModalOpen(true);
  };

  const handleArchiveConfirm = async () => {
    if (!customerToArchive) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/customers/${customerToArchive.id}/archive`,
        { archived: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.id === customerToArchive.id ? { ...customer, archived: true } : customer
          )
        );
        setIsConfirmModalOpen(false);
        setCustomerToArchive(null);
      }
    } catch (error) {
      console.error("Error archiving customer:", error);
    }
  };

  const handleRestoreCustomer = async (customerId) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/customers/${customerId}/archive`,
        { archived: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.id === customerId ? { ...customer, archived: false } : customer
          )
        );
      }
    } catch (error) {
      console.error("Error restoring customer:", error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedCustomers.length === 0) return;
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const requests = selectedCustomers.map((customerId) =>
        axios.patch(
          `http://127.0.0.1:8000/api/customers/${customerId}/archive`,
          { archived: action === "archive" },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await Promise.all(requests);
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          selectedCustomers.includes(customer.id)
            ? { ...customer, archived: action === "archive" }
            : customer
        )
      );
      setSelectedCustomers([]);
    } catch (error) {
      console.error(`Error ${action}ing customers:`, error);
    }
  };

  const handleAddNewClick = () => {
    setIsEditMode(false);
    setCustomerToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = async (customer) => {
    try {
      const token = localStorage.getItem("LaravelPassportToken");
      const response = await axios.get(`http://127.0.0.1:8000/api/users/${customer.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Customer data fetched for edit:", response.data);
      setCustomerToEdit({
        ...customer,
        first_name: response.data.first_name || '',
        middlename: response.data.middlename || '',
        last_name: response.data.last_name || '',
        suffix: response.data.suffix || '',
        gender: response.data.gender || '',
      });
      setIsEditMode(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching customer for edit:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCustomerToEdit(null);
  };

  const handleCustomerAdd = async (newCustomer) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register",
        newCustomer,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        console.log("Response data:", response.data);
        const addedCustomer = {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          role_name: "Customer", // Hardcoded since role_id is 2
          profile_img: null, // No profile_img on add
          created_at: response.data.user.created_at || new Date().toISOString(),
          updated_at: response.data.user.updated_at || new Date().toISOString(),
          archived: false,
        };
        setCustomers((prevCustomers) => [addedCustomer, ...prevCustomers]);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding customer:", error.response?.data || error.message);
    }
  };

  const handleCustomerUpdate = async (updatedCustomer) => {
    try {
        const token = localStorage.getItem("LaravelPassportToken");
        console.log("Sending update with token:", token);

        const formDataEntries = {};
        for (let [key, value] of updatedCustomer.entries()) {
            formDataEntries[key] = value instanceof File ? value.name : value;
        }
        console.log("Update payload (FormData contents):", formDataEntries);

        const response = await axios.post(
            `http://127.0.0.1:8000/api/users/${customerToEdit.id}`,
            updatedCustomer,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        if (response.status === 200) {
            console.log("Full response from update:", response.data);
            setCustomers((prevCustomers) =>
                prevCustomers.map((customer) =>
                    customer.id === response.data.id ? { ...response.data } : customer
                )
            );
            setIsModalOpen(false);
            setIsEditMode(false);
            setCustomerToEdit(null);
            console.log("Customer updated successfully:", response.data);
            console.log("Expected image URL:", `${baseImageUrl}${response.data.profile_img}`);
        }
    } catch (error) {
        console.error("Error updating customer:", error.response?.data || error.message);
        console.log("Full error response:", error.response);
    }
};

  const customersPerPage = 5;
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const currentCustomers = filteredCustomers.slice(
    (pagination.currentPage - 1) * customersPerPage,
    pagination.currentPage * customersPerPage
  );

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  return (
    <div className="app">
      <Sidebar activeItem="Customer List" />
      <TopNavbar />
      <div className="customerlist-dashboard">
        <div className="customerlist-content">
          <h2>{showArchived ? "Archived Customers" : "Customer List"}</h2>
          <div className="customerlist-header">
            <div className="left-actions">
              <input
                type="text"
                className="search-input"
                placeholder="Search Customers"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="right-actions">
              {selectedCustomers.length > 0 && (
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

          <div className="customerlist-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="header-actions-icon">
                      <span onClick={toggleSelectAll} style={{ cursor: "pointer" }}>
                        {selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0 ? (
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
                    <td colSpan="6" className="loading-row">Loading customers...</td>
                  </tr>
                ) : currentCustomers.length > 0 ? (
                  currentCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="action-icons">
                          <span onClick={() => toggleSelectCustomer(customer.id)} style={{ cursor: "pointer" }}>
                            {selectedCustomers.includes(customer.id) ? (
                              <FaCheckSquare className="checkbox-icon" size={16} />
                            ) : (
                              <FaSquare className="checkbox-icon" size={16} />
                            )}
                          </span>
                          {showArchived ? (
                            <IconRefresh
                              size={16}
                              className="restore-icon"
                              onClick={() => handleRestoreCustomer(customer.id)}
                            />
                          ) : (
                            <IconTrash
                              size={16}
                              className="delete-icon"
                              onClick={() => handleArchiveClick(customer)}
                            />
                          )}
                          <IconEdit
                            size={16}
                            className="edit-icon"
                            onClick={() => handleEditClick(customer)}
                          />
                        </div>
                      </td>
                      <td className="username-cell">
                      <img
  src={customer.profile_img ? `${baseImageUrl}${customer.profile_img}` : `${baseImageUrl}images/pfp/default.png`}
  alt="Profile"
  className="profile-picture"
  onError={(e) => {
    console.log("Image load failed for:", `${baseImageUrl}${customer.profile_img}`);
    e.target.src = `${baseImageUrl}images/pfp/default.png`;
  }}
/>
                        {customer.username || "N/A"}
                      </td>
                      <td>{customer.email || "N/A"}</td>
                      <td>{customer.role_name || "N/A"}</td>
                      <td>{formatDate(customer.created_at)}</td>
                      <td>{formatDate(customer.updated_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No {showArchived ? "archived" : "active"} customers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="customerlist-pagination">
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
            <p>Do you want to archive "{customerToArchive?.username}"?</p>
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
        <CustomerModal
          onClose={handleModalClose}
          onSubmit={isEditMode ? handleCustomerUpdate : handleCustomerAdd}
          isEdit={isEditMode}
          initialData={customerToEdit}
        />
      )}
    </div>
  );
};

export default CustomerList;