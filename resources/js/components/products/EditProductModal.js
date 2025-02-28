import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import "./../../../sass/components/_products_modal.scss";

function EditProductModal({ onClose, onSubmit, product }) {
  const [productImage, setProductImage] = useState(product?.product_img || null);
  const [imageFile, setImageFile] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    id: product?.id || "",
    productName: product?.product_name || "",
    description: product?.description || "",
    setPrice: product?.price ? String(product.price).replace(/,/g, "") : "",
    setStock: product?.quantity ? String(product.quantity) : "",
    brand: product?.brand_id ? String(product.brand_id) : "",
    category: product?.category_id ? String(product.category_id) : "",
  });

  useEffect(() => {
    console.log("Initial product data:", product);
    console.log("Initial formData:", formData);

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

    fetchBrands();
    fetchCategories();
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

    const submissionData = new FormData();
    submissionData.append("product_name", formData.productName || product?.product_name || "");
    submissionData.append("description", formData.description || product?.description || "");
    submissionData.append("price", Number(formData.setPrice || product?.price || 0));
    submissionData.append("quantity", Number(formData.setStock || product?.quantity || 0));
    submissionData.append("brand_id", Number(formData.brand || product?.brand_id || 0));
    submissionData.append("category_id", Number(formData.category || product?.category_id || 0));
    submissionData.append("id", formData.id);
    if (imageFile) {
      submissionData.append("product_img", imageFile);
    }

    console.log("FormData state before submit:", formData);
    console.log("Submitting Edit FormData:");
    for (const [key, value] of submissionData.entries()) {
      console.log(`${key}: ${value}`);
    }

    onSubmit(submissionData);
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
              Change Image
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