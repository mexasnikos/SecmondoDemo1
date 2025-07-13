import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Comprehensive.css';

const Comprehensive: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="comprehensive">
      <div className="container">
        <div className="page-header">
          <h1>COMPREHENSIVE Single Trip Insurance</h1>
          <p className="page-subtitle">Our most extensive coverage for extended trips up to 15 months. Ideal for gap years, working holidays, and long-term travel.</p>
          <div className="key-points">
            <ul>
              <li>Trip durations up to 15 months</li>
              <li>Enhanced medical coverage</li>
              <li>Adventure sports coverage included</li>
              <li>Business equipment protection</li>
              <li>Extended personal liability</li>
              <li>Perfect for digital nomads and long-term adventurers</li>
            </ul>
          </div>
          <Link to="/quote" className="btn btn-primary btn-large">Get a Quote</Link>
        </div>

        <div className="content-sections">
          <nav className="section-nav">
            <ul>
              <li><a href="#overview">Overview</a></li>
              <li><a href="#benefits">Key Benefits</a></li>
              <li><a href="#coverage">Coverage Details</a></li>
              <li><a href="#adventure">Adventure Sports</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </nav>

          <section id="overview" className="content-section">
            <h2>What is Comprehensive Single Trip Insurance?</h2>
            <p>
              Our Comprehensive Single Trip Insurance is designed for travelers embarking on extended journeys 
              lasting up to 15 months. Whether you're taking a gap year, working holiday, studying abroad, 
              or pursuing long-term travel adventures, this policy provides the most extensive coverage available.
            </p>
            <p>
              This comprehensive policy goes beyond basic travel insurance to include specialized coverage for 
              digital nomads, adventure enthusiasts, and anyone requiring enhanced protection during extended 
              periods away from home.
            </p>
            <div className="highlight-box">
              <h3>🎒 Perfect for Long-Term Travel</h3>
              <p>Extended coverage up to 15 months with enhanced benefits for gap years, working holidays, and digital nomad lifestyles!</p>
            </div>
          </section>

          <section id="benefits" className="content-section">
            <h2>Key Benefits</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">🕒</div>
                <h3>Extended Duration</h3>
                <p>Coverage for trips up to 15 months, perfect for gap years and extended travel adventures.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🏥</div>
                <h3>Enhanced Medical</h3>
                <p>Higher medical coverage limits with specialized care for long-term travelers.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🏄</div>
                <h3>Adventure Sports</h3>
                <p>Comprehensive coverage for adventure activities and extreme sports included.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">💻</div>
                <h3>Business Equipment</h3>
                <p>Protection for laptops, cameras, and professional equipment for digital nomads.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🌍</div>
                <h3>Worldwide Coverage</h3>
                <p>Global coverage including high-risk destinations and remote locations.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🏠</div>
                <h3>Personal Liability</h3>
                <p>Extended personal liability coverage for long-term stays and rental properties.</p>
              </div>
            </div>
          </section>

          <section id="coverage" className="content-section">
            <h2>Coverage Details</h2>
            <div className="coverage-table">
              <div className="coverage-row">
                <div className="coverage-item">Emergency Medical Expenses</div>
                <div className="coverage-value">Up to €2,000,000</div>
              </div>
              <div className="coverage-row">
                <div className="coverage-item">Emergency Repatriation</div>
                <div className="coverage-value">Up to €2,000,000</div>
              </div>
              <div className="coverage-row">
                <div className="coverage-item">Trip Cancellation</div>
                <div className="coverage-value">Up to €10,000</div>
              </div>
              <div className="coverage-row">
                <div className="coverage-item">Trip Curtailment</div>
                <div className="coverage-value">Up to €10,000</div>
              </div>
              <div className="coverage-row">
                <div className="coverage-item">Personal Baggage</div>
                <div className="coverage-value">Up to €3,000</div>
              </div>
              <div className="coverage-row">
                <div className="coverage-item">Business Equipment</div>
                <div className="coverage-value">Up to €2,000</div>
              </div>
              <div className="coverage-row">
                <div className="coverage-item">Personal Money</div>
                <div className="coverage-value">Up to €1,000</div>
              </div>
              <div className="coverage-row">
                <div className="coverage-item">Travel Delay</div>
                <div className="coverage-value">Up to €1,000</div>
              </div>
              <div className="coverage-row">
                <div className="coverage-item">Personal Liability</div>
                <div className="coverage-value">Up to €2,000,000</div>
              </div>
              <div className="coverage-row">
                <div className="coverage-item">Adventure Sports</div>
                <div className="coverage-value">Included</div>
              </div>
            </div>
          </section>

          <section id="adventure" className="content-section">
            <h2>Adventure Sports Coverage</h2>
            <p>
              Our Comprehensive policy includes extensive adventure sports coverage at no additional cost. 
              Whether you're planning to go bungee jumping in New Zealand, scuba diving in Thailand, 
              or trekking in the Himalayas, you're covered.
            </p>
            <div className="adventure-activities">
              <div className="activity-category">
                <h3>Water Sports</h3>
                <ul>
                  <li>Scuba Diving (up to 30m)</li>
                  <li>White Water Rafting</li>
                  <li>Surfing & Windsurfing</li>
                  <li>Jet Skiing</li>
                  <li>Parasailing</li>
                </ul>
              </div>
              <div className="activity-category">
                <h3>Mountain Activities</h3>
                <ul>
                  <li>Trekking & Hiking</li>
                  <li>Rock Climbing</li>
                  <li>Mountaineering</li>
                  <li>Zip Lining</li>
                  <li>Via Ferrata</li>
                </ul>
              </div>
              <div className="activity-category">
                <h3>Extreme Sports</h3>
                <ul>
                  <li>Bungee Jumping</li>
                  <li>Skydiving</li>
                  <li>Paragliding</li>
                  <li>Hot Air Ballooning</li>
                  <li>Canyoning</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="pricing" className="content-section">
            <h2>Pricing Information</h2>
            <p>
              Comprehensive Single Trip Insurance is competitively priced considering the extensive coverage 
              and extended duration. The cost depends on several factors:
            </p>
            <ul className="pricing-factors">
              <li>Trip duration (up to 15 months)</li>
              <li>Age of travelers</li>
              <li>Destination and geographical coverage</li>
              <li>Pre-existing medical conditions</li>
              <li>Adventure sports participation</li>
              <li>Business equipment value</li>
            </ul>
            <div className="price-highlight">
              <p><strong>Starting from €189</strong> (based on 1 adult aged up to 30 traveling in Europe for up to 30 days with basic coverage).</p>
            </div>
            <p>
              For extended trips and enhanced coverage, prices vary based on your specific needs. 
              Get an instant personalized quote using our online quote system.
            </p>
          </section>

          <section className="who-section">
            <h2>Who Is This For?</h2>
            <div className="who-grid">
              <div className="who-card">
                <div className="who-icon">🎓</div>
                <h3>Gap Year Students</h3>
                <p>Perfect for students taking extended breaks for travel and cultural experiences.</p>
              </div>
              <div className="who-card">
                <div className="who-icon">💼</div>
                <h3>Digital Nomads</h3>
                <p>Comprehensive coverage for remote workers traveling while maintaining their careers.</p>
              </div>
              <div className="who-card">
                <div className="who-icon">🏔️</div>
                <h3>Adventure Travelers</h3>
                <p>Extensive adventure sports coverage for thrill-seekers and outdoor enthusiasts.</p>
              </div>
              <div className="who-card">
                <div className="who-icon">🌏</div>
                <h3>Long-term Travelers</h3>
                <p>Extended coverage for those embarking on round-the-world trips or extended stays.</p>
              </div>
            </div>
          </section>

          <section className="cta-section">
            <div className="cta-content">
              <h2>Ready for Your Extended Adventure?</h2>
              <p>Get comprehensive coverage for your extended trip with our most extensive policy</p>
              <Link to="/quote" className="btn btn-primary btn-large">
                Get Your Comprehensive Quote
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Comprehensive;
