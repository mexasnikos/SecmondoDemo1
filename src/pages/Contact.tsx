import React, { useState, useEffect } from 'react';
import './Contact.css';
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
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>We're here to help with all your travel insurance needs</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            
            <div className="contact-method">
              <h3>📞 Phone Support</h3>
              <p>Available 24/7 for emergencies</p>
              <a href="tel:+1-800-123-4567">+1-800-123-4567</a>
            </div>

            <div className="contact-method">
              <h3>✉️ Email Support</h3>
              <p>Response within 24 hours</p>
              <a href="mailto:support@travelsafe.com">support@travelsafe.com</a>
            </div>

            <div className="contact-method">
              <h3>🏢 Office Hours</h3>
              <p>Monday - Friday: 8:00 AM - 8:00 PM EST</p>
              <p>Saturday: 9:00 AM - 5:00 PM EST</p>
              <p>Sunday: Emergency support only</p>
            </div>

            <div className="contact-method">
              <h3>🚨 Emergency Claims</h3>
              <p>24/7 emergency assistance</p>
              <a href="tel:+1-800-EMERGENCY">+1-800-EMERGENCY</a>
            </div>

            <div className="contact-method">
              <h3>💬 Live Chat</h3>
              <p>Get instant help online</p>
              <button 
                type="button" 
                className="contact-button"
                onClick={() => alert('Live chat coming soon!')}
              >
                Start Chat
              </button>
            </div>

            <div className="contact-method">
              <h3>📱 Mobile App</h3>
              <p>Manage your policy on the go</p>
              <button 
                type="button" 
                className="contact-button"
                onClick={() => alert('Download our mobile app!')}
              >
                Download App
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <h2>Send us a Message</h2>
            
            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="status-message success">
                ✅ Thank you for your message! We'll get back to you soon.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="status-message error">
                ❌ There was an error submitting your message. Please try again.
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
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

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us how we can help you..."
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
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
