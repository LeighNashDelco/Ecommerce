import React from "react";
import Sidebar from "./../sidebar/Sidebar";
import TopNavbar from "./../topnavbar/TopNavbar";
//import "./../../../sass/components/_helpandsupport.scss";

export default function HelpAndSupport() {
  return (
    <div className="app">
      <Sidebar activeItem="Help & Support" />
      <div className="helpandsupport-container">
        <TopNavbar />
        <h1>Help & Support Page</h1>
      </div>
    </div>
  );
}
