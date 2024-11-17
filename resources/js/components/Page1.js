// Page1.js
import React from "react";
import Sidebar from "./Sidebar";  // Import the Sidebar component
import TopNavbar from "./TopNavbar";  // Import the TopNavbar component
import "../../sass/components/Page1.scss"; // Import the SCSS file for Page1

const Page1 = () => {
  return (
    <div className="page1-container">
      {/* Reusable Sidebar */}
      <Sidebar />
      
      {/* Reusable Top Navbar */}
      <TopNavbar />
      
      {/* Main content for Page1 */}
      <div className="page1-content">
        <h1>1</h1>
      </div>
    </div>
  );
};

export default Page1;
