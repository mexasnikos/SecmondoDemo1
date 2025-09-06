import React, { useEffect } from 'react';
import './LearnMore.css';

const LearnMore: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="learn-more-page">
      <div className="container">
        <div className="learn-more-header">
          <h1>Learn More About Travel Insurance</h1>
          <h2 className="subtitle">Protect Your Trip, Protect Your Peace of Mind</h2>
        </div>

        <div className="learn-more-content">
          <section className="intro-section">
            <p>
              Travel is exciting—but it's also unpredictable. Whether you're exploring new cities, 
              relaxing on a beach, or attending an important business event, unexpected issues can 
              turn your plans upside down. That's where travel insurance comes in.
            </p>
            
            <p>
              In a world where spontaneity and uncertainty coexist, preparedness becomes a luxury. 
              Travel insurance is not just a policy — it's the invisible infrastructure that supports 
              seamless global living.
            </p>
            
            <p>
              It's not just about risk—it's about reassurance. Travel insurance is designed to protect 
              your investment and your well-being, giving you the freedom to focus on the experience, 
              not the "what-ifs."
            </p>
          </section>

          <section className="coverage-section">
            <h2>What Does Travel Insurance Cover?</h2>
            <p>Here's a breakdown of the key coverages and why they matter:</p>

            <div className="coverage-item">
              <h3>Trip Cancellation or Interruption</h3>
              <p>
                If you have to cancel or cut your trip short due to illness, family emergency, 
                or unforeseen events, you can be reimbursed for prepaid, non-refundable expenses 
                like flights and hotels.
              </p>
            </div>

            <div className="coverage-item">
              <h3>Emergency Medical Expenses</h3>
              <p>
                Medical care abroad can be costly. This coverage helps pay for doctor visits, 
                hospital stays, and even emergency evacuation—crucial if your regular health 
                insurance doesn't cover you overseas.
              </p>
            </div>

            <div className="coverage-item">
              <h3>Lost, Stolen, or Delayed Baggage</h3>
              <p>
                If your luggage goes missing or is delayed, you'll be compensated for essentials 
                and replacement items, so your trip isn't disrupted.
              </p>
            </div>

            <div className="coverage-item">
              <h3>Travel Delays</h3>
              <p>
                Flight delayed or canceled? This coverage can reimburse you for meals, 
                accommodations, and alternative transportation while you wait.
              </p>
            </div>

            <div className="coverage-item">
              <h3>24/7 Travel Assistance Services</h3>
              <p>
                From helping you find medical care to replacing a lost passport, dedicated 
                support is available anytime, anywhere in the world.
              </p>
            </div>
          </section>

          <section className="conclusion-section">
            <h2>Travel Smart. Travel Insured.</h2>
            <p>
              The right travel insurance plan offers more than just financial protection—it offers 
              peace of mind. Whether you're traveling for leisure, adventure, or business, knowing 
              you're covered lets you enjoy every moment with confidence.
            </p>
            <p>
              Learn more about how to choose the best policy for your journey, what coverage fits 
              your needs, and how to travel worry-free.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;
