import React from "react";
import Sidebar from "./Sidebar";  // Import the Sidebar component
import TopNavbar from "./TopNavbar";  // Import the TopNavbar component
import "../../sass/components/ClassScheduling.scss"; // Import the SCSS file for Class Scheduling

const ClassScheduling = () => {
  return (
    <div className="classscheduling-container">
      <Sidebar />
      <TopNavbar />
      <div className="classscheduling-content">
        <h1>5</h1>
      </div>
    </div>
  );
};

export default ClassScheduling;
