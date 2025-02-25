import React from "react";
import Sidebar from "./../sidebar/Sidebar";
import TopNavbar from "./../topnavbar/TopNavbar";
//import "./../../../sass/components/_inventory.scss";

export default function Inventory() {
  return (
    <div className="app">
      <Sidebar activeItem="Inventory" />
      <div className="inventory-container">
        <TopNavbar />
        <h1>Inventory Page</h1>
      </div>
    </div>
  );
}
