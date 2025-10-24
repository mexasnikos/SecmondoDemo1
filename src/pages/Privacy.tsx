import React, { useEffect } from 'react';

interface PrivacyProps {
  onNavigate?: (page: string) => void;
}

const Privacy: React.FC<PrivacyProps> = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-5">
        <h1 className="text-4xl text-gray-900 mb-8 text-center font-bold">
          Privacy Policy
        </h1>
        
        <div className="leading-relaxed text-gray-700">
          <section className="mb-8">
            <h2 className="text-2xl text-blue-600 mb-4 font-semibold">Cookie Policy</h2>
            <p className="mb-4">
              TravelSafe uses cookies to enhance your browsing experience, analyze site traffic, 
              and personalize content. By continuing to use our website, you consent to our use of cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl text-blue-600 mb-4 font-semibold">What are Cookies?</h2>
            <p className="mb-4">
              Cookies are small text files that are stored on your device when you visit our website. 
              They help us provide you with a better user experience and allow certain features to function properly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl text-blue-600 mb-4 font-semibold">Types of Cookies We Use</h2>
            <ul className="pl-6 list-disc space-y-2">
              <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Marketing Cookies:</strong> Used to show relevant advertisements</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl text-blue-600 mb-4 font-semibold">Managing Cookies</h2>
            <p className="mb-4">
              You can manage your cookie preferences at any time by clicking the "Cookie Settings" 
              link in our footer or through your browser settings. Note that disabling certain cookies 
              may affect website functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl text-blue-600 mb-4 font-semibold">Data Protection</h2>
            <p className="mb-4">
              We are committed to protecting your privacy and personal data in accordance with GDPR 
              and other applicable privacy laws. For more information about how we collect, use, 
              and protect your data, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-blue-600 mb-4 font-semibold">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about our privacy practices or cookie policy, 
              please contact us at privacy@travelsafe.com or call +1-800-123-4567.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
