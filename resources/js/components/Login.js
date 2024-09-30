import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/login.css'; // Import the CSS file
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons from react-icons

const Login = () => {
  const [username, setUsername] = useState(''); // Changed email to username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [showPassword, setShowPassword] = useState(false); // State for showing password
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === '' || password === '') { // Updated to check username
      setError('Both fields are required');
    } else {
      setError('');
      console.log('Admin logged in:', { username, password }); // Updated to log username
      navigate('/'); // Redirect to the home page
    }
  };

  const handleRegisterClick = () => {
    setIsModalOpen(true); // Open the modal when Register is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  const handleForgotPasswordClick = () => {
    alert('Forgot password functionality not implemented yet.'); // Placeholder for forgot password functionality
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Admin Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-icon">
              <input
                type="text" // Changed input type to text for username
                className="form-control"
                placeholder="Username" // Updated placeholder to Username
                value={username} // Updated value to username
                onChange={(e) => setUsername(e.target.value)} // Updated onChange to setUsername
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-icon">
              <input
                type={showPassword ? 'text' : 'password'} // Show password based on state
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="eye-icon" onClick={toggleShowPassword}>
                {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Eye icon */}
              </span>
            </div>
          </div>
          <button type="submit" className="btn">Login</button>
          <p className="forgot-password" onClick={handleForgotPasswordClick}>
            Forgot Password?
          </p> {/* Forgot password link */}
        </form>
        <p className="register-text">
          Don't have an account?{' '}
          <span className="register-link" onClick={handleRegisterClick}>
            Register
          </span>
        </p> {/* Register text link */}
      </div>

      {/* Modal for registration */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Register</h2>
            {/* Registration form can be added here */}
            <p>This is where you can add registration form fields.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
