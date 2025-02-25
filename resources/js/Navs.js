import React from "react";
import { Link } from "react-router-dom";

export default function Navs() {
  return (
    <nav>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/adminlist">Admin List</Link>
        </li>
        <li>
          <Link to="/customerlist">Customer List</Link>
        </li>
        <li>
          <Link to="/helpandsupport">Help & Support</Link>
        </li>
        <li>
          <Link to="/inventory">Inventory</Link>
        </li>
        <li>
          <Link to="/orders">Orders</Link>
        </li>
        <li>
          <Link to="/paymentmanagement">Payment Management</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/reviewsandnotifications">Reviews & Notifications</Link>
        </li>
        <li>
          <Link to="/roles">roles</Link>
        </li>
        <li>
          <Link to="/shipment">Shipment</Link>
        </li>
        <li>
          <Link to="/statusandcategory">Status & Category</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
      </ul>
    </nav>
  );
}
