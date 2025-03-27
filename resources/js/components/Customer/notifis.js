import React, { useState, useEffect } from 'react';
import "./../../../sass/components/notifs.scss";
import { useNavigate } from 'react-router-dom';

function Notifs({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  const notifications = [
    { id: 1, message: 'Your order #1234 has been shipped!', time: '2 hours ago' },
    { id: 2, message: 'New product added to the store.', time: '5 hours ago' },
    { id: 3, message: 'Your payment was successful.', time: '1 day ago' },
  ];

  const handleViewAll = () => {
    navigate('/notifications');
    setIsClosing(true); // Trigger closing animation
  };

  const handleClose = () => {
    setIsClosing(true); // Trigger closing animation
  };

  // Handle the closing animation and call onClose when done
  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        onClose(); // Call the onClose prop after the animation completes
        setIsClosing(false); // Reset the closing state
      }, 300); // Match the animation duration (0.3s)
      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose]);

  // Render the modal only if it's open or in the process of closing
  if (!isOpen && !isClosing) return null;

  return (
    <div className={`notifs-modal ${isClosing ? 'closing' : ''}`}>
      <div className="notifs-header">
        <h3>Notifications</h3>
        <button className="notifs-close" onClick={handleClose}>
          ✕
        </button>
      </div>
      <div className="notifs-body">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div key={notif.id} className="notif-item">
              <p>{notif.message}</p>
              <span>{notif.time}</span>
            </div>
          ))
        ) : (
          <p>No new notifications.</p>
        )}
      </div>
      <div className="notifs-footer">
        <button className="notifs-view-all" onClick={handleViewAll}>
          View All
        </button>
      </div>
    </div>
  );
}

export default Notifs;