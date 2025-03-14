import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Customer components
import CustomerProfile from "./components/customerside/profile/CustomerProfile";
import Homepage from "./components/customerside/Homepage/homepage";
import Shop from "./components/customerside/shop/shop";
import Cart from "./components/customerside/Customer/cart";
import Checkout from "./components/customerside/Customer/checkout";
import CheckoutAddress from "./components/customerside/Customer/checkout_address"; // Renamed for consistency
import PaymentMethods from "./components/customerside/Customer/payment_methods";   // Renamed for consistency
import Developer from "./components/customerside/Developers/developer";
import OrderComplete from "./components/customerside/OrderComplete/order_complete"; // Renamed for consistency
import Notfound from "./components/customerside/Pagenotfound/notfound";
import ProductView from "./components/customerside/ProductView/product_view";      // Renamed for consistency
import TrackOrder from "./components/customerside/TrackOrder/track_order";
import AboutUs from "./components/customerside/AboutUs/about_us";                 // Renamed for consistency

// Admin components
import AdminLogin from "./components/adminside/login/Login";
import AdminRegister from "./components/adminside/register/Register";
import AdminDashboard from "./components/adminside/admindashboard/admindashboard";
import AdminProfile from "./components/adminside/profile/Profile";
import ChangePassAdmin from "./components/adminside/profile/ChangePassAdmin.js";
import AdminList from "./components/adminside/adminlist/AdminList";
import CustomerList from "./components/adminside/customerlist/CustomerList";
import HelpAndSupport from "./components/adminside/helpandsupport/HelpAndSupport";
import Inventory from "./components/adminside/inventory/Inventory";
import Orders from "./components/adminside/orders/Orders";
import PaymentManagement from "./components/adminside/paymentmanagement/PaymentManagement";
import Products from "./components/adminside/products/Products";
import ReviewsAndNotifications from "./components/adminside/reviewsandnotification/ReviewsAndNotifications";
import Roles from "./components/adminside/roles/Roles";
import Shipment from "./components/adminside/shipment/Shipment";
import StatusAndCategory from "./components/adminside/statusandcategory/StatusAndCategory";
import Users from "./components/adminside/users/Users";
import Brands from "./components/adminside/brands/Brands";
import PrivateRoute from "./components/adminside/routes/PrivateRoute.js";

export default function Routers() {
  return (
    <Router>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Navigate to="/homepage" />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout_address" element={<CheckoutAddress />} />
        <Route path="/payment_methods" element={<PaymentMethods />} />
        <Route path="/developer" element={<Developer />} />
        <Route path="/order_complete" element={<OrderComplete />} />
        <Route path="/notfound" element={<Notfound />} />
        <Route path="/product_view" element={<ProductView />} />
        <Route path="/customerprofile" element={<CustomerProfile />} />
        <Route path="/track_order" element={<TrackOrder />} />
        <Route path="/about_us" element={<AboutUs />} />

        {/* Admin Routes */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/register" element={<AdminRegister />} />
        <Route
          path="/admindashboard"
          element={<PrivateRoute element={<AdminDashboard />} />}
        />
        <Route
          path="/brands"
          element={<PrivateRoute element={<Brands />} />}
        />
        <Route
          path="/profile"
          element={<PrivateRoute element={<AdminProfile />} />}
        />
        <Route
          path="/changepassadmin"
          element={<PrivateRoute element={<ChangePassAdmin />} />}
        />
        <Route
          path="/adminlist"
          element={<PrivateRoute element={<AdminList />} />}
        />
        <Route
          path="/customerlist"
          element={<PrivateRoute element={<CustomerList />} />}
        />
        <Route
          path="/helpandsupport"
          element={<PrivateRoute element={<HelpAndSupport />} />}
        />
        <Route
          path="/inventory"
          element={<PrivateRoute element={<Inventory />} />}
        />
        <Route
          path="/orders"
          element={<PrivateRoute element={<Orders />} />}
        />
        <Route
          path="/paymentmanagement"
          element={<PrivateRoute element={<PaymentManagement />} />}
        />
        <Route
          path="/products"
          element={<PrivateRoute element={<Products />} />}
        />
        <Route
          path="/reviewsandnotifications"
          element={<PrivateRoute element={<ReviewsAndNotifications />} />}
        />
        <Route
          path="/roles"
          element={<PrivateRoute element={<Roles />} />}
        />
        <Route
          path="/shipment"
          element={<PrivateRoute element={<Shipment />} />}
        />
        <Route
          path="/statusandcategory"
          element={<PrivateRoute element={<StatusAndCategory />} />}
        />
        <Route
          path="/users"
          element={<PrivateRoute element={<Users />} />}
        />
      </Routes>
    </Router>
  );
}

if (document.getElementById("root")) {
  ReactDOM.render(<Routers />, document.getElementById("root"));
}