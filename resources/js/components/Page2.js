// Page2.js
import React from "react";
import Sidebar from "./Sidebar";  // Import the Sidebar component
import TopNavbar from "./TopNavbar";  // Import the TopNavbar component
import "../../sass/components/Page2.scss"; // Import the SCSS file for Page2

const Page2 = () => {
  return (
    <div className="page2-container">
      {/* Reusable Sidebar */}
      <Sidebar />
      
      {/* Reusable Top Navbar */}
      <TopNavbar />
      
      {/* Main content for Page2 */}
      <div className="page2-content">
        <h1>2</h1>
      </div>
    </div>
  );
};

export default Page2;
