import React, { useEffect } from 'react';

interface ComprehensiveProps {
  onNavigate?: (page: string) => void;
}

const Comprehensive: React.FC<ComprehensiveProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <span className="inline-block px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-semibold backdrop-blur-sm">
                Comprehensive Coverage
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Extended Travel, <span className="text-yellow-300">Complete Protection</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed max-w-2xl">
                Perfect for gap years, working holidays, and digital nomads. Get comprehensive coverage 
                for trips up to 15 months with our most extensive travel insurance policy.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">15</div>
                  <div className="text-sm text-blue-200">Months coverage</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">€10M</div>
                  <div className="text-sm text-blue-200">Medical cover</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">50+</div>
                  <div className="text-sm text-blue-200">Adventure sports</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
  onClick={() => onNavigate?.('quote')}
>
  Get Quote Now
</button>
                <button 
                  className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 font-semibold rounded-lg transition-all duration-300"
                  onClick={() => onNavigate?.('learn-more')}
                >
                  Explore Features
                </button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 max-w-md">
                <h3 className="text-2xl font-bold mb-6 text-center">🌍 Extended Coverage</h3>
                <ul className="space-y-4">
                  <li className="flex items-center text-lg">🏥 Up to €10M medical cover</li>
                  <li className="flex items-center text-lg">⛷️ Adventure sports included</li>
                  <li className="flex items-center text-lg">💼 Business equipment protection</li>
                  <li className="flex items-center text-lg">🎒 Enhanced baggage cover</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:bg-blue-50">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Up to 15 Months</h3>
              <p className="text-gray-600">Extended coverage for long-term travel and working holidays</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:bg-green-50">
              <div className="text-4xl mb-4">🏔️</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Adventure Sports</h3>
              <p className="text-gray-600">50+ adventure sports covered as standard</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:bg-purple-50">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Digital Nomad Ready</h3>
              <p className="text-gray-600">Business equipment and remote work protection</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:bg-orange-50">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Study & Work</h3>
              <p className="text-gray-600">Perfect for gap years and working holidays</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Overview Section */}
          <section id="overview" className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Comprehensive Single Trip Insurance</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold mb-6 text-blue-600">Who Is It For?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Gap year travelers
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Digital nomads
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Students studying abroad
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Working holiday makers
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Long-term adventurers
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold mb-6 text-green-600">Key Advantages</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Up to 15 months coverage
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Enhanced medical protection
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Adventure sports included
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Business equipment cover
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Worldwide destinations
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold mb-6 text-purple-600">What Makes It Special</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Most extensive coverage available
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Specialized digital nomad benefits
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Enhanced personal liability
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Extended baggage protection
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    24/7 global assistance
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Adventure Sports */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Adventure Sports Included</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-5xl mb-4">🏔️</div>
                <h3 className="text-2xl font-bold mb-6">Mountain Sports</h3>
                <div className="space-y-2">
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">Skiing</span>
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">Snowboarding</span>
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">Mountaineering</span>
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">Rock Climbing</span>
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">Ice Climbing</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-5xl mb-4">🌊</div>
                <h3 className="text-2xl font-bold mb-6">Water Sports</h3>
                <div className="space-y-2">
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">Scuba Diving</span>
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">Surfing</span>
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">White Water Rafting</span>
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">Kayaking</span>
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">Kitesurfing</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-5xl mb-4">🪂</div>
                <h3 className="text-2xl font-bold mb-6">Extreme Sports</h3>
                <div className="space-y-2">
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">Bungee Jumping</span>
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">Skydiving</span>
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">Paragliding</span>
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">Base Jumping</span>
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">Hang Gliding</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-5xl mb-4">🚴</div>
                <h3 className="text-2xl font-bold mb-6">Adventure Travel</h3>
                <div className="space-y-2">
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">Mountain Biking</span>
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">Trekking</span>
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">Safari Tours</span>
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">Wilderness Hiking</span>
                  <span className="block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">Expedition Travel</span>
                </div>
              </div>
            </div>
          </section>

          {/* Special Benefits */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Digital Nomad & Extended Travel Benefits</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Business Equipment</h3>
                <p className="text-gray-600">Laptop, camera, and professional equipment coverage up to €5,000</p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-green-500">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Temporary Accommodation</h3>
                <p className="text-gray-600">Extended stay coverage if your trip is prolonged due to covered reasons</p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Study Materials</h3>
                <p className="text-gray-600">Educational materials and course fee protection for study abroad</p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-cyan-500">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Global Communication</h3>
                <p className="text-gray-600">Emergency communication costs and satellite phone rental coverage</p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500">
                <div className="text-4xl mb-4">⚖️</div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Enhanced Liability</h3>
                <p className="text-gray-600">Up to €5M personal liability cover for extended stays</p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-red-500">
                <div className="text-4xl mb-4">🚨</div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Emergency Evacuation</h3>
                <p className="text-gray-600">Political evacuation and natural disaster emergency transport</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 rounded-2xl">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready for Your Extended Adventure?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Get comprehensive coverage for your long-term travel plans with our most extensive policy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <button 
                  className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
  onClick={() => onNavigate?.('quote')}
>
  Get Quote Now
</button>
                  <button 
                  className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 font-semibold rounded-lg transition-all duration-300"
  onClick={() => onNavigate?.('contact')}
>
  Expert Advice
</button>
                </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">🛡️</span>
                  <span className="text-lg font-medium">Comprehensive Protection</span>
                  </div>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">🌍</span>
                  <span className="text-lg font-medium">Worldwide Coverage</span>
                  </div>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">⚡</span>
                  <span className="text-lg font-medium">Instant Policy</span>
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
