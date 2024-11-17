// Page2.js
import React from "react";
import Sidebar from "./Sidebar";  // Import the Sidebar component
import TopNavbar from "./TopNavbar";  // Import the TopNavbar component
import "../../sass/components/Page6.scss"; // Import the SCSS file for Page2

const Page6 = () => {
  return (
    <div className="page6-container">
      {/* Reusable Sidebar */}
      <Sidebar />
      
      {/* Reusable Top Navbar */}
      <TopNavbar />
      
      {/* Main content for Page */}
      <div className="page6-content">
        <h1>6</h1>
      
      </div>
    </div>
  );
};

export default Page6;
