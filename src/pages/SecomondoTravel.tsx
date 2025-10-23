import React, { useEffect, useState } from 'react';
import './SecomondoTravel.css?v=3'; // cache-busting query string

interface SecomondoTravelProps {
  onNavigate?: (page: string) => void;
}

const SecomondoTravel: React.FC<SecomondoTravelProps> = () => {
  const [formData, setFormData] = useState({
    countryOfResidence: 'Greece',
    destination: 'Europe',
    startDate: '14 Sep. 2025',
    endDate: '27 Sep. 2025',
    numberOfTravelers: '1',
    alreadyAbroad: false
  });

  const [isQuote2Mode, setIsQuote2Mode] = useState(false);
  const [isFieldsLocked, setIsFieldsLocked] = useState(false);
  const [showComparisonTable, setShowComparisonTable] = useState(false);

  // Mock insurance plans data
  const insurancePlans = [
    {
      name: "Secomondo Top",
      price: "43,42 €",
      coverage: {
        emergencyMedical: "5.000.000 €",
        medicalTransport: "Included",
        baggage: "1.700 €",
        travelDisruption: "450 €",
        cancellation: "3.500 €",
        electronic: "Optional",
        adventureSports: "Optional",
        cruise: "-"
      }
    },
    {
      name: "Secomondo Premium",
      price: "54,50 €",
      coverage: {
        emergencyMedical: "10.000.000 €",
        medicalTransport: "Included",
        baggage: "2.500 €",
        travelDisruption: "1.500 €",
        cancellation: "7.000 €",
        electronic: "Optional",
        adventureSports: "Optional",
        cruise: "Optional"
      }
    },
    {
      name: "Secomondo Medical",
      price: "39,49 €",
      coverage: {
        emergencyMedical: "10.000.000 €",
        medicalTransport: "Included",
        baggage: "-",
        travelDisruption: "-",
        cancellation: "-",
        electronic: "-",
        adventureSports: "-",
        cruise: "-"
      }
    }
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGetQuote = () => {
    window.location.href = '/quote';
  };

  const handleQuote2 = () => {
    setIsQuote2Mode(true);
    setIsFieldsLocked(true);
    setShowComparisonTable(true);
    
    // Scroll to align quote-wizard-section with header
    const quoteWizardSection = document.querySelector('.quote-wizard-section');
    if (quoteWizardSection) {
      quoteWizardSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleEdit = () => {
    setIsFieldsLocked(false);
    setShowComparisonTable(false);
  };

  const handleGetQuoteFromEdit = () => {
    // Search mock insurance plans with new data
    console.log('Searching with data:', formData);
    // Here you would typically make an API call or filter the mock data
    // For now, we'll just show the comparison table again
    setShowComparisonTable(true);
  };

  return (
    <div className="secomondo-travel-page">
      {!isQuote2Mode && (
        <div className="section section-1">
          <div className="section-content">
            <h2>Secmondo Travel Insurance</h2>
          </div>
        </div>
      )}
      
      {/* Quote Wizard Section */}
      <div className="quote-wizard-section">
        <div className="quote-wizard-container">
          <div className="quote-wizard-panel">
            <h3 className="quote-title">Travel insurance quote & buy</h3>
            
            <div className="quote-form">
              <div className="form-row">
                {/* Country */}
                <div className="form-group country-group">
                  <label>Country of residence</label>
                  <div className="input-wrapper">
                    <select 
                      value={formData.countryOfResidence}
                      onChange={(e) => handleInputChange('countryOfResidence', e.target.value)}
                      disabled={isFieldsLocked}
                    >
                      <option value="Greece">Greece</option>
                      <option value="Spain">Spain</option>
                      <option value="Italy">Italy</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                    </select>
                    <span className="dropdown-icon">▼</span>
                  </div>
                </div>

                {/* Destination */}
                <div className="form-group">
                  <label>Destination</label>
                  <div className="input-wrapper">
                    <select 
                      value={formData.destination}
                      onChange={(e) => handleInputChange('destination', e.target.value)}
                      disabled={isFieldsLocked}
                    >
                      <option value="Europe">Europe</option>
                      <option value="Worldwide">Worldwide</option>
                      <option value="Asia">Asia</option>
                      <option value="Americas">Americas</option>
                      <option value="Africa">Africa</option>
                    </select>
                    <span className="dropdown-icon">▼</span>
                  </div>
                </div>

                {/* Start Date */}
                <div className="form-group">
                  <label>Start date</label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      disabled={isFieldsLocked}
                    />
                    <span className="calendar-icon">📅</span>
                  </div>
                </div>

                {/* End Date */}
                <div className="form-group">
                  <label>End date</label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      disabled={isFieldsLocked}
                    />
                    <span className="calendar-icon">📅</span>
                  </div>
                </div>

                {/* Travelers */}
                <div className="form-group">
                  <label>N° of travelers</label>
                  <div className="input-wrapper">
                    <select 
                      value={formData.numberOfTravelers}
                      onChange={(e) => handleInputChange('numberOfTravelers', e.target.value)}
                      disabled={isFieldsLocked}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                    <span className="dropdown-icon">▼</span>
                  </div>
                </div>
              </div>
              
              <div className="second-row">
                <div className="checkbox-section">
                  <div className="checkbox-wrapper">
                    <input 
                      type="checkbox" 
                      id="alreadyAbroad"
                      checked={formData.alreadyAbroad}
                      onChange={(e) => handleInputChange('alreadyAbroad', e.target.checked)}
                      disabled={isFieldsLocked}
                    />
                    <label htmlFor="alreadyAbroad">Already abroad?</label>
                    <span className="info-icon">ⓘ</span>
                  </div>
                </div>
                
                {!isQuote2Mode ? (
                  <button className="quote-button" onClick={handleQuote2}>
                    Quote2
                  </button>
                ) : isFieldsLocked ? (
                  <button className="quote-button edit-button" onClick={handleEdit}>
                    EDIT
                  </button>
                ) : (
                  <button className="quote-button" onClick={handleGetQuoteFromEdit}>
                    GET A QUOTE
                  </button>
                )}
              </div>
            </div>
            
            {/* Comparison Table */}
            {showComparisonTable && (
              <div className="comparison-table-container">
                <div className="comparison-table">
                  <div className="table-header">
                    {insurancePlans.map((plan, index) => (
                      <div key={index} className="plan-header">
                        <h3>{plan.name}</h3>
                        <div className="plan-price">{plan.price}</div>
                        <button className="buy-button">Buy</button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="table-body">
                    <div className="coverage-row">
                      <div className="coverage-category">Emergency medical & dental expenses overseas</div>
                      {insurancePlans.map((plan, index) => (
                        <div key={index} className="coverage-value">{plan.coverage.emergencyMedical}</div>
                      ))}
                    </div>
                    
                    <div className="coverage-row">
                      <div className="coverage-category">Medical transport & repatriation home</div>
                      {insurancePlans.map((plan, index) => (
                        <div key={index} className="coverage-value">{plan.coverage.medicalTransport}</div>
                      ))}
                    </div>
                    
                    <div className="coverage-row">
                      <div className="coverage-category">Baggage</div>
                      {insurancePlans.map((plan, index) => (
                        <div key={index} className="coverage-value">{plan.coverage.baggage}</div>
                      ))}
                    </div>
                    
                    <div className="coverage-row">
                      <div className="coverage-category">Travel disruption</div>
                      {insurancePlans.map((plan, index) => (
                        <div key={index} className="coverage-value">{plan.coverage.travelDisruption}</div>
                      ))}
                    </div>
                    
                    <div className="coverage-row">
                      <div className="coverage-category">Cancellation & interruption</div>
                      {insurancePlans.map((plan, index) => (
                        <div key={index} className="coverage-value">{plan.coverage.cancellation}</div>
                      ))}
                    </div>
                    
                    <div className="coverage-row">
                      <div className="coverage-category">Electronic</div>
                      {insurancePlans.map((plan, index) => (
                        <div key={index} className="coverage-value">
                          {plan.coverage.electronic === "Optional" ? (
                            <button className="optional-button">Optional</button>
                          ) : (
                            plan.coverage.electronic
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="coverage-row">
                      <div className="coverage-category">Adventure sports</div>
                      {insurancePlans.map((plan, index) => (
                        <div key={index} className="coverage-value">
                          {plan.coverage.adventureSports === "Optional" ? (
                            <button className="optional-button">Optional</button>
                          ) : (
                            plan.coverage.adventureSports
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="coverage-row">
                      <div className="coverage-category">Cruise</div>
                      {insurancePlans.map((plan, index) => (
                        <div key={index} className="coverage-value">
                          {plan.coverage.cruise === "Optional" ? (
                            <button className="optional-button">Optional</button>
                          ) : (
                            plan.coverage.cruise
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Other sections */}
      <div className="section section-2">
        <div className="section-content"><h2>Section 2</h2></div>
      </div>
      <div className="section section-3">
        <div className="section-content"><h2>Section 3</h2></div>
      </div>
      <div className="section section-4">
        <div className="section-content"><h2>Section 4</h2></div>
      </div>
      <div className="section section-5">
        <div className="section-content"><h2>Section 5</h2></div>
      </div>
    </div>
  );
};

export default SecomondoTravel;
