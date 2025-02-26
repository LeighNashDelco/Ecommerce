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
import Roles from "./components/roles/Roles";
import Shipment from "./components/shipment/Shipment";
import StatusAndCategory from "./components/statusandcategory/StatusAndCategory";
import Users from "./components/users/Users";
import PrivateRoute from "./components/routes/PrivateRoute.js"; // Import the PrivateRoute


export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> {/* Default route */}
        <Route path="login" element={<Login />} />
        <Route path="admindashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="adminlist" element={<PrivateRoute element={<AdminList />} />} />
        <Route path="customerlist" element={<PrivateRoute element={<CustomerList />} />} />
        <Route path="helpandsupport" element={<PrivateRoute element={<HelpAndSupport />} />} />
        <Route path="inventory" element={<PrivateRoute element={<Inventory />} />} />
        <Route path="orders" element={<PrivateRoute element={<Orders />} />} />
        <Route path="paymentmanagement" element={<PrivateRoute element={<PaymentManagement />} />} />
        <Route path="products" element={<PrivateRoute element={<Products />} />} />
        <Route path="register" element={<Register />} />
        <Route path="reviewsandnotifications" element={<PrivateRoute element={<ReviewsAndNotifications />} />} />
        <Route path="roles" element={<PrivateRoute element={<Roles />} />} />
        <Route path="shipment" element={<PrivateRoute element={<Shipment />} />} />
        <Route path="statusandcategory" element={<PrivateRoute element={<StatusAndCategory />} />} />
        <Route path="users" element={<PrivateRoute element={<Users />} />} />
      </Routes>
    </Router>
  );
}

if (document.getElementById("root")) {
  ReactDOM.render(<Routers />, document.getElementById("root"));
}