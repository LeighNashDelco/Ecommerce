// Chatbot.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaCommentAlt, FaEllipsisH, FaPaperclip, FaTimes, FaPaperPlane, FaArrowLeft, FaSearch } from 'react-icons/fa';
import './../../../../sass/components/chatbot.scss';

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState(null);
    const [messages, setMessages] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [selectedFaq, setSelectedFaq] = useState(null);
    const [input, setInput] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [menuVisible, setMenuVisible] = useState(null);
    const [error, setError] = useState(null);
    const [initialLoading, setInitialLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const getAuthHeaders = () => ({
        'Authorization': `Bearer ${localStorage.getItem('LaravelPassportToken')}`,
    });

    useEffect(() => {
        if (isOpen) {
            if (view === 'chat') {
                fetchMessages(true);
                const intervalId = setInterval(() => fetchMessages(false), 5000);
                return () => clearInterval(intervalId);
            } else if (view === 'faqs') {
                fetchFaqs();
            }
        }
    }, [isOpen, view]);

    useEffect(() => {
        if (messagesEndRef.current && view === 'chat') {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, view]);

    const fetchMessages = async (isInitialFetch = false) => {
        if (isInitialFetch) setInitialLoading(true);
        setError(null);
        try {
            const headers = getAuthHeaders();
            const response = await axios.get('http://127.0.0.1:8000/api/chat/customer', { headers });
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError('Failed to load messages: ' + (error.response?.data?.message || error.message));
        } finally {
            if (isInitialFetch) setInitialLoading(false);
        }
    };

    const fetchFaqs = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/helpandsupport', {
                headers: getAuthHeaders(),
            });
            setFaqs(response.data);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim() && !image) return;
        try {
            const formData = new FormData();
            if (input.trim()) formData.append('message', input);
            if (image) formData.append('image', image);

            const response = await axios.post('http://127.0.0.1:8000/api/chat/send', formData, {
                headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' },
            });
            setMessages(prev => [...prev, response.data.data]);
            setInput('');
            setImage(null);
            setImagePreview(null);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message: ' + (error.response?.data?.error || error.message));
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
            console.error('Error deleting message:', error);
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

    const handleFaqClick = (faq) => {
        setSelectedFaq(faq);
    };

    return (
        <div className="chat-container">
            {!isOpen && (
                <div className="chat-icon" onClick={() => setIsOpen(true)}>
                    <FaCommentAlt size={30} />
                </div>
            )}
            {isOpen && !view && (
                <div className="conversations-window">
                    <div className="conversations-header">
                        <h3>Chat</h3>
                        <button onClick={() => setIsOpen(false)}>
                            <FaTimes size={20} />
                        </button>
                    </div>
                    <div className="conversations-list">
                        <div className="conversation-item" onClick={() => setView('faqs')}>
                            <div className="conversation-info">
                                <div className="conversation-name">FAQs</div>
                                <div className="last-message">View frequently asked questions</div>
                            </div>
                        </div>
                        <div className="conversation-item" onClick={() => setView('chat')}>
                            <div className="conversation-info">
                                <div className="conversation-name">Contact Support</div>
                                <div className="last-message">Chat with our support team</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isOpen && view === 'faqs' && (
                <div className="chat-window">
                    <div className="chat-header">
                        <button onClick={() => setView(null)}>
                            <FaArrowLeft size={20} />
                        </button>
                        <div className="chat-header-info">
                            <h3>FAQs</h3>
                        </div>
                    </div>
                    <div className="chat-body">
                        {selectedFaq ? (
                            <div className="messages">
                                <div className="message-wrapper received">
                                    <div className="message">
                                        <div className="message-content">
                                            <span>{selectedFaq.question}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="message-wrapper sent">
                                    <div className="message">
                                        <div className="message-content">
                                            <span>{selectedFaq.answer}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="conversations-list">
                                {faqs.length > 0 ? (
                                    faqs.map(faq => (
                                        <div
                                            key={faq.id}
                                            className="conversation-item"
                                            onClick={() => handleFaqClick(faq)}
                                        >
                                            <div className="conversation-info">
                                                <div className="conversation-name">{faq.question}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-conversations">
                                        <p>No FAQs available.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {isOpen && view === 'chat' && (
                <div className="chat-window">
                    <div className="chat-header">
                        <button onClick={() => setView(null)}>
                            <FaArrowLeft size={20} />
                        </button>
                        <div className="chat-header-info">
                            <h3>Vero Help Support</h3>
                            <div className="status">Support Team</div>
                        </div>
                    </div>
                    <div className="chat-body">
                        {initialLoading ? (
                            <div className="no-conversations">
                                <p>Loading...</p>
                            </div>
                        ) : error ? (
                            <div className="error-message">
                                <p>{error}</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="no-conversations">
                                <p>No messages yet. Start a conversation!</p>
                            </div>
                        ) : (
                            <div className="messages">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`message-wrapper ${msg.is_admin_reply ? 'received' : 'sent'}`}
                                        onMouseLeave={() => setMenuVisible(null)}
                                    >
                                        <div className="message">
                                            <div className="message-content">
                                                {msg.image && (
                                                    <div className={`image-attachment ${msg.is_admin_reply ? 'received' : 'sent'}`}>
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
                                            {!msg.is_admin_reply && (
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
                        )}
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
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Type something..."
                                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
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
                            <button onClick={handleSendMessage}>
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

export default Chatbot;