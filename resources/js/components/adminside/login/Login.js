import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert } from "antd";
import "./../../../../sass/components/_login.scss";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetMessage, setResetMessage] = useState(null);
    const [resetLoading, setResetLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("LaravelPassportToken");
        if (token) {
            navigate("/homepage");
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/login",
                { email, password },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                }
            );

            const { token, user } = response.data;

            localStorage.setItem("LaravelPassportToken", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("userRole", user.role_id === 1 ? "admin" : "customer"); // Store role
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            setSuccessMessage("Login successful! Redirecting...");

            setTimeout(() => {
                if (user.role_id === 1) {
                    navigate("/admindashboard");
                } else {
                    navigate("/homepage");
                }
            }, 2000);
        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {
                    setError("Invalid email or password.");
                } else if (err.response.status === 403) {
                    setError("Your account is archived and cannot log in.");
                } else {
                    setError("Login failed. Please try again.");
                }
            } else {
                setError("Server error. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setResetMessage(null);
        setResetLoading(true);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/forgot-password",
                { email: resetEmail },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                }
            );
            setResetMessage(response.data.message);
            setResetEmail("");
        } catch (err) {
            setResetMessage(err.response?.data.message || "Failed to send reset link.");
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            {successMessage && (
                <div className="alert-container">
                    <Alert
                        message={<span><strong>Success:</strong> {successMessage}</span>}
                        type="success"
                        showIcon
                        closable
                        className="custom-success-alert"
                    />
                </div>
            )}
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
                            <button
                                type="button"
                                className="login-forgot-link"
                                onClick={() => setForgotPassword(true)}
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button type="submit" className="login-submit-btn" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="login-signup">
                        <p>
                            Don't have an account? <Link to="/register" className="login-signup-link">Sign up</Link>
                        </p>
                    </div>
                </div>

                <div className="login-image-section"></div>
            </div>

            {forgotPassword && (
                <div className="forgot-password-modal">
                    <div className="forgot-password-content">
                        <h3>Reset Password</h3>
                        <p>Enter your email to receive a password reset link.</p>
                        {resetMessage && (
                            <p className={resetMessage.includes("sent") ? "reset-success" : "reset-error"}>
                                {resetMessage}
                            </p>
                        )}
                        <form onSubmit={handleForgotPassword}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                                className="forgot-password-input"
                            />
                            <div className="forgot-password-buttons">
                                <button type="submit" className="reset-submit-btn" disabled={resetLoading}>
                                    {resetLoading ? "Sending..." : "Send Reset Link"}
                                </button>
                                <button
                                    type="button"
                                    className="reset-cancel-btn"
                                    onClick={() => setForgotPassword(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;