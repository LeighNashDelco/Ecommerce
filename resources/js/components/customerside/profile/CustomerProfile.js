import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd"; // Import Ant Design message
import "./../../../../sass/components/profile.scss";
import Background from "../../../../../resources/sass/img/coverp.svg";
import Navbar from "../../customerside/Customer/topnav_login";
import Footer from "../footer/footer";
import OrdersCart from "../CartModals/orders_cart";
import { IconEdit, IconUpload } from "@tabler/icons-react";
import AddressModal from "../profile/address_modal";
import PasswordModal from "../profile/password_modal";
import AllOrder from "../orderHistory/all_order";
import { Alert, Spin } from "antd";
import "antd/dist/reset.css";
import LoadingImage from "../../../../../public/images/vero_copy.png";

const CustomerProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState({
    name: false,
    contact: false,
    address: false,
    password: false,
  });
  const [tempProfile, setTempProfile] = useState({});
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [profileId, setProfileId] = useState(null); // Added for cart functionality

  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("LaravelPassportToken");
    return token ? {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    } : { "Content-Type": "application/json" };
  };

  useEffect(() => {
    const fetchProfileAndId = async () => {
      const token = localStorage.getItem("LaravelPassportToken");
      if (!token) {
        message.error({
          content: "Please log in to view your profile.",
          style: { marginTop: "20px" },
        });
        navigate("/login");
        return;
      }

      try {
        setLoading(true);

        // Fetch user profile
        const userResponse = await axios.get("http://127.0.0.1:8000/api/user-profile", {
          headers: getAuthHeaders(),
        });

        const userData = userResponse.data;
        const profileData = {
          first_name: userData.profile?.first_name || "N/A",
          middlename: userData.profile?.middlename || "N/A",
          last_name: userData.profile?.last_name || "N/A",
          gender: userData.profile?.gender || "Unknown",
          suffix: userData.profile?.suffix || "N/A",
          contact_number: userData.profile?.contact_number || "N/A",
          street: userData.profile?.street || "N/A",
          city: userData.profile?.city || "N/A",
          province: userData.profile?.province || "N/A",
          postal_code: userData.profile?.postal_code || "N/A",
          country: userData.profile?.country || "N/A",
          email: userData.user?.email || "N/A",
          profileImg: userData.profile?.profile_img || null,
        };

        // Fetch profile ID
        const profileResponse = await axios.get(`http://127.0.0.1:8000/api/profiles/user/${userData.user.id}`, {
          headers: getAuthHeaders(),
        });
        const profileIdData = profileResponse.data;

        setProfile(profileData);
        setTempProfile(profileData);
        setProfileId(profileIdData.id);
        setTimeout(() => setLoading(false), 2000);
      } catch (error) {
        setError("Failed to load profile data. Please try again.");
        message.error({
          content: "Failed to load profile data. Please try again.",
          style: { marginTop: "20px" },
        });
        if (error.response?.status === 401) {
          localStorage.removeItem("LaravelPassportToken");
          navigate("/login");
        }
        setTimeout(() => setLoading(false), 2000);
      }
    };

    fetchProfileAndId();
  }, [navigate]);

  const handleTabChange = (tab) => setActiveTab(tab);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const handleViewCart = () => {
    if (!profileId) {
      message.error({
        content: "Please log in to view your cart.",
        style: { marginTop: "20px" },
      });
      navigate("/login");
      return;
    }
    setIsCartOpen(true); // Open cart modal instead of navigating
    message.info({
      content: "Viewing your cart.",
      style: { marginTop: "20px" },
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setTempProfile((prev) => ({ ...prev, profileImg: e.target.result }));
      setProfile((prev) => ({ ...prev, profileImg: e.target.result }));
    };
    reader.readAsDataURL(file);

    const token = localStorage.getItem("LaravelPassportToken");
    if (!token) {
      setError("Authentication required. Please log in.");
      message.error({
        content: "Authentication required. Please log in.",
        style: { marginTop: "20px" },
      });
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("profile_img", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedProfile = response.data.profile;
      setProfile((prev) => ({ ...prev, profileImg: updatedProfile.profile_img }));
      setTempProfile((prev) => ({ ...prev, profileImg: updatedProfile.profile_img }));
      setSuccess("Profile image updated successfully!");
      setError(null);
      message.success({
        content: "Profile image updated successfully!",
        style: { marginTop: "20px" },
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to upload image. Please try again.");
      setProfile((prev) => ({ ...prev, profileImg: null }));
      setTempProfile((prev) => ({ ...prev, profileImg: null }));
      message.error({
        content: error.response?.data?.message || "Failed to upload image. Please try again.",
        style: { marginTop: "20px" },
      });
      setTimeout(() => setError(null), 3000);
    } finally {
      event.target.value = null;
    }
  };

  const handleAvatarClick = () => document.getElementById("avatar-upload").click();
  const handleUploadIconClick = () => document.getElementById("avatar-upload").click();

  const handleEditClick = (field) => {
    if (field === "address") {
      setIsAddressModalOpen(true);
    } else if (field === "password") {
      setIsPasswordModalOpen(true);
    } else {
      setEditMode((prev) => ({
        ...prev,
        name: field === "name",
        contact: field === "contact",
        address: false,
        password: false,
      }));
      setTempProfile({ ...profile });
    }
  };

  const handleSave = async (field) => {
    const token = localStorage.getItem("LaravelPassportToken");
    if (!token) {
      setError("Authentication required. Please log in.");
      message.error({
        content: "Authentication required. Please log in.",
        style: { marginTop: "20px" },
      });
      navigate("/login");
      return;
    }

    const updatedProfileData = {
      first_name: tempProfile.first_name,
      middlename: tempProfile.middlename,
      last_name: tempProfile.last_name,
      suffix: tempProfile.suffix,
      contact_number: tempProfile.contact_number,
      gender: tempProfile.gender,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/update-profile",
        updatedProfileData,
        {
          headers: getAuthHeaders(),
        }
      );

      setProfile((prev) => ({ ...prev, ...response.data.profile }));
      setEditMode((prev) => ({ ...prev, [field]: false }));
      setSuccess("Profile updated successfully!");
      setError(null);
      message.success({
        content: "Profile updated successfully!",
        style: { marginTop: "20px" },
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile. Please try again.");
      message.error({
        content: error.response?.data?.message || "Failed to update profile. Please try again.",
        style: { marginTop: "20px" },
      });
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleCancel = () => {
    setTempProfile({ ...profile });
    setEditMode({
      name: false,
      contact: false,
      address: false,
      password: false,
    });
  };

  const handleSaveAddress = async (updatedAddress) => {
    const token = localStorage.getItem("LaravelPassportToken");
    if (!token) {
      setError("Authentication required. Please log in.");
      message.error({
        content: "Authentication required. Please log in.",
        style: { marginTop: "20px" },
      });
      navigate("/login");
      return;
    }

    const updatedProfileData = {
      street: updatedAddress.street,
      city: updatedAddress.city,
      province: updatedAddress.province,
      postal_code: updatedAddress.postalCode,
      country: updatedAddress.country,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/update-profile",
        updatedProfileData,
        {
          headers: getAuthHeaders(),
        }
      );

      setProfile((prev) => ({ ...prev, ...response.data.profile }));
      setIsAddressModalOpen(false);
      setSuccess("Address updated successfully!");
      setError(null);
      message.success({
        content: "Address updated successfully!",
        style: { marginTop: "20px" },
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update address. Please try again.");
      message.error({
        content: error.response?.data?.message || "Failed to update address. Please try again.",
        style: { marginTop: "20px" },
      });
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSavePassword = async (newPassword) => {
    const token = localStorage.getItem("LaravelPassportToken");
    if (!token) {
      setError("Authentication required. Please log in.");
      message.error({
        content: "Authentication required. Please log in.",
        style: { marginTop: "20px" },
      });
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/update-profile",
        { password: newPassword },
        {
          headers: getAuthHeaders(),
        }
      );

      setIsPasswordModalOpen(false);
      setSuccess("Password updated successfully!");
      setError(null);
      message.success({
        content: "Password updated successfully!",
        style: { marginTop: "20px" },
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update password. Please try again.");
      message.error({
        content: error.response?.data?.message || "Failed to update password. Please try again.",
        style: { marginTop: "20px" },
      });
      setTimeout(() => setError(null), 3000);
    }
  };

  const isAddressEmpty = () =>
    !profile.street ||
    profile.street === "N/A" &&
    !profile.city ||
    profile.city === "N/A" &&
    !profile.province ||
    profile.province === "N/A" &&
    !profile.postal_code ||
    profile.postal_code === "N/A" &&
    !profile.country ||
    profile.country === "N/A";

  const formatAddress = () => {
    if (isAddressEmpty()) return "Add your Address";
    return [profile.street, profile.city, profile.province, profile.postal_code, profile.country]
      .filter((part) => part && part !== "N/A")
      .join(", ");
  };

  const formatFullName = () => {
    const parts = [profile?.first_name, profile?.middlename, profile?.last_name, profile?.suffix]
      .filter((part) => part && part !== "N/A");
    return parts.length > 0 ? parts.join(" ") : profile?.email || "User";
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#1a1a1a",
          flexDirection: "column",
          gap: "20px",
          animation: "fadeIn 0.5s ease-in-out",
        }}
      >
        <img
          src={LoadingImage}
          alt="Loading"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            boxShadow: "0 0 20px rgba(255, 77, 77, 0.8)",
            animation: "pulse 1.5s infinite",
          }}
        />
        <Spin
          size="large"
          style={{
            color: "#ff4d4f",
          }}
        />
        <p
          style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "#ff4d4f",
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontFamily: "'Roboto', sans-serif",
            textShadow: "0 0 10px rgba(255, 77, 77, 0.5)",
          }}
        >
          Loading Your Profile
        </p>
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}
        </style>
      </div>
    );
  }

  if (!profile) return <div className="error">No profile data available</div>;

  return (
    <div className="profile-page">
      <Navbar onCartClick={toggleCart} />
      <div className="content-wrapper" style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 1000, width: "300px" }}>
          {success && (
            <Alert
              message={<span><strong>Success:</strong> {success}</span>}
              type="success"
              showIcon
              closable
              onClose={() => setSuccess(null)}
            />
          )}
          {error && (
            <Alert
              message={<span><strong>Error:</strong> {error}</span>}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
            />
          )}
        </div>

        <div className="background-section">
          <img src={Background} alt="Background" className="background-image" />
        </div>
        <div className="profile-header">
          <div className="avatar-container" onClick={handleAvatarClick}>
            <img
              src={profile.profileImg || "http://127.0.0.1:8000/images/pfp/default.png"}
              alt="Profile"
              className="avatar-image"
              onError={(e) => (e.target.src = "http://127.0.0.1:8000/images/pfp/default.png")}
            />
            <div className="upload-photo-icon" onClick={handleUploadIconClick}>
              <IconUpload size={18} />
            </div>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
          <h2 className="username">{formatFullName()}</h2>
        </div>
        <div className="tabs-section">
          <button
            className={`tab ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => handleTabChange("personal")}
          >
            Personal Information
          </button>
          <button
            className={`tab ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => handleTabChange("orders")}
          >
            Order History
          </button>
        </div>
        {activeTab === "personal" ? (
          <div className="info-grid">
            <div className="info-box">
              <h3>Name</h3>
              {editMode.name ? (
                <div>
                  <input
                    type="text"
                    value={tempProfile.first_name}
                    onChange={(e) => setTempProfile((prev) => ({ ...prev, first_name: e.target.value }))}
                    placeholder="First Name"
                    className="edit-input"
                  />
                  <input
                    type="text"
                    value={tempProfile.middlename}
                    onChange={(e) => setTempProfile((prev) => ({ ...prev, middlename: e.target.value }))}
                    placeholder="Middle Name"
                    className="edit-input"
                  />
                  <input
                    type="text"
                    value={tempProfile.last_name}
                    onChange={(e) => setTempProfile((prev) => ({ ...prev, last_name: e.target.value }))}
                    placeholder="Last Name"
                    className="edit-input"
                  />
                  <input
                    type="text"
                    value={tempProfile.suffix}
                    onChange={(e) => setTempProfile((prev) => ({ ...prev, suffix: e.target.value }))}
                    placeholder="Suffix"
                    className="edit-input"
                  />
                  <div className="edit-actions">
                    <button className="cancel-btn" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button className="save-btn" onClick={() => handleSave("name")}>
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p>{formatFullName()}</p>
              )}
              <button className="edit-btn" onClick={() => handleEditClick("name")}>
                <IconEdit size={24} />
              </button>
            </div>
            <div className="info-box">
              <h3>Contact Number</h3>
              {editMode.contact ? (
                <div>
                  <input
                    type="tel"
                    value={tempProfile.contact_number}
                    onChange={(e) => setTempProfile((prev) => ({ ...prev, contact_number: e.target.value }))}
                    className="edit-input"
                  />
                  <div className="edit-actions">
                    <button className="cancel-btn" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button className="save-btn" onClick={() => handleSave("contact")}>
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p>{profile.contact_number}</p>
              )}
              <button className="edit-btn" onClick={() => handleEditClick("contact")}>
                <IconEdit size={24} />
              </button>
            </div>
            <div className="info-box">
              <h3>Gender</h3>
              <p>{profile.gender}</p>
            </div>
            <div className="info-box">
              <h3>Address</h3>
              <p>{formatAddress()}</p>
              <button className="edit-btn" onClick={() => handleEditClick("address")}>
                <IconEdit size={24} />
              </button>
            </div>
            <div className="info-box">
              <h3>Password</h3>
              <p>************</p>
              <button className="edit-btn" onClick={() => handleEditClick("password")}>
                <IconEdit size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="order-history">
            <AllOrder />
          </div>
        )}
        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          onSave={handleSaveAddress}
          initialAddress={{
            street: profile.street,
            city: profile.city,
            province: profile.province,
            postalCode: profile.postal_code,
            country: profile.country,
          }}
        />
        <PasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSave={handleSavePassword}
        />
      </div>
      <Footer />
      <OrdersCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} profileId={profileId} />
    </div>
  );
};

export default CustomerProfile;