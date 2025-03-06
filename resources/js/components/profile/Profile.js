import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../../../sass/components/_profilesettings.scss";
import TopNavbar from "./../topnavbar/TopNavbar";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [genders, setGenders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("LaravelPassportToken");
      if (!token) {
        console.error("No token found, user is not authenticated.");
        navigate("/login");
        return;
      }

      try {
        const [profileRes, genderRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/user-profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/api/genders"),
        ]);

        setProfile({
          first_name: profileRes.data.profile?.first_name || "N/A",
          middlename: profileRes.data.profile?.middlename || "N/A",
          last_name: profileRes.data.profile?.last_name || "N/A",
          gender: profileRes.data.profile?.gender || "Unknown",
          suffix: profileRes.data.profile?.suffix || "N/A",
          contact_number: profileRes.data.profile?.contact_number || "N/A",
          street: profileRes.data.profile?.street || "N/A",
          city: profileRes.data.profile?.city || "N/A",
          province: profileRes.data.profile?.province || "N/A",
          postal_code: profileRes.data.profile?.postal_code || "N/A",
          country: profileRes.data.profile?.country || "N/A",
          email: profileRes.data.user?.email || "N/A",
          profileImg: profileRes.data.profile?.profile_img || "default-profile.png",
        });

        setGenders(genderRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("LaravelPassportToken");

    if (!token) {
      showAlert("Authentication token is missing. Please log in again.", "error");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.put(
        "http://127.0.0.1:8000/api/update-profile",
        {
          first_name: profile.first_name,
          middlename: profile.middlename || null,
          last_name: profile.last_name,
          gender: profile.gender, // Send gender as name
          suffix: profile.suffix || null,
          contact_number: profile.contact_number || null,
          street: profile.street || null,
          city: profile.city || null,
          province: profile.province || null,
          postal_code: profile.postal_code || null,
          country: profile.country || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showAlert(response.data.message || "Profile updated successfully!", "success");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error.response ? error.response.data : error);

      if (error.response && error.response.status === 422) {
        showAlert(`Validation Error: ${JSON.stringify(error.response.data.errors)}`, "error");
      } else if (error.response && error.response.status === 404) {
        showAlert("Profile not found. Please create a profile first.", "error");
      } else {
        showAlert("Failed to update profile. Please try again.", "error");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("LaravelPassportToken");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  return (
    <div className="profile-settings-container">
      <TopNavbar />
      <div className="profile-main">
        <div className="profile-sidebar">
          <img
            src={profile?.profileImg}
            alt="Profile"
            className="profile-image"
            onError={(e) => (e.target.src = "default-profile.png")}
          />
          <span className="upload-text">Upload</span>
          <h3>{profile?.first_name} {profile?.last_name}</h3>
          <p>{profile?.email}</p>
          <div className="sidebar-item selected">Personal Information</div>
          <div className="sidebar-item" onClick={() => navigate("/changepassadmin")}>
            Change Password
          </div>
          <div className="sidebar-item logout" onClick={handleLogout}>
            Logout
          </div>
        </div>

        <div className="profile-content">
          <h2>Personal Information</h2>

          {alert.message && (
            <div className={`custom-alert ${alert.type}`}>
              {alert.message}
            </div>
          )}

          <div className="profile-grid">
            {profile && Object.keys(profile).map((key) =>
              key !== "profileImg" ? (
                <div className="profile-card" key={key}>
                  <strong>{key.replace("_", " ").toUpperCase()}:</strong>
                  {isEditing ? (
                    key === "gender" ? (
                      <select
                        value={genders.find((g) => g.name === profile.gender)?.name || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, gender: e.target.value })
                        }
                      >
                        {genders.map((gender) => (
                          <option key={gender.id} value={gender.name}>
                            {gender.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={profile[key]}
                        onChange={(e) =>
                          setProfile({ ...profile, [key]: e.target.value })
                        }
                      />
                    )
                  ) : (
                    <p>{profile[key]}</p>
                  )}
                </div>
              ) : null
            )}
          </div>

          {isEditing && (
            <div className="profile-save-btn">
              <button onClick={handleSave}>Save Changes</button>
            </div>
          )}

          <div className="profile-edit-btn">
            <button onClick={handleEditToggle}>{isEditing ? "Cancel" : "Edit Profile"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;