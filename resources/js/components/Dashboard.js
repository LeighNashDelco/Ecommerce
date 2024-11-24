// Dashboard.js
import React from "react";
import Sidebar from "./Sidebar";  // Import the Sidebar component
import TopNavbar from "./TopNavbar";  // Import the TopNavbar component
import "../../sass/components/Dashboard.scss"; // Import the SCSS file for Dashboard

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Reusable Sidebar */}
      <Sidebar />
      
      {/* Reusable Top Navbar */}
      <TopNavbar />
      
      {/* Main content for Dashboard */}
      <div className="dashboard-content">
        <h1>1</h1>
      </div>
    </div>
  );
};

export default Dashboard;
