import React from "react";
import { Link } from "react-router-dom";

export default function Navs() {
  return (
    <nav>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        <li>
          <Link to="/dashboard">Dashboard</Link> {/* Navigate to Dashboard */}
        </li>
        <li>
          <Link to="/users">Users</Link> {/* Navigate to Users */}
        </li>
        <li>
          <Link to="/student-is">Student IS</Link> {/* Navigate to Student IS */}
        </li>
        <li>
          <Link to="/faculty-is">Faculty IS</Link> {/* Navigate to Faculty IS */}
        </li>
        <li>
          <Link to="/class-scheduling">Class Scheduling</Link> {/* Navigate to Class Scheduling */}
        </li>
        <li>
          <Link to="/academic-programs">Academic Programs</Link> {/* Navigate to Academic Programs */}
        </li>
        <li>
          <Link to="/subject-enlistment">Subject Enlistment</Link> {/* Navigate to Subject Enlistment */}
        </li>
        <li>
          <Link to="/enlistment-manager">Enlistment Manager</Link> {/* Navigate to Enlistment Manager */}
        </li>
        <li>
          <Link to="/classroom-manager">Classroom Manager</Link> {/* Navigate to Classroom Manager */}
        </li>
        <li>
          <Link to="/system-settings">System Settings</Link> {/* Navigate to System Settings */}
        </li>
      </ul>
    </nav>
  );
}
