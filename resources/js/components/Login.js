import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../../sass/components/_login.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous errors

    try {
      // Send a POST request to the backend API with email and password
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login", // Replace with your actual API URL
        { email, password },
        { withCredentials: true } // Send cookies with the request if needed
      );

      // Store the token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Set Authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

      // Redirect to dashboard after successful login
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-form">
          <h2>Welcome Back</h2>
          <p>Please enter your credentials to log in.</p>

          {error && <p className="error">{error}</p>}

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

          <div className="signup-link">
            <p>
              Don't have an account? <a href="/register">Sign up</a>
            </p>
          </div>
        </div>

        <div className="login-image"></div>
      </div>
    </div>
  );
};

export default Login;
