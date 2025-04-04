import React, { useState, useEffect, useRef } from 'react';
import { FaCommentAlt, FaPaperclip, FaPaperPlane, FaArrowLeft, FaSearch, FaTimes } from 'react-icons/fa';
import './../../../../sass/components/chatbot.scss';

const fetchFast = async (url, options = {}) => {
  const defaultHeaders = {
    'Authorization': `Bearer ${localStorage.getItem('LaravelPassportToken')}`,
    'Content-Type': 'application/json',
  };
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

function Chatbot({ isOpen: controlledIsOpen, setIsOpen: controlledSetIsOpen, chatData }) {
  // Internal state for isOpen if not controlled by props
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  // Determine if the component is controlled by external props
  const isControlled = controlledIsOpen !== undefined && controlledSetIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const setIsOpen = isControlled ? controlledSetIsOpen : setInternalIsOpen;

  const [showChat, setShowChat] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
      fetchFaqs();
      if (chatData) {
        setSelectedSeller(chatData.seller);
        setShowChat(true);
        setInput(
          `Hello ${chatData.seller.name}, I’d like to discuss my order: ${chatData.order.name} (Order #${chatData.order.order_number}).`
        );
      } else if (showChat && selectedSeller) {
        fetchMessages(selectedSeller.id);
      } else if (showChat) {
        fetchMessages();
      }
    }
  }, [isOpen, showChat, chatData]);

  useEffect(() => {
    const filtered = conversations.filter(conversation =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredConversations(filtered);
  }, [searchQuery, conversations]);

  const fetchConversations = async () => {
    try {
      const response = await fetchFast('http://127.0.0.1:8000/api/chat/customer');
      const userMessages = response.filter(msg => !msg.deleted_for);

      const conversation = {
        id: 1,
        name: chatData?.seller.name || 'Vero Support Team',
        lastMessage: userMessages.length > 0 ? userMessages[userMessages.length - 1].message : 'Start a conversation',
        timestamp: userMessages.length > 0 ? new Date(userMessages[userMessages.length - 1].created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        unread: 0,
      };

      setConversations([conversation]);
      setFilteredConversations([conversation]);
      setError(null);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to load conversations. Please try again later.');
    }
  };

  const fetchFaqs = async () => {
    try {
      const response = await fetchFast('http://127.0.0.1:8000/api/helpandsupport');
      setFaqs(response);
      setError(null);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setError('Failed to load FAQs. Please try again later.');
    }
  };

  const fetchMessages = async (sellerId = null) => {
    try {
      const url = sellerId
        ? `http://127.0.0.1:8000/api/chat/seller/${sellerId}`
        : 'http://127.0.0.1:8000/api/chat/customer';
      const response = await fetchFast(url);
      setMessages(response);
      setError(null);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages. Please try again later.');
    }
  };

  const handleFaqClick = faq => {
    setMessages(prev => [
      ...prev,
      { message: faq.question, is_admin_reply: false, created_at: new Date() },
      { message: faq.answer, is_admin_reply: true, created_at: new Date() },
    ]);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if ((!input.trim() && !file) || (input.trim() === '' && !file)) {
      setError('Please enter a message or attach a file.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('message', input || '');
      if (file) {
        formData.append('image', file);
      }
      if (selectedSeller?.id) {
        formData.append('seller_id', selectedSeller.id);
      }

      const response = await fetch('http://127.0.0.1:8000/api/chat/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('LaravelPassportToken')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const newMessage = {
        ...result.data,
        attachmentUrl: result.data.attachment_path ? `http://127.0.0.1:8000/storage/${result.data.attachment_path.replace('public/', '')}` : null,
      };

      setMessages(prev => [...prev, newMessage]);
      setInput('');
      setFile(null);
      setFilePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setError(null);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again later.');
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setShowChat(false);
    setSearchQuery('');
    setFile(null);
    setFilePreview(null);
    setInput('');
    setSelectedSeller(null);
  };

  const isImageAttachment = (attachmentPath) => {
    if (!attachmentPath) return false;
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const extension = attachmentPath.split('.').pop().toLowerCase();
    return imageExtensions.includes(extension);
  };

  return (
    <div className="chatbot">
      {!isOpen && (
        <div
          className="chat-icon"
          onClick={() => setIsOpen(true)}
        >
          <FaCommentAlt size={30} />
        </div>
      )}
      {isOpen && !showChat && (
        <div className="conversations-window">
          <div className="conversations-header">
            <h3>Chats</h3>
            <button onClick={handleCloseChat}>
              <FaTimes size={20} />
            </button>
          </div>
          <div className="search-bar">
            <FaSearch size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="conversations-list">
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conversation => (
                <div
                  key={conversation.id}
                  className="conversation-item"
                  onClick={() => {
                    setShowChat(true);
                    setSelectedSeller(chatData?.seller || { name: 'Vero Support Team', id: null });
                  }}
                >
                  <div className="user-avatar support-team-avatar"></div>
                  <div className="conversation-info">
                    <div className="conversation-name">{conversation.name}</div>
                    <div className="last-message">{conversation.lastMessage}</div>
                  </div>
                  <div className="timestamp">{conversation.timestamp}</div>
                </div>
              ))
            ) : (
              <div className="no-conversations">
                <p>No conversations found.</p>
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
              <h3>{selectedSeller?.name || 'Vero Support Team'}</h3>
              <span className="status online">Online</span>
            </div>
          </div>
          <div className="chat-body">
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            <div className="faq-list">
              {faqs.map(faq => (
                <div
                  key={faq.id}
                  className="faq-item"
                  onClick={() => handleFaqClick(faq)}
                >
                  {faq.question}
                </div>
              ))}
            </div>
            <div className="messages">
              {messages.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className={`message-wrapper ${msg.is_admin_reply ? 'received' : 'sent'}`}
                >
                  <div className="message">
                    <div className="message-content">
                      {isImageAttachment(msg.attachment_path) ? (
                        <div className="image-attachment">
                          <img
                            src={`http://127.0.0.1:8000/storage/${msg.attachment_path.replace('public/', '')}`}
                            alt="Attachment"
                          />
                          {msg.message && msg.message !== '' && (
                            <span>{msg.message}</span>
                          )}
                        </div>
                      ) : (
                        <span>
                          {msg.message}
                          {msg.attachment_path && (
                            <a
                              href={`http://127.0.0.1:8000/storage/${msg.attachment_path.replace('public/', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="attachment-link"
                            >
                              (View Attachment)
                            </a>
                          )}
                        </span>
                      )}
                    </div>
                    <small>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="chat-footer">
            {filePreview && (
              <div className="file-preview">
                <div className="preview-image-container">
                  <img src={filePreview} alt="Preview" />
                  <button className="remove-file" onClick={handleRemoveFile}>
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
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
              </label>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type something..."
              />
              <button onClick={handleSendMessage}>
                <FaPaperPlane size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;