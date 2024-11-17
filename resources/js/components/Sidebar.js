import React from "react";
import { NavLink } from "react-router-dom";
import "../../sass/components/Sidebar.scss";

const Sidebar = ({ isOpen }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Sidebar content */}
      <div className="logo">
        <h2>Logo</h2>
      </div>
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink
            to="/page1"
            className="nav-link"
            activeClassName="active"
          >
            Page 1
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/page2"
            className="nav-link"
            activeClassName="active"
          >
            Page 2
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/page3"
            className="nav-link"
            activeClassName="active"
          >
            Page 3
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/page4"
            className="nav-link"
            activeClassName="active"
          >
            Page 4
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/page5"
            className="nav-link"
            activeClassName="active"
          >
            Page 5
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/page6"
            className="nav-link"
            activeClassName="active"
          >
            Page 6
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/page7"
            className="nav-link"
            activeClassName="active"
          >
            Page 7
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/page8"
            className="nav-link"
            activeClassName="active"
          >
            Page 8
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
