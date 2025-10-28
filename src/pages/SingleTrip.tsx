import React, { useState, useEffect } from 'react';

interface SingleTripProps {
  onNavigate?: (page: string) => void;
}

const SingleTrip: React.FC<SingleTripProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [destinationCategories, setDestinationCategories] = useState<{[key: string]: string[]}>({});
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load destination categories and countries
  useEffect(() => {
    const loadDestinationCategories = async () => {
      try {
        setIsLoadingCategories(true);
        
        // Load categories
        const categoriesResponse = await fetch('http://localhost:5002/api/destination-categories');
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesData.status === 'success') {
          const categories = categoriesData.categories;
          const categoriesWithCountries: {[key: string]: string[]} = {};
          
          // Load countries for each category
          for (const category of categories) {
            try {
              const countriesResponse = await fetch(`http://localhost:5002/api/destination-categories/${encodeURIComponent(category)}/countries`);
              const countriesData = await countriesResponse.json();
              
              if (countriesData.status === 'success') {
                categoriesWithCountries[category] = countriesData.countries;
              }
            } catch (error) {
              console.error(`Error loading countries for ${category}:`, error);
              categoriesWithCountries[category] = [];
            }
          }
          
          setDestinationCategories(categoriesWithCountries);
        }
      } catch (error) {
        console.error('Error loading destination categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadDestinationCategories();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="bg-gray-50 py-24 sm:py-10">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
               <h2 className="!text-left text-base/7 font-semibold text-blue-600">What is Single Trip Travel Insurance?</h2>
               <p className="mt-2 !text-left text-lg leading-relaxed text-gray-600">
                 Single Trip Travel Insurance is designed for people travelling independently or on a package holiday with a maximum trip duration of up to 15 months, depending on age. Globelink travel insurance policies for a Single Trip are available to people who are living in UK, EU, and EEA countries including Iceland, Liechtenstein and Norway.
               </p>
                <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-2 lg:grid-rows-[400px_350px]">
                <div className="relative lg:row-span-1">
                  <div className="absolute inset-px rounded-[3rem] bg-gray-900"></div>
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(3rem+1px)]">
                    <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                      <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">Single Trip Travel Insurance Key Benefits</p>
                      <ul className="mt-2 max-w-lg text-sm/6 text-gray-300 max-lg:text-center space-y-1">
                        <li>• Get exactly what you need</li>
                        <li>• No hidden costs</li>
                        <li>• Single trip policies for people aged up to 89</li>
                        <li>• Large number of pre-existing medical conditions that are covered for free</li>
                        <li>• Cover for Aussies, Kiwis and Saffas</li>
                        <li>• We help you to customise your travel insurance policy, so it suits all your needs</li>
                        <li>• Purchasing Travel Insurance takes less than 1 minute</li>
                      </ul>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-px rounded-[3rem] shadow outline outline-1 outline-black/5"></div>
                </div>
                <div className="relative lg:col-start-2 lg:row-start-1">
                  <div className="absolute inset-px rounded-[3rem] bg-white"></div>
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(3rem+1px)]">
                    <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                      <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Important Notice</p>
                      <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">Attention! The European Health Insurance Card (EHIC) / Global Health Insurance Card (GHIC) provides some emergency healthcare within the EU, but it does not cover Repatriation costs, or a doctor or nurse escort home; nor lost or stolen property. You need Travel Insurance for that.</p>
                    </div>
                    <div className="flex flex-1 items-center justify-center px-4 py-4">
                      <img 
                        src="/important_notice2.jpg" 
                        alt="Important Notice" 
                        className="w-1/4 h-4/4 object-cover rounded-xl shadow-lg" 
                        style={{ borderRadius: '12px' }}
                      />
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-px rounded-[3rem] shadow outline outline-1 outline-black/5"></div>
                </div>
                <div className="relative lg:col-span-2 lg:row-start-2">
                  <div className="absolute inset-px rounded-[3rem] bg-white"></div>
                  <div className="relative flex h-full flex-row overflow-hidden rounded-[calc(3rem+1px)]">
                    <div className="flex-1 px-8 py-8 sm:px-10 sm:py-10">
                      <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Planning a Trip? Pack your Travel Insurance!</p>
                      <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">Whether you're planning a Staycation weekend away, going on a business to Rome, taking a family holiday to Cyprus, or thinking of a romantic getaway to Paris, don't overlook your travel insurance. This may not be the most exciting part of travel preparation, neither is it the first thing you might think of when getting ready for a trip but it is no less important than your passport and travel arrangements. An unforeseen mishap abroad could cost you thousands – so don't leave home without Travel Insurance.</p>
                    </div>
                    <div className="flex-1 flex items-center justify-center px-4 py-4">
                      <img 
                        src="/travel_packing.jpg" 
                        alt="Travel Packing" 
                        className="w-3/4 h-3/4 object-cover rounded-xl shadow-lg" 
                        style={{ borderRadius: '12px' }}
                      />
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-px rounded-[3rem] shadow outline outline-1 outline-black/5"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'geographical':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Geographical Coverage</h3>
            <p className="text-gray-600 leading-relaxed">
              Our Single Trip Insurance provides extensive geographical coverage across multiple regions, 
              ensuring you're protected wherever your travels take you.
            </p>
            {isLoadingCategories ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading destination categories...</div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {Object.entries(destinationCategories).map(([category, countries], index) => {
                  const categoryNames: {[key: string]: string} = {
                    'Europe': 'Domestic and European',
                    'Worldwide': 'Worldwide All Countries'
                  };
                  
                  const displayName = categoryNames[category] || category;
                  const colors = [
                    { bg: 'bg-red-50', text: 'text-red-800' },
                    { bg: 'bg-blue-50', text: 'text-blue-800' },
                    { bg: 'bg-purple-50', text: 'text-purple-800' }
                  ];
                  
                  return (
                    <div key={category} className={`${colors[index % colors.length].bg} p-6 rounded-lg`}>
                      <h4 className={`font-semibold ${colors[index % colors.length].text} mb-2`}>
                        {displayName}
                      </h4>
                      <div className="text-gray-700 mb-3">
                        {countries.length} countries covered
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        <div className="text-sm text-gray-600 space-y-1">
                          {countries.slice(0, 10).map((country, idx) => (
                            <div key={idx} className="truncate">• {country}</div>
                          ))}
                          {countries.length > 10 && (
                            <div className="text-gray-500 italic">
                              ... and {countries.length - 10} more countries
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      case 'policy':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Policy Wording</h3>
            <p className="text-gray-600 leading-relaxed">
              Please review the detailed policy wording to understand the terms, conditions, and exclusions 
              of your Single Trip Insurance coverage.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-4">Important Policy Information</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-700">Coverage Limits</h5>
                  <p className="text-sm text-gray-600">Medical expenses: €10,000,000 | Personal liability: €2,000,000 | Baggage: €2,500</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700">Exclusions</h5>
                  <p className="text-sm text-gray-600">Pre-existing medical conditions, extreme sports (unless specified), war zones</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700">Claims Process</h5>
                  <p className="text-sm text-gray-600">Contact our 24/7 helpline immediately in case of emergency or claim</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Section 1: Feature Section with Product Picture */}
      <section className="bg-gray-900 text-white py-20 rounded-[3rem] mx-4 sm:mx-6 lg:mx-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <span className="inline-block px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-semibold backdrop-blur-sm">
                Single Trip Insurance
              </span> 
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Perfect for <span className="text-yellow-300">Individual Adventures</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                Comprehensive coverage for your single trip adventures. Whether it's a weekend getaway, 
                business trip, or extended holiday, we've got you covered with flexible options.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">365</div>
                  <div className="text-sm text-gray-400">Days max</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">€10M</div>
                  <div className="text-sm text-gray-400">Medical cover</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">24/7</div>
                  <div className="text-sm text-gray-400">Support</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 max-w-md">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">✈️</div>
                  <h3 className="text-2xl font-bold">Single Trip Coverage</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center text-lg">🏥 Medical expenses covered</li>
                  <li className="flex items-center text-lg">🎒 Baggage protection</li>
                  <li className="flex items-center text-lg">🚫 Trip cancellation</li>
                  <li className="flex items-center text-lg">⚖️ Personal liability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Tabbed Menu Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Menu */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200 rounded-t-lg ${
                  activeTab === 'overview'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('geographical')}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200 rounded-t-lg ${
                  activeTab === 'geographical'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Geographical
              </button>
              <button
                onClick={() => setActiveTab('policy')}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200 rounded-t-lg ${
                  activeTab === 'policy'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Policy Wording
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-gray-50 rounded-2xl p-8 min-h-[400px]">
            {renderTabContent()}
          </div>
        </div>
      </section>

      {/* Section 3: CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20 rounded-[3rem] mx-4 sm:mx-6 lg:mx-8 mb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Your Single Trip Quote?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Get an instant quote for your single trip insurance and start your adventure with complete peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-55">
            <a 
              href="/quote"
              className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-block text-center"
            >
              Get Quote Now
            </a>
            <a 
              href="/contact"
              className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 font-semibold rounded-lg transition-all duration-300 inline-block text-center"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SingleTrip;
