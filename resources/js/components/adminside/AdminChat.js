import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaCommentAlt, FaPaperclip, FaPaperPlane, FaArrowLeft, FaTimes, FaEllipsisH } from 'react-icons/fa';
import './../../../sass/components/adminchat.scss';

function AdminChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [reply, setReply] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null);
  const [initialLoading, setInitialLoading] = useState(false);
  const fileInputRef = useRef(null);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('LaravelPassportToken')}`,
  });

  const fetchMessages = async (isInitialFetch = false) => {
    if (isInitialFetch) {
      setInitialLoading(true);
    }
    setError(null);
    try {
      const headers = getAuthHeaders();
      const response = await axios.get('http://127.0.0.1:8000/api/chat/admin', { headers });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error.response ? error.response.data : error.message);
      setError('Failed to load messages: ' + (error.response?.data?.error || error.message));
    } finally {
      if (isInitialFetch) {
        setInitialLoading(false);
      }
    }
  };

  useEffect(() => {
    let intervalId;
    if (isOpen) {
      fetchMessages(true);
      intervalId = setInterval(() => {
        fetchMessages(false);
      }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOpen]);

  const handleReply = async () => {
    if (!selectedUserId || (!reply.trim() && !image)) return;
    try {
      const formData = new FormData();
      formData.append('user_id', selectedUserId);
      if (reply.trim()) formData.append('message', reply);
      if (image) formData.append('image', image);

      const response = await axios.post('http://127.0.0.1:8000/api/chat/reply', formData, {
        headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' },
      });
      setMessages(prev => [...prev, response.data.data]);
      setReply('');
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error sending reply:', error.response ? error.response.data : error.message);
      setError('Failed to send reply: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/chat/message/${messageId}`, {
        headers: getAuthHeaders(),
      });
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setMenuVisible(null);
    } catch (error) {
      console.error('Error deleting message:', error.response ? error.response.data : error.message);
      setError('Failed to delete message: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const usersWithMessages = messages.reduce((acc, msg) => {
    if (!acc.some(u => u.id === msg.user_id) && !msg.is_admin_reply) {
      acc.push({
        id: msg.user_id,
        name: msg.user?.full_name || '',
        profile_img: msg.user?.profile_img || 'images/pfp/default.png',
        lastMessage: msg.message || '[Image]',
        timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
    return acc;
  }, []);

  const handleImageError = (e, userId) => {
    console.warn(`Failed to load profile image for user ${userId}: ${e.target.src}, falling back to default`);
    e.target.src = '/images/pfp/default.png';
  };

  return (
    <div className="admin-chat">
      {!isOpen && (
        <div className="chat-icon" onClick={() => setIsOpen(true)}>
          <FaCommentAlt size={30} />
        </div>
      )}
      {isOpen && !showChat && (
        <div className="conversations-window">
          <div className="conversations-header">
            <h3>Customers</h3>
            <button onClick={() => setIsOpen(false)}>
              <FaTimes size={20} />
            </button>
          </div>
          <div className="conversations-list">
            {initialLoading && <p>Loading...</p>}
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            {usersWithMessages.length > 0 ? (
              usersWithMessages.map(user => (
                <div
                  key={user.id}
                  className="conversation-item"
                  onClick={() => {
                    setSelectedUserId(user.id);
                    setShowChat(true);
                  }}
                >
                  <img
                    src={`http://127.0.0.1:8000/${user.profile_img}`}
                    alt="Profile"
                    className="user-avatar"
                    onError={(e) => handleImageError(e, user.id)}
                  />
                  <div className="conversation-info">
                    <div className="conversation-name">{user.name || 'Anonymous'}</div>
                    <div className="last-message">{user.lastMessage}</div>
                  </div>
                  <div className="timestamp">{user.timestamp}</div>
                </div>
              ))
            ) : (
              <div className="no-conversations">
                <p>No customer messages yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
      {isOpen && showChat && (
        <div className="chat-window">
          <div className="chat-header">
            <button onClick={() => setShowChat(false)}>
              <FaArrowLeft size={20} />
            </button>
            <div className="chat-header-info">
              <h3>
                {usersWithMessages.find(u => u.id === selectedUserId)?.name || 'Anonymous'}
              </h3>
            </div>
          </div>
          <div className="chat-body">
            {initialLoading && <p>Loading...</p>}
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            <div className="messages">
              {messages
                .filter(m => m.user_id === selectedUserId)
                .map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`message-wrapper ${msg.is_admin_reply ? 'sent' : 'received'}`}
                    onMouseLeave={() => setMenuVisible(null)}
                  >
                    <div className="message">
                      <div className="message-content">
                        {msg.image && (
                          <div className="image-attachment">
                            <img src={`http://127.0.0.1:8000/storage/${msg.image}`} alt="Chat Image" />
                            {msg.message && msg.message !== '[Image]' && (
                              <span>{msg.message}</span>
                            )}
                          </div>
                        )}
                        {msg.message && msg.message !== '[Image]' && !msg.image && (
                          <span>{msg.message}</span>
                        )}
                      </div>
                      <small>
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </small>
                      {msg.is_admin_reply && (
                        <div className="message-menu">
                          <FaEllipsisH
                            className="menu-icon"
                            onClick={() =>
                              setMenuVisible(msg.id === menuVisible ? null : msg.id)
                            }
                          />
                          {menuVisible === msg.id && (
                            <div className="menu-dropdown">
                              <button
                                className="delete-option"
                                onClick={() => handleDelete(msg.id)}
                              >
                                Delete Message
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="chat-footer">
            {imagePreview && (
              <div className="file-preview">
                <div className="preview-image-container">
                  <img src={imagePreview} alt="Preview" />
                  <button className="remove-file" onClick={handleRemoveImage}>
                    <FaTimes size={14} />
                  </button>
                </div>
              </div>
            )}
            <div className="input-container">
              <label className="file-upload">
                <FaPaperclip size={20} />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
              <input
                type="text"
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Type your reply..."
              />
              <button onClick={handleReply}>
                <FaPaperPlane size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminChat;