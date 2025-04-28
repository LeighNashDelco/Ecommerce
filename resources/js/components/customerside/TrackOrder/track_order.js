import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './../../../../sass/components/track_order.scss';
import { IconCheck, IconBox, IconTruck, IconTruckDelivery, IconHome } from '@tabler/icons-react';
import Navbar from "../../customerside/Customer/topnav_login";
import Footer from "../footer/footer";

const TrackOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const orderId = location.state?.order?.id;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('LaravelPassportToken');
        if (!token) {
          throw new Error('Please login first - No token found');
        }

        if (!orderId) {
          throw new Error('No order ID provided');
        }

        const response = await fetch(`http://127.0.0.1:8000/api/orders/track/${orderId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            localStorage.removeItem('LaravelPassportToken');
            throw new Error('Session expired. Please login again.');
          }
          throw new Error(errorData.message || 'Failed to fetch order details');
        }

        const data = await response.json();
        setOrder(data);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        if (err.message.includes('login')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location, navigate, orderId]);

  const getTimelineSteps = (status) => {
    if (!order) return { steps: [], statusIndex: 0 };

    const steps = [
      { label: 'Order Placed', date: order.order_placed_date, icon: IconCheck },
      { label: 'In Transit', date: order.in_transit_date, icon: IconTruck },
      { label: 'Shipped', date: order.out_for_delivery_date, icon: IconTruckDelivery },
      { label: 'Delivered', date: order.delivered_date, icon: IconHome },
    ];

    const statusIndex = {
      'Pending': 0,
      'In Transit': 1,
      'Shipped': 2,
      'Delivered': 3,
      'Completed': 3,
      'Cancelled': 0,
    }[status] || 0;

    steps.forEach((step, index) => {
      step.active = index <= statusIndex;
      step.current = index === statusIndex;
      if (index < statusIndex && index !== 0) {
        step.icon = IconCheck;
      }
    });

    return { steps, statusIndex };
  };

  if (loading) {
    return (
      <div className="track-order-page">
        <Navbar />
        <div className="track-order">
          <p className="loading">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="track-order-page">
        <Navbar />
        <div className="track-order">
          <p className="error-message">Error: {error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="track-order-page">
        <Navbar />
        <div className="track-order">
          <p>No order data available</p>
        </div>
        <Footer />
      </div>
    );
  }

  const { steps: timelineSteps, statusIndex } = getTimelineSteps(order.status);

  return (
    <div className="track-order-page">
      <Navbar />
      <div className="track-order">
        <div className="order-status">
          <h2>
            Order Status: <span className="status-text">{order.status}</span>
          </h2>
          <p className="notice">Track your order's progress below.</p>
        </div>
        <div className="order-info">
          <div className="info-item">
            <span>ORDER PLACED</span>
            <span>{order.order_placed_date}</span>
          </div>
          <div className="info-item">
            <span>TOTAL</span>
            <span>₱{order.total_amount}</span>
          </div>
          <div className="info-item">
            <span>SHIP TO</span>
            <span>{order.ship_to}</span>
          </div>
          <div className="info-item">
            <span>PAYMENT METHOD</span>
            <span>{order.payment_method}</span>
          </div>
        </div>
        <div className={`timeline active-${statusIndex}`}>
          {timelineSteps.map((step, index) => (
            <div
              key={index}
              className={`timeline-step ${step.active ? 'active' : ''} ${step.current ? 'current' : ''}`}
              data-index={index}
            >
              <span className="timeline-icon">
                <step.icon size={20} />
              </span>
              <span className="timeline-label">{step.label}</span>
              <span className="timeline-date">{step.date || 'N/A'}</span>
            </div>
          ))}
        </div>
        <div className="order-details">
          <h3>Order Details</h3>
          <div className="details-content">
            <div className="details-text">
              <p><strong>Order ID:</strong> #{order.id}</p>
              <p><strong>Product Name:</strong> {order.product_name}</p>
              <p><strong>Estimated Delivery Date:</strong> {order.estimated_delivery_date}</p>
              <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
            </div>
            <div className="details-image">
              {order.product_img ? (
                <img src={order.product_img} alt={order.product_name} className="product-image" />
              ) : (
                <p>No image available</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrackOrder;