import React from "react";
import Sidebar from "./../sidebar/Sidebar";
import TopNavbar from "./../topnavbar/TopNavbar";
import "./../../../sass/components/_roles.scss";

export default function Orders() {
  return (
    <div className="app">
      <Sidebar activeItem="Orders" />
      <div className="orders-container">
        <TopNavbar />
        <h1>Orders Page</h1>
      </div>
    </div>
  );
}
