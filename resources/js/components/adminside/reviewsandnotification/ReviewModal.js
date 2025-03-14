import React, { useState, useEffect } from "react";
import axios from "axios"; // Add axios for API calls
import "./../../../../sass/components/_reviewsandnotification.scss";

const ReviewModal = ({ onClose, onSubmit, isEdit = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    product_id: isEdit && initialData ? initialData.product_id || "" : "",
    profile_id: isEdit && initialData ? initialData.profile_id || "" : "",
    rating: isEdit && initialData ? initialData.rating || "" : "",
    comment: isEdit && initialData ? initialData.comment || "" : "",
  });
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

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
          const product = productsRes.data.find(p => p.id === initialData.product_id);
          const profile = profilesRes.data.find(p => p.id === initialData.profile_id);
          setProductSearch(product ? product.product_name : "");
          setProfileSearch(profile ? `${profile.first_name} ${profile.last_name}` : "");
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchData();
  
    if (isEdit && initialData) {
      setFormData({
        product_id: initialData.product_id || "",
        profile_id: initialData.profile_id || "",
        rating: initialData.rating || "",
        comment: initialData.comment || "",
      });
    }
  }, [isEdit, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSelect = (product) => {
    setFormData((prev) => ({ ...prev, product_id: product.id }));
    setProductSearch(product.name);
    setShowProductDropdown(false);
  };

  const handleUserSelect = (user) => {
    setFormData((prev) => ({ ...prev, profile_id: user.id }));
    setUserSearch(user.name);
    setShowUserDropdown(false);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ formData });
  };

  return (
    <div className="modal-overlay">
      <div className="add-item-modal">
        {/* ... (modal-header unchanged) */}
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="field-group full-width">
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
                  required
                />
                {showProductDropdown && (
                  <ul style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #ccc", position: "absolute", background: "#fff", zIndex: 10 }}>
                    {filteredProducts.map((product) => (
                      <li
                        key={product.id}
                        onClick={() => handleProductSelect(product)}
                        style={{ padding: "5px", cursor: "pointer" }}
                      >
                        {product.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="field-group full-width">
                <label>User Name</label>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setShowUserDropdown(true);
                  }}
                  onFocus={() => setShowUserDropdown(true)}
                  className="input-field"
                  required
                />
                {showUserDropdown && (
                  <ul style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #ccc", position: "absolute", background: "#fff", zIndex: 10 }}>
                    {filteredUsers.map((user) => (
                      <li
                        key={user.id}
                        onClick={() => handleUserSelect(user)}
                        style={{ padding: "5px", cursor: "pointer" }}
                      >
                        {user.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* ... (rating and comment unchanged) */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;