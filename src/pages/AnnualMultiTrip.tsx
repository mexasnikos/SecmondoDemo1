"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import './AnnualMultiTrip.css';

const AnnualMultiTrip: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="annual-multi-trip">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="animated-pattern"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <span className="hero-badge">Annual Multi-Trip</span>
              <h1>Unlimited Trips, <span className="highlight">One Policy</span></h1>
              <p className="hero-subtitle">
                Perfect for frequent travelers. Get comprehensive coverage for unlimited trips 
                throughout the year with our Annual Multi-Trip insurance.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">€99.34</div>
                  <div className="stat-label">Starting from</div>
                </div>
                <div className="stat">
                  <div className="stat-number">120</div>
                  <div className="stat-label">Days per trip</div>
                </div>
                <div className="stat">
                  <div className="stat-number">79</div>
                  <div className="stat-label">Max age</div>
                </div>
              </div>
              <div className="hero-actions">
                <Link href="/quote" className="btn-primary">Get Quote Now</Link>
                <a href="#features" className="btn-secondary">Learn More</a>
              </div>
            </div>
            <div className="hero-visual">
              <div className="coverage-card">
                <h3>✈️ Annual Coverage</h3>
                <ul>
                  <li>🌍 Worldwide destinations</li>
                  <li>🏥 Up to €8M medical cover</li>
                  <li>🧳 Baggage protection</li>
                  <li>🚢 FREE cruise cover</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="quick-features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🔄</div>
              <h3>Unlimited Trips</h3>
              <p>Take as many trips as you want throughout the year</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📅</div>
              <h3>120 Days Per Trip</h3>
              <p>Each trip can last up to 120 days</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🚢</div>
              <h3>FREE Cruise Cover</h3>
              <p>Cruise coverage included at no extra cost</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🏔️</div>
              <h3>Winter Sports</h3>
              <p>17 days winter sports cover included</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          {/* Overview Section */}
          <section id="overview" className="content-section">
            <h2>Annual Multi-Trip Insurance Overview</h2>
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Who Is It For?</h3>
                <ul>
                  <li>Frequent business travelers</li>
                  <li>Holiday enthusiasts</li>
                  <li>EU & EEA residents up to age 79</li>
                  <li>Those taking multiple trips per year</li>
                </ul>
              </div>
              <div className="overview-card">
                <h3>Key Features</h3>
                <ul>
                  <li>Unlimited trips for 12 months</li>
                  <li>Up to 120 days per trip</li>
                  <li>Worldwide coverage options</li>
                  <li>Family discounts available</li>
                </ul>
              </div>
              <div className="overview-card">
                <h3>What's Included</h3>
                <ul>
                  <li>Medical expenses up to €8M</li>
                  <li>Trip cancellation & curtailment</li>
                  <li>Baggage & personal effects</li>
                  <li>Personal liability cover</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="comparison-section">
            <h2>Choose Your Coverage Level</h2>
            <div className="comparison-table">
              <div className="plan-column">
                <div className="plan-header">
                  <h3>Europe</h3>
                  <div className="price">From €99.34</div>
                </div>
                <ul className="plan-features">
                  <li>✅ European countries</li>
                  <li>✅ Up to €8M medical</li>
                  <li>✅ 120 days per trip</li>
                  <li>✅ Cruise cover included</li>
                  <li>✅ Winter sports (17 days)</li>
                </ul>
                <Link href="/quote" className="plan-btn">Choose Europe</Link>
              </div>
              <div className="plan-column featured">
                <div className="plan-header">
                  <h3>Worldwide Excluding</h3>
                  <div className="price">From €189.67</div>
                  <span className="popular-badge">Most Popular</span>
                </div>
                <ul className="plan-features">
                  <li>✅ Global coverage (excl. USA, Canada, etc.)</li>
                  <li>✅ Up to €8M medical</li>
                  <li>✅ 120 days per trip</li>
                  <li>✅ Cruise cover included</li>
                  <li>✅ Winter sports (17 days)</li>
                </ul>
                <Link href="/quote" className="plan-btn">Choose Worldwide</Link>
              </div>
              <div className="plan-column">
                <div className="plan-header">
                  <h3>Worldwide All</h3>
                  <div className="price">From €379.34</div>
                </div>
                <ul className="plan-features">
                  <li>✅ Complete global coverage</li>
                  <li>✅ Includes USA, Canada, Australia</li>
                  <li>✅ Up to €8M medical</li>
                  <li>✅ 120 days per trip</li>
                  <li>✅ Premium destinations</li>
                </ul>
                <Link href="/quote" className="plan-btn">Choose Premium</Link>
              </div>
            </div>
          </section>

          {/* Special Offers */}
          <section className="offers-section">
            <h2>Special Offers & Discounts</h2>
            <div className="offers-grid">
              <div className="offer-card">
                <div className="offer-icon">👨‍👩‍👧‍👦</div>
                <h3>Family Discount</h3>
                <p>Children travel free with adult policies. Up to 4 children under 18 covered at no extra cost.</p>
                <span className="offer-value">Save up to €400</span>
              </div>
              <div className="offer-card">
                <div className="offer-icon">💑</div>
                <h3>Couple Savings</h3>
                <p>Special rates for couples traveling together. Both partners covered under one convenient policy.</p>
                <span className="offer-value">Save 15%</span>
              </div>
              <div className="offer-card">
                <div className="offer-icon">🎯</div>
                <h3>Group Bookings</h3>
                <p>Traveling with friends or colleagues? Get group discounts for 5 or more travelers.</p>
                <span className="offer-value">Save 20%</span>
              </div>
            </div>
          </section>

          {/* Policy Documents */}
          <section id="policy" className="content-section">
            <h2>Policy Wording</h2>
            <div className="policy-wording-content">
              <h3>Travel Insurance</h3>
              <p>
                Please read your Policy Wording carefully to ensure that it meets with your precise 
                requirements. View and download the relevant Policy Wording* from the links below. 
                If you purchased a Globelink policy previously while you were a UK RESIDENT, or you 
                need to view the Policy Wording we issue to UK Residents, please 
                <button className="uk-link" onClick={() => window.open('https://www.globelink.co.uk', '_blank')}> click here to visit our Globelink UK site</button>.
              </p>
              <p className="policy-note">
                *If you purchased your Travel Insurance policy prior to 1st October 2022, you can 
                view your policy wording by reviewing your Globelink Travel Insurance Purchase email, 
                or obtain a copy by contacting 
                <a href="mailto:globelink@globelink.eu" className="email-link"> globelink@globelink.eu</a> 
                with your name and address details.
              </p>

              <div className="policy-downloads">
                <div className="download-item">
                  <div className="download-info">
                    <h4>📄 Policy Wording for Policies issued to EU residents (living outside the UK) from 12th March 2025 onwards.</h4>
                  </div>
                  <a 
                    href="/Globelink_Wording_EU_V2_07.03.2025.pdf" 
                    download="Globelink_Wording_EU_V2_07.03.2025.pdf"
                    className="download-btn"
                  >
                    Download
                  </a>
                </div>

                <div className="download-item">
                  <div className="download-info">
                    <h4>📄 Policy Wording for Policies issued to EU residents (living outside the UK) from 29th November to 11th March 2025.</h4>
                  </div>
                  <a 
                    href="/Globelink_Wording_EU_V2_07.03.2025.pdf" 
                    download="Globelink_Wording_EU_Nov2024_Mar2025.pdf"
                    className="download-btn"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="benefits-section">
            <div className="container">
              <h2>Key Benefits</h2>
              <div className="benefits-grid">
                <div className="benefit-card">
                  <div className="benefit-icon">🏥</div>
                  <h3>Medical Expenses</h3>
                  <p>Up to €8,000,000 worldwide medical coverage for peace of mind</p>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon">✈️</div>
                  <h3>Cancellation</h3>
                  <p>Trip cancellation up to €8,000 per person</p>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon">🧳</div>
                  <h3>Baggage</h3>
                  <p>Baggage cover up to €2,500 including delayed baggage</p>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon">🏔️</div>
                  <h3>Winter Sports</h3>
                  <p>FREE winter sports cover included at no extra cost</p>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon">🚢</div>
                  <h3>Cruise Cover</h3>
                  <p>FREE cruise cover with cabin confinement benefits</p>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon">🌍</div>
                  <h3>Worldwide</h3>
                  <p>Coverage across Europe, Asia, Americas, and beyond</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <div className="container">
              <div className="cta-content">
                <h2>Ready to Travel with Confidence?</h2>
                <p>Get your Annual Multi-Trip insurance quote in minutes and enjoy unlimited trips with comprehensive coverage.</p>
                <div className="cta-buttons">
                  <Link href="/quote" className="btn-primary">Get Quote Now</Link>
                  <Link href="/contact" className="btn-secondary">Speak to Expert</Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AnnualMultiTrip;
