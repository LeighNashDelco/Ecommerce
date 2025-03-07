import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa"; // Added FaArrowLeft
import { Link } from "react-router-dom";
import axios from "axios";
import "./../../../sass/components/_register.scss";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    gender: "",
    suffix: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [roles, setRoles] = useState([]);
  const [genders, setGenders] = useState([]);
  const [alert, setAlert] = useState({ message: "", type: "" });

  // Show alert function
  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 5000);
  };

  // Close alert manually
  const closeAlert = () => {
    setAlert({ message: "", type: "" });
  };

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/roles/specific");
        console.log("Fetched Roles:", response.data);
        setRoles(response.data || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/genders");
        console.log("Fetched Genders Data:", response.data);
        setGenders(response.data || []);
      } catch (error) {
        console.error("Error fetching genders:", error);
      }
    };
    fetchGenders();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "password") {
      validatePassword(e.target.value);
    }
  };

  // Validate password
  const validatePassword = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    setPasswordError(!hasUppercase || !hasNumber ? "Password must contain at least 1 uppercase letter and 1 number." : "");
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        first_name: formData.firstName || "",
        middlename: formData.middleName.trim() ? formData.middleName : null,
        last_name: formData.lastName || "",
        gender: formData.gender ? parseInt(formData.gender, 10) : null,
        suffix: formData.suffix.trim() ? formData.suffix : null,
        email: formData.email || "",
        password: formData.password || "",
        role_id: formData.role ? parseInt(formData.role, 10) : null,
      };

      console.log("🚀 Sending user data:", userData);
      const response = await axios.post("http://localhost:8000/api/register", userData);

      console.log("Registration successful:", response.data);
      showAlert("✅ Registration successful!", "success");

      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        role: "",
        gender: "",
        suffix: "",
      });
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.response) {
        console.error("Server Response Data:", error.response.data);
        if (error.response.data.errors?.email) {
          showAlert("🚫 Email is already registered. Try another one!", "error");
        } else {
          showAlert("🚫 Email is already registered. Try another one!", "error");
        }
      } else {
        showAlert("❌ Network error. Please try again.", "error");
      }
    }
  };

  return (
    <div className="register-wrapper">
      {/* Back Button with Icon */}
      <Link to="/" className="back-btn">
        <FaArrowLeft />
      </Link>

      {/* Alert Message */}
      {alert.message && (
        <div className={`custom-alert ${alert.type}`}>
          {alert.message}
          <button className="alert-close-btn" onClick={closeAlert}>×</button>
        </div>
      )}

      <div className="register-card">
        <div className="register-content">
          <h2 className="register-title">Create New Account</h2>
          <form onSubmit={handleRegister} className="register-form-container">
            <div className="register-row">
              <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
              <input type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} />
            </div>
            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />

            <div className="register-password-group">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}

            <div className="register-dropdowns">
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="" disabled>Select Role</option>
                {roles.map(role => <option key={role.id} value={role.id}>{role.role_name}</option>)}
              </select>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="" disabled>Select Gender</option>
                {genders.map(gender => <option key={gender.id} value={gender.id}>{gender.name}</option>)}
              </select>
              <select name="suffix" value={formData.suffix} onChange={handleChange}>
                <option value="">Suffix</option>
                <option value="Jr.">Jr.</option>
                <option value="Sr.">Sr.</option>
                <option value="II">II</option>
                <option value="III">III</option>
              </select>
            </div>

            <button type="submit" className="register-submit-btn">Register</button>
          </form>
        </div>
        <div className="register-image-section"></div>
      </div>
    </div>
  );
};

export default Register;