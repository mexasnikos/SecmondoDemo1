import React, { useEffect } from 'react';

interface AnnualMultiTripProps {
  onNavigate?: (page: string) => void;
}

const AnnualMultiTrip: React.FC<AnnualMultiTripProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-900 text-white overflow-hidden py-20 lg:py-32 flex items-center">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-block bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-sm font-semibold mb-5">
                Annual Multi-Trip
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
                Unlimited Trips, <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">One Policy</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-10 opacity-90 leading-relaxed">
                Perfect for frequent travelers. Get comprehensive coverage for unlimited trips 
                throughout the year with our Annual Multi-Trip insurance.
              </p>
              <div className="flex justify-center lg:justify-start gap-8 md:gap-12 mb-10">
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">€99.34</div>
                  <div className="text-sm opacity-80">Starting from</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">120</div>
                  <div className="text-sm opacity-80">Days per trip</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">79</div>
                  <div className="text-sm opacity-80">Max age</div>
                </div>
              </div>
              <div className="flex gap-5 flex-wrap justify-center lg:justify-start">
                <button 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-indigo-900 font-semibold px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => onNavigate?.('quote')}
                >
                  Get Quote Now
                </button>
                <button 
                  className="bg-transparent text-white border-2 border-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300"
                  onClick={() => onNavigate?.('learn-more')}
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6 text-yellow-400">✈️ Annual Coverage</h3>
                <ul className="space-y-3 text-lg">
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
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl mb-6">🔄</div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Unlimited Trips</h3>
              <p className="text-gray-600 leading-relaxed">Take as many trips as you want throughout the year</p>
            </div>
            <div className="bg-white p-8 rounded-2xl text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl mb-6">📅</div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">120 Days Per Trip</h3>
              <p className="text-gray-600 leading-relaxed">Each trip can last up to 120 days</p>
            </div>
            <div className="bg-white p-8 rounded-2xl text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl mb-6">🚢</div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">FREE Cruise Cover</h3>
              <p className="text-gray-600 leading-relaxed">Cruise coverage included at no extra cost</p>
            </div>
            <div className="bg-white p-8 rounded-2xl text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl mb-6">🏔️</div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Winter Sports</h3>
              <p className="text-gray-600 leading-relaxed">17 days winter sports cover included</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Overview Section */}
          <section id="overview" className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-600 text-center mb-12">Annual Multi-Trip Insurance Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-blue-600">
                <h3 className="text-2xl font-semibold text-blue-600 mb-6">Who Is It For?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-gray-700">Frequent business travelers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-gray-700">Holiday enthusiasts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-gray-700">EU & EEA residents up to age 79</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-gray-700">Those taking multiple trips per year</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-blue-600">
                <h3 className="text-2xl font-semibold text-blue-600 mb-6">Key Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-gray-700">Unlimited trips for 12 months</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-gray-700">Up to 120 days per trip</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-gray-700">Worldwide coverage options</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-gray-700">Family discounts available</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-blue-600">
                <h3 className="text-2xl font-semibold text-blue-600 mb-6">What's Included</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-gray-700">Medical expenses up to €8M</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-gray-700">Trip cancellation & curtailment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-gray-700">Baggage & personal effects</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-gray-700">Personal liability cover</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Comparison Section */}
          <section className="bg-gray-50 py-16 rounded-3xl my-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-600 text-center mb-12">Choose Your Coverage Level</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-blue-600 mb-3">Europe</h3>
                  <div className="text-3xl font-bold text-indigo-900 mb-6">From €99.34</div>
                </div>
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-start gap-2">✅ European countries</li>
                  <li className="flex items-start gap-2">✅ Up to €8M medical</li>
                  <li className="flex items-start gap-2">✅ 120 days per trip</li>
                  <li className="flex items-start gap-2">✅ Cruise cover included</li>
                  <li className="flex items-start gap-2">✅ Winter sports (17 days)</li>
                </ul>
                <button 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold px-6 py-4 rounded-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => onNavigate?.('quote')}
                >
                  Choose Europe
                </button>
              </div>
              <div className="bg-white p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-4 border-yellow-400 relative scale-105">
                <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-indigo-900 px-6 py-2 rounded-full font-bold text-sm">
                  Most Popular
                </span>
                <div className="mb-8 mt-6">
                  <h3 className="text-2xl font-bold text-blue-600 mb-3">Worldwide Excluding</h3>
                  <div className="text-3xl font-bold text-indigo-900 mb-6">From €189.67</div>
                </div>
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-start gap-2">✅ Global coverage (excl. USA, Canada, etc.)</li>
                  <li className="flex items-start gap-2">✅ Up to €8M medical</li>
                  <li className="flex items-start gap-2">✅ 120 days per trip</li>
                  <li className="flex items-start gap-2">✅ Cruise cover included</li>
                  <li className="flex items-start gap-2">✅ Winter sports (17 days)</li>
                </ul>
                <button 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold px-6 py-4 rounded-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => onNavigate?.('quote')}
                >
                  Choose Worldwide
                </button>
              </div>
              <div className="bg-white p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-blue-600 mb-3">Worldwide All</h3>
                  <div className="text-3xl font-bold text-indigo-900 mb-6">From €379.34</div>
                </div>
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-start gap-2">✅ Complete global coverage</li>
                  <li className="flex items-start gap-2">✅ Includes USA, Canada, Australia</li>
                  <li className="flex items-start gap-2">✅ Up to €8M medical</li>
                  <li className="flex items-start gap-2">✅ 120 days per trip</li>
                  <li className="flex items-start gap-2">✅ Premium destinations</li>
                </ul>
                <button 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold px-6 py-4 rounded-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => onNavigate?.('quote')}
                >
                  Choose Premium
                </button>
              </div>
            </div>
          </section>

          {/* Special Offers */}
          <section className="bg-gradient-to-br from-blue-600 to-indigo-900 text-white py-16 rounded-3xl my-16">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Special Offers & Discounts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-5xl mb-6">👨‍👩‍👧‍👦</div>
                <h3 className="text-2xl font-semibold mb-4">Family Discount</h3>
                <p className="mb-6 opacity-90 leading-relaxed">Children travel free with adult policies. Up to 4 children under 18 covered at no extra cost.</p>
                <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-indigo-900 px-6 py-2 rounded-full font-bold">
                  Save up to €400
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-5xl mb-6">💑</div>
                <h3 className="text-2xl font-semibold mb-4">Couple Savings</h3>
                <p className="mb-6 opacity-90 leading-relaxed">Special rates for couples traveling together. Both partners covered under one convenient policy.</p>
                <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-indigo-900 px-6 py-2 rounded-full font-bold">
                  Save 15%
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-5xl mb-6">🎯</div>
                <h3 className="text-2xl font-semibold mb-4">Group Bookings</h3>
                <p className="mb-6 opacity-90 leading-relaxed">Traveling with friends or colleagues? Get group discounts for 5 or more travelers.</p>
                <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-indigo-900 px-6 py-2 rounded-full font-bold">
                  Save 20%
                </span>
              </div>
            </div>
          </section>

          {/* Policy Documents */}
          <section id="policy" className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-600 text-center mb-12">Policy Wording</h2>
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold text-blue-600 mb-6">Travel Insurance</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Please read your Policy Wording carefully to ensure that it meets with your precise 
                requirements. View and download the relevant Policy Wording* from the links below. 
                If you purchased a Globelink policy previously while you were a UK RESIDENT, or you 
                need to view the Policy Wording we issue to UK Residents, please 
                <button className="text-blue-600 underline hover:text-blue-800" onClick={() => window.open('https://www.globelink.co.uk', '_blank')}> click here to visit our Globelink UK site</button>.
              </p>
              <p className="bg-gray-50 p-6 rounded-xl mb-8 border-l-4 border-yellow-400">
                *If you purchased your Travel Insurance policy prior to 1st October 2022, you can 
                view your policy wording by reviewing your Globelink Travel Insurance Purchase email, 
                or obtain a copy by contacting 
                <a href="mailto:globelink@globelink.eu" className="text-blue-600 hover:text-blue-800 underline"> globelink@globelink.eu</a> 
                with your name and address details.
              </p>

              <div className="space-y-4">
                <div className="bg-white border border-gray-300 rounded-xl p-6 flex justify-between items-center hover:border-blue-600 hover:shadow-md transition-all duration-300">
                  <div>
                    <h4 className="text-gray-900">📄 Policy Wording for Policies issued to EU residents (living outside the UK) from 12th March 2025 onwards.</h4>
                  </div>
                  <a 
                    href="/Globelink_Wording_EU_V2_07.03.2025.pdf" 
                    download="Globelink_Wording_EU_V2_07.03.2025.pdf"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                  >
                    Download
                  </a>
                </div>

                <div className="bg-white border border-gray-300 rounded-xl p-6 flex justify-between items-center hover:border-blue-600 hover:shadow-md transition-all duration-300">
                  <div>
                    <h4 className="text-gray-900">📄 Policy Wording for Policies issued to EU residents (living outside the UK) from 29th November to 11th March 2025.</h4>
                  </div>
                  <a 
                    href="/Globelink_Wording_EU_V2_07.03.2025.pdf" 
                    download="Globelink_Wording_EU_Nov2024_Mar2025.pdf"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-600 text-center mb-12">Key Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue-600">
                <div className="text-5xl mb-6">🏥</div>
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Medical Expenses</h3>
                <p className="text-gray-600 leading-relaxed">Up to €8,000,000 worldwide medical coverage for peace of mind</p>
              </div>
              <div className="bg-white p-8 rounded-2xl text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue-600">
                <div className="text-5xl mb-6">✈️</div>
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Cancellation</h3>
                <p className="text-gray-600 leading-relaxed">Trip cancellation up to €8,000 per person</p>
              </div>
              <div className="bg-white p-8 rounded-2xl text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue-600">
                <div className="text-5xl mb-6">🧳</div>
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Baggage</h3>
                <p className="text-gray-600 leading-relaxed">Baggage cover up to €2,500 including delayed baggage</p>
              </div>
              <div className="bg-white p-8 rounded-2xl text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue-600">
                <div className="text-5xl mb-6">🏔️</div>
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Winter Sports</h3>
                <p className="text-gray-600 leading-relaxed">FREE winter sports cover included at no extra cost</p>
              </div>
              <div className="bg-white p-8 rounded-2xl text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue-600">
                <div className="text-5xl mb-6">🚢</div>
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Cruise Cover</h3>
                <p className="text-gray-600 leading-relaxed">FREE cruise cover with cabin confinement benefits</p>
              </div>
              <div className="bg-white p-8 rounded-2xl text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue-600">
                <div className="text-5xl mb-6">🌍</div>
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Worldwide</h3>
                <p className="text-gray-600 leading-relaxed">Coverage across Europe, Asia, Americas, and beyond</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-br from-indigo-900 to-blue-600 text-white py-16 rounded-3xl text-center">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Travel with Confidence?</h2>
              <p className="text-xl opacity-90 mb-10 leading-relaxed">Get your Annual Multi-Trip insurance quote in minutes and enjoy unlimited trips with comprehensive coverage.</p>
              <div className="flex gap-6 justify-center flex-wrap">
                <button 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-indigo-900 font-bold px-10 py-5 rounded-full text-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => onNavigate?.('quote')}
                >
                  Get Quote Now
                </button>
                <button 
                  className="bg-transparent text-white border-2 border-white font-bold px-10 py-5 rounded-full text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                  onClick={() => onNavigate?.('contact')}
                >
                  Speak to Expert
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AnnualMultiTrip;
