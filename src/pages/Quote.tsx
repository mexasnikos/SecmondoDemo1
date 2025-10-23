import React, { useState, useEffect, useRef } from 'react';
import './Quote.css';
// Import API service for database integration
import { createQuote, processPayment as apiProcessPayment } from '../services/apiService';

// Import jsPDF dynamically to avoid build issues
const generatePDF = async (formData: any, calculateTotalPrice: () => number, formatDateToEuropean: (date: string) => string, policyNumber: string) => {
  try {
    // Dynamic import of jsPDF
    const jsPDF = (await import('jspdf')).default;
    
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString('en-GB');
    
    // Set up fonts and styles
    doc.setFontSize(20);
    doc.text('TRAVEL INSURANCE POLICY', 20, 20);
    
    doc.setFontSize(14);
    doc.text(`Policy Number: ${policyNumber}`, 20, 35);
    doc.text(`Issue Date: ${currentDate}`, 20, 45);
    
    let yPos = 65;
    
    // Trip Information Section
    doc.setFontSize(16);
    doc.text('TRIP INFORMATION', 20, yPos);
    yPos += 15;
    
    doc.setFontSize(12);
    const tripType = formData.tripType === 'single' ? 'Single Trip Insurance' : 
                    formData.tripType === 'annual' ? 'Annual Multi-Trip Insurance' : 
                    'Comprehensive Single Trip Insurance';
    
    doc.text(`Trip Type: ${tripType}`, 20, yPos);
    yPos += 10;
    doc.text(`Country of Residence: ${formData.countryOfResidence}`, 20, yPos);
    yPos += 10;
    doc.text(`Destination: ${formData.destination}`, 20, yPos);
    yPos += 10;
    doc.text(`Departure: ${formatDateToEuropean(formData.startDate)}`, 20, yPos);
    yPos += 10;
    doc.text(`Return: ${formatDateToEuropean(formData.endDate)}`, 20, yPos);
    yPos += 10;
    doc.text(`Travelers: ${formData.numberOfTravelers}`, 20, yPos);
    yPos += 20;
    
    // Traveler Information
    doc.setFontSize(16);
    doc.text('TRAVELER INFORMATION', 20, yPos);
    yPos += 15;
    
    doc.setFontSize(12);
    formData.travelers.forEach((traveler: any, index: number) => {
      if (yPos > 250) { // New page if needed
        doc.addPage();
        yPos = 20;
      }
      
      doc.text(`${index === 0 ? 'Primary Policyholder' : `Traveler ${index + 1}`}:`, 20, yPos);
      yPos += 10;
      doc.text(`Name: ${traveler.firstName} ${traveler.lastName}`, 20, yPos);
      yPos += 8;
      doc.text(`Age: ${traveler.age} years old`, 20, yPos);
      yPos += 8;
      doc.text(`Email: ${traveler.email}`, 20, yPos);
      yPos += 8;
      if (traveler.phone) {
        doc.text(`Phone: ${traveler.phone}`, 20, yPos);
        yPos += 8;
      }
      yPos += 10;
    });
    
    // Selected Plan
    if (formData.selectedQuote) {
      if (yPos > 180) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(16);
      doc.text('SELECTED INSURANCE PLAN', 20, yPos);
      yPos += 15;
      
      doc.setFontSize(12);
      doc.text(`Plan: ${formData.selectedQuote.name}`, 20, yPos);
      yPos += 10;
      doc.text(`Medical: ${formData.selectedQuote.coverage.medical}`, 20, yPos);
      yPos += 10;
      doc.text(`Baggage: ${formData.selectedQuote.coverage.baggage}`, 20, yPos);
      yPos += 10;
      doc.text(`Cancellation: ${formData.selectedQuote.coverage.cancellation}`, 20, yPos);
      yPos += 15;
      
      // Add Included Features
      if (formData.selectedQuote.features && formData.selectedQuote.features.length > 0) {
        doc.text('Included Features:', 20, yPos);
        yPos += 10;
        formData.selectedQuote.features.forEach((feature: string) => {
          if (yPos > 270) { // Check for page break
            doc.addPage();
            yPos = 20;
          }
          doc.text(`• ${feature}`, 25, yPos);
          yPos += 8;
        });
        yPos += 10;
      }
    }
    
    // Additional Coverage
    if (formData.additionalPolicies && formData.additionalPolicies.length > 0) {
      if (yPos > 220) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(16);
      doc.text('ADDITIONAL COVERAGE', 20, yPos);
      yPos += 15;
      
      doc.setFontSize(12);
      formData.additionalPolicies.forEach((policy: any) => {
        if (yPos > 270) { // Check for page break
          doc.addPage();
          yPos = 20;
        }
        doc.text(`• ${policy.name} - €${policy.price.toFixed(2)}`, 25, yPos);
        yPos += 8;
      });
      yPos += 15;
    }
    
    // Premium Summary
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(16);
    doc.text('PREMIUM SUMMARY', 20, yPos);
    yPos += 15;
    
    doc.setFontSize(12);
    doc.text(`Base Premium: €${formData.selectedQuote?.price}`, 20, yPos);
    yPos += 10;
    if (formData.additionalPolicies && formData.additionalPolicies.length > 0) {
      const additional = formData.additionalPolicies.reduce((sum: number, policy: any) => sum + policy.price, 0);
      doc.text(`Additional Policies: €${additional.toFixed(2)}`, 20, yPos);
      yPos += 10;
    }
    doc.text('Taxes & Fees: Included', 20, yPos);
    yPos += 10;
    doc.text(`Total Premium: €${calculateTotalPrice().toFixed(2)}`, 20, yPos);
    yPos += 20;
    
    doc.text('Emergency Contact: +30 6974907500', 20, yPos);
    
    // Save the PDF
    doc.save(`Travel_Insurance_Policy_${policyNumber}.pdf`);
    
  } catch (error) {
    console.error('PDF generation failed, falling back to HTML:', error);
    // Fallback to HTML generation if PDF fails
    generateHTMLPolicy(formData, calculateTotalPrice, formatDateToEuropean, policyNumber);
  }
};

const generateHTMLPolicy = (formData: any, calculateTotalPrice: () => number, formatDateToEuropean: (date: string) => string, policyNumber: string) => {
  const currentDate = new Date().toLocaleDateString('en-GB');
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Travel Insurance Policy - ${policyNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #0077b6; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .section-title { color: #0077b6; font-size: 16px; font-weight: bold; margin-bottom: 10px; }
        .info-row { margin: 8px 0; }
        .traveler-block { margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>TRAVEL INSURANCE POLICY</h1>
        <h2>Policy Number: ${policyNumber}</h2>
        <p>Issue Date: ${currentDate}</p>
    </div>
    
    <div class="section">
        <div class="section-title">TRIP INFORMATION</div>
        <div class="info-row"><strong>Trip Type:</strong> ${formData.tripType === 'single' ? 'Single Trip Insurance' : 
                        formData.tripType === 'annual' ? 'Annual Multi-Trip Insurance' : 
                        'Comprehensive Single Trip Insurance'}</div>
        <div class="info-row"><strong>Country of Residence:</strong> ${formData.countryOfResidence}</div>
        <div class="info-row"><strong>Destination:</strong> ${formData.destination}</div>
        <div class="info-row"><strong>Departure:</strong> ${formatDateToEuropean(formData.startDate)}</div>
        <div class="info-row"><strong>Return:</strong> ${formatDateToEuropean(formData.endDate)}</div>
        <div class="info-row"><strong>Travelers:</strong> ${formData.numberOfTravelers}</div>
    </div>
    
    <div class="section">
        <div class="section-title">TRAVELER INFORMATION</div>
        ${formData.travelers.map((traveler: any, index: number) => `
            <div class="traveler-block">
                <strong>${index === 0 ? 'Primary Policyholder' : `Traveler ${index + 1}`}</strong>
                <div class="info-row"><strong>Name:</strong> ${traveler.firstName} ${traveler.lastName}</div>
                <div class="info-row"><strong>Age:</strong> ${traveler.age} years old</div>
                <div class="info-row"><strong>Email:</strong> ${traveler.email}</div>
                ${traveler.phone ? `<div class="info-row"><strong>Phone:</strong> ${traveler.phone}</div>` : ''}
            </div>
        `).join('')}
    </div>
    
    ${formData.selectedQuote ? `
    <div class="section">
        <div class="section-title">SELECTED INSURANCE PLAN</div>
        <div class="info-row"><strong>Plan:</strong> ${formData.selectedQuote.name}</div>
        <div class="info-row"><strong>Medical Coverage:</strong> ${formData.selectedQuote.coverage.medical}</div>
        <div class="info-row"><strong>Baggage Coverage:</strong> ${formData.selectedQuote.coverage.baggage}</div>
        <div class="info-row"><strong>Trip Cancellation:</strong> ${formData.selectedQuote.coverage.cancellation}</div>
        
        ${formData.selectedQuote.features && formData.selectedQuote.features.length > 0 ? `
        <div style="margin-top: 15px;">
            <strong>Included Features:</strong>
            <ul>
                ${formData.selectedQuote.features.map((feature: string) => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
    </div>
    ` : ''}
    
    ${formData.additionalPolicies && formData.additionalPolicies.length > 0 ? `
    <div class="section">
        <div class="section-title">ADDITIONAL COVERAGE</div>
        <ul>
            ${formData.additionalPolicies.map((policy: any) => `<li>${policy.name} - €${policy.price.toFixed(2)}</li>`).join('')}
        </ul>
    </div>
    ` : ''}
    
    <div class="section">
        <div class="section-title">PREMIUM SUMMARY</div>
        <div class="info-row"><strong>Base Premium:</strong> €${formData.selectedQuote?.price}</div>
        ${formData.additionalPolicies && formData.additionalPolicies.length > 0 ? `
        <div class="info-row"><strong>Additional Policies:</strong> €${formData.additionalPolicies.reduce((sum: number, policy: any) => sum + policy.price, 0).toFixed(2)}</div>
        ` : ''}
        <div class="info-row"><strong>Taxes & Fees:</strong> Included</div>
        <div class="info-row"><strong>Total Premium:</strong> €${calculateTotalPrice().toFixed(2)}</div>
    </div>
    
    <div class="section">
        <div class="info-row"><strong>Emergency Contact:</strong> +30 6974907500</div>
        <div class="info-row" style="margin-top: 20px; font-style: italic;">
            This document serves as proof of travel insurance coverage.
        </div>
    </div>
    
    <script>
        window.onload = function() { window.print(); };
        window.onafterprint = function() { window.close(); };
    </script>
</body>
</html>`;

  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
};

// Format date to European format (DD/MM/YYYY)
const formatDateToEuropean = (dateString: string): string => {
  if (!dateString) return '';
  // Parse the ISO date string directly to avoid timezone issues
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

interface TravelerInfo {
  firstName: string;
  lastName: string;
  age: string;
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
  countryOfResidence: string;
  
  // Traveler Information
  numberOfTravelers: number;
  travelers: TravelerInfo[];
  
  // Selected Quote
  selectedQuote: QuoteOption | null;
  
  // Additional Policies
  additionalPolicies: AdditionalPolicy[];
  
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

interface AdditionalPolicy {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: string;
}

type WizardPhase = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface QuoteProps {
  onNavigate?: (page: string) => void;
}

const Quote: React.FC<QuoteProps> = ({ onNavigate }) => {
  const [currentPhase, setCurrentPhase] = useState<WizardPhase>(1);
  const [formData, setFormData] = useState<QuoteFormData>({
    destination: '',
    startDate: '',
    endDate: '',
    tripType: 'single',
    countryOfResidence: '',
    numberOfTravelers: 1,
    travelers: [
      {
        firstName: '',
        lastName: '',
        age: '',
        email: '',
        phone: '',
        vaxId: '',
        nationality: ''
      }
    ],
    selectedQuote: null,
    additionalPolicies: [],
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
  const [policyNumber, setPolicyNumber] = useState<string>('');
  const [availableAdditionalPolicies] = useState<AdditionalPolicy[]>([
    {
      id: 'excess-waiver',
      name: 'Excess Waiver',
      description: 'You can avoid paying the policy excess by adding the Excess Waiver option. This means that in the event of a claim, you won\'t have the excess deducted from the amount you are paid.',
      price: 8.45,
      icon: '🛡️',
      category: 'Protection'
    },
    {
      id: 'cancellation-top-up',
      name: 'Cancellation Top Up',
      description: 'Additional cancellation coverage for enhanced protection against trip cancellation costs.',
      price: 15.50,
      icon: '❌',
      category: 'Cancellation'
    },
    {
      id: 'hazardous-pursuits-cat3',
      name: 'Hazardous Pursuits Category 3',
      description: 'Coverage for adventure sports and activities including skiing, snowboarding, and water sports.',
      price: 12.30,
      icon: '🏂',
      category: 'Activities'
    },
    {
      id: 'hazardous-pursuits-cat4',
      name: 'Hazardous Pursuits Category 4',
      description: 'Coverage for extreme sports including rock climbing, bungee jumping, and skydiving.',
      price: 18.75,
      icon: '🪂',
      category: 'Activities'
    },
    {
      id: 'valuables',
      name: 'Valuables',
      description: 'Enhanced coverage for valuable items including jewelry, electronics, and expensive equipment.',
      price: 22.40,
      icon: '💎',
      category: 'Protection'
    },
    {
      id: 'golfers-extension',
      name: 'Golfers Extension',
      description: 'Specialized coverage for golf equipment, green fees, and golf-related incidents.',
      price: 14.80,
      icon: '⛳',
      category: 'Sports'
    },
    {
      id: 'event-cancellation',
      name: 'Event Cancellation',
      description: 'Coverage for cancellation of prepaid events, concerts, or special occasions during your trip.',
      price: 19.95,
      icon: '🎫',
      category: 'Events'
    },
    {
      id: 'repatriation-home',
      name: 'Repatriation Home For Australians, South Africans, And New Zealanders',
      description: 'Special repatriation coverage for travelers from Australia, South Africa, and New Zealand.',
      price: 25.60,
      icon: '✈️',
      category: 'Repatriation'
    }
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Show a brief message when end date is cleared due to start date change
  useEffect(() => {
    if (formData.startDate && !formData.endDate) {
      // This effect will run when start date exists but end date is empty
      // We could add a toast notification here if needed
    }
  }, [formData.startDate, formData.endDate]);


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

  // Custom Date Picker Component
  const CustomDatePicker: React.FC<{
    id: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    required?: boolean;
    minDate?: string; // ISO date string for minimum selectable date
  }> = ({ id, value, onChange, placeholder, required, minDate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(() => {
      // Initialize with selected date if available, otherwise current date
      return value ? new Date(value) : new Date();
    });
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    // Update current date when value changes to show the correct month
    useEffect(() => {
      if (value) {
        setCurrentDate(new Date(value));
      }
    }, [value]);

    // Helper function to check if a date is valid (not in past and not before minDate)
    const isDateValid = (date: Date): boolean => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
      
      // Reset the input date to start of day for accurate comparison
      const inputDate = new Date(date);
      inputDate.setHours(0, 0, 0, 0);
      
      // Check if date is in the past
      if (inputDate < today) {
        return false;
      }
      
      // Check if date is before minimum date
      if (minDate) {
        const minDateObj = new Date(minDate);
        minDateObj.setHours(0, 0, 0, 0);
        if (inputDate < minDateObj) {
          return false;
        }
      }
      
      return true;
    };

    const generateCalendar = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const days = [];
      
      // Add empty cells for days before the first day of the month
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        // Create ISO string manually to avoid timezone issues
        const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const isSelected = value === dateString;
        const isToday = new Date().toDateString() === date.toDateString();
        const isValid = isDateValid(date);

        days.push(
          <div
            key={day}
            className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${!isValid ? 'disabled' : ''}`}
            onClick={() => {
              if (isValid) {
                onChange(dateString);
                setIsOpen(false);
              }
            }}
            style={{
              cursor: isValid ? 'pointer' : 'not-allowed',
              opacity: isValid ? 1 : 0.4
            }}
          >
            {day}
          </div>
        );
      }

      return days;
    };

    const navigateMonth = (direction: number) => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    };

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
      <div className="custom-date-picker" ref={pickerRef}>
        <div className="date-input-wrapper">
          <input
            type="text"
            id={id}
            value={value ? formatDateToEuropean(value) : ''}
            onChange={(e) => {
              const formattedValue = formatDateInput(e.target.value);
              const isoDate = formattedValue.length === 10 ? convertToISO(formattedValue) : '';
              
              // Validate that the date is valid (not in past and not before minDate)
              if (isoDate) {
                const inputDate = new Date(isoDate);
                if (!isDateValid(inputDate)) {
                  // Don't update the value if it's an invalid date
                  return;
                }
              }
              
              onChange(isoDate);
            }}
            placeholder={placeholder}
            title={minDate ? 
              "Enter date (DD/MM/YYYY) or click calendar - past dates and dates before start date are not allowed" : 
              "Enter date (DD/MM/YYYY) or click calendar - past dates are not allowed"
            }
            pattern="\d{2}/\d{2}/\d{4}"
            maxLength={10}
            required={required}
          />
          <span 
            className="date-icon clickable" 
            onClick={() => setIsOpen(!isOpen)}
            title="Open calendar"
          >
            📅
          </span>
        </div>
        
        {isOpen && (
          <div className="calendar-popup">
            <div className="calendar-header">
              <button 
                type="button" 
                className="calendar-nav-btn" 
                onClick={() => navigateMonth(-1)}
              >
                ‹
              </button>
              <span className="calendar-month-year">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button 
                type="button" 
                className="calendar-nav-btn" 
                onClick={() => navigateMonth(1)}
              >
                ›
              </button>
            </div>
            <div className="calendar-weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="calendar-weekday">{day}</div>
              ))}
            </div>
            <div className="calendar-days">
              {generateCalendar()}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // If start date is changed, clear end date if it's now invalid
      if (field === 'startDate' && value && prev.endDate) {
        const startDate = new Date(value as string);
        const endDate = new Date(prev.endDate);
        startDate.setDate(startDate.getDate() + 1); // Add 1 day to start date
        
        // If end date is before or equal to start date, clear it
        if (endDate <= startDate) {
          newData.endDate = '';
        }
      }
      
      return newData;
    });
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
            age: '',
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

  // Helper function to convert DD/MM/YYYY to YYYY-MM-DD for internal storage
  const convertToISO = (ddmmyyyy: string): string => {
    if (!ddmmyyyy || ddmmyyyy.length !== 10) return '';
    const [day, month, year] = ddmmyyyy.split('/');
    // Create date in local timezone to avoid timezone issues
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toISOString().split('T')[0];
  };

  // Helper function to format input as DD/MM/YYYY
  const formatDateInput = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as DD/MM/YYYY
    if (digits.length >= 8) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    } else if (digits.length >= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const nextPhase = () => {
    if (currentPhase === 1) {
      // Generate quotes when moving from phase 1 to 2
      const options = generateQuoteOptions();
      setQuoteOptions(options);
      
      // Automatically pre-select the middle plan (standard)
      const standardPlan = options.find(option => option.type === 'standard');
      if (standardPlan) {
        setFormData(prev => ({
          ...prev,
          selectedQuote: standardPlan
        }));
      }
    }
    
    if (currentPhase < 7) {
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

  const addAdditionalPolicy = (policy: AdditionalPolicy) => {
    setFormData(prev => ({
      ...prev,
      additionalPolicies: [...prev.additionalPolicies, policy]
    }));
  };

  const removeAdditionalPolicy = (policyId: string) => {
    setFormData(prev => ({
      ...prev,
      additionalPolicies: prev.additionalPolicies.filter(p => p.id !== policyId)
    }));
  };

  const calculateTotalPrice = (): number => {
    const basePrice = formData.selectedQuote?.price || 0;
    const additionalPrice = formData.additionalPolicies.reduce((sum, policy) => sum + policy.price, 0);
    return basePrice + additionalPrice;
  };

  const generatePolicyPDF = async () => {
    await generatePDF(formData, calculateTotalPrice, formatDateToEuropean, policyNumber || `TI-${Date.now().toString().slice(-8)}`);
  };

  const downloadPolicyPDF = () => {
    generatePolicyPDF();
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    try {
      // First save the quote to database
      // Add TravellerNumber to each traveler (index + 1)
      const travelersWithNumber = formData.travelers.map((traveler, index) => ({
        ...traveler,
        travellerNumber: index + 1
      }));

      const quoteData = {
        destination: formData.destination,
        countryOfResidence: formData.countryOfResidence,
        startDate: formData.startDate,
        endDate: formData.endDate,
        tripType: formData.tripType,
        numberOfTravelers: formData.numberOfTravelers,
        travelers: travelersWithNumber,
        selectedQuote: formData.selectedQuote,
        additionalPolicies: formData.additionalPolicies,
        totalAmount: calculateTotalPrice()
      };

      // console.log('Saving quote to database...', quoteData);
      // console.log('Quote data JSON string:', JSON.stringify(quoteData));
      const quoteResponse = await createQuote(quoteData);
      
      if (quoteResponse.status === 'success' && quoteResponse.data) {
        const quoteId = quoteResponse.data.quoteId;
        
        // Process payment
        const paymentData = {
          quoteId: quoteId,
          paymentMethod: formData.paymentMethod,
          cardNumber: formData.cardNumber, // Note: In production, this should be tokenized
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          billingAddress: formData.billingAddress,
          amount: calculateTotalPrice()
        };

        // console.log('Processing payment...', { ...paymentData, cardNumber: '****', cvv: '***' });
        // console.log('Payment method being sent:', formData.paymentMethod);
        // console.log('Form data payment method:', formData.paymentMethod);
        const paymentResponse = await apiProcessPayment(paymentData);
        
        if (paymentResponse.status === 'success') {
          // console.log('Payment successful:', paymentResponse.data);
          // Store the policy number from the backend response
          if (paymentResponse.data?.policyNumber) {
            setPolicyNumber(paymentResponse.data.policyNumber);
          }
          setIsProcessing(false);
          nextPhase(); // Move to documents phase
        } else {
          throw new Error(paymentResponse.message || 'Payment failed');
        }
      } else {
        throw new Error(quoteResponse.message || 'Failed to save quote');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setIsProcessing(false);
      alert('Payment processing failed. Please try again. Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const isPhaseValid = (phase: WizardPhase): boolean => {
    switch (phase) {
      case 1:
        return !!(
          formData.destination &&
          formData.startDate &&
          formData.endDate &&
          formData.tripType &&
          formData.countryOfResidence &&
          formData.travelers.every(t => t.firstName && t.lastName && t.age && t.email)
        );
      case 2:
        return !!formData.selectedQuote;
      case 3:
        return true; // Additional policies phase is always valid (optional)
      case 4:
        return true; // Summary phase is always valid
      case 5:
        return true; // Confirmation phase is always valid
      case 6:
        const paymentValid = !!(
          formData.cardNumber && 
          formData.expiryDate && 
          formData.cvv &&
          formData.billingAddress.street &&
          formData.billingAddress.city &&
          formData.billingAddress.postalCode &&
          formData.billingAddress.country
        );
        
        
        return paymentValid;
      case 7:
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
          <label htmlFor="countryOfResidence">Country of Residence</label>
          <input
            type="text"
            id="countryOfResidence"
            value={formData.countryOfResidence}
            onChange={(e) => handleInputChange('countryOfResidence', e.target.value)}
            placeholder="e.g., Greece, Germany, United Kingdom"
            required
          />
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
            <label htmlFor="startDate">Departure Date <span className="date-format-hint">(DD/MM/YYYY)</span></label>
            <CustomDatePicker
              id="startDate"
              value={formData.startDate}
              onChange={(value) => handleInputChange('startDate', value)}
              placeholder="DD/MM/YYYY"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">Return Date <span className="date-format-hint">(DD/MM/YYYY)</span></label>
            <CustomDatePicker
              id="endDate"
              value={formData.endDate}
              onChange={(value) => handleInputChange('endDate', value)}
              placeholder="DD/MM/YYYY"
              required
              minDate={formData.startDate ? (() => {
                // Set minimum date to start date + 1 day
                const startDate = new Date(formData.startDate);
                startDate.setDate(startDate.getDate() + 1);
                return startDate.toISOString().split('T')[0];
              })() : undefined}
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
                <label htmlFor={`firstName-${index}`}>First Name</label>
                <input
                  type="text"
                  id={`firstName-${index}`}
                  value={traveler.firstName}
                  onChange={(e) => handleTravelerChange(index, 'firstName', e.target.value)}
                  placeholder="Enter first name"
                  title="Enter the traveler's first name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`lastName-${index}`}>Last Name</label>
                <input
                  type="text"
                  id={`lastName-${index}`}
                  value={traveler.lastName}
                  onChange={(e) => handleTravelerChange(index, 'lastName', e.target.value)}
                  placeholder="Enter last name"
                  title="Enter the traveler's last name"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`age-${index}`}>Travellers Age</label>
                <input
                  type="number"
                  id={`age-${index}`}
                  value={traveler.age}
                  onChange={(e) => handleTravelerChange(index, 'age', e.target.value)}
                  placeholder="Enter age"
                  title="Enter the traveler's age (1-120)"
                  min="1"
                  max="120"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`email-${index}`}>Email</label>
                <input
                  type="email"
                  id={`email-${index}`}
                  value={traveler.email}
                  onChange={(e) => handleTravelerChange(index, 'email', e.target.value)}
                  placeholder="Enter email address"
                  title="Enter the traveler's email address"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`phone-${index}`}>Phone</label>
                <input
                  type="tel"
                  id={`phone-${index}`}
                  value={traveler.phone}
                  onChange={(e) => handleTravelerChange(index, 'phone', e.target.value)}
                  placeholder="+30 123 456 7890"
                  title="Enter the traveler's phone number"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor={`vaxId-${index}`}>VAX ID</label>
              <input
                type="text"
                id={`vaxId-${index}`}
                value={traveler.vaxId}
                onChange={(e) => handleTravelerChange(index, 'vaxId', e.target.value)}
                placeholder="Enter VAX ID"
                title="Enter the traveler's VAX ID (optional)"
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
              <div className="quote-price">
                <p className="price-amount">€{option.price}</p>
                <p className="price-period">per trip</p>
              </div>
            </div>
            
            <ul className="quote-features">
              <li>Medical Coverage: {option.coverage.medical}</li>
              <li>Baggage Coverage: {option.coverage.baggage}</li>
              <li>Cancellation: {option.coverage.cancellation}</li>
              {option.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            
            <button 
              className="select-button"
              aria-label={formData.selectedQuote?.id === option.id ? 'Plan selected' : `Select ${option.name} plan`}
              title={formData.selectedQuote?.id === option.id ? 'This plan is currently selected' : `Choose the ${option.name} plan`}
              type="button"
            >
              {formData.selectedQuote?.id === option.id ? 'Selected' : 'SELECT PLAN'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPhase3 = () => (
    <div className="wizard-phase">
      <h2>Enhance Your Coverage</h2>
      <p>Add optional coverage for extra protection during your trip.</p>
      
      <div className="selected-plan-summary">
        <div className="current-plan">
          <h3>Your Selected Plan</h3>
          {formData.selectedQuote && (
            <div className="plan-info">
              <div className="plan-name">{formData.selectedQuote.name}</div>
              <div className="plan-price">€{formData.selectedQuote.price}</div>
            </div>
          )}
        </div>
      </div>

      <div className="additional-policies">
        <h3>Optional Coverage Add-ons</h3>
        <div className="policies-grid">
          {availableAdditionalPolicies.map(policy => {
            const isSelected = formData.additionalPolicies.some(p => p.id === policy.id);
            return (
              <div key={policy.id} className={`policy-card ${isSelected ? 'selected' : ''}`}>
                <div className="policy-header">
                  <div className="policy-icon">{policy.icon}</div>
                  <div className="policy-info">
                    <h4>{policy.name}</h4>
                    <div className="policy-price">€{policy.price.toFixed(2)}</div>
                  </div>
                  <button 
                    className={`policy-btn ${isSelected ? 'remove' : 'add'}`}
                    onClick={() => isSelected ? removeAdditionalPolicy(policy.id) : addAdditionalPolicy(policy)}
                  >
                    {isSelected ? 'REMOVE' : 'ADD'}
                  </button>
                </div>
                <div className="policy-description">
                  <p>{policy.description}</p>
                  {policy.id === 'excess-waiver' && (
                    <button 
                      className="find-out-more" 
                      onClick={() => alert('More information about Excess Waiver coverage will be available soon.')}
                      aria-label="Learn more about Excess Waiver coverage"
                      title="Get more information about Excess Waiver coverage"
                      type="button"
                    >
                      Find out more
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="total-summary-box">
        <div className="summary-content">
          <div className="base-plan">
            <span>Base Plan: {formData.selectedQuote?.name}</span>
            <span>€{formData.selectedQuote?.price}</span>
          </div>
          {formData.additionalPolicies.map(policy => (
            <div key={policy.id} className="additional-item">
              <span>{policy.name}</span>
              <span>€{policy.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="total-line">
            <span className="total-label">Total Premium:</span>
            <span className="total-amount">€{calculateTotalPrice().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPhase4 = () => {
    const calculateTripDuration = () => {
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
        return days;
      }
      return 0;
    };

    return (
      <div className="wizard-phase">
        <h2>Review Your Details</h2>
        <p>Please carefully review all information below. You can go back to make changes if needed.</p>
        
        <div className="professional-summary">
          {/* Trip Overview Card */}
          <div className="summary-card">
            <div className="card-header">
              <h3>🌍 Trip Overview</h3>
            </div>
            <div className="card-content">
              <div className="summary-grid">
                <div className="summary-row">
                  <span className="label">Insurance Type:</span>
                  <span className="value">{
                    formData.tripType === 'single' ? 'Single Trip Insurance' :
                    formData.tripType === 'annual' ? 'Annual Multi-Trip Insurance' :
                    'Comprehensive Single Trip Insurance'
                  }</span>
                </div>
                <div className="summary-row">
                  <span className="label">Country of Residence:</span>
                  <span className="value">{formData.countryOfResidence}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Destination:</span>
                  <span className="value">{formData.destination}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Departure Date:</span>
                  <span className="value">{formatDateToEuropean(formData.startDate)}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Return Date:</span>
                  <span className="value">{formatDateToEuropean(formData.endDate)}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Trip Duration:</span>
                  <span className="value">{calculateTripDuration()} days</span>
                </div>
                <div className="summary-row">
                  <span className="label">Number of Travelers:</span>
                  <span className="value">{formData.numberOfTravelers} {formData.numberOfTravelers === 1 ? 'person' : 'people'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Travelers Information Card */}
          <div className="summary-card">
            <div className="card-header">
              <h3>👥 Traveler Information</h3>
            </div>
            <div className="card-content">
              {formData.travelers.map((traveler, index) => (
                <div key={index} className="traveler-card">
                  <div className="traveler-header">
                    <h4>Primary {index === 0 ? 'Policyholder' : `Traveler ${index + 1}`}</h4>
                  </div>
                  <div className="traveler-details">
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Full Name:</span>
                        <span className="detail-value">{traveler.firstName} {traveler.lastName}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Age:</span>
                        <span className="detail-value">{traveler.age} years old</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Email Address:</span>
                        <span className="detail-value">{traveler.email}</span>
                      </div>
                      {traveler.phone && (
                        <div className="detail-item">
                          <span className="detail-label">Phone Number:</span>
                          <span className="detail-value">{traveler.phone}</span>
                        </div>
                      )}
                      {traveler.vaxId && (
                        <div className="detail-item">
                          <span className="detail-label">VAX ID:</span>
                          <span className="detail-value">{traveler.vaxId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insurance Plan Card */}
          <div className="summary-card">
            <div className="card-header">
              <h3>🛡️ Selected Insurance Plan</h3>
            </div>
            <div className="card-content">
              {formData.selectedQuote && (
                <div className="plan-summary">
                  <div className="plan-header">
                    <h4>{formData.selectedQuote.name}</h4>
                    <div className="plan-price">
                      <span className="price-label">Total Premium:</span>
                      <span className="price-value">€{calculateTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="coverage-overview">
                    <h5>Coverage Limits</h5>
                    <div className="coverage-grid">
                      <div className="coverage-item">
                        <span className="coverage-icon">🏥</span>
                        <div className="coverage-details">
                          <span className="coverage-type">Medical Emergency</span>
                          <span className="coverage-amount">{formData.selectedQuote.coverage.medical}</span>
                        </div>
                      </div>
                      <div className="coverage-item">
                        <span className="coverage-icon">🧳</span>
                        <div className="coverage-details">
                          <span className="coverage-type">Baggage Protection</span>
                          <span className="coverage-amount">{formData.selectedQuote.coverage.baggage}</span>
                        </div>
                      </div>
                      <div className="coverage-item">
                        <span className="coverage-icon">❌</span>
                        <div className="coverage-details">
                          <span className="coverage-type">Trip Cancellation</span>
                          <span className="coverage-amount">{formData.selectedQuote.coverage.cancellation}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="features-overview">
                    <h5>Included Benefits</h5>
                    <div className="features-grid">
                      {formData.selectedQuote.features.map((feature, index) => (
                        <div key={index} className="feature-item">
                          <span className="feature-check">✓</span>
                          <span className="feature-text">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary Totals */}
          <div className="summary-card total-card">
            <div className="card-content">
              <div className="total-summary">
                <div className="total-row">
                  <span className="total-label">Base Premium:</span>
                  <span className="total-value">€{formData.selectedQuote?.price}</span>
                </div>
                {formData.additionalPolicies.length > 0 && (
                  <div className="total-row">
                    <span className="total-label">Additional Policies:</span>
                    <span className="total-value">€{formData.additionalPolicies.reduce((sum, policy) => sum + policy.price, 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="total-row">
                  <span className="total-label">Taxes & Fees:</span>
                  <span className="total-value">Included</span>
                </div>
                <div className="total-row final-total">
                  <span className="total-label">Total Amount:</span>
                  <span className="total-value">€{calculateTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPhase5 = () => (
    <div className="wizard-phase">
      <h2>Confirmation</h2>
      <p>Please confirm that all details are correct before proceeding to payment.</p>
      
      <div className="confirmation-box">
        <div className="confirmation-item">
          <strong>Trip:</strong> {formData.destination} ({formatDateToEuropean(formData.startDate)} to {formatDateToEuropean(formData.endDate)})
        </div>
        <div className="confirmation-item">
          <strong>Country of Residence:</strong> {formData.countryOfResidence}
        </div>
        <div className="confirmation-item">
          <strong>Travelers:</strong> {formData.numberOfTravelers} person{formData.numberOfTravelers > 1 ? 's' : ''}
        </div>
        <div className="confirmation-item">
          <strong>Plan:</strong> {formData.selectedQuote?.name}
        </div>
        <div className="confirmation-item total">
          <strong>Total Amount:</strong> €{calculateTotalPrice().toFixed(2)}
        </div>
      </div>
      
      <div className="terms-section">
        <label className="checkbox-option">
          <input type="checkbox" required />
          <span>I agree to the <button 
            className="link-button" 
            onClick={() => onNavigate?.('privacy')}
            style={{ background: 'none', border: 'none', color: '#0077b6', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Terms and Conditions
          </button></span>
        </label>
        <label className="checkbox-option">
          <input type="checkbox" required />
          <span>I agree to the <button 
            className="link-button" 
            onClick={() => onNavigate?.('privacy')}
            style={{ background: 'none', border: 'none', color: '#0077b6', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Privacy Policy
          </button></span>
        </label>
        <label className="checkbox-option">
          <input type="checkbox" />
          <span>I would like to receive marketing emails about travel insurance offers</span>
        </label>
      </div>
    </div>
  );

  const renderPhase6 = () => (
    <div className="wizard-phase">
      <h2>Payment Details</h2>
      <p>Enter your payment information to complete your purchase.</p>
      
      
      <div className="payment-section">
        <div className="payment-methods">
          <h3>Payment Method</h3>
          <div className="payment-method-info">
            <p>We accept all major credit and debit cards for secure payment processing.</p>
          </div>
        </div>

        <div className="card-details">
          <h3>Card Details</h3>
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              placeholder="1234 5678 9012 3456"
              title="Enter your 16-digit card number"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="text"
                id="expiryDate"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                placeholder="MM/YY"
                title="Enter card expiry date in MM/YY format"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                placeholder="123"
                title="Enter the 3-digit CVV code from the back of your card"
                required
              />
            </div>
          </div>
        </div>

        <div className="billing-address">
          <h3>Billing Address</h3>
          <div className="form-group">
            <label htmlFor="street">Street Address</label>
            <input
              type="text"
              id="street"
              value={formData.billingAddress.street}
              onChange={(e) => handleBillingAddressChange('street', e.target.value)}
              placeholder="Enter street address"
              title="Enter your billing street address"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                value={formData.billingAddress.city}
                onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                placeholder="Enter city"
                title="Enter your billing city"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                value={formData.billingAddress.postalCode}
                onChange={(e) => handleBillingAddressChange('postalCode', e.target.value)}
                placeholder="Enter postal code"
                title="Enter your billing postal code"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              value={formData.billingAddress.country}
              onChange={(e) => handleBillingAddressChange('country', e.target.value)}
              placeholder="Enter country"
              title="Enter your billing country"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="payment-summary">
        <div className="summary-item">
          <strong>Total Amount: €{calculateTotalPrice().toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );

  const renderPhase7 = () => (
    <div className="wizard-phase">
      <h2>🎉 Congratulations!</h2>
      <p>Your travel insurance has been successfully purchased.</p>
      
      <div className="success-message">
        <div className="policy-number">
          <strong>Policy Number:</strong> {policyNumber || `TI-${Date.now().toString().slice(-8)}`}
        </div>
        <div className="confirmation-email">
          A confirmation email has been sent to {formData.travelers[0]?.email}
        </div>
      </div>
      
      <div className="documents-section">
        <h3>Your Documents</h3>
        <div className="document-links">
          <button 
            onClick={downloadPolicyPDF} 
            className="document-link download-btn"
            aria-label="Download your policy summary as a PDF document"
            title="Download a PDF copy of your travel insurance policy summary"
            type="button"
          >
            📄 Download Your Policy Summary (PDF)
          </button>
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
      case 7:
        return renderPhase7();
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
            {[1, 2, 3, 4, 5, 6, 7].map(phase => (
              <div key={phase} className={`progress-step ${currentPhase >= phase ? 'active' : ''} ${currentPhase === phase ? 'current' : ''}`}>
                <div className="step-number">{phase}</div>
                <div className="step-label">
                  {phase === 1 && 'Details'}
                  {phase === 2 && 'Quotes'}
                  {phase === 3 && 'Add-ons'}
                  {phase === 4 && 'Review'}
                  {phase === 5 && 'Confirm'}
                  {phase === 6 && 'Payment'}
                  {phase === 7 && 'Documents'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="wizard-content">
          {renderPhaseContent()}
        </div>

        <div className="wizard-navigation">
          {currentPhase > 1 && currentPhase < 7 && (
            <button 
              className="btn btn-secondary" 
              onClick={prevPhase}
              aria-label="Go to previous step"
              title="Go back to the previous step"
              type="button"
            >
              Previous
            </button>
          )}
          
          {currentPhase < 6 && (
            <button 
              className="btn btn-primary" 
              onClick={nextPhase}
              disabled={!isPhaseValid(currentPhase)}
              aria-label={currentPhase === 5 ? 'Proceed to payment step' : 'Go to next step'}
              title={currentPhase === 5 ? 'Continue to payment details' : 'Continue to next step'}
              type="button"
            >
              {currentPhase === 5 ? 'Proceed to Payment' : 'Next'}
            </button>
          )}
          
          {currentPhase === 6 && (
            <>
              <button 
                className="btn btn-primary" 
                onClick={processPayment}
                disabled={!isPhaseValid(currentPhase) || isProcessing}
                aria-label={isProcessing ? 'Processing payment, please wait' : `Pay €${calculateTotalPrice().toFixed(2)} for your travel insurance`}
                title={isProcessing ? 'Payment is being processed, please wait' : `Complete payment of €${calculateTotalPrice().toFixed(2)}`}
                type="button"
                style={{
                  opacity: (!isPhaseValid(currentPhase) || isProcessing) ? 0.5 : 1,
                  cursor: (!isPhaseValid(currentPhase) || isProcessing) ? 'not-allowed' : 'pointer'
                }}
              >
                {isProcessing ? 'Processing Payment...' : `Pay €${calculateTotalPrice().toFixed(2)}`}
              </button>
              
            </>
          )}
          
          {currentPhase === 7 && (
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.href = '/'}
              aria-label="Return to homepage"
              title="Go back to the main homepage"
              type="button"
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
