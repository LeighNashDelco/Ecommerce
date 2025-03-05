import React, { useState, useEffect } from 'react';
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./../../../sass/components/_usersdashboard.scss"; // Reuse styling or adjust as needed

function CustomerModal({ onClose, onSubmit, isEdit = false, initialData = null }) {
  const [formData, setFormData] = useState({
    first_name: isEdit && initialData ? initialData.first_name || '' : '',
    middlename: isEdit && initialData ? initialData.middlename || '' : '',
    last_name: isEdit && initialData ? initialData.last_name || '' : '',
    suffix: isEdit && initialData ? initialData.suffix || '' : '',
    email: isEdit && initialData ? initialData.email || '' : '',
    password: '',
    role_id: '2', // Hardcoded to 2 (Customer role)
    gender: isEdit && initialData ? initialData.gender?.toString() || '' : '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [genders, setGenders] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(isEdit && initialData?.profile_img ? `http://127.0.0.1:8000/${initialData.profile_img}` : null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const genderResponse = await axios.get("http://127.0.0.1:8000/api/genders");
        console.log("Fetched Genders:", genderResponse.data);
        setGenders(genderResponse.data || []);

        if (!isEdit && genderResponse.data.length > 0) {
          setFormData((prev) => ({ ...prev, gender: genderResponse.data[0].id.toString() }));
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, [isEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      console.log(`Input changed: ${name} = ${value}`, newData);
      return newData;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
      console.log("Selected file:", file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting:", formData);

    const submitData = new FormData();
    submitData.append('first_name', formData.first_name);
    submitData.append('middlename', formData.middlename);
    submitData.append('last_name', formData.last_name);
    submitData.append('suffix', formData.suffix || '');
    submitData.append('email', formData.email);
    if (!isEdit || formData.password) {
        submitData.append('password', formData.password);
    }
    submitData.append('role_id', '2'); // Hardcoded Customer role
    submitData.append('gender', formData.gender || ''); // Ensure gender is sent
    if (isEdit && profileImage) {
        submitData.append('profile_img', profileImage);
    }
    if (isEdit) {
        submitData.append('_method', 'PATCH');
    }

    const formDataEntries = {};
    for (let [key, value] of submitData.entries()) {
        formDataEntries[key] = value instanceof File ? value.name : value;
    }
    console.log("FormData being sent:", formDataEntries);

    onSubmit(submitData);
};

  return (
    <div className="modal-overlay">
      <div className="add-user-modal">
        <div className="modal-header">
          <h2>{isEdit ? "Edit Customer" : "Create New Customer"}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleSubmit} className="register-form-container">
            <div className="register-row">
              <div className="field-group">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="field-group">
                <input
                  type="text"
                  name="middlename"
                  placeholder="Middle Name"
                  value={formData.middlename}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="field-group">
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="field-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="register-password-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={isEdit ? "New Password (optional)" : "Password"}
                value={formData.password}
                onChange={handleInputChange}
                required={!isEdit}
              />
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {isEdit && (
              <div className="field-group">
                <label>Profile Image</label>
                {previewImage && (
                  <div className="image-preview">
                    <img src={previewImage} alt="Profile Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                  </div>
                )}
                <input
                  type="file"
                  name="profile_img"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            )}
            <div className="register-dropdowns">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select Gender</option>
                {genders.map((gender) => (
                  <option key={gender.id} value={gender.id}>
                    {gender.name}
                  </option>
                ))}
              </select>
              <select
                name="suffix"
                value={formData.suffix}
                onChange={handleInputChange}
              >
                <option value="">Suffix</option>
                <option value="Jr.">Jr.</option>
                <option value="Sr.">Sr.</option>
                <option value="II">II</option>
                <option value="III">III</option>
              </select>
            </div>
            <div className="button-group">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="save-button">
                {isEdit ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomerModal;