import React from 'react';
import './Footer.css';

// Declare Cookiebot for TypeScript
declare global {
  interface Window {
    Cookiebot?: {
      show: () => void;
    };
  }
}

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>TravelSafe</h3>
            <p>Your trusted partner for travel insurance worldwide.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/quote">Get Quote</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="tel:+306974907500">+30 6974907500</a></li>
              <li><a href="mailto:mexas.nikos@gmail.com">mexas.nikos@gmail.com</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-media">
              <a href="https://facebook.com/travelsafe" target="_blank" rel="noopener noreferrer" className="social-link">
                📘 Facebook
              </a>
              <a href="https://twitter.com/travelsafe" target="_blank" rel="noopener noreferrer" className="social-link">
                🐦 Twitter
              </a>
              <a href="https://instagram.com/travelsafe" target="_blank" rel="noopener noreferrer" className="social-link">
                📷 Instagram
              </a>
              <a href="https://linkedin.com/company/travelsafe" target="_blank" rel="noopener noreferrer" className="social-link">
                💼 LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 TravelSafe. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <span>|</span>
            <button 
              type="button" 
              className="cookie-settings-btn"
              onClick={() => {
                if (window.Cookiebot) {
                  window.Cookiebot.show();
                }
              }}
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
