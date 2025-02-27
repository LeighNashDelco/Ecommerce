import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "./../topnavbar/TopNavbar";
import { FaSquare } from "react-icons/fa";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import "./../../../sass/components/_customerlist.scss";

// Function to format date into a readable format
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short", // Feb, Mar, Apr, etc.
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Ensures AM/PM format
  }).format(new Date(dateString));
};

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token"); // Get Bearer token from localStorage
        const response = await axios.get("http://127.0.0.1:8000/api/customers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCustomers(response.data); // Store fetched customers
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="customer-app">
      <Sidebar activeItem="Customer List" />
      <TopNavbar />
      <div className="customer-dashboard">
        <div className="customer-content">
          <h2>Customer</h2>
          <div className="customer-header">
            <input
              type="text"
              className="customer-search-input"
              placeholder="Search Users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="customer-actions">
              <button className="customer-action-button">View Archived</button>
            </div>
          </div>
          <div className="customer-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="customer-header-actions-icon">
                      <FaSquare className="customer-checkbox-icon" />
                      Actions
                    </div>
                  </th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created at</th>
                  <th>Updated at</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="customer-action-icons">
                        <FaSquare className="customer-checkbox-icon" size={16} />
                        <IconTrash size={16} className="customer-delete-icon" />
                        <IconEdit size={16} className="customer-edit-icon" />
                      </div>
                    </td>
                    <td>{customer.username}</td>
                    <td>{customer.email}</td>
                    <td>{customer.role_name}</td>
                    <td>{formatDate(customer.created_at)}</td>
                    <td>{formatDate(customer.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="customer-pagination">
            <span>Page 1 of 1</span>
            <button>&lt;</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
