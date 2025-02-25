import React from "react";
import Sidebar from "./../sidebar/Sidebar";
import TopNavbar from "./../topnavbar/TopNavbar";
//import "./../../../sass/components/_statusandcategory.scss";

export default function StatusAndCategory() {
  return (
    <div className="app">
      <Sidebar activeItem="Status & Category" />
      <div className="statusandcategory-container">
        <TopNavbar />
        <h1>Status & Category Page</h1>
      </div>
    </div>
  );
}
