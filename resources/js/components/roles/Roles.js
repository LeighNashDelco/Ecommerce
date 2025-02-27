import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSquare } from "react-icons/fa";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "../topnavbar/TopNavbar";
import "./../../../sass/components/_roles.scss";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/roleslist")
      .then((response) => {
        setRoles(response.data.roles);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  return (
    <div className="app">
      <Sidebar activeItem="Roles" />
      <TopNavbar />
      <div className="roles-dashboard">
        <div className="roles-container">
          <h2>Roles Management</h2>
          <div className="roles-table">
            <table>
              <thead>
                <tr>
                  <th>Actions</th>
                  <th>Role ID</th>
                  <th>Role Name</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <tr key={role.id}>
                      <td>
                        <div className="action-icons">
                          <FaSquare className="checkbox-icon" size={16} />
                          <IconTrash size={16} className="delete-icon" />
                          <IconEdit size={16} className="edit-icon" />
                        </div>
                      </td>
                      <td>{role.id}</td>
                      <td>{role.role_name}</td>
                      <td>{new Date(role.created_at).toLocaleDateString()}</td>
                      <td>{new Date(role.updated_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No roles found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roles;
