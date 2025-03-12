import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import components directly
import Login from "./components/login/Login";
import Profile from "./components/profile/Profile";
import Register from "./components/register/Register";
import Homepage from "./components/Homepage/homepage";
import Shop from "./components/shop/shop";
import Cart from "./components/Customer/cart";
import Checkout from "./components/Customer/checkout";
import Checkout_adress from "./components/Customer/checkout_address";
import Payment_methods from "./components/Customer/payment_methods";
import Developer from "./components/Developers/developer";
import Order_complete from "./components/OrderComplete/order_complete";
import Notfound from "./components/Pagenotfound/notfound";
import Product_view from "./components/ProductView/product_view";
import TrackOrder from "./components/TrackOrder/track_order";
import About_us from "./components/AboutUs/about_us";



export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="homepage" />} /> {/* Default route */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="homepage" element={<Homepage />} />
        <Route path="shop" element={<Shop />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="checkout_address" element={<Checkout_adress />} />
        <Route path="payment_methods" element={<Payment_methods />} />
        <Route path="developer" element={<Developer />} />
        <Route path="order_complete" element={<Order_complete />} />
        <Route path="notfound" element={<Notfound />} />
        <Route path="product_view" element={<Product_view />} />
        <Route path="profile" element={<Profile />} />
        <Route path="track_order" element={<TrackOrder />} />
        <Route path="about_us" element={<About_us />} />
      </Routes>
    </Router>
  );
}

if (document.getElementById("root")) {
  ReactDOM.render(<Routers />, document.getElementById("root"));
}