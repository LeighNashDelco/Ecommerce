import React, { useState } from 'react';
import { FaUpload } from 'react-icons/fa';



function AddUserModal({ onClose }) {
  const [userImage, setUserImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    email: '',
    password: '',
    address: '',
    contactNumber: '',
    country: '',
    city: '',
    province: '',
    postalCode: '',
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUserImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(`Input changed: ${name} = ${value}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="add-user-modal">
        <div className="modal-header">
          <h2>Add User</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="layout-container">
              <div className="image-section">
                <div className="image-preview">
                  {userImage ? (
                    <img src={userImage} alt="User Preview" />
                  ) : (
                    <div className="placeholder">
                      <span>No image uploaded</span>
                    </div>
                  )}
                </div>
                <label htmlFor="user-image-upload" className="upload-button">
                  <FaUpload /> Upload a photo
                </label>
                <input
                  type="file"
                  id="user-image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
              <div className="form-section">
                <div className="name-fields">
                  <div className="field-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  <div className="field-group">
                    <label>Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      placeholder="Middle Name"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  <div className="field-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  <div className="field-group">
                    <label>Suffix</label>
                    <input
                      type="text"
                      name="suffix"
                      placeholder="Suffix"
                      value={formData.suffix}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="field-group full-width">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div className="field-group full-width">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div className="field-group full-width">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div className="field-group">
                  <label>Contact Number</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    placeholder="Contact Number"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div className="location-fields">
                  <div className="field-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  <div className="field-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  <div className="field-group">
                    <label>Province</label>
                    <input
                      type="text"
                      name="province"
                      placeholder="Province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  <div className="field-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="button-group">
                  <button type="button" className="cancel-button" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="save-button">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUserModal;