import React, { useState } from 'react';
import './../../../sass/components/profile.scss';
import Avatar from '../../../../resources/sass/img/Avatar.svg';
import Background from '../../../../resources/sass/img/coverp.svg';
import Navbar from "../Customer/topvar_notlogin";
import Footer from "../footer/footer";
import OrdersCart from "../CartModals/orders_cart";
import { IconEdit, IconUpload } from '@tabler/icons-react';

function Profile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [avatarImage, setAvatarImage] = useState(Avatar); 
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarImage(e.target.result); 
      };
      reader.readAsDataURL(file);
    }
    event.target.value = null; 
  };

  // Trigger file input click for avatar
  const handleAvatarClick = () => {
    document.getElementById('avatar-upload').click();
  };

  // Trigger file input click for upload icon
  const handleUploadIconClick = () => {
    document.getElementById('avatar-upload').click();
  };

  return (
    <div className="profile-page">
      <Navbar onCartClick={toggleCart} />
      <div className="content-wrapper">
        <div className="background-section">
          <img src={Background} alt="Background" className="background-image" />
        </div>
        <div className="profile-header">
          <div className="avatar-container" onClick={handleAvatarClick}>
            <img src={avatarImage} alt="Avatar" className="avatar-image" />
            <div className="upload-photo-icon" onClick={handleUploadIconClick}>
              <IconUpload size={18} />
            </div>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
          <h2 className="username">alexdooe02122</h2>
        </div>
        <div className="tabs-section">
          <button
            className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => handleTabChange('personal')}
          >
            Personal Information
          </button>
          <button
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => handleTabChange('orders')}
          >
            Order History
          </button>
        </div>
        {activeTab === 'personal' ? (
          <div className="info-grid">
            <div className="info-box">
              <h3>Name</h3>
              <p>Alexander Otaza</p>
              <button className="edit-btn">
                <IconEdit size={24} />
              </button>
            </div>
            <div className="info-box">
              <h3>Email</h3>
              <p>Alexander Otaza</p>
              <button className="edit-btn">
                <IconEdit size={24} />
              </button>
            </div>
            <div className="info-box">
              <h3>Address</h3>
              <p>San Francisco St, Butuan City, Agusan Del Norte 8600, Philippines</p>
              <button className="edit-btn">
                <IconEdit size={24} />
              </button>
            </div>
            <div className="info-box">
              <h3>Password</h3>
              <p>************</p>
              <button className="edit-btn">
                <IconEdit size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="order-history">
            <p>Order history will be displayed here.</p>
          </div>
        )}
      </div>
      <Footer />
      <OrdersCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default Profile;