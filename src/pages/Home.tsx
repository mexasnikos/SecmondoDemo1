import React, { useState, useEffect } from 'react';
import PolicyModal from '../components/PolicyModal';

const Home: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [modalState, setModalState] = useState({
    isOpen: false,
    policyType: '',
    title: '',
    content: ''
  });

  const policyInfo = {
    'regular': {
      title: 'REGULAR Single Trip Insurance',
      content: 'Perfect for occasional travelers taking a single holiday. This comprehensive policy covers medical emergencies up to €1M, trip cancellation, delays, and lost baggage. Ideal for short to medium-term trips lasting up to 45 days. Includes 24/7 emergency assistance and covers pre-existing medical conditions with our medical screening.'
    },
    'annual': {
      title: 'ANNUAL MULTI-TRIP Travel Insurance',
      content: 'The ultimate solution for frequent travelers! Take unlimited trips throughout the year with continuous coverage. Each trip can last up to 45 days with our standard policy. Includes FREE 17-day Winter Sports coverage and covers all the same benefits as our single trip policies. Perfect for business travelers and vacation enthusiasts.'
    },
    'comprehensive': {
      title: 'COMPREHENSIVE Single Trip Insurance',
      content: 'Our most extensive coverage for extended trips up to 15 months. Ideal for gap years, working holidays, and long-term travel. Includes enhanced medical coverage, adventure sports coverage, business equipment protection, and extended personal liability. Perfect for digital nomads and long-term adventurers.'
    }
  };

  const openModal = (policyType: keyof typeof policyInfo) => {
    setModalState({
      isOpen: true,
      policyType,
      title: policyInfo[policyType].title,
      content: policyInfo[policyType].content
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      policyType: '',
      title: '',
      content: ''
    });
  };

  return (
    <>
      <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-orange-50 py-20 lg:py-32">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            style={{ textAlign: 'left', width: '100%', paddingLeft: '16px' }}
          >
            We'll take you anywhere.
          </h1>
          <h2 
            className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700 mb-8 leading-relaxed"
            style={{ textAlign: 'left', width: '100%', paddingLeft: '16px' }}
          >
            With Secmondo Insurance, you're settled. Never worry about a thing.
          </h2>
          <div 
            className="flex flex-wrap gap-4"
            style={{ justifyContent: 'flex-start', paddingLeft: '16px' }}
          >
              <a 
                href="/quote" 
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Quote
              </a>
              <a 
                href="/learn-more" 
                className="bg-white hover:bg-blue-600 text-blue-600 hover:text-white border-2 border-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
              Learn More
            </a>
          </div>
        </div>
      </section>

        {/* Section 1: Three Insurance Plans and Coverage */}
        <section className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
          {/* Decorative background element */}
          <div aria-hidden="true" className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl">
            <div 
              style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
              className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
            ></div>
          </div>

          {/* Header - Aligned to left and centered */}
          <div className="flex justify-center">
            <div className="max-w-4xl text-left">
              <h2 className="text-base/7 font-semibold text-indigo-600">Travel Insurance</h2>
              <p className="mt-2 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
                Choose Your Coverage Policy
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <p className="mt-6 max-w-2xl text-pretty text-left text-lg font-medium text-gray-600 sm:text-xl/8">
              Choose the best policy according to your needs. Comprehensive coverage with medical protection, trip cancellation, and 24/7 emergency assistance worldwide.
            </p>
          </div>

          {/* Three Insurance Plans Grid - Aligned to left and centered */}
          <div className="flex justify-center">
            <div className="mt-16 grid max-w-lg grid-cols-1 items-start gap-8 sm:mt-20 lg:max-w-6xl lg:grid-cols-3">
            
            {/* REGULAR Single Trip */}
            <div className="rounded-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 hover:ring-2 hover:ring-blue-600 transition-all duration-300 sm:p-10">
              <h3 id="tier-regular" className="text-base/7 font-semibold text-blue-600 flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                REGULAR Single Trip
              </h3>
              <p className="mt-6 text-base/7 text-gray-600">
                Perfect for occasional travelers taking a single holiday. Best if you only take one holiday or are travelling to one destination.
              </p>
              <ul className="mt-8 space-y-3 text-sm/6 text-gray-600 sm:mt-10">
                <li className="flex gap-x-3">
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-6 w-5 flex-none text-blue-600">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
                  </svg>
                  Coverage up to 45 days
                </li>
                <li className="flex gap-x-3">
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-6 w-5 flex-none text-blue-600">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
                  </svg>
                  Medical coverage up to €1M
                </li>
                <li className="flex gap-x-3">
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-6 w-5 flex-none text-blue-600">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
                  </svg>
                  Trip cancellation & delays
                </li>
                <li className="flex gap-x-3">
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-6 w-5 flex-none text-blue-600">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
                  </svg>
                  Lost baggage protection
                </li>
                <li className="flex gap-x-3">
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-6 w-5 flex-none text-blue-600">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
                  </svg>
                  24/7 emergency assistance
                </li>
              </ul>
              <button 
                onClick={() => openModal('regular')}
                aria-describedby="tier-regular" 
                className="mt-8 block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-200 hover:ring-blue-300 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300 sm:mt-10"
              >
                More Info
              </button>
            </div>

            {/* ANNUAL MULTI-TRIP */}
            <div className="rounded-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 hover:ring-2 hover:ring-orange-600 transition-all duration-300 sm:p-10">
              <h3 id="tier-annual" className="text-base/7 font-semibold text-orange-600 flex items-center gap-2">
                <span className="text-2xl">🌍</span>
                ANNUAL MULTI-TRIP
              </h3>
              <p className="mt-6 text-base/7 text-gray-600">
                The ultimate solution for frequent travelers! Take unlimited trips throughout the year. Includes FREE 17-day Winter Sports coverage.
              </p>
              <ul className="mt-8 space-y-3 text-sm/6 text-gray-600 sm:mt-10">
                <li className="flex gap-x-3">
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-6 w-5 flex-none text-orange-600">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
                  </svg>
                  Unlimited trips per year
                </li>
                <li className="flex gap-x-3">
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-6 w-5 flex-none text-orange-600">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
                  </svg>
                  Each trip up to 45 days
                </li>
                <li className="flex gap-x-3">
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-6 w-5 flex-none text-orange-600">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
                  </svg>
                  FREE Winter Sports (17 days)
                </li>
                <li className="flex gap-x-3">
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-6 w-5 flex-none text-orange-600">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
                  </svg>
                  Medical coverage up to €1M
                </li>
                <li className="flex gap-x-3">
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-6 w-5 flex-none text-orange-600">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
                  </svg>
                  All single trip benefits
                </li>
                <li className="flex gap-x-3">
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-6 w-5 flex-none text-orange-600">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
                  </svg>
                  24/7 premium support
                </li>
              </ul>
              <button 
                onClick={() => openModal('annual')}
                aria-describedby="tier-annual" 
                className="mt-8 block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-orange-600 ring-1 ring-inset ring-orange-200 hover:ring-orange-300 hover:bg-orange-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-300 sm:mt-10"
              >
                More Info
              </button>
            </div>

            {/* COMPREHENSIVE Single Trip */}
            <div className="rounded-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 hover:ring-2 hover:ring-purple-600 transition-all duration-300 sm:p-10">
              <h3 id="tier-comprehensive" className="text-base/7 font-semibold text-purple-600 flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                COMPREHENSIVE
              </h3>
              <p className="mt-6 text-base/7 text-gray-600">
                Our most extensive coverage for extended trips up to 15 months. Perfect for gap years, working holidays, and long-term travel.
              </p>
              <ul className="mt-8 space-y-3 text-sm/6 text-gray-600 sm:mt-10">
                <li className="flex gap-x-3">
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-6 w-5 flex-none text-purple-600">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
                  </svg>
                  Coverage up to 15 months
                </li>
                <li className="flex gap-x-3">
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-6 w-5 flex-none text-purple-600">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
                  </svg>
                  Enhanced medical coverage
                </li>
                <li className="flex gap-x-3">
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-6 w-5 flex-none text-purple-600">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
                  </svg>
                  Adventure sports coverage
                </li>
                <li className="flex gap-x-3">
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-6 w-5 flex-none text-purple-600">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
                  </svg>
                  Business equipment protection
                </li>
                <li className="flex gap-x-3">
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-6 w-5 flex-none text-purple-600">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
                  </svg>
                  Extended personal liability
                </li>
              </ul>
              <button 
                onClick={() => openModal('comprehensive')}
                aria-describedby="tier-comprehensive" 
                className="mt-8 block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-purple-600 ring-1 ring-inset ring-purple-200 hover:ring-purple-300 hover:bg-purple-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-all duration-300 sm:mt-10"
              >
                More Info
              </button>
            </div>
            </div>
          </div>
        </section>

        {/* Section 2: Mobile App Advertising */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Manage Your Travel Insurance On-The-Go
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Download the Secmondo mobile app and have your policy details, emergency contacts, and claims process at your fingertips wherever you are in the world.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Instant Policy Access</h4>
                      <p className="text-gray-600">View and download your policy documents anytime</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Quick Claims Submission</h4>
                      <p className="text-gray-600">Submit claims with photos directly from your phone</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Emergency Assistance</h4>
                      <p className="text-gray-600">One-tap access to 24/7 emergency support</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a href="https://apps.apple.com" className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300">
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    App Store
                  </a>
                  <a href="https://play.google.com" className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300">
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    Google Play
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="bg-white rounded-2xl p-6 transform -rotate-3">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📱</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Secmondo App</h3>
                      <p className="text-gray-600 mb-4">Travel Insurance in Your Pocket</p>
                      <div className="space-y-2 text-left">
                        <div className="flex items-center text-sm text-gray-700">
                          <span className="text-green-600 mr-2">✓</span>
                          Digital policy cards
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <span className="text-green-600 mr-2">✓</span>
                          Offline access
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <span className="text-green-600 mr-2">✓</span>
                          Real-time claim tracking
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <span className="text-green-600 mr-2">✓</span>
                          Travel alerts & tips
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

        {/* Section 3: Partnership with Lloyd's and Helvetia */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Trusted by Industry Leaders
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our partnerships with Lloyd's of London and Helvetia Insurance ensure you receive world-class coverage and financial security
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Lloyd's Partnership */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-4">
                    L
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Lloyd's of London</h3>
                    <p className="text-gray-600">Since 1688</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Lloyd's of London is the world's leading insurance marketplace, providing specialist insurance services to businesses and individuals in over 200 countries. Our partnership ensures your policy is backed by centuries of financial stability and expertise.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <span className="text-blue-600 mr-2 font-bold">✓</span>
                    A+ Financial Strength Rating
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="text-blue-600 mr-2 font-bold">✓</span>
                    Global Claims Network
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="text-blue-600 mr-2 font-bold">✓</span>
                    335+ Years of Experience
                  </div>
                </div>
              </div>

              {/* Helvetia Partnership */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-4">
                    H
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Helvetia Insurance</h3>
                    <p className="text-gray-600">Since 1858</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Helvetia is one of Switzerland's leading insurance companies with over 165 years of experience. Their commitment to quality service and financial security makes them the perfect partner for comprehensive travel insurance.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <span className="text-red-600 mr-2 font-bold">✓</span>
                    Swiss Quality & Reliability
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="text-red-600 mr-2 font-bold">✓</span>
                    European Market Leader
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="text-red-600 mr-2 font-bold">✓</span>
                    165+ Years of Trust
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 bg-gray-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">500K+</div>
                  <div className="text-gray-600">Policies Sold</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-600 mb-2">200+</div>
                  <div className="text-gray-600">Countries Covered</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
                  <div className="text-gray-600">Satisfaction Rate</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
                  <div className="text-gray-600">Support Available</div>
                </div>
            </div>
          </div>
        </div>
      </section>

        {/* Section 4: User Testimonials / Blog */}
        <section className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Stories from Our Travelers
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real experiences from real people who trust Secmondo for their travel insurance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                      SJ
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">Sarah Johnson</h4>
                      <p className="text-gray-600 text-sm">Backpacker, Thailand</p>
                    </div>
                  </div>
                  <div className="text-yellow-400 text-xl mb-4">⭐⭐⭐⭐⭐</div>
                  <h5 className="text-xl font-semibold text-gray-900 mb-3">
                    "Secmondo Saved My Trip!"
                  </h5>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    I fell ill in Thailand and needed emergency medical care. Secmondo covered everything - from hospital bills to my extended stay. The 24/7 support team was amazing and spoke my language. I can't imagine traveling without them now!
                  </p>
                  <div className="text-sm text-gray-500">
                    Posted 2 weeks ago
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                <div className="h-2 bg-gradient-to-r from-orange-600 to-orange-400"></div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                      MC
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">Mike Chen</h4>
                      <p className="text-gray-600 text-sm">Business Traveler</p>
                    </div>
                  </div>
                  <div className="text-yellow-400 text-xl mb-4">⭐⭐⭐⭐⭐</div>
                  <h5 className="text-xl font-semibold text-gray-900 mb-3">
                    "Perfect for Frequent Travelers"
                  </h5>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    As someone who travels 20+ times a year for work, the Annual Multi-Trip policy is a game-changer. When my flight was cancelled, Secmondo covered my hotel and meals without hassle. Fast, reliable, and worth every penny.
                  </p>
                  <div className="text-sm text-gray-500">
                    Posted 1 month ago
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                <div className="h-2 bg-gradient-to-r from-purple-600 to-purple-400"></div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                      ER
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">Emma Rodriguez</h4>
                      <p className="text-gray-600 text-sm">Family Vacation</p>
                    </div>
                  </div>
                  <div className="text-yellow-400 text-xl mb-4">⭐⭐⭐⭐⭐</div>
                  <h5 className="text-xl font-semibold text-gray-900 mb-3">
                    "Peace of Mind for Families"
                  </h5>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Traveling with kids means expecting the unexpected. When our luggage was lost, Secmondo reimbursed us quickly so we could buy essentials. Their mobile app made everything so easy. Highly recommend for families!
                  </p>
                  <div className="text-sm text-gray-500">
                    Posted 3 weeks ago
              </div>
            </div>
              </div>
            </div>

            {/* Blog CTA */}
            <div className="mt-16 text-center">
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Want to Share Your Secmondo Story?
                </h3>
                <p className="text-gray-600 mb-6">
                  We'd love to hear about your travel experiences and how Secmondo helped you along the way.
                </p>
                <a 
                  href="/contact" 
                  className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Share Your Story
                </a>
            </div>
          </div>
        </div>
      </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Travel with Confidence?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Get a personalized quote in under 2 minutes
            </p>
            <a 
              href="/quote" 
              className="inline-block bg-white text-blue-600 hover:bg-gray-100 px-10 py-5 rounded-lg font-bold text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
            >
              Get Your Quote Now
            </a>
        </div>
      </section>
      </div>

      <PolicyModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        policyType={modalState.policyType}
        title={modalState.title}
        content={modalState.content}
      />
    </>
  );
};

export default Home;
