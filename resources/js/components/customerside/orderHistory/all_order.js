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
            3: 'Shipped',
            4: 'Delivered',
            5: 'Completed',
            6: 'Cancelled'
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
            actions: getActionsFromStatus(statusName, order.status_id),
          };
        });

        const sortedOrders = ordersWithTabs.sort((a, b) => {
          if (a.status_id === 1 && b.status_id !== 1) return -1;
          if (a.status_id !== 1 && b.status_id === 1) return 1;
          return b.id - a.id;
        });

        setOrders(sortedOrders);
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
      case 'pending': return 'pending';
      case 'in transit': return 'in_transit';
      case 'shipped': return 'shipped';
      case 'delivered': return 'delivered';
      case 'completed': return 'completed';
      case 'cancelled': return 'cancelled';
      default: return 'all';
    }
  };

  const getActionsFromStatus = (status, statusId) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return ['Cancel Order', 'Track Order'];
      case 'in transit':
        return ['Track Order'];
      case 'shipped':
        return ['Track Order'];
      case 'delivered':
        return statusId === 4 ? ['Order Complete', 'Rate'] : ['Rate'];
      case 'completed':
        return ['Rate', 'Refund'];
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

  const handleConfirmCancel = async (reason) => {
    if (selectedOrderForCancel) {
      try {
        const token = localStorage.getItem('LaravelPassportToken');
        const response = await fetch(`/api/orders/${selectedOrderForCancel.id}/cancel`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason }),
        });

        if (!response.ok) {
          throw new Error('Failed to cancel order');
        }

        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === selectedOrderForCancel.id
              ? { ...order, status: 'Cancelled', status_id: 6, actions: [], tab: 'cancelled' }
              : order
          )
        );
        setIsCancelModalOpen(false);
        setSelectedOrderForCancel(null);
      } catch (error) {
        setError(error.message);
      }
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

  const handleOrderComplete = async (order) => {
    try {
      const token = localStorage.getItem('LaravelPassportToken');
      const response = await fetch(`/api/orders/${order.id}/complete`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark order as complete');
      }

      setOrders(prevOrders =>
        prevOrders.map(o =>
          o.id === order.id
            ? { ...o, status: 'Completed', status_id: 5, actions: ['Rate', 'Refund'], tab: 'completed' }
            : o
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="all-order">
      <div className="order-tabs">
        <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
          All Orders
        </button>
        <button className={`tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
          Pending
        </button>
        <button className={`tab ${activeTab === 'in_transit' ? 'active' : ''}`} onClick={() => setActiveTab('in_transit')}>
          In Transit
        </button>
        <button className={`tab ${activeTab === 'shipped' ? 'active' : ''}`} onClick={() => setActiveTab('shipped')}>
          Shipped
        </button>
        <button className={`tab ${activeTab === 'delivered' ? 'active' : ''}`} onClick={() => setActiveTab('delivered')}>
          Delivered
        </button>
        <button className={`tab ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
          Completed
        </button>
        <button className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`} onClick={() => setActiveTab('cancelled')}>
          Cancelled
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
                          action === 'Order Complete' ? () => handleOrderComplete(order) :
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