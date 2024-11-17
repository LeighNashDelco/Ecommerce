import React from "react";
import "../../sass/components/TopNavbar.scss";

const TopNavbar = ({ toggleSidebar }) => {
  return (
    <div className="top-navbar">
      {/* Sidebar Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
      </div>
    </div>
  );
};

export default TopNavbar;
