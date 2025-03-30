// resources/js/components/Notifications.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../../../../sass/components/notifications.scss';
import Navbar from "./topnav_login";
import Footer from "../footer/footer";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('LaravelPassportToken');
    return token ? {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    } : { 'Content-Type': 'application/json' };
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/notifications', {
          headers: getAuthHeaders(),
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setErrorMessage('Failed to load notifications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/notifications/${notificationId}/read`, {}, {
        headers: getAuthHeaders(),
      });
      setNotifications(prev => prev.map(notif =>
        notif.id === notificationId ? { ...notif, status: 'read' } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setErrorMessage('Failed to mark notification as read.');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/notifications/${notificationId}`, {
        headers: getAuthHeaders(),
      });
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      setSelectedNotifications(prev => prev.filter(id => id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      setErrorMessage('Failed to delete notification.');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/notifications/mark-all-read', {}, {
        headers: getAuthHeaders(),
      });
      setNotifications(prev => prev.map(notif => ({ ...notif, status: 'read' })));
    } catch (error) {
      console.error('Error marking all as read:', error);
      setErrorMessage('Failed to mark all notifications as read.');
    }
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev =>
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(notif => notif.id));
    }
  };

  const handleRemoveSelected = async () => {
    try {
      await Promise.all(selectedNotifications.map(id =>
        axios.delete(`http://127.0.0.1:8000/api/notifications/${id}`, {
          headers: getAuthHeaders(),
        })
      ));
      setNotifications(prev => prev.filter(notif => !selectedNotifications.includes(notif.id)));
      setSelectedNotifications([]);
    } catch (error) {
      console.error('Error removing selected notifications:', error);
      setErrorMessage('Failed to remove selected notifications.');
    }
  };

  const handleBackToShop = () => {
    navigate('/shop');
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  };

  if (loading) return <div className="loading">Loading notifications...</div>;

  return (
    <div className="notifications-page">
      <Navbar />
      <div className="notifications-content">
        <div className="notifications-header">
          <h1>Notifications</h1>
        </div>
        {errorMessage && (
          <div className="error-message">{errorMessage}</div>
        )}
        {notifications.length === 0 ? (
          <p className="no-notifications">No notifications available.</p>
        ) : (
          <>
            <div className="notifications-actions">
              <button className="back-btn" onClick={handleBackToShop}>
                ← Back
              </button>
              <button className="select-all-btn" onClick={handleSelectAll}>
                {selectedNotifications.length === notifications.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                className="remove-selected-btn"
                onClick={handleRemoveSelected}
                disabled={selectedNotifications.length === 0}
              >
                Remove Selected
              </button>
            </div>
            <ul className="notifications-list">
              {notifications.map(notif => (
                <li
                  key={notif.id}
                  className={`notification-item ${notif.status === 'unread' ? 'unread' : 'read'}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notif.id)}
                    onChange={() => handleSelectNotification(notif.id)}
                  />
                  <div className="notification-text">
                    <span>{notif.message}</span>
                  </div>
                  <div className="notification-timestamp">
                    <small>{getRelativeTime(notif.created_at)}</small>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Notifications;