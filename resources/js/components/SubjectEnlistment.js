import React from "react";
import Sidebar from "./Sidebar";  // Import the Sidebar component
import TopNavbar from "./TopNavbar";  // Import the TopNavbar component
import "../../sass/components/SubjectEnlistment.scss"; // Import the SCSS file for Subject Enlistment

const SubjectEnlistment = () => {
  return (
    <div className="subjectenlistment-container">
      <Sidebar />
      <TopNavbar />
      <div className="subjectenlistment-content">
        <h1>7</h1>
      </div>
    </div>
  );
};

export default SubjectEnlistment;
