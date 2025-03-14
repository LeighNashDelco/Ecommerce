import React, { useState } from 'react';
import './../../../../sass/components/address_modal.scss';

const AddressModal = ({ isOpen, onClose, onSave, initialAddress }) => {
  // Split the initial address into parts (you might want to adjust this based on your address format)
  const [address, setAddress] = useState({
    street: initialAddress.street || '',
    city: initialAddress.city || '',
    province: initialAddress.province || '',
    postalCode: initialAddress.postalCode || '',
    country: initialAddress.country || '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save
  const handleSave = () => {
    onSave(address);
    onClose();
  };

  // Handle cancel
  const handleCancel = () => {
    onClose();
  };

  // Don't render the modal if it's not open
  if (!isOpen) return null;

  return (
    <div className="address-modal-overlay">
      <div className="address-modal">
        <div className="modal-header">
          <h2>Edit Address</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="street">Street</label>
            <input
              type="text"
              id="street"
              name="street"
              value={address.street}
              onChange={handleChange}
              placeholder="Enter street"
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={address.city}
              onChange={handleChange}
              placeholder="Enter city"
            />
          </div>
          <div className="form-group">
            <label htmlFor="province">Province</label>
            <input
              type="text"
              id="province"
              name="province"
              value={address.province}
              onChange={handleChange}
              placeholder="Enter province"
            />
          </div>
          <div className="form-group">
            <label htmlFor="postalCode">Postal Code</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={address.postalCode}
              onChange={handleChange}
              placeholder="Enter postal code"
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={address.country}
              onChange={handleChange}
              placeholder="Enter country"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;