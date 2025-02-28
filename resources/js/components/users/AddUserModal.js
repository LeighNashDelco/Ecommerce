import React, { useState, useEffect } from 'react';
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./../../../sass/components/_usersdashboard.scss";

function AddUserModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    first_name: '',
    middlename: '',
    last_name: '',
    suffix: '',
    email: '',
    password: '',
    role_id: '', // Ensure this is set
    gender: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [genders, setGenders] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [genderResponse, roleResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/genders"),
          axios.get("http://127.0.0.1:8000/api/roles"),
        ]);
        console.log("Fetched Genders:", genderResponse.data);
        console.log("Fetched Roles:", roleResponse.data);
        setGenders(genderResponse.data || []);
        setRoles(roleResponse.data || []);
        // Set defaults if data exists
        if (genderResponse.data.length > 0) {
          setFormData((prev) => ({ ...prev, gender: genderResponse.data[0].id.toString() }));
        }
        if (roleResponse.data.length > 0) {
          setFormData((prev) => ({ ...prev, role_id: roleResponse.data[0].id.toString() }));
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      console.log(`Input changed: ${name} = ${value}`, newData); // Log full state
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting:", formData);
    const submitData = {
      ...formData,
      role_id: parseInt(formData.role_id, 10),
      gender: parseInt(formData.gender, 10),
    };
    console.log("Converted for submission:", submitData);
    onSubmit({ formData: submitData });
  };

  return (
    <div className="modal-overlay">
      <div className="add-user-modal">
        <div className="modal-header">
          <h2>Create New User</h2>
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
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="register-dropdowns">
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
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
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUserModal;