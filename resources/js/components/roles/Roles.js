import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./../sidebar/Sidebar";
import TopNavbar from "./../topnavbar/TopNavbar";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./../../../sass/components/_roles.scss";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/roles") // Change the endpoint if needed
      .then((response) => setRoles(response.data))
      .catch((error) => console.error("Error fetching roles:", error));
  }, []);

  return (
    <div className="app">
      <Sidebar activeItem="Roles" />
      <div className="roles-container">
        <TopNavbar />
        <h2>Roles</h2>
        <div className="roles-header">
          <button className="btn">Users</button>
          <button className="btn active">Roles</button>
          <button className="btn">View Archived</button>
          <input
            type="text"
            className="search-input"
            placeholder="Search Users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn">Add New</button>
        </div>
        <table className="roles-table">
          <thead>
            <tr>
              <th>Actions</th>
              <th>Role ID</th>
              <th>Name</th>
              <th>Created at</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>
                  <FaTrash className="icon delete-icon" />
                  <FaEdit className="icon edit-icon" />
                </td>
                <td>{role.id}</td>
                <td>{role.name}</td>
                <td>{role.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button>{"<"}</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>{">"}</button>
        </div>
      </div>
    </div>
  );
};

export default Roles;
