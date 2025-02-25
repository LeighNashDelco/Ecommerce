import React from "react";
import Sidebar from "./../sidebar/Sidebar";
import TopNavbar from "./../topnavbar/TopNavbar";

export default function AdminList() {
  return (
    <div className="app">
      <Sidebar activeItem="Admin List" />
      <div className="adminlist-container">
        <TopNavbar />
        <h1>Admin List Page</h1>
      </div>
    </div>
  );
}
