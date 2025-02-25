import React from "react";
import Sidebar from "./../sidebar/Sidebar";
import TopNavbar from "./../topnavbar/TopNavbar";
//import "./../../../sass/components/_paymentmanagement.scss";

export default function PaymentManagement() {
  return (
    <div className="app">
      <Sidebar activeItem="Payment Management" />
      <div className="paymentmanagement-container">
        <TopNavbar />
        <h1>Payment Management Page</h1>
      </div>
    </div>
  );
}
