import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaCommentAlt, FaPlus, FaPaperPlane, FaTimes, FaEllipsisH } from 'react-icons/fa';
import './../../../../sass/components/chatbot.scss';

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [faqs, setFaqs] = useState([]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [view, setView] = useState(null);
    const [selectedFaq, setSelectedFaq] = useState(null);
    const [menuVisible, setMenuVisible] = useState(null);
    const fileInputRef = useRef(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('LaravelPassportToken');
        if (!token) {
            throw new Error('No authentication token found. Please log in.');
        }
        return {
            'Authorization': `Bearer ${token}`,
        };
    };

    useEffect(() => {
        if (isOpen) {
            fetchFaqs();
            if (view === 'chat') {
                fetchMessages();
                const intervalId = setInterval(() => {
                    fetchMessages();
                }, 5000);
                return () => clearInterval(intervalId);
            }
        }
    }, [isOpen, view]);

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

    const fetchMessages = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/chat/customer', {
                headers: getAuthHeaders(),
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleFaqClick = faq => {
        setSelectedFaq(faq);
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

    const handleSendMessage = async () => {
        if (!input.trim() && !image) return;
        try {
            const formData = new FormData();
            if (input.trim()) formData.append('message', input);
            if (image) formData.append('image', image);

            console.log('Sending FormData:', { message: input, image });

            const response = await axios.post('http://127.0.0.1:8000/api/chat/send', formData, {
                headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' },
            });
            setMessages(prev => [...prev, response.data.data]);
            setInput('');
            setImage(null);
            setImagePreview(null);
        } catch (error) {
            console.error('Error sending message:', error.response?.data || error.message);
            if (error.response?.status === 422) {
                const details = error.response.data.details;
                const errorMessage = Object.values(details).flat().join(' ');
                alert('Validation failed: ' + errorMessage);
            } else {
                alert('Failed to send message: ' + (error.response?.data?.error || error.message));
            }
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
            console.error('Error deleting message:', error.response?.data || error.message);
            alert('Failed to delete message: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="chatbot">
            {!isOpen && (
                <div className="chat-icon" onClick={() => setIsOpen(true)}>
                    <FaCommentAlt size={30} />
                </div>
            )}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>{view ? (view === 'faqs' ? 'FAQs' : 'Contact Support') : 'Support Options'}</h3>
                        {view && <button onClick={() => { setView(null); setSelectedFaq(null); }}>←</button>}
                        <button onClick={() => { setIsOpen(false); setView(null); setSelectedFaq(null); }}>X</button>
                    </div>
                    <div className="chat-body">
                        {!view ? (
                            <div className="options-list">
                                <div className="option-item" onClick={() => setView('faqs')}>
                                    FAQs
                                </div>
                                <div className="option-item" onClick={() => setView('chat')}>
                                    Contact Support
                                </div>
                            </div>
                        ) : view === 'faqs' ? (
                            <div className="faq-section">
                                {selectedFaq ? (
                                    <div className="faq-content">
                                        <div className="faq-question">{selectedFaq.question}</div>
                                        <div className="faq-answer">{selectedFaq.answer}</div>
                                    </div>
                                ) : (
                                    <div className="faq-list">
                                        {faqs.length > 0 ? (
                                            faqs.map(faq => (
                                                <div
                                                    key={faq.id}
                                                    className="faq-item"
                                                    onClick={() => handleFaqClick(faq)}
                                                >
                                                    {faq.question}
                                                </div>
                                            ))
                                        ) : (
                                            <p>No FAQs available.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="chat-section">
                                <div className="messages">
                                    {messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`message ${msg.is_admin_reply ? 'received' : 'sent'}`}
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
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            placeholder="Type your question..."
                                        />
                                        <button onClick={handleSendMessage}>
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

export default Chatbot;