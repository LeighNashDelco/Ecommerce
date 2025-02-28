import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import "./../../../sass/components/_products_modal.scss";

function AddProductModal({ onClose, onSubmit }) {
  const [productImage, setProductImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [profileId, setProfileId] = useState(null);

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    setPrice: "",
    setStock: "",
    brand: "",
    category: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("LaravelPassportToken");
    if (!token) {
      console.error("Token is missing");
      return;
    }

    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/brands", {
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
        if (!userId) {
          console.error("User ID not found");
          return;
        }

        const profileResponse = await axios.get(
          `http://127.0.0.1:8000/api/profiles/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (profileResponse.data && profileResponse.data.id) {
          setProfileId(profileResponse.data.id);
        } else {
          console.error("Profile ID not found");
        }
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
      }
    };

    fetchBrands();
    fetchCategories();
    fetchUserProfile();
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

    const token = localStorage.getItem("LaravelPassportToken");
    if (!token) {
      console.error("Token is missing");
      return;
    }

    if (!profileId) {
      console.error("Profile ID is missing");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("product_name", formData.productName);
    submissionData.append("description", formData.description || "");
    submissionData.append("price", formData.setPrice);
    submissionData.append("quantity", formData.setStock);
    submissionData.append("brand_id", formData.brand);
    submissionData.append("category_id", formData.category);
    submissionData.append("profile_id", profileId);
    if (imageFile) {
      submissionData.append("product_img", imageFile);
    }

    console.log("Submitting Add FormData:", Array.from(submissionData.entries()));
    onSubmit(submissionData);
  };

  return (
    <div className="modal-overlay">
      <div className="product-modal">
        <div className="modal-header">
          <h2>Add New Product</h2>
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
              Add Image
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
                Submit Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProductModal;