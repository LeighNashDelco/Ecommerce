// Page2.js
import React from "react";
import Sidebar from "./Sidebar";  // Import the Sidebar component
import TopNavbar from "./TopNavbar";  // Import the TopNavbar component
import "../../sass/components/Page4.scss"; // Import the SCSS file for Page2

const Page4 = () => {
  return (
    <div className="page4-container">
      {/* Reusable Sidebar */}
      <Sidebar />
      
      {/* Reusable Top Navbar */}
      <TopNavbar />
      
      {/* Main content for Page4 */}
      <div className="page4-content">
        <h1>4</h1>
      
      </div>
    </div>
  );
};

export default Page4;
