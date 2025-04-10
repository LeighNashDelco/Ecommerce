import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Shared components
import Login from "./components/adminside/login/Login";
import Register from "./components/adminside/register/Register";
import ResetPassword from "./components/adminside/login/ResetPassword";

// Customer components
import CustomerProfile from "./components/customerside/profile/CustomerProfile";
import Homepage from "./components/customerside/Homepage/homepage";
import Shop from "./components/customerside/shop/shop";
import Cart from "./components/customerside/Customer/cart";
import Checkout from "./components/customerside/Customer/checkout";
import CheckoutAddress from "./components/customerside/Customer/checkout_address";
import PaymentMethods from "./components/customerside/Customer/payment_methods";
import Developer from "./components/customerside/Developers/developer";
import OrderComplete from "./components/customerside/OrderComplete/order_complete";
import Notfound from "./components/customerside/Pagenotfound/notfound";
import ProductView from "./components/customerside/ProductView/product_view";
import TrackOrder from "./components/customerside/TrackOrder/track_order";
import AboutUs from "./components/customerside/AboutUs/about_us";
import Notifications from './components/customerside/Customer/Notifications';
import Chatbot from './components/customerside/Customer/Chatbot';

// Admin components
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
import StatusAndCategory from "./components/adminside/statusandcategory/StatusAndCategory";
import Users from "./components/adminside/users/Users";
import Brands from "./components/adminside/brands/Brands";
import AdminChat from './components/adminside/AdminChat';
import PrivateRoute from "./components/adminside/routes/PrivateRoute.js";

// Customer Layout
function CustomerLayout({ children }) {
    const token = localStorage.getItem('LaravelPassportToken');
    const userRole = localStorage.getItem('userRole'); // Ensure this is set on login
    return (
        <>
            {children}
            {token && (!userRole || userRole === 'customer') && <Chatbot />}
        </>
    );
}

// Admin Layout
function AdminLayout({ children }) {
    const token = localStorage.getItem('LaravelPassportToken');
    const userRole = localStorage.getItem('userRole');
    console.log('AdminLayout - token:', token, 'userRole:', userRole); // Debug
    return (
        <>
            {children}
            {token && userRole === 'admin' && <AdminChat />}
        </>
    );
}

export default function Routers() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/homepage" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Customer Routes */}
                <Route path="/homepage" element={<CustomerLayout><Homepage /></CustomerLayout>} />
                <Route path="/notifications" element={<CustomerLayout><Notifications /></CustomerLayout>} />
                <Route path="/shop" element={<CustomerLayout><Shop /></CustomerLayout>} />
                <Route path="/shop/product/:id" element={<CustomerLayout><ProductView /></CustomerLayout>} />
                <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
                <Route path="/checkout" element={<CustomerLayout><Checkout /></CustomerLayout>} />
                <Route path="/checkout_address" element={<CustomerLayout><CheckoutAddress /></CustomerLayout>} />
                <Route path="/payment_methods" element={<CustomerLayout><PaymentMethods /></CustomerLayout>} />
                <Route path="/developer" element={<CustomerLayout><Developer /></CustomerLayout>} />
                <Route path="/order_complete" element={<CustomerLayout><OrderComplete /></CustomerLayout>} />
                <Route path="/product_view" element={<CustomerLayout><ProductView /></CustomerLayout>} />
                <Route path="/customerprofile" element={<CustomerLayout><CustomerProfile /></CustomerLayout>} />
                <Route path="/track_order" element={<CustomerLayout><TrackOrder /></CustomerLayout>} />
                <Route path="/about_us" element={<CustomerLayout><AboutUs /></CustomerLayout>} />

                {/* Admin Routes */}
                <Route 
                    path="/admindashboard" 
                    element={<AdminLayout><PrivateRoute element={<AdminDashboard />} /></AdminLayout>} 
                />
                <Route 
                    path="/brands" 
                    element={<AdminLayout><PrivateRoute element={<Brands />} /></AdminLayout>} 
                />
                <Route 
                    path="/profile" 
                    element={<AdminLayout><PrivateRoute element={<AdminProfile />} /></AdminLayout>} 
                />
                <Route 
                    path="/changepassadmin" 
                    element={<AdminLayout><PrivateRoute element={<ChangePassAdmin />} /></AdminLayout>} 
                />
                <Route 
                    path="/adminlist" 
                    element={<AdminLayout><PrivateRoute element={<AdminList />} /></AdminLayout>} 
                />
                <Route 
                    path="/customerlist" 
                    element={<AdminLayout><PrivateRoute element={<CustomerList />} /></AdminLayout>} 
                />
                <Route 
                    path="/helpandsupport" 
                    element={<AdminLayout><PrivateRoute element={<HelpAndSupport />} /></AdminLayout>} 
                />
                <Route 
                    path="/inventory" 
                    element={<AdminLayout><PrivateRoute element={<Inventory />} /></AdminLayout>} 
                />
                <Route 
                    path="/orders" 
                    element={<AdminLayout><PrivateRoute element={<Orders />} /></AdminLayout>} 
                />
                <Route 
                    path="/paymentmanagement" 
                    element={<AdminLayout><PrivateRoute element={<PaymentManagement />} /></AdminLayout>} 
                />
                <Route 
                    path="/products" 
                    element={<AdminLayout><PrivateRoute element={<Products />} /></AdminLayout>} 
                />
                <Route 
                    path="/reviewsandnotifications" 
                    element={<AdminLayout><PrivateRoute element={<ReviewsAndNotifications />} /></AdminLayout>} 
                />
                <Route 
                    path="/roles" 
                    element={<AdminLayout><PrivateRoute element={<Roles />} /></AdminLayout>} 
                />
                <Route 
                    path="/statusandcategory" 
                    element={<AdminLayout><PrivateRoute element={<StatusAndCategory />} /></AdminLayout>} 
                />
                <Route 
                    path="/users" 
                    element={<AdminLayout><PrivateRoute element={<Users />} /></AdminLayout>} 
                />

                {/* Catch-All Route for 404 */}
                <Route path="*" element={<CustomerLayout><Notfound /></CustomerLayout>} />
            </Routes>
        </Router>
    );
}

if (document.getElementById("root")) {
    ReactDOM.render(<Routers />, document.getElementById("root"));
}