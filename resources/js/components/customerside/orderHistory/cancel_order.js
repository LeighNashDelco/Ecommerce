// resources/js/components/customerside/orderHistory/cancel_order.js
import React, { useState } from 'react';
import './../../../../sass/components/cancel_order.scss';

const CancelOrder = ({ isOpen, onClose, onConfirm, orderId }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const cancellationReasons = [
    "I don't want to buy it anymore.",
    "I changed my mind.",
    "I ordered by mistake.",
    "I found a better price elsewhere.",
  ];

  const handleReasonChange = (event) => {
    setSelectedReason(event.target.value);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedReason) return;

    setIsLoading(true);
    setError(null);

    try {
      const passportToken = localStorage.getItem('LaravelPassportToken');
      if (!passportToken) {
        throw new Error('No authentication token found');
      }

      console.log('Cancelling order with ID:', orderId); // Debug log

      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${passportToken}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Response:', data); // Debug log

      if (response.ok) {
        onConfirm(selectedReason);
        onClose();
      } else {
        setError(data.error || 'Failed to cancel order');
        if (data.debug) {
          console.log('Debug info:', data.debug);
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred while cancelling the order');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cancel-order-modal-overlay">
      <div className="cancel-order-modal-content">
        <h2>Cancel Order</h2>
        <p>Please select a cancellation reason.</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="radio-group">
          {cancellationReasons.map((reason, index) => (
            <label key={index} className="radio-label">
              <input
                type="radio"
                value={reason}
                checked={selectedReason === reason}
                onChange={handleReasonChange}
                required
                disabled={isLoading}
              />
              <span>{reason}</span>
            </label>
          ))}
          <div className="button-group">
            <button 
              type="button" 
              className="btn no-btn" 
              onClick={onClose}
              disabled={isLoading}
            >
              No
            </button>
            <button
              type="submit"
              className="btn yes-btn"
              disabled={!selectedReason || isLoading}
            >
              {isLoading ? 'Cancelling...' : 'Yes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelOrder;