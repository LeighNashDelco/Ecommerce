import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import components directly
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import AdminList from "./components/AdminList";
import CustomerList from "./components/CustomerList";
import HelpAndSupport from "./components/HelpAndSupport";
import Inventory from "./components/Inventory";
import Orders from "./components/Orders";
import PaymentManagement from "./components/PaymentManagement";
import Products from "./components/Products";
import Register from "./components/Register";
import ReviewsAndNotifications from "./components/ReviewsAndNotifications";
import SellerList from "./components/SellerList";
import StatusAndCategory from "./components/StatusAndCategory";
import Users from "./components/Users";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> {/* Default route */}
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="adminlist" element={<AdminList />} />
        <Route path="customerlist" element={<CustomerList />} />
        <Route path="helpandsupport" element={<HelpAndSupport />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="orders" element={<Orders />} />
        <Route path="paymentmanagement" element={<PaymentManagement />} />
        <Route path="products" element={<Products />} />
        <Route path="register" element={<Register />} />
        <Route path="reviewsandnotifications" element={<ReviewsAndNotifications />} />
        <Route path="sellerlist" element={<SellerList />} />
        <Route path="statusandcategory" element={<StatusAndCategory />} />
        <Route path="users" element={<Users />} />
      </Routes>
    </Router>
  );
}

if (document.getElementById("root")) {
  ReactDOM.render(<Routers />, document.getElementById("root"));
}