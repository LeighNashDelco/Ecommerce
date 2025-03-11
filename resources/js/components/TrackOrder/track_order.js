import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation to access state
import './../../../sass/components/track_order.scss';
import { IconCheck, IconBox, IconTruck, IconTruckDelivery, IconHome } from '@tabler/icons-react';
import Navbar from "../Customer/topvar_notlogin";
import Footer from "../footer/footer";

const TrackOrder = () => {
  const location = useLocation(); // Hook to access navigation state
  const order = location.state?.order || { // Use passed order or fallback to default
    orderNumber: '#2241',
    status: 'In Transit',
    total: '2365.00 USD',
    shipTo: 'Alexander Otaza',
    estimatedDeliveryDate: 'March 17, 2025',
    orderPlacedDate: 'March 14, 2025',
    orderReadyDate: 'March 13, 2025',
    inTransitDate: 'March 14, 2025',
    outForDeliveryDate: null,
    deliveredDate: null,
    productName: 'Attack Shark X3',
    shippingAddress: 'Purok 6 960-B RCES, Baan riverside (Bgy. 19), Butuan City, Mindanao, Agusan Del Norte 8600',
  };

  const timelineSteps = [
    { label: 'Order Placed', date: order.orderPlacedDate, icon: IconCheck, active: true },
    { label: 'Order Ready', date: order.orderReadyDate, icon: IconBox, active: true },
    { label: 'In Transit', date: order.inTransitDate, icon: IconTruck, active: true },
    { label: 'Out for Delivery', date: order.outForDeliveryDate, icon: IconTruckDelivery, active: false },
    { label: 'Delivered', date: order.deliveredDate, icon: IconHome, active: false },
  ];

  return (
    <div className="track-order-page">
      <Navbar />
      <div className="track-order">
        <div className="order-status">
          <h2>
            Order Status: <span className="status-text">{order.status}</span>
          </h2>
          <p>Estimated Delivery Date: {order.estimatedDeliveryDate}</p>
        </div>
        <div className="order-info">
          <div className="info-item">
            <span>ORDER PLACED</span>
            <span>{order.orderPlacedDate}</span>
          </div>
          <div className="info-item">
            <span>TOTAL</span>
            <span>{order.total}</span>
          </div>
          <div className="info-item">
            <span>SHIP TO</span>
            <span>{order.shipTo}</span>
          </div>
          <div className="info-item">
            <span>ORDER</span>
            <span>{order.orderNumber}</span>
          </div>
        </div>
        <div className="timeline">
          {timelineSteps.map((step, index) => (
            <div key={index} className={`timeline-step ${step.active ? 'active' : ''}`}>
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
          <p><strong>Product Name:</strong> {order.name || order.productName}</p>
          <p><strong>Order number:</strong> {order.orderNumber}</p>
          <p><strong>Estimated Delivery Date:</strong> {order.estimatedDeliveryDate}</p>
          <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrackOrder;