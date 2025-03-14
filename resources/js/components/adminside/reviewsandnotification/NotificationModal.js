import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../../../../sass/components/_reviewsandnotification.scss";

const NotificationModal = ({ onClose, onSubmit, isEdit = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    profile_id: isEdit && initialData ? initialData.profile_id || "" : "",
    message: isEdit && initialData ? initialData.message || "" : "",
    faqs_id: isEdit && initialData ? initialData.faqs_id || "" : "",
    type: isEdit && initialData ? initialData.type || "" : "",
    status: isEdit && initialData ? initialData.status || "" : "",
  });
  const [profiles, setProfiles] = useState([]);
  const [profileSearch, setProfileSearch] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("LaravelPassportToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const profilesRes = await axios.get("http://127.0.0.1:8000/api/profiles", config);
        setProfiles(profilesRes.data);

        if (isEdit && initialData) {
          const profile = profilesRes.data.find(p => p.id === initialData.profile_id);
          setProfileSearch(profile ? profile.full_name : "");
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };
    fetchData();

    if (isEdit && initialData) {
      setFormData({
        profile_id: initialData.profile_id || "",
        message: initialData.message || "",
        faqs_id: initialData.faqs_id || "",
        type: initialData.type || "",
        status: initialData.status || "",
      });
    }
  }, [isEdit, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfileSelect = (profile) => {
    setFormData((prev) => ({ ...prev, profile_id: profile.id }));
    setProfileSearch(profile.full_name);
    setShowProfileDropdown(false);
  };

  const filteredProfiles = profiles.filter((p) =>
    p.full_name.toLowerCase().includes(profileSearch.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ formData });
  };

  return (
    <div className="modal-overlay">
      <div className="add-item-modal">
        <div className="modal-header">
          <h2>{isEdit ? "Edit Notification" : "Add Notification"}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
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
                  required
                />
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
                <label>Message</label>
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="field-group full-width">
                <label>FAQ ID</label>
                <input
                  type="number"
                  name="faqs_id"
                  placeholder="FAQ ID (optional)"
                  value={formData.faqs_id}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div className="field-group full-width">
                <label>Type</label>
                <input
                  type="text"
                  name="type"
                  placeholder="Type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="field-group full-width">
                <label>Status</label>
                <input
                  type="text"
                  name="status"
                  placeholder="Status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
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

export default NotificationModal;