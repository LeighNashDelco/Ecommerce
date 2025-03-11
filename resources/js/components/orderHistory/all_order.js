import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../../../sass/components/all_order.scss';
import AttackSharkImage from '../../../../resources/sass/img/ATKX5.svg';
import CancelOrder from '../orderHistory/cancel_order'; // Adjust the path to your cancel_order.js file
import RateProduct from '../orderHistory/rate_product'; // Adjust the path to your rate_product.js file

const AllOrder = () => {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  // State to manage the cancel modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState(null);

  // State to manage the rate modal
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [selectedOrderForRate, setSelectedOrderForRate] = useState(null);

  const orders = [
    {
      id: 1,
      image: AttackSharkImage,
      name: 'Attack Shark X3',
      quantity: 1,
      status: 'Shipped',
      tab: 'to_ship',
      actions: ['Track', 'Cancel Order'],
      orderNumber: '#2241',
      total: '2365.00 USD',
      shipTo: 'Alexander Otaza',
      estimatedDeliveryDate: 'March 17, 2025',
      orderPlacedDate: 'March 14, 2025',
      orderReadyDate: 'March 13, 2025',
      inTransitDate: 'March 14, 2025',
      outForDeliveryDate: null,
      deliveredDate: null,
      shippingAddress: 'Purok 6 960-B RCES, Baan riverside (Bgy. 19), Butuan City, Mindanao, Agusan Del Norte 8600',
    },
    {
      id: 2,
      image: AttackSharkImage,
      name: 'Attack Shark X3',
      quantity: 1,
      status: 'Received',
      tab: 'to_receive',
      actions: ['Rate', 'Refund'],
      orderNumber: '#2242',
      total: '2365.00 USD',
      shipTo: 'Alexander Otaza',
      estimatedDeliveryDate: 'March 18, 2025',
      orderPlacedDate: 'March 15, 2025',
      orderReadyDate: 'March 16, 2025',
      inTransitDate: 'March 17, 2025',
      outForDeliveryDate: null,
      deliveredDate: null,
      shippingAddress: 'Purok 6 960-B RCES, Baan riverside (Bgy. 19), Butuan City, Mindanao, Agusan Del Norte 8600',
    },
  ];

  const filteredOrders = activeTab === 'all' ? orders : orders.filter(order => order.tab === activeTab);

  const handleTrackOrder = (order) => {
    navigate('/track_order', { state: { order } });
  };

  // Open the cancel modal for the selected order
  const handleCancelOrder = (order) => {
    setSelectedOrderForCancel(order);
    setIsCancelModalOpen(true);
  };

  // Handle confirmation from the cancel modal
  const handleConfirmCancel = (reason) => {
    if (selectedOrderForCancel) {
      console.log('Order cancelled:', selectedOrderForCancel.orderNumber, 'Reason:', reason);
      setIsCancelModalOpen(false);
    }
  };

  // Close the cancel modal
  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedOrderForCancel(null);
  };

  // Open the rate modal for the selected order
  const handleRateOrder = (order) => {
    setSelectedOrderForRate(order);
    setIsRateModalOpen(true);
  };

  // Handle submission from the rate modal
  const handleSubmitRating = ({ rating, review }) => {
    if (selectedOrderForRate) {
      console.log('Rating submitted for order:', selectedOrderForRate.orderNumber, { rating, review });
      // Add your rating submission logic here (e.g., API call)
      setIsRateModalOpen(false);
    }
  };

  // Close the rate modal
  const handleCloseRateModal = () => {
    setIsRateModalOpen(false);
    setSelectedOrderForRate(null);
  };

  return (
    <div className="all-order">
      <div className="order-tabs">
        <button
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Order
        </button>
        <button
          className={`tab ${activeTab === 'to_pay' ? 'active' : ''}`}
          onClick={() => setActiveTab('to_pay')}
        >
          To Pay
        </button>
        <button
          className={`tab ${activeTab === 'to_ship' ? 'active' : ''}`}
          onClick={() => setActiveTab('to_ship')}
        >
          To Ship
        </button>
        <button
          className={`tab ${activeTab === 'to_receive' ? 'active' : ''}`}
          onClick={() => setActiveTab('to_receive')}
        >
          To Receive
        </button>
        <button
          className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
        <button
          className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
        </button>
        <button
          className={`tab ${activeTab === 'refunded' ? 'active' : ''}`}
          onClick={() => setActiveTab('refunded')}
        >
          Refunded
        </button>
      </div>

      <div className="orders-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order.id} className="order-item-container">
              <div className="order-item">
                <div className="order-details">
                  <img src={order.image} alt={order.name} className="order-image" />
                  <div className="order-info">
                    <h4>{order.name}</h4>
                    <p>x{order.quantity}</p>
                    <p className={`status ${order.status.toLowerCase()}`}>
                      Status: {order.status}
                    </p>
                  </div>
                </div>
                <div className="order-actions">
                  {order.actions.map((action, index) => (
                    <button
                      key={index}
                      className="action-btn"
                      onClick={
                        action === 'Track'
                          ? () => handleTrackOrder(order)
                          : action === 'Cancel Order'
                          ? () => handleCancelOrder(order)
                          : action === 'Rate'
                          ? () => handleRateOrder(order)
                          : undefined
                      }
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No orders found for this tab.</p>
        )}
      </div>

      {/* Render the CancelOrder modal */}
      <CancelOrder
        isOpen={isCancelModalOpen}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
      />

      {/* Render the RateProduct modal */}
      <RateProduct
        isOpen={isRateModalOpen}
        onClose={handleCloseRateModal}
        onSubmit={handleSubmitRating}
      />
    </div>
  );
};

export default AllOrder;