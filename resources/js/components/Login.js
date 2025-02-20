import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./../../sass/components/_login.scss";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const handleLogin = (e) => {
      e.preventDefault();
      console.log("Login clicked", { email, password });
    };
  
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-content">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Please enter your credentials to log in.</p>
  
            <form onSubmit={handleLogin} className="login-form-container">
              <div className="login-input-group">
                <input
                  type="email"
                  className="login-email-input"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
  
              <div className="login-password-group">
                <input
                  type="password"
                  className="login-password-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
  
              <div className="login-options">
                <label className="login-remember-label">
                  <input type="checkbox" className="login-checkbox" /> Remember me
                </label>
                <a href="/forgot-password" className="login-forgot-link">Forgot password?</a>
              </div>
  
              <button type="submit" className="login-submit-btn">Login</button>
            </form>
  
            <div className="login-signup">
              <p>
                Don't have an account? <Link to="/register" className="login-signup-link">Sign up</Link>
              </p>
            </div>
          </div>
  
          <div className="login-image-section">
            {/* Background image will be handled via CSS */}
          </div>
        </div>
      </div>
    );
  };
  
  export default Login;