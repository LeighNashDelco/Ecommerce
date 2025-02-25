import React from "react";
import Sidebar from "./../sidebar/Sidebar";
import TopNavbar from "./../topnavbar/TopNavbar";
//import "./../../../sass/components/_reviewsandnotifications.scss";

export default function ReviewsAndNotifications() {
  return (
    <div className="app">
      <Sidebar activeItem="Reviews & Notifications" />
      <div className="reviewsandnotifications-container">
        <TopNavbar />
        <h1>Reviews & Notifications Page</h1>
      </div>
    </div>
  );
}
