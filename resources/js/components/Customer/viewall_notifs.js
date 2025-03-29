import React, { useState } from 'react';
import './../../../sass/components/viewall_notifs.scss';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Customer/topvar_notlogin'; // Importing your Navbar
import Footer from '../footer/footer'; // Importing your Footer
import { IconArrowLeft, IconBellFilled, IconTrash, IconLayersIntersect } from '@tabler/icons-react'; // Added IconLayersIntersect

// Sample notifications data (replace with your actual data source, e.g., an API)
const initialNotifications = [
  { id: 1, message: 'Your order #1234 has been shipped!', time: '2 hours ago' },
  { id: 2, message: 'New product added to the store.', time: '5 hours ago' },
  { id: 3, message: 'Your payment was successful.', time: '1 day ago' },
  { id: 4, message: 'Your order #1233 is out for delivery.', time: '2 days ago' },
  { id: 5, message: 'Welcome to our store!', time: '3 days ago' },
];

const ViewAllNotifs = () => {
  const navigate = useNavigate(); // For navigating back
  const [notifications, setNotifications] = useState(initialNotifications); // State for notifications
  const [selectedNotifs, setSelectedNotifs] = useState(new Set()); // State for selected notifications
  const [isAllSelected, setIsAllSelected] = useState(false); // State for "Select All" checkbox

  // Handle "Select All" (used for both checkbox on desktop and button on mobile)
  const handleSelectAll = () => {
    const newIsAllSelected = !isAllSelected; // Toggle the state
    setIsAllSelected(newIsAllSelected);
    if (newIsAllSelected) {
      const allNotifIds = new Set(notifications.map((notif) => notif.id));
      setSelectedNotifs(allNotifIds);
    } else {
      setSelectedNotifs(new Set());
    }
  };

  // Handle individual notification selection
  const handleNotifSelect = (notifId) => (e) => {
    const isChecked = e.target.checked;
    const newSelectedNotifs = new Set(selectedNotifs);
    if (isChecked) {
      newSelectedNotifs.add(notifId);
    } else {
      newSelectedNotifs.delete(notifId);
    }
    setSelectedNotifs(newSelectedNotifs);
    setIsAllSelected(newSelectedNotifs.size === notifications.length);
  };

  // Handle removal of selected notifications
  const handleRemoveSelected = () => {
    if (selectedNotifs.size === 0) return; // Do nothing if no notifications are selected
    const remainingNotifs = notifications.filter((notif) => !selectedNotifs.has(notif.id));
    setNotifications(remainingNotifs);
    setSelectedNotifs(new Set()); // Clear selection
    setIsAllSelected(false); // Uncheck "Select All"
    console.log('Removed notifications:', Array.from(selectedNotifs));
  };

  return (
    <div className="view-all-notifs-wrapper">
      <Navbar /> {/* Adding the Navbar */}
      <div className="view-all-notifs">
        {/* Header */}
        <div className="notifs-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <IconArrowLeft className="back-icon" /> Back
          </button>
          <h1>Notifications</h1>
          {/* On desktop, the actions will be here */}
          {notifications.length > 0 && (
            <div className="notifs-actions notifs-actions-desktop">
              <div className="select-all">
                {/* Desktop: Checkbox with label */}
                <label className="select-all-desktop">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                  Select All
                </label>
                {/* Mobile: Button with icon (hidden on desktop) */}
                <button className="select-all-mobile" onClick={handleSelectAll}>
                  <IconLayersIntersect className="select-icon" />
                  {isAllSelected ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <button
                className="remove-selected-btn"
                onClick={handleRemoveSelected}
                disabled={selectedNotifs.size === 0}
              >
                <IconTrash className="trash-icon" /> Remove Selected
              </button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="notifs-list">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div key={notif.id} className="notif-item">
                <input
                  type="checkbox"
                  className="notif-checkbox"
                  checked={selectedNotifs.has(notif.id)}
                  onChange={handleNotifSelect(notif.id)}
                />
                <IconBellFilled className="notif-icon" />
                <div className="notif-content">
                  <p className="notif-message">{notif.message}</p>
                  <span className="notif-time">{notif.time}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-notifs">No notifications available.</p>
          )}
        </div>

        {/* On mobile, the actions will be here */}
        {notifications.length > 0 && (
          <div className="notifs-actions notifs-actions-mobile">
            <div className="select-all">
              {/* Desktop: Checkbox with label (hidden on mobile) */}
              <label className="select-all-desktop">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
                Select All
              </label>
              {/* Mobile: Button with icon */}
              <button className="select-all-mobile" onClick={handleSelectAll}>
                <IconLayersIntersect className="select-icon" />
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <button
              className="remove-selected-btn"
              onClick={handleRemoveSelected}
              disabled={selectedNotifs.size === 0}
            >
              <IconTrash className="trash-icon" /> Remove Selected
            </button>
          </div>
        )}
      </div>
      <Footer /> {/* Adding the Footer */}
    </div>
  );
};

export default ViewAllNotifs;