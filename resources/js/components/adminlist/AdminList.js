import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "../topnavbar/TopNavbar";
import { FaSquare, FaChevronDown } from "react-icons/fa";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import "./../../../sass/components/_adminlist.scss";


const formatDate = (dateString) => {
  if (!dateString) return "N/A"; 

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit", 
    year: "numeric", 
    hour: "2-digit",
    minute: "2-digit", 
    hour12: true, 
  }).format(date);
};

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [archivedAdmins, setArchivedAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewArchived, setViewArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const adminsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/api/admins")
      .then((response) => setAdmins(response.data))
      .catch((error) => console.error("Error fetching admins:", error))
      .finally(() => setLoading(false));

    axios
      .get("http://localhost:8000/api/admins/archived")
      .then((response) => setArchivedAdmins(response.data))
      .catch((error) => console.error("Error fetching archived admins:", error));
  }, []);

  const toggleViewArchived = () => {
    setViewArchived(!viewArchived);
    setCurrentPage(1);
  };

  const filteredAdmins = (viewArchived ? archivedAdmins : admins).filter((admin) =>
    admin.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);

  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (selectedAdmin) {
      axios
        .delete(`http://localhost:8000/api/admins/${selectedAdmin.id}`)
        .then(() => {
          setAdmins(admins.filter((admin) => admin.id !== selectedAdmin.id));
          setShowModal(false);
        })
        .catch((error) => console.error("Error deleting admin:", error));
    }
  };

  return (
    <div className="adminlist-app">
      <Sidebar activeItem="Admin List" />
      <TopNavbar />
      <div className="adminlist-dashboard">
        <div className="adminlist-content">
          <h2>List of {viewArchived ? "Archived Admins" : "Admins"}</h2>
          <div className="adminlist-header">
            <input
              type="text"
              className="adminlist-search-input"
              placeholder="Search Admins"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="adminlist-archive-button" onClick={toggleViewArchived}>
              {viewArchived ? "View Active" : "View Archived"}
            </button>
          </div>

          <div className="adminlist-table">
            <table>
              <thead>
                <tr>
                  <th>Actions</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created at</th>
                  <th>Updated at</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="loading-row">Loading admins...</td>
                  </tr>
                ) : currentAdmins.length > 0 ? (
                  currentAdmins.map((admin) => (
                    <tr key={admin.id}>
                      <td>
                        <FaSquare className="adminlist-checkbox-icon" size={16} />
                        <IconEdit size={16} className="adminlist-edit-icon" />
                        {!viewArchived && (
                          <IconTrash
                            size={16}
                            className="adminlist-delete-icon"
                            onClick={() => handleDeleteClick(admin)}
                          />
                        )}
                      </td>
                      <td>{admin.username || "N/A"}</td>
                      <td>{admin.email || "N/A"}</td>
                      <td>{admin.role_name || "N/A"}</td>
                      <td>{admin.created_at ? formatDate(admin.created_at) : "N/A"}</td>
                      <td>{admin.updated_at ? formatDate(admin.updated_at) : "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No {viewArchived ? "archived" : "active"} admins found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="adminlist-pagination">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete {selectedAdmin?.username}?</p>
            <button onClick={confirmDelete}>Yes, Delete</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminList;

