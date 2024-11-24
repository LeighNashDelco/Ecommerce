import React from "react";
import Sidebar from "./Sidebar";  // Import the Sidebar component
import TopNavbar from "./TopNavbar";  // Import the TopNavbar component
import "../../sass/components/Users.scss"; // Import the SCSS file for Users

const Users = () => {
  return (
    <div className="users-container">
      <Sidebar />
      <TopNavbar />
      <div className="users-content">
        <h1>2</h1>
      </div>
    </div>
  );
};

export default Users;
