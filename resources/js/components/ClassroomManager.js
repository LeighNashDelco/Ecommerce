import React from "react";
import Sidebar from "./Sidebar";  // Import the Sidebar component
import TopNavbar from "./TopNavbar";  // Import the TopNavbar component
import "../../sass/components/ClassroomManager.scss"; // Import the SCSS file for Classroom Manager

const ClassroomManager = () => {
  return (
    <div className="classroommanager-container">
      <Sidebar />
      <TopNavbar />
      <div className="classroommanager-content">
        <h1>9</h1>
      </div>
    </div>
  );
};

export default ClassroomManager;
