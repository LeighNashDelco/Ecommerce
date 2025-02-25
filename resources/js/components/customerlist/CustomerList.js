import React from "react";
import Sidebar from "./../sidebar/Sidebar";
import TopNavbar from "./../topnavbar/TopNavbar";
//import "./../../../sass/components/_customerlist.scss";

export default function CustomerList() {
  return (
    <div className="app">
      <Sidebar activeItem="Customer List" />
      <div className="customerlist-container">
        <TopNavbar />
        <h1>Customer List Page</h1>
      </div>
    </div>
  );
}
