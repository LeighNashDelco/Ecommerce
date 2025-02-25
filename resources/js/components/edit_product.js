import React, { useState } from 'react';

export default function EditProduct() {
  const [selectedFile, setSelectedFile] = useState(null); // State for the selected file

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Update state with the selected file
      // Here, you can add logic to preview the image or upload it (e.g., to a server)
    }
  };

  return (
    <div className="edit-product-modal">
      <div className="edit-product-overlay">
        <div className="edit-product-content">
          <div className="edit-product-header">
            <h2>Edit Product</h2>
          </div>
          <div className="edit-product-form">
            <div className="edit-product-left">
              <div className="edit-product-image-section">
                <img 
                  src={selectedFile ? URL.createObjectURL(selectedFile) : "/path/to/default-image.jpg"} 
                  alt="Product" 
                  className="edit-product-image" 
                />
              </div>
              <label className="edit-product-upload-button" style={{ width: '300px' }}>
                Add Image
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="edit-product-file-input" 
                  hidden 
                />
              </label>
            </div>
            <div className="edit-product-right">
              <div className="edit-product-field">
                <label>Product Name</label>
                <input type="text" className="edit-product-input" placeholder="Enter product name" />
              </div>
              <div className="edit-product-field">
                <label>Category</label>
                <input type="text" className="edit-product-input" placeholder="Enter category" />
              </div>
              <div className="edit-product-field">
                <label>Seller</label>
                <input type="text" className="edit-product-input" placeholder="Enter seller name" />
              </div>
              <div className="edit-product-field">
                <label>Price</label>
                <input type="text" className="edit-product-input" placeholder="Enter price" />
              </div>
              <div className="edit-product-field">
                <label>Stock</label>
                <input type="number" className="edit-product-input" placeholder="Enter stock quantity" />
              </div>
              <div className="edit-product-field">
                <label>Description</label>
                <textarea className="edit-product-textarea" placeholder="Enter product description"></textarea>
              </div>
            </div>
          </div>
          <div className="edit-product-actions">
            <button className="edit-product-cancel-button">Cancel</button>
            <button className="edit-product-save-button">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}