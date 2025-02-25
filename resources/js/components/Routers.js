import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import Register from "./register";
import Admindashboard from "./admindashboard";
import Product from "./product";
import Users from "./users";
import Orders from "./orders";
import Inventory from "./inventory";
import Customer from "./customer";
import Seller from "./seller";
import Reviewsmanagement from "./reviewsmanagement";
import Notifications from "./notifications";
import Roles from "./roles";
import Sidebar from "./sidebar";
import Table from "./table";
import Adminlist from "./adminlist";
import Product_modal from "./product_modal";
import Add_usermodal from "./add_usermodal";
import Edit_product from "./edit_product";
import Chatbot from "./chatbot";
import Archvied_products from "./archived_products";



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
                <Route path="/orders" element={<Orders />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/customer" element={<Customer />} />
                <Route path="/seller" element={<Seller />} />
                <Route path="/reviewsmanagement" element={<Reviewsmanagement />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/sidebar" element={<Sidebar />} />
                <Route path="/table" element={<Table />} />
                <Route path="/adminlist" element={<Adminlist />} />
                <Route path="/product_modal" element={<Product_modal />} />
                <Route path="/add_usermodal" element={<Add_usermodal />} />
                <Route path="/edit_product" element={<Edit_product />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/archived_products" element={<Archvied_products />} />


                
            </Routes>
        </Router>
    );
}

if (document.getElementById("root")) {
    const container = document.getElementById("root");
    const root = createRoot(container);
    root.render(<Routers />);
}