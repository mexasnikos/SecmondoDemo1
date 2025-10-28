import React, { useState, useEffect } from 'react';

interface LongStayTripProps {
  onNavigate?: (page: string) => void;
}

const LongStayTrip: React.FC<LongStayTripProps> = ({ onNavigate }) => {
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
          <div className="bg-gray-50 py-24 sm:py-32">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
              <h2 className="text-center text-base/7 font-semibold text-purple-600">Long Stay Trip Insurance</h2>
              <p className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">Everything you need for extended adventures</p>
              <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
                <div className="relative lg:row-span-2">
                  <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                    <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                      <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Section 1</p>
                      <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">Add your text or image content here for the main feature highlight.</p>
                    </div>
                    <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                      <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                        <div className="size-full object-cover object-top bg-purple-100 flex items-center justify-center text-gray-500">Image 1</div>
                      </div>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-px rounded-lg shadow outline outline-1 outline-black/5 lg:rounded-l-[2rem]"></div>
                </div>
                <div className="relative max-lg:row-start-1">
                  <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                    <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                      <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Section 2</p>
                      <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">Add your text or image content here for the second feature.</p>
                    </div>
                    <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                      <div className="w-full max-lg:max-w-xs bg-blue-100 h-32 flex items-center justify-center text-gray-500">Image 2</div>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-px rounded-lg shadow outline outline-1 outline-black/5 max-lg:rounded-t-[2rem]"></div>
                </div>
                <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                  <div className="absolute inset-px rounded-lg bg-white"></div>
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
                    <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                      <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Section 3</p>
                      <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">Add your text or image content here for the third feature.</p>
                    </div>
                    <div className="flex flex-1 items-center [container-type:inline-size] max-lg:py-6 lg:pb-2">
                      <div className="h-[min(152px,40cqw)] w-full bg-green-100 flex items-center justify-center text-gray-500">Image 3</div>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-px rounded-lg shadow outline outline-1 outline-black/5"></div>
                </div>
                <div className="relative lg:row-span-2">
                  <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                    <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                      <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Section 4</p>
                      <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">Add your text or image content here for the fourth feature highlight.</p>
                    </div>
                    <div className="relative min-h-[30rem] w-full grow">
                      <div className="absolute bottom-0 left-10 right-0 top-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl outline outline-1 outline-white/10">
                        <div className="flex bg-gray-900 outline outline-1 outline-white/5">
                          <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                            <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">LongStay.jsx</div>
                            <div className="border-r border-gray-600/10 px-4 py-2">Coverage.jsx</div>
                          </div>
                        </div>
                        <div className="px-6 pb-14 pt-6">
                          <div className="bg-orange-100 h-40 flex items-center justify-center text-gray-500">Image 4</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-px rounded-lg shadow outline outline-1 outline-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
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
              Long Stay Trip Insurance provides comprehensive worldwide coverage, ensuring you're protected 
              during your extended travels across all continents and destinations.
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
                    { bg: 'bg-blue-50', text: 'text-blue-800' },
                    { bg: 'bg-green-50', text: 'text-green-800' },
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
              of your Long Stay Trip Insurance coverage.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-4">Important Policy Information</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-700">Coverage Limits</h5>
                  <p className="text-sm text-gray-600">Medical expenses: €10,000,000 | Personal liability: €5,000,000 | Business equipment: €5,000</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700">Trip Duration</h5>
                  <p className="text-sm text-gray-600">Maximum 15 months per trip, with options for extension</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700">Special Benefits</h5>
                  <p className="text-sm text-gray-600">Study materials, business equipment, temporary accommodation, emergency evacuation</p>
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
                Long Stay Trip Insurance
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Extended <span className="text-yellow-300">Adventures</span> Covered
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                Perfect for gap years, working holidays, and digital nomads. Get comprehensive coverage 
                for extended trips up to 15 months with our most extensive travel insurance policy.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">15</div>
                  <div className="text-sm text-gray-400">Months max</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">€10M</div>
                  <div className="text-sm text-gray-400">Medical cover</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">€5M</div>
                  <div className="text-sm text-gray-400">Liability</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 max-w-md">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🌏</div>
                  <h3 className="text-2xl font-bold">Long Stay Coverage</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center text-lg">📚 Study materials</li>
                  <li className="flex items-center text-lg">💻 Business equipment</li>
                  <li className="flex items-center text-lg">🏠 Temporary accommodation</li>
                  <li className="flex items-center text-lg">🚨 Emergency evacuation</li>
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
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20 rounded-[3rem] mx-4 sm:mx-6 lg:mx-8 mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready for Your Long Stay Quote?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Get an instant quote for your long stay trip insurance and embark on your extended adventure with complete protection.
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

export default LongStayTrip;
