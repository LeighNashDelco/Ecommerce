import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem("LaravelPassportToken");
    const user = JSON.parse(localStorage.getItem("user"));

    // Redirect if not logged in or not an admin
    if (!token || !user || user.role_id !== 1) {
        return <Navigate to="/login" replace />;
    }

    return element;
};

export default PrivateRoute;
