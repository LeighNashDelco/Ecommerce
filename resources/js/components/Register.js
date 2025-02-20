import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios"; 
import "./../../sass/components/_register.scss";

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

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/roles");
        setRoles(response.data || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  // Fetch genders from API
  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/genders");
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
  
      console.log("✅ Registration successful:", response.data);
      alert("Registration successful! 🎉");
  
    } catch (error) {
      console.error("❌ Error during registration:", error);
  
      if (error.response) {
        console.error("🚨 Server Response Data:", error.response.data);
        alert("❌ Registration failed: " + JSON.stringify(error.response.data.errors));
      } else {
        alert("❌ Network error. Please try again.");
      }
    }
  };
  
  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-form">
          <h2>Create New Account</h2>

          <form onSubmit={handleRegister}>
            <div className="input-group-row">
              <div className="input-group">
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <input type="text" name="middleName" placeholder="Middle Name (Optional)" value={formData.middleName} onChange={handleChange} />
              </div>
            </div>

            <div className="input-group">
              <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="password-group">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              <span onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}

            <div className="dropdown-group">
              <div className="dropdown-wrapper">
                <select name="role" value={formData.role} onChange={handleChange} required>
                  <option value="" disabled>Select Role</option>
                  {roles.map(role => <option key={role.id} value={role.id}>{role.role_name}</option>)}
                </select>
              </div>

              <div className="dropdown-wrapper">
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="" disabled>Select Gender</option>
                  {genders.map(gender => <option key={gender.id} value={gender.id}>{gender.gender_name}</option>)}
                </select>
              </div>

              <div className="dropdown-wrapper">
                <select name="suffix" value={formData.suffix} onChange={handleChange}>
                  <option value="">Suffix</option>
                  <option value="Jr.">Jr.</option>
                  <option value="Sr.">Sr.</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                </select>
              </div>
            </div>

            <button type="submit" className="register-btn">Register</button>
          </form>

          <div className="login-link">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
