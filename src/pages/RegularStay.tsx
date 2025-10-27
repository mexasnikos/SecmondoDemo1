import React, { useEffect } from 'react';

// Export type for TypeScript module resolution
export type RegularStayComponent = React.FC;

const RegularStay: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="font-sans line-height-normal text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Regular Single Trip Insurance
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Essential travel protection for single trips up to 60 days. 
            Affordable coverage with comprehensive medical protection.
          </p>
          <div className="flex justify-center flex-wrap gap-8 md:gap-12 mb-12">
            <div className="text-center">
              <span className="block text-3xl font-bold text-blue-600 mb-2">€5M</span>
              <span className="text-sm text-gray-600 uppercase tracking-wide">Medical Cover</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold text-blue-600 mb-2">60 Days</span>
              <span className="text-sm text-gray-600 uppercase tracking-wide">Max Duration</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold text-blue-600 mb-2">84 Years</span>
              <span className="text-sm text-gray-600 uppercase tracking-wide">Max Age</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="/quote" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1">
              Get Quote
            </a>
            <a href="/contact" className="bg-white hover:bg-blue-600 text-blue-600 hover:text-white border-2 border-blue-600 font-semibold px-8 py-4 rounded-lg transition-all duration-300">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl text-center shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Medical Coverage</h3>
              <p className="text-gray-600 leading-relaxed">Up to €5,000,000 emergency medical expenses worldwide</p>
            </div>
            <div className="bg-white p-8 rounded-xl text-center shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Repatriation</h3>
              <p className="text-gray-600 leading-relaxed">Emergency medical repatriation to home country</p>
            </div>
            <div className="bg-white p-8 rounded-xl text-center shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Personal Liability</h3>
              <p className="text-gray-600 leading-relaxed">€2,500,000 coverage for accidental injury to others</p>
            </div>
            <div className="bg-white p-8 rounded-xl text-center shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Trip Protection</h3>
              <p className="text-gray-600 leading-relaxed">Coverage for trip delays, cancellation, and lost baggage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Details */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            Coverage Details
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg text-center border-l-4 border-blue-600">
              <h4 className="text-gray-900 font-semibold mb-2">Medical Expenses</h4>
              <p className="text-blue-600 text-2xl font-bold">€5,000,000</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center border-l-4 border-blue-600">
              <h4 className="text-gray-900 font-semibold mb-2">Repatriation</h4>
              <p className="text-blue-600 text-2xl font-bold">Unlimited</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center border-l-4 border-blue-600">
              <h4 className="text-gray-900 font-semibold mb-2">Personal Liability</h4>
              <p className="text-blue-600 text-2xl font-bold">€2,500,000</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center border-l-4 border-blue-600">
              <h4 className="text-gray-900 font-semibold mb-2">Personal Effects</h4>
              <p className="text-blue-600 text-2xl font-bold">€2,500</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center border-l-4 border-blue-600">
              <h4 className="text-gray-900 font-semibold mb-2">Trip Cancellation</h4>
              <p className="text-blue-600 text-2xl font-bold">€10,000</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center border-l-4 border-blue-600">
              <h4 className="text-gray-900 font-semibold mb-2">Trip Delay</h4>
              <p className="text-blue-600 text-2xl font-bold">€500</p>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            Eligibility Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <h4 className="text-xl font-semibold text-blue-600 mb-2">Age Limit</h4>
              <p className="text-gray-600">Up to 84 years old</p>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold text-blue-600 mb-2">Trip Duration</h4>
              <p className="text-gray-600">Maximum 60 days</p>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold text-blue-600 mb-2">Residence</h4>
              <p className="text-gray-600">EU/EEA residents only</p>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold text-blue-600 mb-2">Health</h4>
              <p className="text-gray-600">No pre-existing conditions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Get Protected?</h2>
          <p className="text-xl opacity-90 mb-8">Get your instant quote and travel with confidence</p>
          <a href="/quote" className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold px-10 py-5 rounded-lg text-lg transition-all duration-300 transform hover:-translate-y-1">
            Get Your Quote Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default RegularStay;
