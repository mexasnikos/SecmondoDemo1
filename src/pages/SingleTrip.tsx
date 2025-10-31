import React, { useState, useEffect, useRef } from 'react';

interface SingleTripProps {
  onNavigate?: (page: string) => void;
}

const SingleTrip: React.FC<SingleTripProps> = ({ onNavigate }) => {
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
          <div className="bg-gray-50 py-24 sm:py-10">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
               <h2 className="!text-left text-base/7 font-semibold text-blue-600">What is Single Trip Travel Insurance?</h2>
               <p className="mt-2 !text-left text-lg leading-relaxed text-gray-600">
                 Single Trip Travel Insurance is designed for people travelling independently or on a package holiday with a maximum trip duration of up to 15 months, depending on age. Globelink travel insurance policies for a Single Trip are available to people who are living in UK, EU, and EEA countries including Iceland, Liechtenstein and Norway.
               </p>

              {/* Insurance Plans Comparison */}
              <section className="mt-24 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Coverage Plan</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Select the perfect plan for your travel needs with comprehensive protection
                  </p>
                </div>

                {/* Features Comparison Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        {/* Pricing Cards Row */}
                        <tr>
                          <th className="bg-gray-50"></th>
                          {/* Value Plan */}
                          <th className="bg-gray-50 py-6 px-4">
                            <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden mx-auto max-w-xs">
                              <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Value</h3>
                                <div className="flex items-baseline justify-center mb-4">
                                  <span className="text-4xl font-bold text-gray-900">€39</span>
                                  <span className="text-gray-500 ml-2">/trip</span>
                                </div>
                                <a href="/quote" className="block w-full py-2.5 px-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm text-center">
                                  Get a Quote
                                </a>
                              </div>
                            </div>
                          </th>
                          {/* Silver Plan - Featured */}
                          <th className="bg-blue-50 py-6 px-4">
                            <div className="bg-white rounded-xl shadow-xl border-2 border-blue-600 overflow-hidden relative mx-auto max-w-xs">
                              <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                                Popular
                              </div>
                              <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Silver</h3>
                                <div className="flex items-baseline justify-center mb-4">
                                  <span className="text-4xl font-bold text-gray-900">€79</span>
                                  <span className="text-gray-500 ml-2">/trip</span>
                                </div>
                                <a href="/quote" className="block w-full py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm text-center">
                                  Get a Quote
                                </a>
                              </div>
                            </div>
                          </th>
                          {/* Gold Plan */}
                          <th className="bg-gray-50 py-6 px-4">
                            <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden mx-auto max-w-xs">
                              <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gold</h3>
                                <div className="flex items-baseline justify-center mb-4">
                                  <span className="text-4xl font-bold text-gray-900">€129</span>
                                  <span className="text-gray-500 ml-2">/trip</span>
                                </div>
                                <a href="/quote" className="block w-full py-2.5 px-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm text-center">
                                  Get a Quote
                                </a>
                              </div>
                            </div>
                          </th>
                        </tr>
                        {/* Column Headers Row */}
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-6 px-8 font-semibold text-white bg-gray-900">Secmondo Insurance Plans</th>
                          <th className="text-center py-6 px-8 font-semibold text-white bg-gray-900">Value</th>
                          <th className="text-center py-6 px-8 font-semibold text-white bg-gray-900">Silver</th>
                          <th className="text-center py-6 px-8 font-semibold text-white bg-gray-900">Gold</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Cancellation & Curtailment */}
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <td colSpan={4} className="py-4 px-8 font-bold text-gray-900">Cancellation & Curtailment</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Cancellation or Curtailment Charges</td>
                          <td className="text-center py-4 px-8 text-gray-700">Up to €500</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">Up to €3,500</td>
                          <td className="text-center py-4 px-8 text-gray-700">Up to €7,000</td>
                        </tr>

                        {/* Medical Coverage Section */}
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <td colSpan={4} className="py-4 px-8 font-bold text-gray-900">Emergency Medical, Repatriation and Other Expenses</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Emergency Medical, Repatriation and Other Expenses</td>
                          <td className="text-center py-4 px-8 text-gray-700">Up to €1,000,000</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">Up to €6,000,000</td>
                          <td className="text-center py-4 px-8 text-gray-700">Up to €10,000,000</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Including Dental Treatment</td>
                          <td className="text-center py-4 px-8 text-gray-300">—</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">€200</td>
                          <td className="text-center py-4 px-8 text-gray-700">€200</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Hospital Confinement Benefit</td>
                          <td className="text-center py-4 px-8 text-gray-300">—</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">€25 per 24hrs<br/>up to €2,500</td>
                          <td className="text-center py-4 px-8 text-gray-700">€25 per 24hrs<br/>up to €2,500</td>
                        </tr>

                        {/* Personal Accident */}
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <td colSpan={4} className="py-4 px-8 font-bold text-gray-900">Personal Accident</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Accidental death</td>
                          <td className="text-center py-4 px-8 text-gray-700">€10,000</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">€32,000</td>
                          <td className="text-center py-4 px-8 text-gray-700">€64,000</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Loss of limb(s) or loss of sight</td>
                          <td className="text-center py-4 px-8 text-gray-700">€10,000</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">€32,000</td>
                          <td className="text-center py-4 px-8 text-gray-700">€64,000</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Permanent total disablement</td>
                          <td className="text-center py-4 px-8 text-gray-700">€10,000</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">€32,000</td>
                          <td className="text-center py-4 px-8 text-gray-700">€64,000</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Travel Accident - Whilst on Public Transport only</td>
                          <td className="text-center py-4 px-8 text-gray-300">—</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-300">—</td>
                          <td className="text-center py-4 px-8 text-gray-700">€100,000</td>
                        </tr>

                        {/* Trip Disruption */}
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <td colSpan={4} className="py-4 px-8 font-bold text-gray-900">Trip Disruption</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Delayed Departure</td>
                          <td className="text-center py-4 px-8 text-gray-700">€20 first 12hrs<br/>then €20/12hrs<br/>up to €400</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">€50 first 12hrs<br/>then €25/12hrs<br/>up to €600</td>
                          <td className="text-center py-4 px-8 text-gray-700">€50 first 12hrs<br/>then €25/12hrs<br/>up to €600</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Abandonment after full 24 hours delay</td>
                          <td className="text-center py-4 px-8 text-gray-700">€500</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">Up to €3,500</td>
                          <td className="text-center py-4 px-8 text-gray-700">Up to €7,000</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Missed Departure</td>
                          <td className="text-center py-4 px-8 text-gray-700">€200</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">Up to €1,300</td>
                          <td className="text-center py-4 px-8 text-gray-700">Up to €1,800</td>
                        </tr>

                        {/* Baggage & Personal Items Section */}
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <td colSpan={4} className="py-4 px-8 font-bold text-gray-900">Baggage & Personal Property</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Baggage</td>
                          <td className="text-center py-4 px-8 text-gray-700">Up to €1,000</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">Up to €1,800</td>
                          <td className="text-center py-4 px-8 text-gray-700">Up to €3,000</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Single Article/Pair/Set Limit</td>
                          <td className="text-center py-4 px-8 text-gray-700">€150</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">€250</td>
                          <td className="text-center py-4 px-8 text-gray-700">€500</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Total Valuables Limit</td>
                          <td className="text-center py-4 px-8 text-gray-700">€150</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">€250</td>
                          <td className="text-center py-4 px-8 text-gray-700">€500</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Spectacles/Sunglasses Limit</td>
                          <td className="text-center py-4 px-8 text-gray-700">€50</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">€250</td>
                          <td className="text-center py-4 px-8 text-gray-700">€300</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Delayed Baggage (Minimum Delay of 12 hours)</td>
                          <td className="text-center py-4 px-8 text-gray-700">€250</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">€150</td>
                          <td className="text-center py-4 px-8 text-gray-700">€250</td>
                        </tr>

                        {/* Money & Documents */}
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <td colSpan={4} className="py-4 px-8 font-bold text-gray-900">Personal Money, Passport & Documents</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Personal Money, Passport & Documents</td>
                          <td className="text-center py-4 px-8 text-gray-700">Up to €250</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">Up to €900</td>
                          <td className="text-center py-4 px-8 text-gray-700">Up to €900</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Passport & Documents Limit</td>
                          <td className="text-center py-4 px-8 text-gray-300">—</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">€300</td>
                          <td className="text-center py-4 px-8 text-gray-700">€300</td>
                        </tr>

                        {/* Additional Benefits */}
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <td colSpan={4} className="py-4 px-8 font-bold text-gray-900">Additional Benefits</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Extended Kennel and/or Cattery Fees</td>
                          <td className="text-center py-4 px-8 text-gray-300">—</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">€35/day<br/>up to €350</td>
                          <td className="text-center py-4 px-8 text-gray-700">€35/day<br/>up to €350</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Personal Liability</td>
                          <td className="text-center py-4 px-8 text-gray-300">—</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">Up to €2,000,000</td>
                          <td className="text-center py-4 px-8 text-gray-700">Up to €2,000,000</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Rented Accommodation Limit</td>
                          <td className="text-center py-4 px-8 text-gray-300">—</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">Up to €120,000</td>
                          <td className="text-center py-4 px-8 text-gray-700">Up to €120,000</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Legal Expenses & Assistance</td>
                          <td className="text-center py-4 px-8 text-gray-300">—</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">Up to €19,000</td>
                          <td className="text-center py-4 px-8 text-gray-700">Up to €19,000</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Mugging Benefit</td>
                          <td className="text-center py-4 px-8 text-gray-700">€50/24hrs<br/>up to €1,000</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">€60/24hrs<br/>up to €1,200</td>
                          <td className="text-center py-4 px-8 text-gray-700">€60/24hrs<br/>up to €1,200</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Hijack Cover</td>
                          <td className="text-center py-4 px-8 text-gray-700">€50/24hrs<br/>up to €500</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-700">€60/24hrs<br/>up to €600</td>
                          <td className="text-center py-4 px-8 text-gray-700">€60/24hrs<br/>up to €600</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-12 font-medium text-gray-900">Withdrawal of Services</td>
                          <td className="text-center py-4 px-8 text-gray-300">—</td>
                          <td className="text-center py-4 px-8 bg-blue-50 text-gray-300">—</td>
                          <td className="text-center py-4 px-8 text-gray-700">€25 after 24hrs<br/>then €25/24hrs<br/>up to €250</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Section 1: Coverage */}
              <section className="mt-24 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Single Trip Coverage</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Comprehensive protection for your single trip adventures
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Medical Coverage',
                      description: 'Up to €10,000,000 medical expenses coverage including emergency treatment, hospitalization, and medical repatriation.'
                    },
                    {
                      title: 'Baggage Protection',
                      description: 'Coverage up to €2,500 for lost, stolen, or damaged luggage and personal belongings during your trip.'
                    },
                    {
                      title: 'Trip Cancellation',
                      description: 'Reimbursement for prepaid expenses if you need to cancel your trip due to unforeseen circumstances.'
                    },
                    {
                      title: 'Personal Liability',
                      description: 'Up to €2,000,000 coverage for legal liability if you accidentally cause injury or property damage.'
                    },
                    {
                      title: 'Travel Delays',
                      description: 'Compensation for additional expenses incurred due to flight delays, cancellations, or missed connections.'
                    },
                    {
                      title: 'Worldwide Coverage',
                      description: 'Travel with confidence to destinations worldwide, with 24/7 emergency assistance wherever you are.'
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
              <section className="bg-gray-900 text-white py-20 rounded-[3rem] mx-4 sm:mx-6 lg:mx-8 mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                      "My luggage was lost on a business trip. Secmondo reimbursed me quickly so I could buy essentials. The claims process was smooth and hassle-free."
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
                      "Traveling with kids means expecting the unexpected. When our flight was cancelled, Secmondo covered hotel and meals. Peace of mind for families!"
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
                  {/* Annual Multi-Trip */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 border border-orange-200 hover:shadow-xl transition-all">
                    <div className="flex items-center mb-4">
                      <span className="text-5xl mr-4">🌍</span>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Annual Multi-Trip</h3>
                        <p className="text-orange-600 font-semibold">Unlimited trips per year</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      Perfect for frequent travelers! Take unlimited trips throughout the year with continuous coverage. 
                      Each trip up to 45 days. Includes FREE 17-day Winter Sports coverage.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-gray-700">
                        <span className="text-green-600 mr-2">✓</span>
                        Unlimited trips annually
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="text-green-600 mr-2">✓</span>
                        Up to 45 days per trip
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="text-green-600 mr-2">✓</span>
                        Winter Sports included
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="text-green-600 mr-2">✓</span>
                        Best value for frequent travelers
                      </li>
                    </ul>
                    <a 
                      href="/annual-multitrip" 
                      className="inline-block w-full text-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all"
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
              Our Single Trip Insurance provides extensive geographical coverage across multiple regions, 
              ensuring you're protected wherever your travels take you.
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
              of your Single Trip Insurance coverage.
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
                  <div className="text-6xl mb-4">🗺️</div>
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
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Menu */}
          <div ref={tabMenuRef} className="sticky top-16 bg-white z-40 border-b border-gray-200 mb-8 pb-4">
            <nav className="flex space-x-8 justify-center pt-4">
              <button
                onClick={() => handleTabChange('overview')}
                className={`py-4 px-6 border-b-2 font-medium text-3sm transition-colors duration-200 rounded-t-lg ${
                  activeTab === 'overview'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => handleTabChange('geographical')}
                className={`py-4 px-6 border-b-2 font-medium text-3sm transition-colors duration-200 rounded-t-lg ${
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
      <section className="bg-gray-900 text-white py-20 rounded-[3rem] mx-4 sm:mx-6 lg:mx-8 mb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Your Single Trip Quote?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Get an instant quote for your single trip insurance and start your adventure with complete peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-55">
            <a 
              href="/quote"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-block text-center"
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
