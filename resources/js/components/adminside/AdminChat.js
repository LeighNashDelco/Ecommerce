import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaCommentAlt, FaEllipsisH, FaPaperclip, FaTimes, FaPaperPlane, FaArrowLeft, FaSearch } from 'react-icons/fa';
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
    const [initialLoading, setInitialLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const getAuthHeaders = () => ({
        'Authorization': `Bearer ${localStorage.getItem('LaravelPassportToken')}`,
    });

    const fetchMessages = async (isInitialFetch = false) => {
        if (isInitialFetch) setInitialLoading(true);
        setError(null);
        try {
            const headers = getAuthHeaders();
            const response = await axios.get('http://127.0.0.1:8000/api/chat/admin', { headers });
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error.response ? error.response.data : error.message);
            setError('Failed to load messages: ' + (error.response?.data?.message || error.message));
        } finally {
            if (isInitialFetch) setInitialLoading(false);
        }
    };

    useEffect(() => {
        let intervalId;
        if (isOpen) {
            fetchMessages(true);
            intervalId = setInterval(() => fetchMessages(false), 5000);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isOpen]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, selectedUserId]);

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

    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    const usersWithMessages = messages.reduce((acc, msg) => {
        if (!acc.some(u => u.id === msg.user_id) && !msg.is_admin_reply) {
            acc.push({
                id: msg.user_id,
                name: msg.user?.username || `User #${msg.user_id}`,
                profile_img: msg.user?.profile?.profile_img || null,
                last_message: msg.message,
                timestamp: msg.created_at,
            });
        }
        return acc;
    }, []).filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-chat-container">
            {!isOpen && (
                <div className="chat-icon" onClick={() => setIsOpen(true)}>
                    <FaCommentAlt size={30} />
                </div>
            )}
            {isOpen && !selectedUserId && (
                <div className="conversations-window">
                    <div className="conversations-header">
                        <h3>Chats</h3>
                        <button onClick={() => setIsOpen(false)}>
                            <FaTimes size={20} />
                        </button>
                    </div>
                    <div className="search-bar">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="conversations-list">
                        {initialLoading && (
                            <div className="no-conversations">
                                <p>Loading...</p>
                            </div>
                        )}
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
                                    onClick={() => setSelectedUserId(user.id)}
                                >
                                    {user.profile_img ? (
                                        <img
                                            src={`/storage/${user.profile_img}`}
                                            alt="Profile"
                                            className="user-avatar"
                                        />
                                    ) : (
                                        <div className="user-avatar"></div>
                                    )}
                                    <div className="conversation-info">
                                        <div className="conversation-name">{user.name}</div>
                                        <div className="last-message">{user.last_message}</div>
                                    </div>
                                    <span className="timestamp">
                                        {new Date(user.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))
                        ) : (
                            !initialLoading && !error && (
                                <div className="no-conversations">
                                    <p>No customer messages yet.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
            {isOpen && selectedUserId && (
                <div className="chat-window">
                    <div className="chat-header">
                        <button onClick={() => setSelectedUserId(null)}>
                            <FaArrowLeft size={20} />
                        </button>
                        <div className="chat-header-info">
                            <h3>{usersWithMessages.find(u => u.id === selectedUserId)?.name}</h3>
                            <div className="status online">Online</div>
                        </div>
                    </div>
                    <div className="chat-body">
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
                                        key={index}
                                        className={`message-wrapper ${msg.is_admin_reply ? 'sent' : 'received'}`}
                                        onMouseLeave={() => setMenuVisible(null)}
                                    >
                                        <div className="message">
                                            <div className="message-content">
                                                {msg.image && (
                                                    <div className={`image-attachment ${msg.is_admin_reply ? 'sent' : 'received'}`}>
                                                        <img
                                                            src={`/storage/${msg.image}`}
                                                            alt="Chat Image"
                                                            onClick={() => openImageModal(`/storage/${msg.image}`)}
                                                        />
                                                    </div>
                                                )}
                                                {msg.message && msg.message !== '[Image]' && (
                                                    <span>{msg.message}</span>
                                                )}
                                            </div>
                                            <small>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </small>
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
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    <div className="chat-footer">
                        {imagePreview && (
                            <div className="file-preview">
                                <div className="preview-image-container">
                                    <img src={imagePreview} alt="Preview" />
                                    <button className="remove-file" onClick={removeImage}>
                                        <FaTimes size={12} />
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="input-container">
                            <input
                                type="text"
                                value={reply}
                                onChange={e => setReply(e.target.value)}
                                placeholder="Type something..."
                                onKeyPress={e => e.key === 'Enter' && handleReply()}
                            />
                            <FaPaperclip
                                className="file-upload"
                                onClick={handleImageClick}
                                size={20}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <button onClick={handleReply}>
                                <FaPaperPlane size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {selectedImage && (
                <div className="image-modal" onClick={closeImageModal}>
                    <div className="modal-content">
                        <img src={selectedImage} alt="Full Size" />
                        <FaTimes className="close-modal" onClick={closeImageModal} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminChat;