import React from 'react';

const LoginModal = ({ handleCloseModal }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleCloseModal}>&times;</span>
        <h2>Register</h2>
        {/* Registration form can be added here */}
        <p>This is where you can add registration form fields.</p>
      </div>
    </div>
  );
};

export default LoginModal;
