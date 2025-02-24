import React from 'react';
import Sidebar from './sidebar'; 


export default function Roles() {
  return (
    <div className="app">
      <Sidebar activeItem="Roles" /> {/* Use the Sidebar component with "Roles" as active */}
      <div className="dashboard">
        <div className="roles-content">
          <h2>Roles Management</h2>
          {/* Add your roles-specific content here */}
          <p>This is the Roles page content.</p>
        </div>
      </div>
    </div>
  );
}