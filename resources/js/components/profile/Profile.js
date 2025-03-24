import React, { useState } from 'react';
import './../../../sass/components/profile.scss';
import Avatar from '../../../../resources/sass/img/Avatar.svg';
import Background from '../../../../resources/sass/img/coverp.svg';
import Navbar from "../Customer/topvar_notlogin";
import Footer from "../footer/footer";
import OrdersCart from "../CartModals/orders_cart";
import { IconEdit, IconUpload } from '@tabler/icons-react';
import AddressModal from '../profile/address_modal';
import PasswordModal from '../profile/password_modal';
import AllOrder from '../orderHistory/all_order';

function Profile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [avatarImage, setAvatarImage] = useState(Avatar);

  const [name, setName] = useState('Alexander Otaza');
  const [email, setEmail] = useState('Alexander Otaza');
  const [password, setPassword] = useState('************');
  const [address, setAddress] = useState({
    street: 'San Francisco St',
    city: 'Butuan City',
    province: 'Agusan Del Norte',
    postalCode: '8600',
    country: 'Philippines',
  });

  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    password: false,
    address: false,
  });

  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

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

  const handleAvatarClick = () => {
    document.getElementById('avatar-upload').click();
  };

  const handleUploadIconClick = () => {
    document.getElementById('avatar-upload').click();
  };

  const handleEditClick = (field) => {
    if (field === 'address') {
      setIsAddressModalOpen(true);
      return;
    }
    if (field === 'password') {
      setIsPasswordModalOpen(true);
      return;
    }

    setEditMode({
      name: field === 'name',
      email: field === 'email',
      password: false,
      address: false,
    });

    if (field === 'name') setTempName(name);
    if (field === 'email') setTempEmail(email);
  };

  const handleSave = (field) => {
    if (field === 'name') setName(tempName);
    if (field === 'email') setEmail(tempEmail);

    setEditMode({
      name: false,
      email: false,
      password: false,
      address: false,
    });
  };

  const handleCancel = () => {
    setTempName(name);
    setTempEmail(email);
    setEditMode({
      name: false,
      email: false,
      password: false,
      address: false,
    });
  };

  const handleSaveAddress = (updatedAddress) => {
    setAddress(updatedAddress);
    setIsAddressModalOpen(false);
  };

  const handleSavePassword = (newPassword) => {
    setPassword(newPassword || '************');
    setIsPasswordModalOpen(false);
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
          {/* For Desktop: Show tabs */}
          <div className="tabs-desktop">
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
          {/* For Mobile: Show dropdown */}
          <div className="tabs-mobile">
            <select
              value={activeTab}
              onChange={(e) => handleTabChange(e.target.value)}
              className="tab-dropdown"
            >
              <option value="personal">PERSONAL INFORMATION</option>
              <option value="orders">ORDER HISTORY</option>
            </select>
          </div>
        </div>
        {activeTab === 'personal' ? (
          <div className="info-grid">
            <div className="info-box">
              <h3>Name</h3>
              {editMode.name ? (
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="edit-input"
                />
              ) : (
                <p>{name}</p>
              )}
              <button
                className="edit-btn"
                onClick={() => handleEditClick('name')}
              >
                <IconEdit size={24} />
              </button>
              {editMode.name && (
                <div className="edit-actions">
                  <button className="cancel-btn" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button className="save-btn" onClick={() => handleSave('name')}>
                    Save
                  </button>
                </div>
              )}
            </div>
            <div className="info-box">
              <h3>Email</h3>
              {editMode.email ? (
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="edit-input"
                />
              ) : (
                <p>{email}</p>
              )}
              <button
                className="edit-btn"
                onClick={() => handleEditClick('email')}
              >
                <IconEdit size={24} />
              </button>
              {editMode.email && (
                <div className="edit-actions">
                  <button className="cancel-btn" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button className="save-btn" onClick={() => handleSave('email')}>
                    Save
                  </button>
                </div>
              )}
            </div>
            <div className="info-box">
              <h3>Address</h3>
              <p>{`${address.street}, ${address.city}, ${address.province} ${address.postalCode}, ${address.country}`}</p>
              <button
                className="edit-btn"
                onClick={() => handleEditClick('address')}
              >
                <IconEdit size={24} />
              </button>
            </div>
            <div className="info-box">
              <h3>Password</h3>
              <p>{password}</p>
              <button
                className="edit-btn"
                onClick={() => handleEditClick('password')}
              >
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
          initialAddress={address}
        />
        <PasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSave={handleSavePassword}
        />
      </div>
      <Footer />
      <OrdersCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default Profile;         