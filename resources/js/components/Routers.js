import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Example from "./Example";
import Login from "./login";
import Register from "./register";
import Admindashboard from "./admindashboard";

export default function Routers() {
    return (
        <Router>
            <Routes>
                {/* Login Page */}
                <Route path="/" element={<Example />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admindashboard" element={<Admindashboard />} />
                
            </Routes>
        </Router>
    );
}

if (document.getElementById("root")) {
    const container = document.getElementById("root");
    const root = createRoot(container);
    root.render(<Routers />);
}