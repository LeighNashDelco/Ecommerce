import React, { useState, useEffect } from "react";
import axios from "axios";
import './../../../../sass/components/_gender.scss'; // Ensure this matches your file path

const GenderModal = ({ isOpen, onClose, onSave, initialGender, genders }) => {
  const [gender, setGender] = useState(initialGender || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Sync with initialGender when modal opens, default to empty string if invalid
    setGender(initialGender && genders.includes(initialGender) ? initialGender : "");
  }, [initialGender, genders]);

  const handleSave = async () => {
    if (!gender) {
      setError("Please select a gender.");
      return;
    }

    setLoading(true);
    setError(null);
    const token = localStorage.getItem("LaravelPassportToken");

    if (!token) {
      setError("You are not authenticated. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        "http://127.0.0.1:8000/api/update-profile",
        { gender: gender || null },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Gender Update API Response:", response.data);
      onSave(gender); // Pass updated gender to parent
      onClose(); // Close modal
    } catch (err) {
      console.error("Error updating gender:", err);
      setError(err.response?.data?.message || "Failed to update gender. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="gender-modal-overlay">
      <div className="gender-modal">
        <div className="modal-header">
          <h2>Change Gender</h2>
          <button className="close-btn" onClick={onClose} disabled={loading}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              disabled={loading || !genders.length}
              className="gender-input"
            >
              <option value="">Select Gender</option>
              {genders.length > 0 ? (
                genders.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No gender options available
                </option>
              )}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={loading || !genders.length}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenderModal;