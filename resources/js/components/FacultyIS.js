import React from "react";
import Sidebar from "./Sidebar";  // Import the Sidebar component
import TopNavbar from "./TopNavbar";  // Import the TopNavbar component
import "../../sass/components/FacultyIS.scss"; // Import the SCSS file for Faculty IS

const FacultyIS = () => {
  return (
    <div className="facultyis-container">
      <Sidebar />
      <TopNavbar />
      <div className="facultyis-content">
        <h1>4</h1>
      </div>
    </div>
  );
};

export default FacultyIS;
