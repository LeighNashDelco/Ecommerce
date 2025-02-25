import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa'; // For the close button
import profileImage from '../../imgs/profile_one.svg'; // Your profile image path
import sendIcon from'../../imgs/send.svg';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // State to track typing in the chat input

  // Sample messages (you can expand or modify these later)
  const messages = [
    { sender: 'Sofia Davis', text: 'Hi, how can I help you today?', isBot: true },
    { sender: 'User', text: "Hey, I'm having trouble with my account.", isBot: false },
    { sender: 'Sofia Davis', text: 'What seems to be the problem?', isBot: true },
  ];

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    setIsTyping(e.target.value.length > 0); // Set isTyping to true if input has text, false if empty
  };

  return (
    <div className="chatbot-container">
      {/* Chatbot Icon */}
      <div 
        className="chatbot-icon" 
        onClick={toggleChat}
      >
        <img 
          src={profileImage} // Use imported image
          alt="Chatbot Icon" 
          className="chatbot-profile" 
        />
      </div>

      {/* Chat Box (visible when isOpen is true, with animation) */}
      {isOpen && (
        <div className={`chatbox ${isOpen ? 'chatbox-open' : 'chatbox-closing'}`}>
          <div className="chatbox-header">
            <div className="chatbox-profile">
              <img 
                src={profileImage} // Use imported image
                alt="Sofia Davis" 
                className="chatbox-profile-img" 
              />
              <div className="chatbox-name-email">
                <span>Sofia Davis</span>
                <span className="chatbox-email">m@example.com</span>
              </div>
            </div>
            <button className="chatbox-close" onClick={handleClose}>
              <FaTimes />
            </button>
          </div>
          <div className="chatbox-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`chat-message ${message.isBot ? 'bot-message' : 'user-message'}`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="chatbox-input">
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Type your message..." 
              onChange={handleInputChange} // Track typing
            />
            <button className="chat-send">
              <img 
                src={sendIcon} // Use imported SVG
                alt="Send" 
                className={`send-icon ${isTyping ? 'send-icon-active' : ''}`} // Add class for typing state
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

