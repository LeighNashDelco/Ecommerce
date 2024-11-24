import React from "react";
import Sidebar from "./Sidebar";  // Import the Sidebar component
import TopNavbar from "./TopNavbar";  // Import the TopNavbar component
import "../../sass/components/EnlistmentManager.scss"; // Import the SCSS file for Enlistment Manager

const EnlistmentManager = () => {
  return (
    <div className="enlistmentmanager-container">
      <Sidebar />
      <TopNavbar />
      <div className="enlistmentmanager-content">
        <h1>8</h1>
      </div>
    </div>
  );
};

export default EnlistmentManager;
