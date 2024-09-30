import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import LoginModal from './LoginModal';

const Login = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    setIsModalOpen(true); // Open the modal when Register is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="login-container">
      <LoginForm navigate={navigate} handleRegisterClick={handleRegisterClick} />
      {/* Modal for registration */}
      {isModalOpen && (
        <LoginModal handleCloseModal={handleCloseModal} />
      )}
    </div>
  );
};

export default Login;
