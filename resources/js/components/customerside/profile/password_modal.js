import React, { useState } from 'react';
import './../../../../sass/components/password_modal.scss';
import { IconEye, IconEyeOff } from '@tabler/icons-react'; // Import eye icons

const PasswordModal = ({ isOpen, onClose, onSave }) => {
  // State for new password, confirm password, and visibility
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState({ new: false, confirm: false }); // State to toggle visibility

  // State for password strength and matching
  const [passwordStrength, setPasswordStrength] = useState(null); // Null when empty, otherwise weak/medium/strong
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [confirmTouched, setConfirmTouched] = useState(false);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (!password) return null; // Return null if empty
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (strongPasswordRegex.test(password)) {
      return 'strong';
    } else if (password.length >= 6) {
      return 'medium';
    } else {
      return 'weak';
    }
  };

  // Handle new password change
  const handleNewPasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    const strength = checkPasswordStrength(password);
    setPasswordStrength(strength);
    if (confirmTouched) {
      setPasswordsMatch(password === confirmPassword);
    }
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (e) => {
    const password = e.target.value;
    setConfirmTouched(true);
    setConfirmPassword(password);
    setPasswordsMatch(newPassword === password);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle save
  const handleSave = () => {
    if (passwordStrength === 'strong' && passwordsMatch) {
      onSave(newPassword);
      onClose();
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setNewPassword('');
    setConfirmPassword('');
    setPasswordStrength(null);
    setPasswordsMatch(true);
    setConfirmTouched(false);
    setShowPassword({ new: false, confirm: false });
    onClose();
  };

  // Don't render the modal if it's not open
  if (!isOpen) return null;

  return (
    <div className="password-modal-overlay">
      <div className="password-modal">
        <div className="modal-header">
          <h2>Edit Password</h2>
          <button className="close-btn" onClick={handleCancel}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input-container">
              <input
                type={showPassword.new ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={handleNewPasswordChange}
                placeholder="Enter new password"
                className={`password-input ${passwordStrength || ''}`}
              />
              <span
                className="eye-icon"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPassword.new ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </span>
            </div>
            {passwordStrength === 'weak' && (
              <span className={`strength-indicator ${passwordStrength}`}>
                Weak
              </span>
            )}
            {(passwordStrength === 'medium' || passwordStrength === 'strong') && (
              <span className={`strength-indicator ${passwordStrength}`}>
                {passwordStrength === 'medium' ? 'Medium' : 'Strong'}
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm new password"
                className="password-input"
              />
              <span
                className="eye-icon"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPassword.confirm ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </span>
            </div>
            {confirmTouched && !passwordsMatch && (
              <span className="error-message">Passwords do not match</span>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={passwordStrength !== 'strong' || (confirmTouched && !passwordsMatch)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;