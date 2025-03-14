import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./../../../../sass/components/_login.scss";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const email = searchParams.get("email");
    const token = searchParams.get("token");

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/reset-password",
                { email, token, password, password_confirmation: passwordConfirmation },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                }
            );
            setMessage(response.data.message);
            setTimeout(() => navigate("/login"), 2000); // Redirect to login after success
        } catch (err) {
            console.error("Reset password failed:", err);
            setMessage(err.response?.data.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-content">
                    <h2 className="login-title">Reset Password</h2>
                    <p className="login-subtitle">Enter your new password below.</p>
                    {message && (
                        <p className={message.includes("successfully") ? "reset-success" : "reset-error"}>
                            {message}
                        </p>
                    )}
                    <form onSubmit={handleResetPassword}>
                        <div className="login-input-group">
                            <input
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="login-password-input"
                            />
                        </div>
                        <div className="login-input-group">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                                className="login-password-input"
                            />
                        </div>
                        <button type="submit" className="login-submit-btn" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>
                <div className="login-image-section"></div>
            </div>
        </div>
    );
};

export default ResetPassword;