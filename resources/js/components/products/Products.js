import React from "react";
import Sidebar from "./../sidebar/Sidebar";
import TopNavbar from "./../topnavbar/TopNavbar";
//import "./../../../sass/components/_products.scss";

export default function Products() {
  return (
    <div className="app">
      <Sidebar activeItem="Products" />
      <div className="products-container">
        <TopNavbar />
        <h1>Products Page</h1>
      </div>
    </div>
  );
}
