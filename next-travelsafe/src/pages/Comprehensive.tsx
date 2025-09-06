import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Comprehensive.css';

const Comprehensive: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="comprehensive">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="animated-pattern"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <span className="hero-badge">Comprehensive Coverage</span>
              <h1>Extended Travel, <span className="highlight">Complete Protection</span></h1>
              <p className="hero-subtitle">
                Perfect for gap years, working holidays, and digital nomads. Get comprehensive coverage 
                for trips up to 15 months with our most extensive travel insurance policy.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">15</div>
                  <div className="stat-label">Months coverage</div>
                </div>
                <div className="stat">
                  <div className="stat-number">€10M</div>
                  <div className="stat-label">Medical cover</div>
                </div>
                <div className="stat">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Adventure sports</div>
                </div>
              </div>
              <div className="hero-actions">
                <Link to="/quote" className="btn-primary">Get Quote Now</Link>
                <a href="#features" className="btn-secondary">Explore Features</a>
              </div>
            </div>
            <div className="hero-visual">
              <div className="coverage-card">
                <h3>🌍 Extended Coverage</h3>
                <ul>
                  <li>🏥 Up to €10M medical cover</li>
                  <li>⛷️ Adventure sports included</li>
                  <li>💼 Business equipment protection</li>
                  <li>🎒 Enhanced baggage cover</li>
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
              <div className="feature-icon">📅</div>
              <h3>Up to 15 Months</h3>
              <p>Extended coverage for long-term travel and working holidays</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🏔️</div>
              <h3>Adventure Sports</h3>
              <p>50+ adventure sports covered as standard</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💻</div>
              <h3>Digital Nomad Ready</h3>
              <p>Business equipment and remote work protection</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎓</div>
              <h3>Study & Work</h3>
              <p>Perfect for gap years and working holidays</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          {/* Overview Section */}
          <section id="overview" className="content-section">
            <h2>Comprehensive Single Trip Insurance</h2>
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Who Is It For?</h3>
                <ul>
                  <li>Gap year travelers</li>
                  <li>Digital nomads</li>
                  <li>Students studying abroad</li>
                  <li>Working holiday makers</li>
                  <li>Long-term adventurers</li>
                </ul>
              </div>
              <div className="overview-card">
                <h3>Key Advantages</h3>
                <ul>
                  <li>Up to 15 months coverage</li>
                  <li>Enhanced medical protection</li>
                  <li>Adventure sports included</li>
                  <li>Business equipment cover</li>
                  <li>Worldwide destinations</li>
                </ul>
              </div>
              <div className="overview-card">
                <h3>What Makes It Special</h3>
                <ul>
                  <li>Most extensive coverage available</li>
                  <li>Specialized digital nomad benefits</li>
                  <li>Enhanced personal liability</li>
                  <li>Extended baggage protection</li>
                  <li>24/7 global assistance</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Benefits Comparison */}
          <section className="benefits-comparison">
            <h2>Coverage Comparison</h2>
            <div className="comparison-table">
              <div className="plan-column">
                <div className="plan-header">
                  <h3>Regular Stay</h3>
                  <div className="duration">Up to 90 days</div>
                </div>
                <ul className="plan-features">
                  <li>Basic medical cover</li>
                  <li>Standard baggage protection</li>
                  <li>Trip cancellation</li>
                  <li>Personal liability</li>
                </ul>
                <Link to="/regular-stay" className="plan-btn secondary">View Details</Link>
              </div>
              <div className="plan-column">
                <div className="plan-header">
                  <h3>Annual Multi-Trip</h3>
                  <div className="duration">120 days per trip</div>
                </div>
                <ul className="plan-features">
                  <li>Unlimited trips</li>
                  <li>Enhanced medical cover</li>
                  <li>Cruise & winter sports</li>
                  <li>Worldwide coverage</li>
                </ul>
                <Link to="/annual-multi-trip" className="plan-btn secondary">View Details</Link>
              </div>
              <div className="plan-column featured">
                <div className="plan-header">
                  <h3>Comprehensive</h3>
                  <div className="duration">Up to 15 months</div>
                  <span className="best-badge">Most Complete</span>
                </div>
                <ul className="plan-features">
                  <li>✅ Maximum medical cover</li>
                  <li>✅ Adventure sports included</li>
                  <li>✅ Business equipment</li>
                  <li>✅ Extended protection</li>
                </ul>
                <Link to="/quote" className="plan-btn">Get Quote</Link>
              </div>
            </div>
          </section>

          {/* Adventure Sports */}
          <section className="adventure-section">
            <h2>Adventure Sports Included</h2>
            <div className="adventure-grid">
              <div className="sport-category">
                <div className="sport-icon">🏔️</div>
                <h3>Mountain Sports</h3>
                <div className="sport-list">
                  <span>Skiing</span>
                  <span>Snowboarding</span>
                  <span>Mountaineering</span>
                  <span>Rock Climbing</span>
                  <span>Ice Climbing</span>
                </div>
              </div>
              <div className="sport-category">
                <div className="sport-icon">🌊</div>
                <h3>Water Sports</h3>
                <div className="sport-list">
                  <span>Scuba Diving</span>
                  <span>Surfing</span>
                  <span>White Water Rafting</span>
                  <span>Kayaking</span>
                  <span>Kitesurfing</span>
                </div>
              </div>
              <div className="sport-category">
                <div className="sport-icon">🪂</div>
                <h3>Extreme Sports</h3>
                <div className="sport-list">
                  <span>Bungee Jumping</span>
                  <span>Skydiving</span>
                  <span>Paragliding</span>
                  <span>Base Jumping</span>
                  <span>Hang Gliding</span>
                </div>
              </div>
              <div className="sport-category">
                <div className="sport-icon">🚴</div>
                <h3>Adventure Travel</h3>
                <div className="sport-list">
                  <span>Mountain Biking</span>
                  <span>Trekking</span>
                  <span>Safari Tours</span>
                  <span>Wilderness Hiking</span>
                  <span>Expedition Travel</span>
                </div>
              </div>
            </div>
          </section>

          {/* Special Benefits */}
          <section className="special-benefits">
            <h2>Digital Nomad & Extended Travel Benefits</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">💻</div>
                <h3>Business Equipment</h3>
                <p>Laptop, camera, and professional equipment coverage up to €5,000</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🏠</div>
                <h3>Temporary Accommodation</h3>
                <p>Extended stay coverage if your trip is prolonged due to covered reasons</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">📚</div>
                <h3>Study Materials</h3>
                <p>Educational materials and course fee protection for study abroad</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🌐</div>
                <h3>Global Communication</h3>
                <p>Emergency communication costs and satellite phone rental coverage</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">⚖️</div>
                <h3>Enhanced Liability</h3>
                <p>Up to €5M personal liability cover for extended stays</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🚨</div>
                <h3>Emergency Evacuation</h3>
                <p>Political evacuation and natural disaster emergency transport</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <div className="container">
              <div className="cta-content">
                <h2>Ready for Your Extended Adventure?</h2>
                <p>Get comprehensive coverage for your long-term travel plans with our most extensive policy.</p>
                <div className="cta-buttons">
                  <Link to="/quote" className="btn-primary">Get Quote Now</Link>
                  <Link to="/contact" className="btn-secondary">Expert Advice</Link>
                </div>
                <div className="trust-badges">
                  <div className="trust-item">
                    <span className="trust-icon">🛡️</span>
                    <span>Comprehensive Protection</span>
                  </div>
                  <div className="trust-item">
                    <span className="trust-icon">🌍</span>
                    <span>Worldwide Coverage</span>
                  </div>
                  <div className="trust-item">
                    <span className="trust-icon">⚡</span>
                    <span>Instant Policy</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Comprehensive;
