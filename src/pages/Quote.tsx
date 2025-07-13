import React, { useState, useEffect } from 'react';
import './Quote.css';

interface TravelerInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  vaxId: string;
  nationality: string;
}

interface QuoteOption {
  id: string;
  name: string;
  type: 'basic' | 'standard' | 'premium';
  price: number;
  coverage: {
    medical: string;
    baggage: string;
    cancellation: string;
    activities: string[];
  };
  features: string[];
}

interface QuoteFormData {
  // Trip Details
  destination: string;
  startDate: string;
  endDate: string;
  tripType: 'single' | 'annual' | 'comprehensive';
  
  // Traveler Information
  numberOfTravelers: number;
  travelers: TravelerInfo[];
  
  // Selected Quote
  selectedQuote: QuoteOption | null;
  
  // Payment Details
  paymentMethod: 'card' | 'bank' | 'paypal';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

type WizardPhase = 1 | 2 | 3 | 4 | 5 | 6;

const Quote: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<WizardPhase>(1);
  const [formData, setFormData] = useState<QuoteFormData>({
    destination: '',
    startDate: '',
    endDate: '',
    tripType: 'single',
    numberOfTravelers: 1,
    travelers: [
      {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        phone: '',
        vaxId: '',
        nationality: ''
      }
    ],
    selectedQuote: null,
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    }
  });

  const [quoteOptions, setQuoteOptions] = useState<QuoteOption[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const generateQuoteOptions = (): QuoteOption[] => {
    const days = formData.startDate && formData.endDate 
      ? Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 3600 * 24))
      : 7;

    let basePrice = formData.tripType === 'annual' ? 99 : 40;
    const dailyRate = formData.tripType === 'annual' ? 0 : 5;
    const tripMultiplier = formData.tripType === 'comprehensive' ? 1.5 : 1;

    const options: QuoteOption[] = [
      {
        id: 'basic',
        name: formData.tripType === 'annual' ? 'Annual Basic' : 'Regular Basic',
        type: 'basic',
        price: Math.round((basePrice + (days * dailyRate)) * formData.numberOfTravelers * tripMultiplier),
        coverage: {
          medical: formData.tripType === 'annual' ? '€5,000,000' : '€2,000,000',
          baggage: '€1,000',
          cancellation: '€2,000',
          activities: ['Standard activities']
        },
        features: [
          'Emergency Medical Coverage',
          'Trip Cancellation',
          'Baggage Protection',
          '24/7 Assistance'
        ]
      },
      {
        id: 'standard',
        name: formData.tripType === 'annual' ? 'Annual Standard' : 'Regular Standard',
        type: 'standard',
        price: Math.round((basePrice + (days * dailyRate)) * 1.3 * formData.numberOfTravelers * tripMultiplier),
        coverage: {
          medical: formData.tripType === 'annual' ? '€10,000,000' : '€5,000,000',
          baggage: '€2,500',
          cancellation: '€5,000',
          activities: ['Standard activities', 'Adventure sports']
        },
        features: [
          'Enhanced Medical Coverage',
          'Trip Cancellation & Curtailment',
          'Enhanced Baggage Protection',
          'Adventure Sports Coverage',
          '24/7 Assistance',
          'Travel Delay Compensation'
        ]
      },
      {
        id: 'premium',
        name: formData.tripType === 'annual' ? 'Annual Premium' : 'Comprehensive Premium',
        type: 'premium',
        price: Math.round((basePrice + (days * dailyRate)) * 1.8 * formData.numberOfTravelers * tripMultiplier),
        coverage: {
          medical: formData.tripType === 'annual' ? '€10,000,000' : '€10,000,000',
          baggage: '€5,000',
          cancellation: '€10,000',
          activities: ['All activities', 'Extreme sports', 'Winter sports']
        },
        features: [
          'Maximum Medical Coverage',
          'Comprehensive Trip Protection',
          'Premium Baggage Coverage',
          'All Sports & Activities',
          '24/7 VIP Assistance',
          'Travel Delay & Missed Connections',
          'Personal Liability Coverage',
          'Emergency Cash Advance'
        ]
      }
    ];

    return options;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTravelerChange = (index: number, field: keyof TravelerInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      travelers: prev.travelers.map((traveler, i) => 
        i === index ? { ...traveler, [field]: value } : traveler
      )
    }));
  };

  const handleNumberOfTravelersChange = (count: number) => {
    setFormData(prev => {
      const travelers = [...prev.travelers];
      
      if (count > travelers.length) {
        // Add new travelers
        for (let i = travelers.length; i < count; i++) {
          travelers.push({
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            email: '',
            phone: '',
            vaxId: '',
            nationality: ''
          });
        }
      } else if (count < travelers.length) {
        // Remove travelers
        travelers.splice(count);
      }
      
      return {
        ...prev,
        numberOfTravelers: count,
        travelers
      };
    });
  };

  const handleBillingAddressChange = (field: keyof QuoteFormData['billingAddress'], value: string) => {
    setFormData(prev => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [field]: value
      }
    }));
  };

  const nextPhase = () => {
    if (currentPhase === 1) {
      // Generate quotes when moving from phase 1 to 2
      const options = generateQuoteOptions();
      setQuoteOptions(options);
    }
    
    if (currentPhase < 6) {
      setCurrentPhase((prev) => (prev + 1) as WizardPhase);
      window.scrollTo(0, 0);
    }
  };

  const prevPhase = () => {
    if (currentPhase > 1) {
      setCurrentPhase((prev) => (prev - 1) as WizardPhase);
      window.scrollTo(0, 0);
    }
  };

  const selectQuote = (quote: QuoteOption) => {
    setFormData(prev => ({
      ...prev,
      selectedQuote: quote
    }));
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    nextPhase(); // Move to documents phase
  };

  const isPhaseValid = (phase: WizardPhase): boolean => {
    switch (phase) {
      case 1:
        return !!(
          formData.destination &&
          formData.startDate &&
          formData.endDate &&
          formData.tripType &&
          formData.travelers.every(t => t.firstName && t.lastName && t.dateOfBirth && t.email)
        );
      case 2:
        return !!formData.selectedQuote;
      case 3:
        return true; // Summary phase is always valid
      case 4:
        return true; // Confirmation phase is always valid
      case 5:
        return !!(
          formData.paymentMethod &&
          (formData.paymentMethod !== 'card' || (formData.cardNumber && formData.expiryDate && formData.cvv)) &&
          formData.billingAddress.street &&
          formData.billingAddress.city &&
          formData.billingAddress.postalCode &&
          formData.billingAddress.country
        );
      case 6:
        return true; // Documents phase is always valid
      default:
        return false;
    }
  };

  const renderPhase1 = () => (
    <div className="wizard-phase">
      <h2>Trip Details & Traveler Information</h2>
      
      <div className="form-section">
        <h3>Trip Details</h3>
        
        <div className="form-group">
          <label htmlFor="tripType">Trip Type</label>
          <select
            id="tripType"
            value={formData.tripType}
            onChange={(e) => handleInputChange('tripType', e.target.value)}
            required
          >
            <option value="single">Regular Single Trip Insurance</option>
            <option value="annual">Annual Multi-Trip Travel Insurance</option>
            <option value="comprehensive">Comprehensive Single Trip Insurance</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="destination">Destination</label>
          <input
            type="text"
            id="destination"
            value={formData.destination}
            onChange={(e) => handleInputChange('destination', e.target.value)}
            placeholder="e.g., Europe, Thailand, USA"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Departure Date</label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">Return Date</label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="numberOfTravelers">Number of Travelers</label>
          <select
            id="numberOfTravelers"
            value={formData.numberOfTravelers}
            onChange={(e) => handleNumberOfTravelersChange(parseInt(e.target.value))}
          >
            {[1,2,3,4,5,6,7,8].map(num => (
              <option key={num} value={num}>{num} Traveler{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-section">
        <h3>Traveler Information</h3>
        {formData.travelers.map((traveler, index) => (
          <div key={index} className="traveler-info">
            <h4>Traveler {index + 1}</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={traveler.firstName}
                  onChange={(e) => handleTravelerChange(index, 'firstName', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={traveler.lastName}
                  onChange={(e) => handleTravelerChange(index, 'lastName', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={traveler.dateOfBirth}
                  onChange={(e) => handleTravelerChange(index, 'dateOfBirth', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nationality</label>
                <input
                  type="text"
                  value={traveler.nationality}
                  onChange={(e) => handleTravelerChange(index, 'nationality', e.target.value)}
                  placeholder="e.g., Greek, German"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={traveler.email}
                  onChange={(e) => handleTravelerChange(index, 'email', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={traveler.phone}
                  onChange={(e) => handleTravelerChange(index, 'phone', e.target.value)}
                  placeholder="+30 123 456 7890"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>VAX ID</label>
              <input
                type="text"
                value={traveler.vaxId}
                onChange={(e) => handleTravelerChange(index, 'vaxId', e.target.value)}
                placeholder="VAX ID"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPhase2 = () => (
    <div className="wizard-phase">
      <h2>Choose Your Insurance Plan</h2>
      <p>Select the coverage that best fits your travel needs.</p>
      
      <div className="quote-options">
        {quoteOptions.map(option => (
          <div 
            key={option.id} 
            className={`quote-option ${formData.selectedQuote?.id === option.id ? 'selected' : ''}`}
            onClick={() => selectQuote(option)}
          >
            <div className="quote-header">
              <h3>{option.name}</h3>
              <div className="price">
                <span className="currency">€</span>
                <span className="amount">{option.price}</span>
              </div>
            </div>
            
            <div className="coverage-details">
              <div className="coverage-item">
                <strong>Medical Coverage:</strong> {option.coverage.medical}
              </div>
              <div className="coverage-item">
                <strong>Baggage Coverage:</strong> {option.coverage.baggage}
              </div>
              <div className="coverage-item">
                <strong>Cancellation:</strong> {option.coverage.cancellation}
              </div>
            </div>
            
            <div className="features-list">
              {option.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <span className="checkmark">✓</span>
                  {feature}
                </div>
              ))}
            </div>
            
            <button className={`select-btn ${formData.selectedQuote?.id === option.id ? 'selected' : ''}`}>
              {formData.selectedQuote?.id === option.id ? 'Selected' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPhase3 = () => (
    <div className="wizard-phase">
      <h2>Review Your Details</h2>
      <p>Please review all information before proceeding to payment.</p>
      
      <div className="summary-sections">
        <div className="summary-section">
          <h3>Trip Details</h3>
          <div className="summary-item">
            <strong>Trip Type:</strong> {
              formData.tripType === 'single' ? 'Regular Single Trip' :
              formData.tripType === 'annual' ? 'Annual Multi-Trip' :
              'Comprehensive Single Trip'
            }
          </div>
          <div className="summary-item">
            <strong>Destination:</strong> {formData.destination}
          </div>
          <div className="summary-item">
            <strong>Travel Dates:</strong> {formData.startDate} to {formData.endDate}
          </div>
          <div className="summary-item">
            <strong>Number of Travelers:</strong> {formData.numberOfTravelers}
          </div>
        </div>

        <div className="summary-section">
          <h3>Travelers</h3>
          {formData.travelers.map((traveler, index) => (
            <div key={index} className="traveler-summary">
              <h4>Traveler {index + 1}</h4>
              <div className="summary-item">
                <strong>Name:</strong> {traveler.firstName} {traveler.lastName}
              </div>
              <div className="summary-item">
                <strong>Date of Birth:</strong> {traveler.dateOfBirth}
              </div>
              <div className="summary-item">
                <strong>Email:</strong> {traveler.email}
              </div>
              <div className="summary-item">
                <strong>Nationality:</strong> {traveler.nationality}
              </div>
            </div>
          ))}
        </div>

        <div className="summary-section">
          <h3>Selected Insurance Plan</h3>
          {formData.selectedQuote && (
            <div className="selected-plan-summary">
              <div className="summary-item">
                <strong>Plan:</strong> {formData.selectedQuote.name}
              </div>
              <div className="summary-item">
                <strong>Total Cost:</strong> €{formData.selectedQuote.price}
              </div>
              <div className="summary-item">
                <strong>Medical Coverage:</strong> {formData.selectedQuote.coverage.medical}
              </div>
              <div className="summary-item">
                <strong>Baggage Coverage:</strong> {formData.selectedQuote.coverage.baggage}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPhase4 = () => (
    <div className="wizard-phase">
      <h2>Confirmation</h2>
      <p>Please confirm that all details are correct before proceeding to payment.</p>
      
      <div className="confirmation-box">
        <div className="confirmation-item">
          <strong>Trip:</strong> {formData.destination} ({formData.startDate} to {formData.endDate})
        </div>
        <div className="confirmation-item">
          <strong>Travelers:</strong> {formData.numberOfTravelers} person{formData.numberOfTravelers > 1 ? 's' : ''}
        </div>
        <div className="confirmation-item">
          <strong>Plan:</strong> {formData.selectedQuote?.name}
        </div>
        <div className="confirmation-item total">
          <strong>Total Amount:</strong> €{formData.selectedQuote?.price}
        </div>
      </div>
      
      <div className="terms-section">
        <label className="checkbox-option">
          <input type="checkbox" required />
          <span>I agree to the <a href="/privacy" target="_blank">Terms and Conditions</a></span>
        </label>
        <label className="checkbox-option">
          <input type="checkbox" required />
          <span>I agree to the <a href="/privacy" target="_blank">Privacy Policy</a></span>
        </label>
        <label className="checkbox-option">
          <input type="checkbox" />
          <span>I would like to receive marketing emails about travel insurance offers</span>
        </label>
      </div>
    </div>
  );

  const renderPhase5 = () => (
    <div className="wizard-phase">
      <h2>Payment Details</h2>
      <p>Enter your payment information to complete your purchase.</p>
      
      <div className="payment-section">
        <div className="payment-methods">
          <h3>Payment Method</h3>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === 'card'}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              />
              <span>Credit/Debit Card</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={formData.paymentMethod === 'bank'}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              />
              <span>Bank Transfer</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={formData.paymentMethod === 'paypal'}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              />
              <span>PayPal</span>
            </label>
          </div>
        </div>

        {formData.paymentMethod === 'card' && (
          <div className="card-details">
            <h3>Card Details</h3>
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  placeholder="123"
                  required
                />
              </div>
            </div>
          </div>
        )}

        <div className="billing-address">
          <h3>Billing Address</h3>
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              value={formData.billingAddress.street}
              onChange={(e) => handleBillingAddressChange('street', e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={formData.billingAddress.city}
                onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                value={formData.billingAddress.postalCode}
                onChange={(e) => handleBillingAddressChange('postalCode', e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              value={formData.billingAddress.country}
              onChange={(e) => handleBillingAddressChange('country', e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="payment-summary">
        <div className="summary-item">
          <strong>Total Amount: €{formData.selectedQuote?.price}</strong>
        </div>
      </div>
    </div>
  );

  const renderPhase6 = () => (
    <div className="wizard-phase">
      <h2>🎉 Congratulations!</h2>
      <p>Your travel insurance has been successfully purchased.</p>
      
      <div className="success-message">
        <div className="policy-number">
          <strong>Policy Number:</strong> TI-{Date.now().toString().slice(-8)}
        </div>
        <div className="confirmation-email">
          A confirmation email has been sent to {formData.travelers[0]?.email}
        </div>
      </div>
      
      <div className="documents-section">
        <h3>Your Documents</h3>
        <div className="document-links">
          <a href="/Globelink_Wording_EU_V2_07.03.2025.pdf" className="document-link" download>
            📄 Download Policy Certificate
          </a>
          <a href="/Globelink_Wording_EU_V2_07.03.2025.pdf" className="document-link" download>
            📋 Download Policy Terms & Conditions
          </a>
          <a href="/Globelink_Wording_EU_V2_07.03.2025.pdf" className="document-link" download>
            🆔 Download Insurance Card
          </a>
          <a href="/Globelink_Wording_EU_V2_07.03.2025.pdf" className="document-link" download>
            📞 Emergency Contact Information
          </a>
        </div>
      </div>
      
      <div className="next-steps">
        <h3>What's Next?</h3>
        <ul>
          <li>Save your policy documents in a safe place</li>
          <li>Keep the emergency contact numbers with you while traveling</li>
          <li>Download our mobile app for easy access to your policy</li>
          <li>Contact us anytime at +30 6974907500 for assistance</li>
        </ul>
      </div>
    </div>
  );

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 1:
        return renderPhase1();
      case 2:
        return renderPhase2();
      case 3:
        return renderPhase3();
      case 4:
        return renderPhase4();
      case 5:
        return renderPhase5();
      case 6:
        return renderPhase6();
      default:
        return renderPhase1();
    }
  };

  return (
    <div className="quote-page">
      <div className="container">
        <div className="wizard-header">
          <h1>Travel Insurance Quote Wizard</h1>
          <div className="wizard-progress">
            {[1, 2, 3, 4, 5, 6].map(phase => (
              <div key={phase} className={`progress-step ${currentPhase >= phase ? 'active' : ''} ${currentPhase === phase ? 'current' : ''}`}>
                <div className="step-number">{phase}</div>
                <div className="step-label">
                  {phase === 1 && 'Details'}
                  {phase === 2 && 'Quotes'}
                  {phase === 3 && 'Review'}
                  {phase === 4 && 'Confirm'}
                  {phase === 5 && 'Payment'}
                  {phase === 6 && 'Documents'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="wizard-content">
          {renderPhaseContent()}
        </div>

        <div className="wizard-navigation">
          {currentPhase > 1 && currentPhase < 6 && (
            <button 
              className="btn btn-secondary" 
              onClick={prevPhase}
            >
              Previous
            </button>
          )}
          
          {currentPhase < 5 && (
            <button 
              className="btn btn-primary" 
              onClick={nextPhase}
              disabled={!isPhaseValid(currentPhase)}
            >
              {currentPhase === 4 ? 'Proceed to Payment' : 'Next'}
            </button>
          )}
          
          {currentPhase === 5 && (
            <button 
              className="btn btn-primary" 
              onClick={processPayment}
              disabled={!isPhaseValid(currentPhase) || isProcessing}
            >
              {isProcessing ? 'Processing Payment...' : `Pay €${formData.selectedQuote?.price}`}
            </button>
          )}
          
          {currentPhase === 6 && (
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.href = '/'}
            >
              Return to Homepage
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quote;
