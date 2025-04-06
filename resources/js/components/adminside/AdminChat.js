import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaCommentAlt, FaEllipsisH, FaPlus, FaTimes, FaPaperPlane } from 'react-icons/fa';
import './../../../sass/components/adminchat.scss';

function AdminChat() {
    const [messages, setMessages] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [reply, setReply] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [menuVisible, setMenuVisible] = useState(null);
    const [initialLoading, setInitialLoading] = useState(false); // New state for initial loading
    const fileInputRef = useRef(null);

    const getAuthHeaders = () => ({
        'Authorization': `Bearer ${localStorage.getItem('LaravelPassportToken')}`,
    });

    const fetchMessages = async (isInitialFetch = false) => {
        if (isInitialFetch) {
            setInitialLoading(true); // Show loading only on initial fetch
        }
        setError(null);
        try {
            const headers = getAuthHeaders();
            const response = await axios.get('http://127.0.0.1:8000/api/chat/admin', { headers });
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error.response ? error.response.data : error.message);
            setError('Failed to load messages: ' + (error.response?.data?.message || error.message));
        } finally {
            if (isInitialFetch) {
                setInitialLoading(false);
            }
        }
    };

    useEffect(() => {
        let intervalId;
        if (isOpen) {
            fetchMessages(true); // Initial fetch with loading
            intervalId = setInterval(() => {
                fetchMessages(false); // Polling without loading
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
        } catch (error) {
            console.error('Error sending reply:', error.response ? error.response.data : error.message);
            alert('Failed to send reply: ' + (error.response?.data?.error || error.message));
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
            alert('Failed to delete message: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
        fileInputRef.current.value = '';
    };

    const usersWithMessages = messages.reduce((acc, msg) => {
        if (!acc.some(u => u.id === msg.user_id) && !msg.is_admin_reply) {
            acc.push({
                id: msg.user_id,
                name: msg.user?.username || `User #${msg.user_id}`,
                profile_img: msg.user?.profile?.profile_img || null,
            });
        }
        return acc;
    }, []);

    return (
        <div className="admin-chat-container">
            {!isOpen && (
                <div className="chat-icon" onClick={() => setIsOpen(true)}>
                    <FaCommentAlt size={30} />
                </div>
            )}
            {isOpen && (
                <div className="admin-chat">
                    <div className="chat-header">
                        <h3>{selectedUserId ? 'Chat' : 'Customers'}</h3>
                        {selectedUserId && <button onClick={() => setSelectedUserId(null)}>←</button>}
                        <button onClick={() => { setIsOpen(false); setSelectedUserId(null); }}>X</button>
                    </div>
                    {initialLoading && <p>Loading...</p>}
                    {error && <p className="error">{error}</p>}
                    <div className="chat-body">
                        {!selectedUserId ? (
                            <div className="user-list">
                                {usersWithMessages.length > 0 ? (
                                    usersWithMessages.map(user => (
                                        <div
                                            key={user.id}
                                            className="user-item"
                                            onClick={() => setSelectedUserId(user.id)}
                                        >
                                            {user.profile_img && (
                                                <img
                                                    src={`/storage/${user.profile_img}`}
                                                    alt="Profile"
                                                    className="profile-pic"
                                                />
                                            )}
                                            <span>{user.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No customer messages yet.</p>
                                )}
                            </div>
                        ) : (
                            <div className="chat-area">
                                <div className="messages">
                                    {messages
                                        .filter(m => m.user_id === selectedUserId)
                                        .map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`message ${msg.is_admin_reply ? 'sent' : 'received'}`}
                                                onMouseLeave={() => setMenuVisible(null)}
                                            >
                                                {msg.image && (
                                                    <img
                                                        src={`/storage/${msg.image}`}
                                                        alt="Chat Image"
                                                        className="chat-image"
                                                    />
                                                )}
                                                {msg.message && msg.message !== '[Image]' && (
                                                    <span>{msg.message}</span>
                                                )}
                                                <small>{new Date(msg.created_at).toLocaleTimeString()}</small>
                                                {msg.is_admin_reply && (
                                                    <div className="message-menu">
                                                        <FaEllipsisH
                                                            className="menu-icon"
                                                            onClick={() => setMenuVisible(msg.id === menuVisible ? null : msg.id)}
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
                                        ))}
                                </div>
                                <div className="chat-footer">
                                    {imagePreview && (
                                        <div className="image-preview">
                                            <img src={imagePreview} alt="Preview" />
                                            <FaTimes className="remove-image" onClick={removeImage} />
                                        </div>
                                    )}
                                    <div className="input-row">
                                        <FaPlus
                                            className="add-image-icon"
                                            onClick={handleImageClick}
                                            title="Add Image"
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />
                                        <input
                                            type="text"
                                            value={reply}
                                            onChange={e => setReply(e.target.value)}
                                            placeholder="Type your reply..."
                                        />
                                        <button onClick={handleReply}>
                                            <FaPaperPlane />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminChat;