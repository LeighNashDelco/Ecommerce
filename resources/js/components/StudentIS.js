import React from "react";
import Sidebar from "./Sidebar";  // Import the Sidebar component
import TopNavbar from "./TopNavbar";  // Import the TopNavbar component
import "../../sass/components/StudentIS.scss"; // Import the SCSS file for Student IS

const StudentIS = () => {
  return (
    <div className="studentis-container">
      <Sidebar />
      <TopNavbar />
      <div className="studentis-content">
        <h1>3</h1>
      </div>
    </div>
  );
};

export default StudentIS;
