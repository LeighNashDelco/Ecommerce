import React, { useState } from 'react';
import { FaChevronDown } from "react-icons/fa";

function ProductModal({ onClose }) {
  const [productImage, setProductImage] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    setPrice: '',
    setStock: '',
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductImage(e.target.result);
      };
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

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="product-modal">
        <div className="modal-header">
          <h2>Add New Products</h2>
          <button className="close-button" onClick={handleClose}>
            ✕
          </button>
        </div>
        <div className="modal-content">
          <div className="image-section">
            <div className="image-preview">
              {productImage ? (
                <img src={productImage} alt="Product Preview" />
              ) : (
                <div className="placeholder">
                  <span>Upload Product Image</span>
                </div>
              )}
            </div>
            <label htmlFor="image-upload" className="upload-button">
              Add Image
            </label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
          <div className="form-section">
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              className="input-field"
              value={formData.productName}
              onChange={handleInputChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              className="input-field description"
              value={formData.description}
              onChange={handleInputChange}
            />
            <div className="action-fields">
              <div className="input-wrapper">
                <input
                  type="number"
                  name="setPrice"
                  placeholder="Set Price"
                  className="input-field price-field"
                  value={formData.setPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="input-wrapper">
                <input
                  type="number"
                  name="setStock"
                  placeholder="Set Stock"
                  className="input-field stock-field"
                  value={formData.setStock}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="select-wrapper">
                <select className="select-field">
                  <option value="" disabled selected>Select Brand</option>
                  <option value="attackshark">Attack Shark</option>
                  <option value="logitech">Logitech</option>
                  <option value="razer">Razer</option>
                </select>
                <FaChevronDown className="dropdown-icon" />
              </div>
              <div className="select-wrapper">
                <select className="select-field">
                  <option value="" disabled selected>Select Category</option>
                  <option value="gamingmouse">Gaming Mouse</option>
                  <option value="wirelessmouse">Wireless Mouse</option>
                  <option value="officemouse">Office Mouse</option>
                </select>
                <FaChevronDown className="dropdown-icon" />
              </div>
            </div>
            <button className="submit-button">Submit Product</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;