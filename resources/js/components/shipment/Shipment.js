import React from "react";
import Sidebar from "./../sidebar/Sidebar";
import TopNavbar from "./../topnavbar/TopNavbar";
//import "./../../../sass/components/_shipment.scss";

export default function Shipment() {
  return (
    <div className="app">
      <Sidebar activeItem="Shipment List" />
      <div className="shipment-container">
        <TopNavbar />
        <h1>Shipment List Page</h1>
      </div>
    </div>
  );
}
