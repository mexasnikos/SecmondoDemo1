import React, { useEffect } from 'react';

interface PrivacyProps {
  onNavigate?: (page: string) => void;
}

const Privacy: React.FC<PrivacyProps> = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div style={{ padding: '3rem 0', background: 'white', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#1a1a1a', marginBottom: '2rem', textAlign: 'center' }}>
          Privacy Policy
        </h1>
        
        <div style={{ lineHeight: '1.8', color: '#444' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#0077b6', marginBottom: '1rem' }}>Cookie Policy</h2>
            <p>
              TravelSafe uses cookies to enhance your browsing experience, analyze site traffic, 
              and personalize content. By continuing to use our website, you consent to our use of cookies.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#0077b6', marginBottom: '1rem' }}>What are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit our website. 
              They help us provide you with a better user experience and allow certain features to function properly.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#0077b6', marginBottom: '1rem' }}>Types of Cookies We Use</h2>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Marketing Cookies:</strong> Used to show relevant advertisements</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#0077b6', marginBottom: '1rem' }}>Managing Cookies</h2>
            <p>
              You can manage your cookie preferences at any time by clicking the "Cookie Settings" 
              link in our footer or through your browser settings. Note that disabling certain cookies 
              may affect website functionality.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#0077b6', marginBottom: '1rem' }}>Data Protection</h2>
            <p>
              We are committed to protecting your privacy and personal data in accordance with GDPR 
              and other applicable privacy laws. For more information about how we collect, use, 
              and protect your data, please contact us.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: '#0077b6', marginBottom: '1rem' }}>Contact Us</h2>
            <p>
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
