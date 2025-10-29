import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    // Special handling for /quote to force refresh
    if (path === '/quote') {
      // Force a page refresh to restart the quote form
      window.location.href = '/quote';
      return;
    }
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav aria-label="Global" className="relative flex items-center px-6 py-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
  <button onClick={() => handleNavigation('/')} className="flex items-center gap-3">
    <span className="sr-only">Secmondo</span>
    <div className="flex items-center gap-3">
      <h1 className="text-3xl font-bold text-black">Secmondo</h1>
      <span className="text-1xs text-gray-500 hidden sm:block relative translate-y-1 leading-tight">
        We make dreams secure.
      </span>
    </div>
  </button>
</div>
        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-6 w-6">
              <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Desktop menu - Centered */}
        <div className="hidden lg:flex lg:gap-x-12 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
          {/* Products dropdown */}
          <div className="relative">
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              onBlur={() => setTimeout(() => setProductsOpen(false), 200)}
              className="flex items-center gap-x-1 text-3sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors"
            >
              Products
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-5 w-5 flex-none text-gray-400">
                <path d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" fillRule="evenodd" />
              </svg>
            </button>

            {productsOpen && (
              <div className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  <div className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
                    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-6 w-6 text-gray-600 group-hover:text-indigo-600">
                        <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="flex-auto">
                      <button onClick={() => handleNavigation('/singletrip')} className="block font-semibold text-gray-900 text-left">
                        Single Trip
                        <span className="absolute inset-0"></span>
                      </button>
                      <p className="mt-1 text-gray-600">Single trip travel insurance</p>
                    </div>
                  </div>
                  <div className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
                    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-6 w-6 text-gray-600 group-hover:text-indigo-600">
                        <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="flex-auto">
                      <button onClick={() => handleNavigation('/annual-multitrip')} className="block font-semibold text-gray-900 text-left">
                        Annual Multi-Trip
                        <span className="absolute inset-0"></span>
                      </button>
                      <p className="mt-1 text-gray-600">Year-round travel protection</p>
                    </div>
                  </div>
                  <div className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
                    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-6 w-6 text-gray-600 group-hover:text-indigo-600">
                        <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="flex-auto">
                      <button onClick={() => handleNavigation('/longstaytrip')} className="block font-semibold text-gray-900 text-left">
                        Long Stay Trip
                        <span className="absolute inset-0"></span>
                      </button>
                      <p className="mt-1 text-gray-600">Maximum coverage for peace of mind</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button onClick={() => handleNavigation('/about')} className="text-3sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors">
            About
          </button>
          <button onClick={() => handleNavigation('/contact')} className="text-3sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors">
            Contact
          </button>
          <button onClick={() => handleNavigation('/learn-more')} className="text-3sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors border-0 outline-none focus:outline-none">
            Learn More
          </button>
        </div>

        {/* Get Quote button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button
            onClick={() => handleNavigation('/quote')}
            className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:from-orange-600 hover:to-orange-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            GET QUOTE <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
        </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <button onClick={() => handleNavigation('/')} className="-m-1.5 p-1.5">
                <span className="sr-only">Secmondo</span>
                <h1 className="text-2xl font-bold text-indigo-600">Secmondo</h1>
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-6 w-6">
                  <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <div className="-mx-3">
                    <button
                      type="button"
                      onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                      className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Products
                      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={`h-5 w-5 flex-none transition-transform ${mobileProductsOpen ? 'rotate-180' : ''}`}>
                        <path d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" fillRule="evenodd" />
                      </svg>
                    </button>
                    {mobileProductsOpen && (
                      <div className="mt-2 space-y-2">
                        <button onClick={() => handleNavigation('/regular-stay')} className="block w-full text-left rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                          Regular Stay
                        </button>
                        <button onClick={() => handleNavigation('/annual-multi-trip')} className="block w-full text-left rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                          Annual Multi-Trip
                        </button>
                        <button onClick={() => handleNavigation('/comprehensive')} className="block w-full text-left rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                          Comprehensive
                        </button>
                      </div>
                    )}
                  </div>
                  <button onClick={() => handleNavigation('/about')} className="-mx-3 block w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    About
                  </button>
                  <button onClick={() => handleNavigation('/contact')} className="-mx-3 block w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    Contact
                  </button>
                  <button onClick={() => handleNavigation('/learn-more')} className="-mx-3 block w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 border-0 outline-none focus:outline-none">
                    Learn More
                  </button>
                </div>
                <div className="py-6">
                  <button
                    onClick={() => handleNavigation('/quote')}
                    className="w-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2.5 text-base font-semibold text-white shadow-md hover:from-orange-600 hover:to-orange-700"
                  >
                    GET QUOTE
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>
      )}
    </header>
  );
};

export default Header;
