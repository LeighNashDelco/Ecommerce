import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import "./../../../sass/components/_products_modal.scss";

function EditProductModal({ onClose, onEdit, product }) {
  const [productImage, setProductImage] = useState(product.product_img || null);
  const [imageFile, setImageFile] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [profileId, setProfileId] = useState(null);

  const [formData, setFormData] = useState({
    id: product.id,
    productName: product.product_name,
    description: product.description || "",
    setPrice: product.price,
    setStock: product.quantity,
    brand: product.brand_id || "",
    category: product.category_id || "",
  });

  useEffect(() => {
    console.log("Editing product:", product);
    console.log("Initial formData:", formData);

    const token = localStorage.getItem("LaravelPassportToken");
    if (!token) {
      console.error("Token is missing");
      return;
    }

    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/brands/active", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Brands response:", response.data);
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error.response?.data || error.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Categories response:", response.data);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error.response?.data || error.message);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const userResponse = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userId = userResponse.data.id;
        const profileResponse = await axios.get(
          `http://127.0.0.1:8000/api/profiles/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (profileResponse.data && profileResponse.data.id) {
          setProfileId(profileResponse.data.id);
        }
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
      }
    };

    fetchBrands();
    fetchCategories();
    fetchUserProfile();
  }, [product]);

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
    console.log(`Updating ${name} to ${value}`);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("LaravelPassportToken");
    if (!token) {
      console.error("Token is missing");
      return;
    }
  
    if (!profileId) {
      console.error("Profile ID is missing");
      return;
    }
  
    try {
      // Step 1: Update text fields with JSON
      const jsonData = {
        product_name: formData.productName,
        description: formData.description || "",
        price: formData.setPrice,
        quantity: formData.setStock,
        brand_id: formData.brand,
        category_id: formData.category,
        id: formData.id,
      };
      console.log("Submitting Edit JSON:", jsonData);
  
      const url = `http://127.0.0.1:8000/api/products/${formData.id}`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const response = await axios.patch(url, jsonData, config);
      console.log("Text update response:", response.data);
  
      // Step 2: Update image if present with POST
      if (imageFile) {
        const imageData = new FormData();
        imageData.append("product_img", imageFile);
  
        console.log("Submitting Image FormData:");
        for (let [key, value] of imageData.entries()) {
          console.log(`${key}: ${value}`);
        }
  
        const imageResponse = await axios.post(
          `http://127.0.0.1:8000/api/products/${formData.id}/image`,
          imageData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              console.log("Upload Progress:", { loaded: progressEvent.loaded, total: progressEvent.total, percent });
            },
          }
        );
        console.log("Image update response:", imageResponse.data);
        onEdit(imageResponse.data); // Use final response with image
      } else {
        onEdit(response.data); // Use text-only response
      }
  
      onClose();
    } catch (error) {
      console.error("Error editing product:", error.response?.data || error.message);
      console.log("Response status:", error.response?.status);
      console.log("Response data:", error.response?.data);
      console.log("Validation errors:", error.response?.data?.errors);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="product-modal">
        <div className="modal-header">
          <h2>Edit Product</h2>
          <button className="close-button" onClick={onClose}>
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
              Update Image
            </label>
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
                    <option value="" disabled>
                      Select Brand
                    </option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.brand_name}
                      </option>
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
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className="dropdown-icon" />
                </div>
              </div>
              <button type="submit" className="submit-button">
                Update Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProductModal;