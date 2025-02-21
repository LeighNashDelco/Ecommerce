import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import Register from "./register";
import Admindashboard from "./admindashboard";
import Product from "./product";
import Users from "./users";
import Archived from "./archived";


export default function Routers() {
    return (
        <Router>
            <Routes>
                {/* Login Page */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admindashboard" element={<Admindashboard />} />
                <Route path="/product" element={<Product />} />
                <Route path="/users" element={<Users />} />
                <Route path="/archived" element={<Archived />} />

            </Routes>
        </Router>
    );
}

if (document.getElementById("root")) {
    const container = document.getElementById("root");
    const root = createRoot(container);
    root.render(<Routers />);
}