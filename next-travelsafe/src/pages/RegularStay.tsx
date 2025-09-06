import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RegularStay.css';

// Export type for TypeScript module resolution
export type RegularStayComponent = React.FC;

const RegularStay: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="regular-stay-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="page-title">Regular Single Trip Insurance</h1>
          <p className="page-subtitle">
            Essential travel protection for single trips up to 60 days. 
            Affordable coverage with comprehensive medical protection.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">€5M</span>
              <span className="stat-label">Medical Cover</span>
            </div>
            <div className="stat">
              <span className="stat-value">60 Days</span>
              <span className="stat-label">Max Duration</span>
            </div>
            <div className="stat">
              <span className="stat-value">84 Years</span>
              <span className="stat-label">Max Age</span>
            </div>
          </div>
          <div className="hero-actions">
            <Link to="/quote" className="btn btn-primary">Get Quote</Link>
            <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature">
              <h3>Medical Coverage</h3>
              <p>Up to €5,000,000 emergency medical expenses worldwide</p>
            </div>
            <div className="feature">
              <h3>Repatriation</h3>
              <p>Emergency medical repatriation to home country</p>
            </div>
            <div className="feature">
              <h3>Personal Liability</h3>
              <p>€2,500,000 coverage for accidental injury to others</p>
            </div>
            <div className="feature">
              <h3>Trip Protection</h3>
              <p>Coverage for trip delays, cancellation, and lost baggage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Details */}
      <section className="coverage">
        <div className="container">
          <h2 className="section-title">Coverage Details</h2>
          <div className="coverage-grid">
            <div className="coverage-item">
              <h4>Medical Expenses</h4>
              <p>€5,000,000</p>
            </div>
            <div className="coverage-item">
              <h4>Repatriation</h4>
              <p>Unlimited</p>
            </div>
            <div className="coverage-item">
              <h4>Personal Liability</h4>
              <p>€2,500,000</p>
            </div>
            <div className="coverage-item">
              <h4>Personal Effects</h4>
              <p>€2,500</p>
            </div>
            <div className="coverage-item">
              <h4>Trip Cancellation</h4>
              <p>€10,000</p>
            </div>
            <div className="coverage-item">
              <h4>Trip Delay</h4>
              <p>€500</p>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="eligibility">
        <div className="container">
          <h2 className="section-title">Eligibility Requirements</h2>
          <div className="eligibility-content">
            <div className="eligibility-item">
              <h4>Age Limit</h4>
              <p>Up to 84 years old</p>
            </div>
            <div className="eligibility-item">
              <h4>Trip Duration</h4>
              <p>Maximum 60 days</p>
            </div>
            <div className="eligibility-item">
              <h4>Residence</h4>
              <p>EU/EEA residents only</p>
            </div>
            <div className="eligibility-item">
              <h4>Health</h4>
              <p>No pre-existing conditions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Get Protected?</h2>
          <p>Get your instant quote and travel with confidence</p>
          <Link to="/quote" className="btn btn-large">Get Your Quote Now</Link>
        </div>
      </section>
    </div>
  );
};

export default RegularStay;
