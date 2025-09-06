"use client";
import React, { useEffect } from 'react';
import './About.css';

const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="about-page">
      <div className="container">
        <div className="about-header">
          <h1>About TravelSafe</h1>
          <p>Your trusted partner for travel insurance worldwide</p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              At TravelSafe, we believe that travel should be about creating memories, 
              not worrying about what might go wrong. Since 2020, we've been providing 
              comprehensive travel insurance solutions to millions of travelers worldwide.
            </p>
          </section>

          <section className="about-section">
            <h2>Why Choose Us?</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <h3>🏆 Award-Winning Service</h3>
                <p>Recognized for excellence in customer service and claims processing</p>
              </div>
              <div className="benefit-item">
                <h3>🌍 Global Coverage</h3>
                <p>Protection in over 200 countries and territories worldwide</p>
              </div>
              <div className="benefit-item">
                <h3>⚡ Fast Claims</h3>
                <p>Average claim processing time of just 48 hours</p>
              </div>
              <div className="benefit-item">
                <h3>💰 Competitive Rates</h3>
                <p>Best value coverage with transparent pricing</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Our Coverage</h2>
            <ul className="coverage-list">
              <li>Emergency medical expenses up to $1,000,000</li>
              <li>Emergency evacuation and repatriation</li>
              <li>Trip cancellation and interruption</li>
              <li>Baggage loss and delay protection</li>
              <li>Personal liability coverage</li>
              <li>24/7 emergency assistance</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Our Team</h2>
            <p>
              Our experienced team of travel insurance experts is dedicated to providing 
              you with the best possible service. With decades of combined experience in 
              the insurance industry, we understand what travelers need and deliver 
              solutions that work.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
