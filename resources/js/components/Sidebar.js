import React from "react";
import { NavLink } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaChalkboardTeacher, 
  FaGraduationCap, 
  FaCalendarAlt, 
  FaBook, 
  FaClipboardList, 
  FaCogs 
} from "react-icons/fa";
import "../../sass/components/Sidebar.scss"; 

const Navigation = ({ isOpen }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Sidebar content */}
      <div className="logo">
        <div className="logo-img">
          <img
            src={require("../../assets/images/Dashboard_Logo.svg").default}
            alt="Dashboard Logo"
            className="logo-svg"
          />
        </div>
      </div>

      {/* Line separator below the logo */}
      <div className="line-separator"></div>

      {/* Navigation links */}
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink to="/dashboard" className="nav-link" activeClassName="active">
            <FaTachometerAlt className="nav-icon" /> Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/users" className="nav-link" activeClassName="active">
            <FaUsers className="nav-icon" /> Users
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/student-is" className="nav-link" activeClassName="active">
            <FaChalkboardTeacher className="nav-icon" /> Student IS
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/faculty-is" className="nav-link" activeClassName="active">
            <FaGraduationCap className="nav-icon" /> Faculty IS
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/class-scheduling" className="nav-link" activeClassName="active">
            <FaCalendarAlt className="nav-icon" /> Class Scheduling
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/academic-programs" className="nav-link" activeClassName="active">
            <FaBook className="nav-icon" /> Academic Programs
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/subject-enlistment" className="nav-link" activeClassName="active">
            <FaClipboardList className="nav-icon" /> Subject Enlistment
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/enlistment-manager" className="nav-link" activeClassName="active">
            <FaClipboardList className="nav-icon" /> Enlistment Manager
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/classroom-manager" className="nav-link" activeClassName="active">
            <FaChalkboardTeacher className="nav-icon" /> Classroom Manager
          </NavLink>
        </li>
      </ul>

      {/* Line separator above the System Settings */}
      <div className="line-separator system-settings-separator"></div>

      {/* System Settings */}
      <ul className="nav-list">
        <li className="nav-item system-settings">
          <NavLink to="/system-settings" className="nav-link" activeClassName="active">
            <FaCogs className="nav-icon" /> System Settings
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
