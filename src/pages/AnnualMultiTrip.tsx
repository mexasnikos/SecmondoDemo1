import React, { useState, useEffect, useRef } from 'react';

interface AnnualMultiTripProps {
  onNavigate?: (page: string) => void;
}

const AnnualMultiTrip: React.FC<AnnualMultiTripProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [destinationCategories, setDestinationCategories] = useState<{[key: string]: string[]}>({});
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const tabMenuRef = useRef<HTMLDivElement>(null);
  const [expandedCoverage, setExpandedCoverage] = useState<{[key: number]: boolean}>({});

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Scroll to the tab menu to show content from the beginning
    if (tabMenuRef.current) {
      const headerHeight = 64; // Height of the sticky header
      const section = tabMenuRef.current.closest('section');
      if (section) {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: sectionTop - headerHeight,
          behavior: 'smooth'
        });
      }
    }
  };

  const toggleCoverage = (index: number) => {
    setExpandedCoverage(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

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
              <h2 className="text-center text-base/7 font-semibold text-green-600">Annual Multi-Trip Insurance</h2>
              <p className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">Everything you need for unlimited adventures</p>
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
                        <div className="size-full object-cover object-top bg-green-100 flex items-center justify-center text-gray-500">Image 1</div>
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
                      <div className="h-[min(152px,40cqw)] w-full bg-purple-100 flex items-center justify-center text-gray-500">Image 3</div>
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
                            <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">MultiTrip.jsx</div>
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

              {/* Section 1: Coverage */}
              <section className="mt-24 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Annual Multi-Trip Coverage</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Unlimited trips with comprehensive protection for frequent travelers
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Medical Coverage',
                      description: 'Up to €10,000,000 medical expenses coverage for every trip, including emergency treatment and medical repatriation.'
                    },
                    {
                      title: 'FREE Winter Sports',
                      description: 'Enjoy 17 days of winter sports coverage included FREE with every annual multi-trip policy.'
                    },
                    {
                      title: 'Unlimited Trips',
                      description: 'Take as many trips as you want throughout the year, each up to 45 days duration.'
                    },
                    {
                      title: 'Baggage Protection',
                      description: 'Coverage up to €2,500 per trip for lost, stolen, or damaged luggage and belongings.'
                    },
                    {
                      title: 'Business Travel',
                      description: 'Perfect for business travelers with coverage for work-related trips and equipment.'
                    },
                    {
                      title: 'Worldwide Coverage',
                      description: 'Travel anywhere in the world with 24/7 emergency assistance on every trip.'
                    }
                  ].map((coverage, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => toggleCoverage(index)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <h3 className="text-xl font-bold text-gray-900">{coverage.title}</h3>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {expandedCoverage[index] ? '−' : '+'}
                        </div>
                      </button>
                      {expandedCoverage[index] && (
                        <div className="px-6 pb-6 pt-2">
                          <p className="text-gray-600 leading-relaxed">{coverage.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 2: Secmondo APP */}
              <section className="mt-24 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <h2 className="text-4xl font-bold mb-6">Secmondo Mobile App</h2>
                      <p className="text-xl text-blue-100 mb-8">
                        Manage your travel insurance on-the-go with our intuitive mobile application. 
                        Access your policy, file claims, and get emergency support anytime, anywhere.
                      </p>
                      <div className="space-y-4 mb-8">
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">📱</span>
                          <div>
                            <h4 className="font-semibold text-lg">Instant Policy Access</h4>
                            <p className="text-blue-100">View and download your policy documents instantly</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">📸</span>
                          <div>
                            <h4 className="font-semibold text-lg">Quick Claims Submission</h4>
                            <p className="text-blue-100">Submit claims with photos directly from your phone</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">🆘</span>
                          <div>
                            <h4 className="font-semibold text-lg">24/7 Emergency Support</h4>
                            <p className="text-blue-100">One-tap access to emergency assistance worldwide</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <a href="https://apps.apple.com" className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                          <span className="mr-2">📲</span> App Store
                        </a>
                        <a href="https://play.google.com" className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                          <span className="mr-2">📲</span> Google Play
                        </a>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"></div>
                        <div className="relative bg-white rounded-3xl p-8 text-center">
                          <div className="text-6xl mb-4">📱</div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">Secmondo App</h3>
                          <div className="space-y-2 text-left text-gray-700">
                            <div className="flex items-center">
                              <span className="text-green-600 mr-2">✓</span>
                              Digital policy cards
                            </div>
                            <div className="flex items-center">
                              <span className="text-green-600 mr-2">✓</span>
                              Offline access
                            </div>
                            <div className="flex items-center">
                              <span className="text-green-600 mr-2">✓</span>
                              Real-time claim tracking
                            </div>
                            <div className="flex items-center">
                              <span className="text-green-600 mr-2">✓</span>
                              Travel alerts & tips
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: Why Choose Secmondo */}
              <section className="mt-24 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Secmondo?</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Trusted by thousands of travelers worldwide for reliable coverage and exceptional service
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Industry Leaders</h3>
                    <p className="text-gray-700">Backed by Lloyd's of London and Helvetia Insurance, ensuring financial security and world-class coverage with over 500 years of combined experience.</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Competitive Pricing</h3>
                    <p className="text-gray-700">Get comprehensive coverage at affordable rates with no hidden fees. Transparent pricing and flexible payment options to suit your budget.</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Fast Claims Process</h3>
                    <p className="text-gray-700">Quick and hassle-free claims processing. Our dedicated team ensures your claims are handled efficiently, getting you reimbursed faster.</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">24/7 Support</h3>
                    <p className="text-gray-700">Round-the-clock customer support in multiple languages. Our emergency assistance team is always ready to help, wherever you are in the world.</p>
                  </div>
                </div>
              </section>

              {/* Section 4: Opinions */}
              <section className="mt-24 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Real experiences from travelers who trust Secmondo for their insurance needs
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        SJ
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Sarah Johnson</h4>
                        <p className="text-sm text-gray-600">Solo Traveler</p>
                      </div>
                    </div>
                    <div className="text-yellow-400 text-xl mb-3">⭐⭐⭐⭐⭐</div>
                    <p className="text-gray-700 leading-relaxed">
                      "I fell ill in Thailand and needed emergency care. Secmondo covered everything - hospital bills and extended stay. The 24/7 support was amazing. Highly recommend!"
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        MC
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Mike Chen</h4>
                        <p className="text-sm text-gray-600">Business Traveler</p>
                      </div>
                    </div>
                    <div className="text-yellow-400 text-xl mb-3">⭐⭐⭐⭐⭐</div>
                    <p className="text-gray-700 leading-relaxed">
                      "As someone who travels 20+ times a year, the Annual Multi-Trip policy is a game-changer. Best value for money and hassle-free coverage!"
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        ER
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Emma Rodriguez</h4>
                        <p className="text-sm text-gray-600">Family Traveler</p>
                      </div>
                    </div>
                    <div className="text-yellow-400 text-xl mb-3">⭐⭐⭐⭐⭐</div>
                    <p className="text-gray-700 leading-relaxed">
                      "Perfect for our family! We take multiple vacations each year and this policy saves us money while providing excellent coverage for all our trips."
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 5: More Coverages */}
              <section className="mt-24 mb-12 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore More Coverage Options</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Find the perfect insurance policy for your travel needs
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Single Trip */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200 hover:shadow-xl transition-all">
                    <div className="flex items-center mb-4">
                      <span className="text-5xl mr-4">✈️</span>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Single Trip</h3>
                        <p className="text-blue-600 font-semibold">For occasional travelers</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      Perfect for one-time vacations or business trips. Comprehensive coverage for trips up to 365 days with flexible options.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-gray-700">
                        <span className="text-green-600 mr-2">✓</span>
                        Coverage up to 365 days
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="text-green-600 mr-2">✓</span>
                        €10M medical coverage
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="text-green-600 mr-2">✓</span>
                        Trip cancellation included
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="text-green-600 mr-2">✓</span>
                        Best for single holidays
                      </li>
                    </ul>
                    <a 
                      href="/singletrip" 
                      className="inline-block w-full text-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                    >
                      Learn More
                    </a>
                  </div>

                  {/* Long Stay Trip */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-8 border border-purple-200 hover:shadow-xl transition-all">
                    <div className="flex items-center mb-4">
                      <span className="text-5xl mr-4">🌏</span>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Long Stay Trip</h3>
                        <p className="text-purple-600 font-semibold">Up to 15 months coverage</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      Ideal for gap years, working holidays, and digital nomads. Comprehensive coverage for extended 
                      trips with enhanced benefits including business equipment and study materials.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-gray-700">
                        <span className="text-green-600 mr-2">✓</span>
                        Coverage up to 15 months
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="text-green-600 mr-2">✓</span>
                        Enhanced medical coverage
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="text-green-600 mr-2">✓</span>
                        Business equipment protection
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="text-green-600 mr-2">✓</span>
                        Perfect for long-term adventures
                      </li>
                    </ul>
                    <a 
                      href="/longstaytrip" 
                      className="inline-block w-full text-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
              </section>

            </div>
          </div>
        );
      case 'geographical':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Geographical Coverage</h3>
            <p className="text-gray-600 leading-relaxed">
              Annual Multi-Trip Insurance offers flexible geographical coverage options to suit your travel patterns. 
              Choose the coverage area that best matches your travel needs.
            </p>
            {isLoadingCategories ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading destination categories...</div>
              </div>
            ) : (
              <div className="mt-8 overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                  <thead>
                    <tr className="bg-gray-900 text-white">
                      <th className="py-4 px-6 text-left font-semibold text-lg border-b border-gray-300">
                        Destination Category
                      </th>
                      <th className="py-4 px-6 text-left font-semibold text-lg border-b border-gray-300">
                        Countries Covered
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(destinationCategories).map(([category, countries], index) => {
                      const categoryNames: {[key: string]: string} = {
                        'Europe': 'Domestic and European',
                        'Worldwide': 'Worldwide All Countries'
                      };
                      
                      const displayName = categoryNames[category] || category;
                      
                      return (
                        <tr key={category} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                          <td className="py-4 px-6 border-b border-gray-200 font-medium text-gray-800 align-top">
                            {displayName}
                            <div className="text-sm text-gray-500 mt-1">
                              ({countries.length} countries)
                            </div>
                          </td>
                          <td className="py-4 px-6 border-b border-gray-200 text-gray-700">
                            {countries.join(', ')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
              of your Annual Multi-Trip Insurance coverage.
            </p>
            
            {/* Policy Document Download */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">📄</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">Secmondo Policy Wording</h4>
                    <p className="text-sm text-gray-600">Combined Policy Document - Version 1 (30-10-2025)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a
                    href="/Secmondo Policy Wording - COMBINED - V1 30-10-2025.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    View PDF
                  </a>
                  <a
                    href="/Secmondo Policy Wording - COMBINED - V1 30-10-2025.pdf"
                    download
                    className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Download PDF
                  </a>
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
                Annual Multi-Trip Insurance
                </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Unlimited <span className="text-yellow-300">Year-Round</span> Adventures
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                One policy covers all your trips for an entire year. Perfect for frequent travelers, 
                business professionals, and families who love to explore multiple destinations.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">∞</div>
                  <div className="text-sm text-gray-400">Trips per year</div>
                  </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">31</div>
                  <div className="text-sm text-gray-400">Days per trip</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">365</div>
                  <div className="text-sm text-gray-400">Days coverage</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 max-w-md">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🌍</div>
                  <h3 className="text-2xl font-bold">Multi-Trip Coverage</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center text-lg">✈️ Unlimited trips</li>
                  <li className="flex items-center text-lg">🏥 Medical protection</li>
                  <li className="flex items-center text-lg">🎒 Baggage cover</li>
                  <li className="flex items-center text-lg">💼 Business travel</li>
                </ul>
              </div>
              </div>
              </div>
              </div>
      </section>

      {/* Section 2: Tabbed Menu Content */}
      <section className="py-20 bg-white">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Menu */}
          <div ref={tabMenuRef} className="sticky top-16 bg-white z-40 border-b border-gray-200 mb-8 pb-4">
            <nav className="flex space-x-8 justify-center pt-4">
              <button
                onClick={() => handleTabChange('overview')}
                className={`py-4 px-6 border-b-2 font-medium text-lg transition-colors duration-200 rounded-t-lg ${
                  activeTab === 'overview'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => handleTabChange('geographical')}
                className={`py-4 px-6 border-b-2 font-medium text-lg transition-colors duration-200 rounded-t-lg ${
                  activeTab === 'geographical'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Geographical
              </button>
              <button
                onClick={() => handleTabChange('policy')}
                className={`py-4 px-6 border-b-2 font-medium text-lg transition-colors duration-200 rounded-t-lg ${
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready for Your Annual Multi-Trip Quote?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Get an instant quote for your annual multi-trip insurance and enjoy unlimited adventures throughout the year.
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

export default AnnualMultiTrip;