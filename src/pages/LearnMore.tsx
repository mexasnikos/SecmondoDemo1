"use client";
import React, { useEffect } from 'react';

const LearnMore: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-white py-12 px-6 sm:py-16 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Learn More About Travel Insurance
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-600">
            Protect Your Trip, Protect Your Peace of Mind
          </h2>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Intro Section */}
          <section className="space-y-6">
            <p className="text-lg leading-relaxed text-gray-600">
              Travel is exciting—but it's also unpredictable. Whether you're exploring new cities, 
              relaxing on a beach, or attending an important business event, unexpected issues can 
              turn your plans upside down. That's where travel insurance comes in.
            </p>
            
            <p className="text-lg leading-relaxed text-gray-600">
              In a world where spontaneity and uncertainty coexist, preparedness becomes a luxury. 
              Travel insurance is not just a policy — it's the invisible infrastructure that supports 
              seamless global living.
            </p>
            
            <p className="text-lg leading-relaxed text-gray-600">
              It's not just about risk—it's about reassurance. Travel insurance is designed to protect 
              your investment and your well-being, giving you the freedom to focus on the experience, 
              not the "what-ifs."
            </p>
          </section>

          {/* Coverage Section */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Does Travel Insurance Cover?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Here's a breakdown of the key coverages and why they matter:
            </p>

            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-lg border-l-4 border-blue-600 hover:bg-blue-50 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Trip Cancellation or Interruption
                </h3>
                <p className="text-gray-700">
                  If you have to cancel or cut your trip short due to illness, family emergency, 
                  or unforeseen events, you can be reimbursed for prepaid, non-refundable expenses 
                  like flights and hotels.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg border-l-4 border-orange-600 hover:bg-orange-50 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Emergency Medical Expenses
                </h3>
                <p className="text-gray-700">
                  Medical care abroad can be costly. This coverage helps pay for doctor visits, 
                  hospital stays, and even emergency evacuation—crucial if your regular health 
                  insurance doesn't cover you overseas.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg border-l-4 border-purple-600 hover:bg-purple-50 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Lost, Stolen, or Delayed Baggage
                </h3>
                <p className="text-gray-700">
                  If your luggage goes missing or is delayed, you'll be compensated for essentials 
                  and replacement items, so your trip isn't disrupted.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg border-l-4 border-green-600 hover:bg-green-50 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Travel Delays
                </h3>
                <p className="text-gray-700">
                  Flight delayed or canceled? This coverage can reimburse you for meals, 
                  accommodations, and alternative transportation while you wait.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg border-l-4 border-red-600 hover:bg-red-50 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  24/7 Travel Assistance Services
                </h3>
                <p className="text-gray-700">
                  From helping you find medical care to replacing a lost passport, dedicated 
                  support is available anytime, anywhere in the world.
                </p>
              </div>
            </div>
          </section>

          {/* Conclusion Section */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 md:p-10 rounded-xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Travel Smart. Travel Insured.
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              The right travel insurance plan offers more than just financial protection—it offers 
              peace of mind. Whether you're traveling for leisure, adventure, or business, knowing 
              you're covered lets you enjoy every moment with confidence.
            </p>
            <p className="text-lg text-gray-600">
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
