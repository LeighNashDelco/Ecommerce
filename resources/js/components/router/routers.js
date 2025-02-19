import React from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import components for each page
import Login from "../public/login/login";
import AdminList from "../public/adminlist/adminlist";
import CustomerList from "../public/customerlist/customerlist";
import HelpAndSupport from "../public/helpandsupport/helpandsupport";
import Inventory from "../public/inventory/inventory";
import Orders from "../public/orders/orders";
import PaymentManagement from "../public/paymentmanagement/paymentmanagement";
import Products from "../public/products/products";
import Register from "../public/register/register";
import ReviewsAndNotifications from "../public/reviewsandnotification/reviewsandnotification";
import SellerList from "../public/sellerlist/sellerlist";
import StatusAndCategory from "../public/statusandcategory/statusandcategory";
import Users from "../public/users/users";

// Import role-based components (protected)
import Dashboard from '../public/dashboard/DashboardPage';
import Profile from '../public/profile/ProfilePage';

// PrivateRoute for role-based access control
import PrivateRoute from './PrivateRouter';

const routes = [
  { path: "/login", element: <Login /> },
  { path: "/adminlist", element: <AdminList /> },
  { path: "/customerlist", element: <CustomerList /> },
  { path: "/helpandsupport", element: <HelpAndSupport /> },
  { path: "/inventory", element: <Inventory /> },
  { path: "/orders", element: <Orders /> },
  { path: "/paymentmanagement", element: <PaymentManagement /> },
  { path: "/products", element: <Products /> },
  { path: "/register", element: <Register /> },
  { path: "/reviewsandnotification", element: <ReviewsAndNotifications /> },
  { path: "/sellerlist", element: <SellerList /> },
  { path: "/statusandcategory", element: <StatusAndCategory /> },
  { path: "/users", element: <Users /> },
];

const AppRouter = () => {
  const isAuthenticated = () => {
    return !!localStorage.getItem('auth_token'); // Check for authentication token
  };

  const isLoggedIn = isAuthenticated();
  const userRole = localStorage.getItem('user_role') || ''; // Get user role from localStorage

  return (
    <Router>
      <Routes>
        {/* Redirect root to login if not authenticated */}
        <Route path="/" element={isLoggedIn ? <Navigate to={`/${userRole}/dashboard`} /> : <Navigate to="/login" />} />

        {/* Login Route */}
        <Route path="/login" element={isLoggedIn ? <Navigate to={`/${userRole}/dashboard`} /> : <Login />} />

        {/* Protected Routes based on Role */}
        <Route path="/:role/dashboard" element={<PrivateRoute roleRequired={['admin']}><Dashboard /></PrivateRoute>} />
        <Route path="/:role/profile" element={<PrivateRoute roleRequired={['admin']}><Profile /></PrivateRoute>} />

        {/* Role-based Routes */}
        <Route path="/adminlist" element={<PrivateRoute roleRequired={['admin']}><AdminList /></PrivateRoute>} />
        <Route path="/customerlist" element={<PrivateRoute roleRequired={['admin']}><CustomerList /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute roleRequired={['admin']}><Orders /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute roleRequired={['admin']}><Products /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute roleRequired={['admin']}><Users /></PrivateRoute>} />
        
        {/* Other routes with role-based access */}
        <Route path="/helpandsupport" element={<PrivateRoute roleRequired={['admin']}><HelpAndSupport /></PrivateRoute>} />
        <Route path="/inventory" element={<PrivateRoute roleRequired={['admin']}><Inventory /></PrivateRoute>} />
        <Route path="/reviewsandnotification" element={<PrivateRoute roleRequired={['admin']}><ReviewsAndNotifications /></PrivateRoute>} />
        <Route path="/sellerlist" element={<PrivateRoute roleRequired={['admin']}><SellerList /></PrivateRoute>} />
        <Route path="/statusandcategory" element={<PrivateRoute roleRequired={['admin']}><StatusAndCategory /></PrivateRoute>} />

        {/* Catch-all route for unknown URLs */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
