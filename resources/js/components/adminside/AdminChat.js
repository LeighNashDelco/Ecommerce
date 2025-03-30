// resources/js/components/adminside/AdminChat.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../../../sass/components/adminchat.scss';

function AdminChat() {
    const [messages, setMessages] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false); // Add toggle state

    const getAuthHeaders = () => ({
        'Authorization': `Bearer ${localStorage.getItem('LaravelPassportToken')}`,
        'Content-Type': 'application/json',
    });

    useEffect(() => {
        if (isOpen) {
            fetchMessages();
        }
    }, [isOpen]);

    const fetchMessages = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/chat/admin', {
                headers: getAuthHeaders(),
            });
            console.log('Fetched messages:', response.data);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError('Failed to load messages. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async () => {
        if (!reply.trim() || !selectedUserId) return;
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/chat/reply', {
                user_id: selectedUserId,
                message: reply,
            }, {
                headers: getAuthHeaders(),
            });
            setMessages(prev => [...prev, response.data.data]);
            setReply('');
            fetchMessages(); // Refresh messages after reply
        } catch (error) {
            console.error('Error sending reply:', error);
        }
    };

    // Group messages by user and get user details
    const usersWithMessages = messages.reduce((acc, msg) => {
        if (!acc.some(u => u.id === msg.user_id) && !msg.is_admin_reply) { // Only include users who sent messages
            acc.push({
                id: msg.user_id,
                name: msg.user?.username || `User #${msg.user_id}`, // Use username
            });
        }
        return acc;
    }, []);

    return React.createElement(
        'div',
        { className: 'admin-chat-container' },
        !isOpen && React.createElement(
            'button',
            {
                className: 'chat-toggle-button',
                onClick: () => setIsOpen(true)
            },
            'Open Customer Chat'
        ),
        isOpen && React.createElement(
            'div',
            { className: 'admin-chat' },
            React.createElement(
                'div',
                { className: 'chat-header' },
                React.createElement('h1', null, 'Customer Chat'),
                React.createElement(
                    'button',
                    {
                        className: 'close-button',
                        onClick: () => setIsOpen(false)
                    },
                    'Close'
                )
            ),
            loading && React.createElement('p', null, 'Loading messages...'),
            error && React.createElement('p', { className: 'error' }, error),
            React.createElement(
                'div',
                { className: 'chat-container' },
                React.createElement(
                    'div',
                    { className: 'user-list' },
                    usersWithMessages.length > 0
                        ? usersWithMessages.map(user =>
                              React.createElement(
                                  'div',
                                  {
                                      key: user.id,
                                      className: `user-item ${selectedUserId === user.id ? 'selected' : ''}`,
                                      onClick: () => setSelectedUserId(user.id),
                                  },
                                  user.name
                              )
                          )
                        : React.createElement('p', null, 'No customer messages yet.')
                ),
                React.createElement(
                    'div',
                    { className: 'chat-area' },
                    selectedUserId &&
                        React.createElement(
                            React.Fragment,
                            null,
                            React.createElement(
                                'div',
                                { className: 'messages' },
                                messages
                                    .filter(m => m.user_id === selectedUserId)
                                    .map((msg, index) =>
                                        React.createElement(
                                            'div',
                                            {
                                                key: index,
                                                className: `message ${msg.is_admin_reply ? 'sent' : 'received'}`,
                                            },
                                            React.createElement('span', null, msg.message),
                                            React.createElement(
                                                'small',
                                                null,
                                                new Date(msg.created_at).toLocaleTimeString()
                                            )
                                        )
                                    )
                            ),
                            React.createElement(
                                'div',
                                { className: 'reply-area' },
                                React.createElement('input', {
                                    type: 'text',
                                    value: reply,
                                    onChange: e => setReply(e.target.value),
                                    placeholder: 'Type your reply...',
                                }),
                                React.createElement(
                                    'button',
                                    { onClick: handleReply },
                                    'Send'
                                )
                            )
                        )
                )
            )
        )
    );
}

export default AdminChat;