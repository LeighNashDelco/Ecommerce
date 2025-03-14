import React, { useState } from 'react';
import './../../../../sass/components/cancel_order.scss';

const CancelOrder = ({ isOpen, onClose, onConfirm }) => {
  const [selectedReason, setSelectedReason] = useState('');

  const cancellationReasons = [
    "I don't want to buy it anymore.",
    "I changed my mind.",
    "I ordered by mistake.",
    "I found a better price elsewhere.",
  ];

  const handleReasonChange = (event) => {
    setSelectedReason(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedReason) {
      onConfirm(selectedReason);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cancel-order-modal-overlay">
      <div className="cancel-order-modal-content">
        <h2>Cancel Order</h2>
        <p>
          Please select a cancellation reason. Please take note that this will
          cancel the selected items and the action cannot be undone.
        </p>
        <form onSubmit={handleSubmit} className="radio-group">
          {cancellationReasons.map((reason, index) => (
            <label key={index} className="radio-label">
              <input
                type="radio"
                value={reason}
                checked={selectedReason === reason}
                onChange={handleReasonChange}
                required
              />
              <span>{reason}</span>
            </label>
          ))}
          <div className="button-group">
            <button type="button" className="btn no-btn" onClick={onClose}>
              No
            </button>
            <button
              type="submit"
              className="btn yes-btn"
              disabled={!selectedReason}
            >
              Yes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelOrder;