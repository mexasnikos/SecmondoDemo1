import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Travel Insurance Column */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-4">Travel Insurance</h3>
            <ul className="space-y-3">
              <li>
                <a href="/singletrip" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Regular Single Trip
                </a>
              </li>
              <li>
                <a href="/annual-multitrip" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Annual Multi-Trip
                </a>
              </li>
              <li>
                <a href="/longstaytrip" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Comprehensive Coverage
                </a>
              </li>
            </ul>
          </div>

          {/* Popular Destinations Column */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-4">Popular Destinations</h3>
            <ul className="space-y-3">
              <li>
                <a href="/spain" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Spain
                </a>
              </li>
              <li>
                <a href="/puerto-rico" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Puerto Rico
                </a>
              </li>
              <li>
                <a href="/netherlands" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Netherlands
                </a>
              </li>
              <li>
                <a href="/switzerland" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Switzerland
                </a>
              </li>
              <li>
                <a href="/hong-kong" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Hong Kong
                </a>
              </li>
              <li>
                <a href="/indonesia" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Indonesia
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/responsible-travel" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Responsible Travel
                </a>
              </li>
              <li>
                <a href="/reviews" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-4">Contact Us</h3>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Need help? We're here for you.
              </p>
              <div className="space-y-2">
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">WhatsApp:</span> +34xxxxxxxx
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Email:</span>{' '}
                  <a href="mailto:hello@secmondo.com" className="text-indigo-600 hover:text-indigo-700">
                    hello@secmondo.com
                  </a>
                </p>
              </div>
              <p className="text-gray-500 text-xs">
                Hours: Mon-Fri, 9:00 AM - 6:00 PM (GMT +1)
              </p>
              <p className="text-gray-600 text-sm">
                24/7 assistance:{' '}
                <a href="/assistance" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                  Click here
                </a>
              </p>
              
              {/* App Download Buttons */}
              <div className="pt-4">
                <p className="text-gray-900 font-semibold mb-3 text-sm">Download our app</p>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://play.google.com/store"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs">GET IT ON</div>
                      <div className="text-sm font-semibold">Google Play</div>
                    </div>
                  </a>
                  <a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05,20.28C16.3,21.5 15.46,22.69 14.5,22.7C13.35,22.73 12.96,22 11.67,22C10.38,22 9.95,22.7 8.87,22.73C7.96,22.75 7.05,21.46 6.3,20.28C4.75,17.78 3.56,13.13 5.19,9.92C6,8.32 7.64,7.34 9.43,7.31C10.54,7.28 11.57,8.08 12.22,8.08C12.87,8.08 14.14,7.1 15.5,7.25C16.09,7.27 17.85,7.5 18.95,9.24C18.87,9.29 17.15,10.29 17.17,12.45C17.19,15.07 19.42,15.95 19.44,15.96C19.42,16 19.05,17.16 18.25,18.37C17.58,19.42 16.89,20.27 17.05,20.28M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="text-sm font-semibold">App Store</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media & Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Social Media */}
          <div className="flex  justify-center mb-8">
            <div className="flex items-center gap-4">
              <span className="text-gray-600  font-semibold text-sm">Follow us:</span>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com/secmondo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://tiktok.com/@secmondo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a
                  href="https://x.com/secmondo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://facebook.com/secmondo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/company/secmondo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Links */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900">Secmondo</h2>
              <span className="text-gray-400 text-sm">© 2025 All rights reserved</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="/disclaimer" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Disclaimer
              </a>
              <a href="/privacy" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Terms & Conditions
              </a>
              <a href="/cookies" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
