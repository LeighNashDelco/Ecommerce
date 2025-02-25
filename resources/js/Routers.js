import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import components directly
import Login from "./components/login/Login";
import Dashboard from "./components//admindashboard/admindashboard";
import Profile from "./components/profile/Profile";
import AdminList from "./components/adminlist/AdminList";
import CustomerList from "./components/customerlist/CustomerList";
import HelpAndSupport from "./components/helpandsupport/HelpAndSupport";
import Inventory from "./components/inventory/Inventory";
import Orders from "./components/orders/Orders";
import PaymentManagement from "./components/paymentmanagement/PaymentManagement";
import Products from "./components/products/Products";
import Register from "./components/register/Register";
import ReviewsAndNotifications from "./components/reviewsandnotification/ReviewsAndNotifications";
import SellerList from "./components/sellerlist/SellerList";
import StatusAndCategory from "./components/statusandcategory/StatusAndCategory";
import Users from "./components/users/Users";


export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> {/* Default route */}
        <Route path="login" element={<Login />} />
        <Route path="admindashboard" element={<Dashboard />} />
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