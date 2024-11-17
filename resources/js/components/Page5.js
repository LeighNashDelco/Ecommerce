// Page2.js
import React from "react";
import Sidebar from "./Sidebar";  // Import the Sidebar component
import TopNavbar from "./TopNavbar";  // Import the TopNavbar component
import "../../sass/components/Page5.scss"; // Import the SCSS file for Page2

const Page5 = () => {
  return (
    <div className="page5-container">
      {/* Reusable Sidebar */}
      <Sidebar />
      
      {/* Reusable Top Navbar */}
      <TopNavbar />
      
      {/* Main content for Page */}
      <div className="page5-content">
        <h1>5</h1>
      
      </div>
    </div>
  );
};

export default Page5;
