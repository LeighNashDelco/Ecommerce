import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../../../sass/components/_profilesettings.scss";
import TopNavbar from "./../topnavbar/TopNavbar";

const ChangePassAdmin = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [profile, setProfile] = useState({
    first_name: "",
    middlename: "",
    last_name: "",
    email: "",
    profileImg: "default-profile.png",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("LaravelPassportToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.get("http://127.0.0.1:8000/api/user-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.profile) {
          setProfile({
            first_name: data.profile.first_name || "",
            middlename: data.profile.middlename || "",
            last_name: data.profile.last_name || "",
            email: data.user.email || "",
            profileImg: data.profile.profile_img || "default-profile.png",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [navigate]);

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });

    if (window.alertTimeout) {
      clearTimeout(window.alertTimeout);
    }

    window.alertTimeout = setTimeout(() => {
      setAlert({ message: "", type: "" });
    }, 2000);
  };

  const handleChangePassword = async () => {
    const token = localStorage.getItem("LaravelPassportToken");
    if (!token) {
      showAlert("Authentication token is missing. Please log in again.", "error");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/change-password",
        { current_password: currentPassword, new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showAlert(response.data.message || "Password changed successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Error changing password:", error.response ? error.response.data : error);
      showAlert("Failed to change password. Please try again.", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("LaravelPassportToken");
    navigate("/login");
  };

  return (
    <div className="profile-settings-container">
      <TopNavbar />
      <div className="profile-main">
        <div className="profile-sidebar">
          <img
            src={profile.profileImg}
            alt="Profile"
            className="profile-image"
            onError={(e) => (e.target.src = "default-profile.png")}
          />
          <span className="upload-text">Upload</span>
          <h3>{profile.first_name} {profile.last_name}</h3>
          <p>{profile.email}</p>

          <div className="sidebar-item" onClick={() => navigate("/profile")}>
            Personal Information
          </div>
          <div className="sidebar-item selected">Change Password</div>
          <div className="sidebar-item logout" onClick={handleLogout}>
            Logout
          </div>
        </div>

        <div className="profile-content">
          <h2>Change Password</h2>

          {alert.message && (
            <div className={`custom-alert ${alert.type}`}>{alert.message}</div>
          )}

          <div className="password-grid">
            <div className="password-card">
              <label>Current Password:</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="password-card">
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="profile-save-btn">
            <button onClick={handleChangePassword}>Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassAdmin;