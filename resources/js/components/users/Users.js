import React from "react";
import Sidebar from "./../sidebar/Sidebar";
import TopNavbar from "./../topnavbar/TopNavbar";
//import "./../../../sass/components/_users.scss";

export default function Users() {
  return (
    <div className="app">
      <Sidebar activeItem="Users" />
      <div className="users-container">
        <TopNavbar />
        <h1>Users Page</h1>
      </div>
    </div>
  );
}
