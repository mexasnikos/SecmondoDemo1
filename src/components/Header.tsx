import React from 'react';
import Link from 'next/link';
import './Header.css';

const Header: React.FC = () => {
  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

 return (
  <header className="header">
    <div className="container">
      {/* Logo + Tagline Container */}
      <div className="logo-container">
        <h1 className="logo">Secmondo</h1>
        <span className="tagline">We make dreams secure.</span>
      </div>

      <nav className="nav">
  <Link href="/" className="nav-link">Home</Link>
  <Link href="/quote" className="nav-link">Get Quote</Link>
  <Link href="/about" className="nav-link">About</Link>
  <Link href="/contact" className="nav-link">Contact</Link>
      </nav>
    </div>
  </header>
);
};

export default Header;
