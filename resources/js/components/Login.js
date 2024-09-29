import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Navigate directly to the Home page after login
    navigate("/home");
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
