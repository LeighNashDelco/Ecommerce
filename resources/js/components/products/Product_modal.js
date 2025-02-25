import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import "./../../../sass/components/_products_modal.scss";

function ProductModal({ onClose }) {
  const [productImage, setProductImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sellers, setSellers] = useState([]); // Fetch sellers (profile_id)
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    setPrice: "",
    setStock: "",
    brand: "",
    category: "",
    profileId: "", // Store selected profileId
  });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/brands")
      .then((response) => setBrands(response.data))
      .catch((error) => console.error("Error fetching brands:", error));

    axios
      .get("http://127.0.0.1:8000/api/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));

    axios
      .get("http://127.0.0.1:8000/api/sellers") // Fetch sellers (profile_id)
      .then((response) => setSellers(response.data))
      .catch((error) => console.error("Error fetching sellers:", error));
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setProductImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare FormData for submission
    const submissionData = new FormData();
    submissionData.append("product_name", formData.productName);
    submissionData.append("description", formData.description);
    submissionData.append("price", formData.setPrice);
    submissionData.append("quantity", formData.setStock);
    submissionData.append("brand_id", formData.brand);
    submissionData.append("category_id", formData.category);

    // Check if profileId is valid before submitting
    if (formData.profileId) {
      submissionData.append("profile_id", formData.profileId); // Append profile_id instead of seller_id
    } else {
      console.error("Profile ID is missing");
      return; // Don't submit the form if profileId is missing
    }

    if (imageFile) {
      submissionData.append("product_img", imageFile);
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/products", submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Product added:", response.data);
      onClose(); // Close modal after submission
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error.message);

      if (error.response) {
        const validationErrors = error.response.data.errors;
        console.log("Validation Errors:", validationErrors);
      }
    }
};

  return (
    <div className="modal-overlay">
      <div className="product-modal">
        <div className="modal-header">
          <h2>Add New Product</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        <div className="modal-content">
          <div className="image-section">
            <div className="image-preview">
              {productImage ? (
                <img src={productImage} alt="Product Preview" />
              ) : (
                <div className="placeholder"><span>Upload Product Image</span></div>
              )}
            </div>
            <label htmlFor="image-upload" className="upload-button">Add Image</label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>
          <div className="form-section">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="productName"
                placeholder="Product Name"
                className="input-field"
                value={formData.productName}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                className="input-field description"
                value={formData.description}
                onChange={handleInputChange}
              />
              <div className="action-fields">
                <input
                  type="number"
                  name="setPrice"
                  placeholder="Set Price"
                  className="input-field price-field"
                  value={formData.setPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
                <input
                  type="number"
                  name="setStock"
                  placeholder="Set Stock"
                  className="input-field stock-field"
                  value={formData.setStock}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
                <div className="select-wrapper">
                  <select
                    className="select-field"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>{brand.brand_name}</option>
                    ))}
                  </select>
                  <FaChevronDown className="dropdown-icon" />
                </div>
                <div className="select-wrapper">
                  <select
                    className="select-field"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.category_name}</option>
                    ))}
                  </select>
                  <FaChevronDown className="dropdown-icon" />
                </div>
                <div className="select-wrapper">
                  <select
                    className="select-field"
                    name="profileId" // Changed to profileId
                    value={formData.profileId} // Changed to profileId
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Select Seller</option>
                    {sellers.map((seller) => (
                      <option key={seller.profile_id} value={seller.profile_id}>
                        {seller.username} ({seller.profile_id})
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className="dropdown-icon" />
                </div>
              </div>
              <button type="submit" className="submit-button">Submit Product</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
