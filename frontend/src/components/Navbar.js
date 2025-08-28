import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ college, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/dashboard" className="navbar-brand">
          📚 Timetable Manager
        </Link>
        
        <ul className="navbar-nav">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/branches">Branches</Link></li>
          <li><Link to="/teachers">Teachers</Link></li>
          <li><Link to="/subjects">Subjects</Link></li>
          <li><Link to="/timetable-generator">Generate Timetable</Link></li>
          <li>
            <span style={{ color: '#ccc', marginRight: '15px' }}>
              {college?.name}
            </span>
            <button 
              onClick={onLogout}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
