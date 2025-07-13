import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PolicyModal from '../components/PolicyModal';
import './Home.css';

const Home: React.FC = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    policyType: '',
    title: '',
    content: ''
  });

  const policyInfo = {
    'regular': {
      title: 'REGULAR Single Trip Insurance',
      content: 'Perfect for occasional travelers taking a single holiday. This comprehensive policy covers medical emergencies up to €1M, trip cancellation, delays, and lost baggage. Ideal for short to medium-term trips lasting up to 45 days. Includes 24/7 emergency assistance and covers pre-existing medical conditions with our medical screening.'
    },
    'annual': {
      title: 'ANNUAL MULTI-TRIP Travel Insurance',
      content: 'The ultimate solution for frequent travelers! Take unlimited trips throughout the year with continuous coverage. Each trip can last up to 45 days with our standard policy. Includes FREE 17-day Winter Sports coverage and covers all the same benefits as our single trip policies. Perfect for business travelers and vacation enthusiasts.'
    },
    'comprehensive': {
      title: 'COMPREHENSIVE Single Trip Insurance',
      content: 'Our most extensive coverage for extended trips up to 15 months. Ideal for gap years, working holidays, and long-term travel. Includes enhanced medical coverage, adventure sports coverage, business equipment protection, and extended personal liability. Perfect for digital nomads and long-term adventurers.'
    }
  };

  const openModal = (policyType: keyof typeof policyInfo) => {
    setModalState({
      isOpen: true,
      policyType,
      title: policyInfo[policyType].title,
      content: policyInfo[policyType].content
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      policyType: '',
      title: '',
      content: ''
    });
  };

  return (
    <>
      <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
            Travel Insurance <br />
            </h1>
            <p className="hero-subtitle">
              In a world spontaneity and uncertainty coexist,  
              preparedness becomes a luxury.
            </p>
            <div className="hero-buttons">
              <Link to="/quote" className="btn btn-primary">Get a Quote</Link>
              <Link to="/learn-more" className="btn btn-secondary">Learn More</Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-placeholder">
              🌍 Travel insurance isn't a safety net. It's a strategic layer of freedom.
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose TravelSafe?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏥</div>
              <h3>Medical Coverage</h3>
              <p>Up to €1M in emergency medical expenses and evacuation coverage worldwide.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📞</div>
              <h3>24/7 Assistance</h3>
              <p>Round-the-clock emergency assistance and support in multiple languages.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✈️</div>
              <h3>Trip Protection</h3>
              <p>Coverage for trip cancellation, delays, and lost baggage protection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Types Section */}
      <section className="insurance-types">
        <div className="container">
          <h2 className="section-title">Choose Your Coverage Policy</h2>
          <p className="section-subtitle">Choose the best policy according to your needs:</p>
          
          <div className="insurance-options">
            <div className="insurance-grid">
              <div className="insurance-card">
                <div className="insurance-icon">🛡️</div>
                <h3>REGULAR Single Trip Insurance</h3>
                <p>Regular stay policy is best if you only take one holiday or are only travelling to one destination.</p>
                <button className="more-info-btn" onClick={() => openModal('regular')}>More info</button>
              </div>
              <div className="insurance-card">
                <div className="insurance-icon">🌍</div>
                <h3>ANNUAL MULTI-TRIP Travel Insurance</h3>
                <p>Travelling more than once a year? Take as many holidays as you wish and be covered all year long! 17 days Winter Sports Cover FREE if you take out the 45 days policy.</p>
                <button className="more-info-btn" onClick={() => openModal('annual')}>More info</button>
              </div>
              <div className="insurance-card">
                <div className="insurance-icon">⭐</div>
                <h3>COMPREHENSIVE Single Trip Insurance</h3>
                <p>Offers the most benefits and extra options for trips up to 15 months.</p>
                <button className="more-info-btn" onClick={() => openModal('comprehensive')}>More info</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Saved me thousands when I needed emergency medical care in Thailand. 
                 The claim process was smooth and fast!"</p>
              <div className="testimonial-author">
                <strong>Sarah Johnson</strong>
                <span>Backpacker, Thailand</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Flight was cancelled, but TravelSafe covered all my additional expenses. 
                 Great peace of mind for business travel."</p>
              <div className="testimonial-author">
                <strong>Mike Chen</strong>
                <span>Business Traveler</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Easy to buy online and excellent customer service. 
                 Highly recommend for any international trip!"</p>
              <div className="testimonial-author">
                <strong>Emma Rodriguez</strong>
                <span>Family Vacation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Travel with Confidence?</h2>
          <p>Get a personalized quote in under 2 minutes</p>
          <Link to="/quote" className="btn btn-primary btn-large">
            Get Your Quote Now
          </Link>
        </div>
      </section>
      </div>

      <PolicyModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        policyType={modalState.policyType}
        title={modalState.title}
        content={modalState.content}
      />
    </>
  );
};

export default Home;
