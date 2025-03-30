// resources/js/components/customerside/Customer/Chatbot.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCommentAlt } from 'react-icons/fa';
import './../../../../sass/components/chatbot.scss';

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [faqs, setFaqs] = useState([]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const getAuthHeaders = () => ({
        'Authorization': `Bearer ${localStorage.getItem('LaravelPassportToken')}`,
        'Content-Type': 'application/json',
    });

    useEffect(() => {
        if (isOpen) {
            fetchFaqs();
            fetchMessages();
        }
    }, [isOpen]);

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
        setMessages(prev => [
            ...prev,
            { message: faq.question, is_admin_reply: false, created_at: new Date() },
            { message: faq.answer, is_admin_reply: true, created_at: new Date() },
        ]);
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/chat/send', { message: input }, {
                headers: getAuthHeaders(),
            });
            setMessages(prev => [...prev, response.data.data]);
            setInput('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return React.createElement(
        'div',
        { className: 'chatbot' },
        !isOpen &&
            React.createElement(
                'div',
                { className: 'chat-icon', onClick: () => setIsOpen(true) },
                React.createElement(FaCommentAlt, { size: 30 })
            ),
        isOpen &&
            React.createElement(
                'div',
                { className: 'chat-window' },
                React.createElement(
                    'div',
                    { className: 'chat-header' },
                    React.createElement('h3', null, 'Chat Support'),
                    React.createElement(
                        'button',
                        { onClick: () => setIsOpen(false) },
                        'X'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'chat-body' },
                    React.createElement(
                        'div',
                        { className: 'faq-list' },
                        faqs.map(faq =>
                            React.createElement(
                                'div',
                                {
                                    key: faq.id,
                                    className: 'faq-item',
                                    onClick: () => handleFaqClick(faq),
                                },
                                faq.question
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'messages' },
                        messages.map((msg, index) =>
                            React.createElement(
                                'div',
                                {
                                    key: index,
                                    className: `message ${msg.is_admin_reply ? 'received' : 'sent'}`,
                                },
                                React.createElement('span', null, msg.message),
                                React.createElement(
                                    'small',
                                    null,
                                    new Date(msg.created_at).toLocaleTimeString()
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'chat-footer' },
                    React.createElement('input', {
                        type: 'text',
                        value: input,
                        onChange: e => setInput(e.target.value),
                        placeholder: 'Type your question...',
                    }),
                    React.createElement(
                        'button',
                        { onClick: handleSendMessage },
                        'Send'
                    )
                )
            )
    );
}

export default Chatbot;