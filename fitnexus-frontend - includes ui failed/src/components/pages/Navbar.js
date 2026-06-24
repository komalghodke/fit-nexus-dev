import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Navbar.css';

const Navbar = () => (
<nav className="navbar">
  <div className="branding">
      <h1 className="logo">Fit-Nexus</h1>
      <h3 className="main-title">– The Wellness Hub</h3>
      <p className="tagline">The Wellness Hub</p>
  </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/tracker">Dashboard</Link></li>
        <li><Link to="/PolicyPage">T&C</Link></li>
      </ul>
  </nav>
);

export default Navbar;