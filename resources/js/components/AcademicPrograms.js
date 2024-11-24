import React from "react";
import Sidebar from "./Sidebar";  // Import the Sidebar component
import TopNavbar from "./TopNavbar";  // Import the TopNavbar component
import "../../sass/components/AcademicPrograms.scss"; // Import the SCSS file for Academic Programs

const AcademicPrograms = () => {
  return (
    <div className="academicprograms-container">
      <Sidebar />
      <TopNavbar />
      <div className="academicprograms-content">
        <h1>6</h1>
      </div>
    </div>
  );
};

export default AcademicPrograms;
