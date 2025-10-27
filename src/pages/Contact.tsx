import React, { useState, useEffect } from 'react';
// Import API service for database integration
import { submitContact } from '../services/apiService';

interface ContactProps {
  onNavigate?: (page: string) => void;
}

const Contact: React.FC<ContactProps> = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Call API service to submit the contact form data
      const response = await submitContact(formData);
      
      if (response.status === 'success') {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        // Auto-hide success message after 5 seconds
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        throw new Error(response.message || 'Failed to submit message');
      }
    } catch (error) {
      // console.error('Error submitting form:', error);
      setSubmitStatus('error');
      // Auto-hide error message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12 px-6 sm:py-16 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            We're here to help with all your travel insurance needs
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info Section */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg">
            <h2 className="text-center mb-10 text-2xl font-bold text-gray-900 relative pb-4">
              Get in Touch
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded"></span>
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-600 hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  📞 Phone Support
                </h3>
                <p className="text-gray-600 mb-2">Available 24/7 for emergencies</p>
                <a href="tel:+1-800-123-4567" className="font-semibold text-blue-600 hover:bg-blue-600 hover:text-white px-2 py-1 rounded transition-all duration-300 inline-block">
                  +1-800-123-4567
                </a>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-orange-50 hover:border-orange-600 hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold text-orange-600 mb-2">
                  ✉️ Email Support
                </h3>
                <p className="text-gray-600 mb-2">Response within 24 hours</p>
                <a href="mailto:support@travelsafe.com" className="font-semibold text-orange-600 hover:bg-orange-600 hover:text-white px-2 py-1 rounded transition-all duration-300 inline-block">
                  support@travelsafe.com
                </a>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-purple-50 hover:border-purple-600 hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold text-purple-600 mb-2">
                  🏢 Office Hours
                </h3>
                <p className="text-gray-600">Monday - Friday: 8:00 AM - 8:00 PM EST</p>
                <p className="text-gray-600">Saturday: 9:00 AM - 5:00 PM EST</p>
                <p className="text-gray-600">Sunday: Emergency support only</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-600 hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  🚨 Emergency Claims
                </h3>
                <p className="text-gray-600 mb-2">24/7 emergency assistance</p>
                <a href="tel:+1-800-EMERGENCY" className="font-semibold text-red-600 hover:bg-red-600 hover:text-white px-2 py-1 rounded transition-all duration-300 inline-block">
                  +1-800-EMERGENCY
                </a>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-green-50 hover:border-green-600 hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  💬 Live Chat
                </h3>
                <p className="text-gray-600 mb-2">Get instant help online</p>
                <button 
                  type="button" 
                  className="font-semibold text-green-600 hover:bg-green-600 hover:text-white px-2 py-1 rounded transition-all duration-300"
                  onClick={() => alert('Live chat coming soon!')}
                >
                  Start Chat
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-indigo-50 hover:border-indigo-600 hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                  📱 Mobile App
                </h3>
                <p className="text-gray-600 mb-2">Manage your policy on the go</p>
                <button 
                  type="button" 
                  className="font-semibold text-indigo-600 hover:bg-indigo-600 hover:text-white px-2 py-1 rounded transition-all duration-300"
                  onClick={() => alert('Download our mobile app!')}
                >
                  Download App
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-3xl shadow-lg">
            <h2 className="text-center mb-10 text-2xl font-bold text-gray-900 relative pb-4">
              Send us a Message
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded"></span>
            </h2>
            
            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg font-medium transition-all duration-300">
                ✅ Thank you for your message! We'll get back to you soon.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg font-medium transition-all duration-300">
                ❌ There was an error submitting your message. Please try again.
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="name" className="block mb-2 font-semibold text-gray-900 text-sm">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 font-semibold text-gray-900 text-sm">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="subject" className="block mb-2 font-semibold text-gray-900 text-sm">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-300 cursor-pointer"
                required
              >
                <option value="">Select a subject</option>
                <option value="quote">Get a Quote</option>
                <option value="claim">File a Claim</option>
                <option value="policy">Policy Questions</option>
                <option value="billing">Billing Support</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block mb-2 font-semibold text-gray-900 text-sm">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us how we can help you..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-y min-h-[120px]"
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
