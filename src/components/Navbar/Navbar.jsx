import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Content Manager</h1>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink 
            to="/form" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <span className="nav-icon">📝</span>
            Form
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/upload" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <span className="nav-icon">📤</span>
            Upload
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

