// Page2.js
import React from "react";
import Sidebar from "./Sidebar";  // Import the Sidebar component
import TopNavbar from "./TopNavbar";  // Import the TopNavbar component
import "../../sass/components/Page3.scss"; // Import the SCSS file for Page2

const Page3 = () => {
  return (
    <div className="page3-container">
      {/* Reusable Sidebar */}
      <Sidebar />
      
      {/* Reusable Top Navbar */}
      <TopNavbar />
      
      {/* Main content for Page3 */}
      <div className="page3-content">
        <h1>3</h1>
      
      </div>
    </div>
  );
};

export default Page3;
