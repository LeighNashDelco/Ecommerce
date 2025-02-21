import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./../../../sass/components/_login.scss";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
    
        try {
            console.log("Attempting to login with:", { email, password });
    
            const response = await axios.post(
                "http://127.0.0.1:8000/api/login",
                { email, password },
                {
                    withCredentials: true,
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                }
            );
    
            console.log("Login successful:", response.data);
    
            const { token, user } = response.data;
    
            // Store authentication data
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
    
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
            // Redirect based on user role
            if (user.role_id === 1) {
                navigate("/admindashboard");
            } else {
                navigate("/home");
            }
        } catch (err) {
            console.log("Login error:", err);
    
            if (err.response) {
                console.log("Error response data:", err.response.data);
                console.log("Error response status:", err.response.status);
            } else if (err.request) {
                console.log("No response received:", err.request);
            } else {
                console.log("Request error:", err.message);
            }
    
            if (err.response && err.response.status === 401) {
                setError("Invalid email or password");
            } else {
                setError("Something went wrong. Please try again later.");
            }
        }
    };
    
    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-content">
                    <h2 className="login-title">Welcome Back</h2>
                    <p className="login-subtitle">Please enter your credentials to log in.</p>

                    {error && <p className="login-error">{error}</p>}

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
