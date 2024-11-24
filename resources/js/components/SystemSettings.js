import React from "react";
import Sidebar from "./Sidebar";  // Import the Sidebar component
import TopNavbar from "./TopNavbar";  // Import the TopNavbar component
import "../../sass/components/SystemSettings.scss"; // Import the SCSS file for System Settings

const SystemSettings = () => {
  return (
    <div className="systemsettings-container">
      <Sidebar />
      <TopNavbar />
      <div className="systemsettings-content">
        <h1>10</h1>
      </div>
    </div>
  );
};

export default SystemSettings;
