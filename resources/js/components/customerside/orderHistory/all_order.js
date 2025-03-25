import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../../../../sass/components/all_order.scss';
import CancelOrder from '../orderHistory/cancel_order';
import RateProduct from '../orderHistory/rate_product';

const AllOrder = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState(null);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [selectedOrderForRate, setSelectedOrderForRate] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('LaravelPassportToken');
        
        if (!token) {
          throw new Error('Please login first - No token found');
        }

        const response = await fetch('/api/orders/user', {
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
            throw new Error('Session expired or invalid token. Please login again.');
          }
          throw new Error(errorData.message || 'Failed to fetch orders');
        }

        const data = await response.json();
        
        const ordersWithTabs = data.map(order => {
          const statusMap = {
            1: 'Pending',
            2: 'In Transit',
            3: 'Received',
            4: 'Completed',
            5: 'Cancelled',
            6: 'Refund'
          };

          const statusName = statusMap[order.status_id] || order.status_name || 'Pending';
          
          return {
            ...order,
            tab: getTabFromStatus(statusName),
            image: order.product_img,
            name: order.product_name,
            quantity: order.quantity,
            status: statusName,
            price: order.total_amount.replace(' USD', ''),
            actions: getActionsFromStatus(statusName),
          };
        });

        setOrders(ordersWithTabs);
        setError(null);
      } catch (error) {
        setError(error.message);
        if (error.message.includes('login')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const getTabFromStatus = (status) => {
    switch (status.toLowerCase()) {
      case 'in transit': return 'to_ship';
      case 'received': return 'to_receive';
      case 'completed': return 'completed';
      case 'cancelled': return 'cancelled';
      case 'refund': return 'refunded';
      case 'pending': return 'to_pay';
      default: return 'all';
    }
  };

  const getActionsFromStatus = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return ['Cancel Order', 'Track Order'];
      case 'in transit':
        return ['Track Order'];
      case 'received':
        return ['Track Order'];
      case 'completed':
        return ['Rate', 'Refund']; // Always allow "Rate" for Completed
      default:
        return [];
    }
  };

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(order => order.tab === activeTab);

  const handleTrackOrder = (order) => {
    navigate('/track_order', { state: { order } });
  };

  const handleCancelOrder = (order) => {
    setSelectedOrderForCancel(order);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = (reason) => {
    if (selectedOrderForCancel) {
      console.log('Order cancelled:', selectedOrderForCancel.order_number, 'Reason:', reason);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === selectedOrderForCancel.id 
            ? { ...order, status: 'Cancelled', status_id: 5, actions: [] }
            : order
        )
      );
      setIsCancelModalOpen(false);
      setSelectedOrderForCancel(null);
    }
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedOrderForCancel(null);
  };

  const handleRateOrder = (order) => {
    setSelectedOrderForRate(order);
    setIsRateModalOpen(true);
  };

  const handleSubmitRating = ({ rating, review, image }) => {
    if (selectedOrderForRate) {
      console.log('Rating submitted for order:', selectedOrderForRate.order_number, { rating, review, image });
      setIsRateModalOpen(false);
      setSelectedOrderForRate(null);
    }
  };

  const handleCloseRateModal = () => {
    setIsRateModalOpen(false);
    setSelectedOrderForRate(null);
  };

  return (
    <div className="all-order">
      <div className="order-tabs">
        <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
          All Orders
        </button>
        <button className={`tab ${activeTab === 'to_pay' ? 'active' : ''}`} onClick={() => setActiveTab('to_pay')}>
          Pending
        </button>
        <button className={`tab ${activeTab === 'to_ship' ? 'active' : ''}`} onClick={() => setActiveTab('to_ship')}>
          To Ship
        </button>
        <button className={`tab ${activeTab === 'to_receive' ? 'active' : ''}`} onClick={() => setActiveTab('to_receive')}>
          To Receive
        </button>
        <button className={`tab ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
          Completed
        </button>
        <button className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`} onClick={() => setActiveTab('cancelled')}>
          Cancelled
        </button>
        <button className={`tab ${activeTab === 'refunded' ? 'active' : ''}`} onClick={() => setActiveTab('refunded')}>
          Refunded
        </button>
      </div>

      <div className="orders-list">
        {loading ? (
          <p className="loading">Loading orders...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order.id} className="order-item-container">
              <div className="order-item">
                <div className="order-details">
                  <img src={order.image} alt={order.name} className="order-image" />
                  <div className="order-info">
                    <h4>{order.name}</h4>
                    <p className="quantity">x{order.quantity}</p>
                    <p className={`status status-${order.status.toLowerCase().replace(' ', '-')}`}>
                      Status: {order.status}
                    </p>
                  </div>
                </div>
                <div className="order-actions">
                  <p className="order-price">₱{order.price}</p>
                  <div className="action-buttons">
                    {order.actions.map((action, index) => (
                      <button
                        key={index}
                        className="action-btn"
                        onClick={
                          action === 'Track Order' ? () => handleTrackOrder(order) :
                          action === 'Cancel Order' ? () => handleCancelOrder(order) :
                          action === 'Rate' ? () => handleRateOrder(order) :
                          action === 'Refund' ? () => console.log('Refund requested for order:', order.order_number) :
                          undefined
                        }
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No orders found for this tab.</p>
        )}
      </div>

      <CancelOrder
        isOpen={isCancelModalOpen}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
        orderId={selectedOrderForCancel?.id} 
      />
      <RateProduct
        isOpen={isRateModalOpen}
        onClose={handleCloseRateModal}
        onSubmit={handleSubmitRating}
        orderId={selectedOrderForRate?.id}
        productId={selectedOrderForRate?.product_id} 
      />
    </div>
  );
};

export default AllOrder;