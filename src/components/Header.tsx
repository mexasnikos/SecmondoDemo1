import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo" onClick={handleHomeClick}>
          <h1>TravelSafe</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link" onClick={handleHomeClick}>Home</Link>
          <Link to="/quote" className="nav-link">Get Quote</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
