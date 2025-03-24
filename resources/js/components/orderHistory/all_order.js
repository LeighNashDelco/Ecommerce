import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../../../sass/components/all_order.scss';
import AttackSharkImage from '../../../../resources/sass/img/ATKX5.svg';
import CancelOrder from '../orderHistory/cancel_order';
import RateProduct from '../orderHistory/rate_product';

const AllOrder = () => {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState(null);

  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [selectedOrderForRate, setSelectedOrderForRate] = useState(null);

  const orders = [
    {
      id: 1,
      image: AttackSharkImage,
      name: 'Attack Shark X3PRO Three Modes 8K Gaming Mouse',
      price: 990,
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
      name: 'Attack Shark X3PRO Three Modes 8K Gaming Mouse',
      price: 990,
      quantity: 2, // Changed quantity to 2 for testing
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

  const handleCancelOrder = (order) => {
    setSelectedOrderForCancel(order);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = (reason) => {
    if (selectedOrderForCancel) {
      console.log('Order cancelled:', selectedOrderForCancel.orderNumber, 'Reason:', reason);
      setIsCancelModalOpen(false);
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

  const handleSubmitRating = ({ rating, review }) => {
    if (selectedOrderForRate) {
      console.log('Rating submitted for order:', selectedOrderForRate.orderNumber, { rating, review });
      setIsRateModalOpen(false);
    }
  };

  const handleCloseRateModal = () => {
    setIsRateModalOpen(false);
    setSelectedOrderForRate(null);
  };

  return (
    <div className="all-order">
      <div className="order-tabs">
        <div className="tabs-desktop">
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
        <div className="tabs-mobile">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="order-tab-dropdown"
          >
            <option value="all">ALL ORDER</option>
            <option value="to_pay">TO PAY</option>
            <option value="to_ship">TO SHIP</option>
            <option value="to_receive">TO RECEIVE</option>
            <option value="completed">COMPLETED</option>
            <option value="cancelled">CANCELLED</option>
            <option value="refunded">REFUNDED</option>
          </select>
        </div>
      </div>

      <div className="orders-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order.id} className="order-item-container">
              <div className="order-item">
                <div className="order-details">
                  <img src={order.image} alt={order.name} className="order-image" />
                  <div className="order-info">
                    <div className="price-name">
                      <h4>{order.name}</h4>
                      <p className="order-price">₱{order.price * order.quantity}</p>
                    </div>
                    <div className="quantity-total">
                      <p className="order-quantity">x{order.quantity}</p>
                    </div>
                  </div>
                </div>
                <div className="order-actions">
                  {order.actions.map((action, index) => (
                    <button
                      key={index}
                      className={`action-btn ${action.toLowerCase().replace(' ', '-')}`}
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

      <CancelOrder
        isOpen={isCancelModalOpen}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
      />

      <RateProduct
        isOpen={isRateModalOpen}
        onClose={handleCloseRateModal}
        onSubmit={handleSubmitRating}
      />
    </div>
  );
};

export default AllOrder;