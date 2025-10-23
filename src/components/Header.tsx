import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Change to white after 50px scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        {/* Logo + Tagline Container */}
        <div className="logo-container">
          <div className="logo-content">
            <h1 className="logo">Secmondo</h1>
            <span className="tagline">We make dreams secure.</span>
          </div>
        </div>

        <nav className="nav">
          <button onClick={() => handleNavigation('/')} className="nav-link">Home</button>
          <button onClick={() => handleNavigation('/about')} className="nav-link">About</button>
          <button onClick={() => handleNavigation('/contact')} className="nav-link">Contact</button>
          <button onClick={() => handleNavigation('/quote')} className="nav-link nav-link-cta">GET QUOTE</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
