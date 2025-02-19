import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./../../sass/components/_login.scss"; // Ensure this path is correct
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login clicked", { email, password });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-form">
          <h2>Welcome Back</h2>
          <p>Please enter your credentials to log in.</p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="password-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="/forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="login-btn">Login</button>
          </form>

          {/* Signup Link */}
          <div className="signup-link">
            <p>
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>

        <div className="login-image">
          {/* Background image is set via CSS */}
        </div>
      </div>
    </div>
  );
};

export default Login;
