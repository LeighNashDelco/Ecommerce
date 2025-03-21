import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./../../../../sass/components/_reviewsandnotification.scss";

const ReviewModal = ({ onClose, onSubmit, isEdit = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    product_id: isEdit && initialData ? initialData.product_id || "" : "",
    user_id: isEdit && initialData ? initialData.user_id || "" : "",
    rating: isEdit && initialData ? initialData.rating || "" : "",
    comment: isEdit && initialData ? initialData.comment || "" : "",
    photo: null,
  });
  const [products, setProducts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [profileSearch, setProfileSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(isEdit && initialData?.photo ? initialData.photo : null);
  const [errors, setErrors] = useState({}); // State for validation errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("LaravelPassportToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [productsRes, profilesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/products", config),
          axios.get("http://127.0.0.1:8000/api/profiles", config),
        ]);
        setProducts(productsRes.data);
        setProfiles(profilesRes.data);

        if (isEdit && initialData) {
          const product = productsRes.data.find((p) => p.id === initialData.product_id);
          const profile = profilesRes.data.find((p) => p.user_id === initialData.user_id);
          setProductSearch(product ? product.product_name : "");
          setProfileSearch(profile ? profile.full_name : "");
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchData();
  }, [isEdit, initialData]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.product_name.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) =>
      p.full_name.toLowerCase().includes(profileSearch.toLowerCase())
    );
  }, [profiles, profileSearch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when the user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, photo: "" }));
    }
  };

  const handleProductSelect = (product) => {
    setFormData((prev) => ({ ...prev, product_id: product.id }));
    setProductSearch(product.product_name);
    setShowProductDropdown(false);
    setErrors((prev) => ({ ...prev, product_id: "" }));
  };

  const handleProfileSelect = (profile) => {
    setFormData((prev) => ({ ...prev, user_id: profile.user_id }));
    setProfileSearch(profile.full_name);
    setShowProfileDropdown(false);
    setErrors((prev) => ({ ...prev, user_id: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.product_id) {
      newErrors.product_id = "Please select a product.";
    }
    if (!formData.user_id) {
      newErrors.user_id = "Please select a user.";
    }
    const rating = parseInt(formData.rating, 10);
    if (!formData.rating || isNaN(rating) || rating < 1 || rating > 5) {
      newErrors.rating = "Please enter a rating between 1 and 5.";
    }
    if (formData.photo && formData.photo.size > 2 * 1024 * 1024) {
      newErrors.photo = "Photo must be less than 2MB.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    const submitData = new FormData();
    submitData.append("product_id", formData.product_id);
    submitData.append("user_id", formData.user_id);
    submitData.append("rating", parseInt(formData.rating, 10)); // Ensure rating is an integer
    submitData.append("comment", formData.comment || "");
    if (formData.photo) {
      submitData.append("photo", formData.photo);
    }
    if (isEdit) {
      submitData.append("_method", "PUT");
    }

    // Log the FormData contents
    const formDataEntries = {};
    for (let [key, value] of submitData.entries()) {
      formDataEntries[key] = value;
    }
    console.log("Submitting review data:", formDataEntries);

    onSubmit(submitData);
  };

  return (
    <div className="modal-overlay">
      <div className="add-item-modal">
        <div className="modal-header">
          <h2>{isEdit ? "Edit Review" : "Add Review"}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="field-group full-width" style={{ position: "relative" }}>
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setShowProductDropdown(true);
                  }}
                  onFocus={() => setShowProductDropdown(true)}
                  className="input-field"
                />
                {errors.product_id && (
                  <span className="error-message" style={{ color: "red", fontSize: "12px" }}>
                    {errors.product_id}
                  </span>
                )}
                {showProductDropdown && filteredProducts.length > 0 && (
                  <ul
                    style={{
                      maxHeight: "150px",
                      overflowY: "auto",
                      border: "1px solid #ccc",
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      background: "#fff",
                      zIndex: 10,
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {filteredProducts.map((product) => (
                      <li
                        key={product.id}
                        onClick={() => handleProductSelect(product)}
                        style={{ padding: "5px 10px", cursor: "pointer" }}
                      >
                        {product.product_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="field-group full-width" style={{ position: "relative" }}>
                <label>User Name</label>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={profileSearch}
                  onChange={(e) => {
                    setProfileSearch(e.target.value);
                    setShowProfileDropdown(true);
                  }}
                  onFocus={() => setShowProfileDropdown(true)}
                  className="input-field"
                />
                {errors.user_id && (
                  <span className="error-message" style={{ color: "red", fontSize: "12px" }}>
                    {errors.user_id}
                  </span>
                )}
                {showProfileDropdown && filteredProfiles.length > 0 && (
                  <ul
                    style={{
                      maxHeight: "150px",
                      overflowY: "auto",
                      border: "1px solid #ccc",
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      background: "#fff",
                      zIndex: 10,
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {filteredProfiles.map((profile) => (
                      <li
                        key={profile.id}
                        onClick={() => handleProfileSelect(profile)}
                        style={{ padding: "5px 10px", cursor: "pointer" }}
                      >
                        {profile.full_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="field-group full-width">
                <label>Rating</label>
                <input
                  type="number"
                  name="rating"
                  placeholder="Rating (1-5)"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="input-field"
                  min="1"
                  max="5"
                />
                {errors.rating && (
                  <span className="error-message" style={{ color: "red", fontSize: "12px" }}>
                    {errors.rating}
                  </span>
                )}
              </div>
              <div className="field-group full-width">
                <label>Comment</label>
                <textarea
                  name="comment"
                  placeholder="Comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div className="field-group full-width">
                <label>Upload Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="input-field"
                />
                {errors.photo && (
                  <span className="error-message" style={{ color: "red", fontSize: "12px" }}>
                    {errors.photo}
                  </span>
                )}
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="photo-preview"
                    style={{ maxWidth: "100%", marginTop: "10px" }}
                  />
                )}
              </div>
              <div className="button-group">
                <button type="button" className="cancel-button" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  {isEdit ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;