import React, { useState, useEffect, useRef } from 'react';
import './Quote2.css';
// Import API service for database integration
import { createQuote, processPayment as apiProcessPayment, getAddonsByPolicyType } from '../services/apiService';
// Import Terracotta service for insurance quotes
import TerracottaService, { 
  TerracottaQuoteResponse, 
  TerracottaQuoteResult, 
  TerracottaScreeningQuestionsResponse,
  TerracottaSavePolicyResponse,
  TerracottaProductListResponse,
  TerracottaPolicyType,
  TerracottaPolicyTypeResponse,
  TerracottaPolicyTypeDestination,
  TerracottaPolicyTypeDestinationResponse,
  SummaryCover,
  TerracottaQuoteWithAlterationsRequest,
  TerracottaTraveler,
  TerracottaContactDetails,
  getResidenceID,
  getTypePolicyID,
  getAgebandID,
  getTitleID
} from '../services/terracottaService';

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
                    formData.tripType === 'longstay' ? 'Long Stay Travel Insurance' :
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
                        formData.tripType === 'longstay' ? 'Long Stay Travel Insurance' :
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

const calculateAgeFromDateOfBirth = (dateOfBirth: string): number => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return Math.max(0, age);
};

interface TravelerInfo {
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  phone: string;
  vaxId: string;
  nationality: string;
  title?: string;
  dateOfBirth?: string;
  gender?: string;
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
  // Terracotta specific fields
  terracottaQuoteId?: string;
  schemaName?: string;
  policyTypeName?: string;
  policytypeName?: string; // Raw field from SOAP response
  summaryOfCoverUrl?: string;
  policyWordingUrl?: string;
  currency?: string;
  ipt?: number;
  // Enhanced metadata fields
  schemaID?: number;
  destinationCategory?: string;
  tripType?: string;
  // Enhanced SOAP fields
  residenceName?: string;
  destinationName?: string;
  packageName?: string;
  typePackageName?: string;
  isAnnual?: number;
  isBestBuy?: number;
  maxDaysPerTrip?: number;
  coverLevel?: number;
  discount?: number;
  iconURL?: string;
  helpFile?: string;
  policytypeShortName?: string;
  // Additional SOAP response fields
  keyFactsUrl?: string;
  policyTypeID?: number;
  destinationID?: number;
  packageID?: number;
  screeningPremium?: number;
  ipRate?: number;
  netUW?: number;
  wbComm?: number;
  agentComm?: number;
  // Additional fields from SOAP response
  typePolicyName?: string;
  isBestBuyText?: string;
  SummaryCovers?: SummaryCover[];
  // Document URLs from quote response
  SI?: string;  // Summary of Cover URL
  PW?: string;  // Policy Wording URL
}

interface QuoteFormData {
  // Trip Details
  destination: string;
  startDate: string;
  endDate: string;
  tripType: 'single' | 'annual' | 'comprehensive' | 'longstay';
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
  alterationId: string; // Terracotta alteration ID for SOAP calls
}

type WizardPhase = 1 | 2 | 3 | 4 | 5 | 6;

interface QuoteProps {
  onNavigate?: (page: string) => void;
}

const Quote2: React.FC<QuoteProps> = ({ onNavigate }) => {
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
  const [policyDocuments, setPolicyDocuments] = useState<{
    certificate?: string;
    policyWording?: string;
    summaryOfCover?: string;
    keyFacts?: string;
    ipid?: string;
  }>({});
  const [terracottaService] = useState<TerracottaService>(() => {
    console.log('Creating TerracottaService instance...');
    return TerracottaService.getInstance('4072', '111427');
  });
  const [screeningQuestions, setScreeningQuestions] = useState<any[]>([]);
  const [screeningAnswers, setScreeningAnswers] = useState<{[key: number]: 'yes' | 'no'}>({});
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);
  const [quoteError, setQuoteError] = useState<string>('');
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  
  // Policy types state
  const [availablePolicyTypes, setAvailablePolicyTypes] = useState<TerracottaPolicyType[]>([]);
  const [isLoadingPolicyTypes, setIsLoadingPolicyTypes] = useState(false);
  
  // Policy type destinations state (Trip Types)
  const [availablePolicyTypeDestinations, setAvailablePolicyTypeDestinations] = useState<TerracottaPolicyTypeDestination[]>([]);
  const [isLoadingPolicyTypeDestinations, setIsLoadingPolicyTypeDestinations] = useState(false);
  
  // Destination categories state
  const [destinationCategories, setDestinationCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  
  // Help popup state
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [countriesByCategory, setCountriesByCategory] = useState<{[key: string]: string[]}>({});
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  
  // Privacy Policy and Terms modal states
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsAndConditions, setShowTermsAndConditions] = useState(false);
  const [showGeneralConditions, setShowGeneralConditions] = useState(false);
  const [generalConditionsData, setGeneralConditionsData] = useState<any[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingEmailsAccepted, setMarketingEmailsAccepted] = useState(false);
  
  // Countries of residence state
  const [countriesOfResidence, setCountriesOfResidence] = useState<{country_id: number, country_name: string}[]>([]);
  const [isLoadingCountriesOfResidence, setIsLoadingCountriesOfResidence] = useState(false);
  
  // Addons state - fetched from database based on selected policy type
  const [availableAdditionalPolicies, setAvailableAdditionalPolicies] = useState<AdditionalPolicy[]>([]);
  const [isLoadingAddons, setIsLoadingAddons] = useState(false);
  
  // Store the total GrossPrice from SOAP alterations response
  const [totalGrossPriceWithAddons, setTotalGrossPriceWithAddons] = useState<number | null>(null);
  
  // Loading state for addon operations - track which specific addon is being processed
  const [processingAddonId, setProcessingAddonId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  

  // Load available Terracotta products on component mount
  useEffect(() => {
    const loadTerracottaProducts = async () => {
      try {
        setIsLoadingProducts(true);
        console.log('Loading Terracotta products...');
        const productResponse = await terracottaService.getUserProductList();
        console.log('Terracotta products loaded:', productResponse);
        console.log(`✅ Successfully loaded ${productResponse.Schemas?.length || 0} products for your account`);
        setAvailableProducts(productResponse.Schemas || []);
        setIsLoadingProducts(false);
      } catch (error) {
        console.error('Error loading Terracotta products:', error);
        setIsLoadingProducts(false);
        // Don't show error to user, just log it - we'll use fallback
      }
    };

    loadTerracottaProducts();
  }, [terracottaService]);

  // Load policy types when products are available
  useEffect(() => {
    const loadPolicyTypes = async () => {
      if (availableProducts.length === 0) return;
      
      try {
        setIsLoadingPolicyTypes(true);
        console.log('Loading policy types for available products...');
        
        // Load policy types for each product (schema)
        const allPolicyTypes: TerracottaPolicyType[] = [];
        
        for (const product of availableProducts) {
          try {
            console.log(`Loading policy types for schema ${product.SchemaID}: ${product.SchemaName}`);
            const policyResponse = await terracottaService.getUserProductTypePolicy(product.SchemaID.toString());
            console.log(`Policy types for schema ${product.SchemaID}:`, policyResponse);
            
            // Add schema context to each policy type
            const policyTypesWithSchema = policyResponse.PolicyTypes.map(policyType => ({
              ...policyType,
              SchemaID: product.SchemaID,
              SchemaName: product.SchemaName
            }));
            
            allPolicyTypes.push(...policyTypesWithSchema);
          } catch (error) {
            console.error(`Error loading policy types for schema ${product.SchemaID}:`, error);
          }
        }
        
        // Remove duplicates based on TypePolicyID
        const uniquePolicyTypes = allPolicyTypes.filter((policyType, index, self) => 
          index === self.findIndex(p => p.TypePolicyID === policyType.TypePolicyID)
        );
        
        setAvailablePolicyTypes(uniquePolicyTypes);
        console.log(`✅ Successfully loaded ${uniquePolicyTypes.length} unique policy types`);
        setIsLoadingPolicyTypes(false);
      } catch (error) {
        console.error('Error loading policy types:', error);
        setIsLoadingPolicyTypes(false);
      }
    };

    loadPolicyTypes();
  }, [availableProducts, terracottaService]);

  // Load policy types (Trip Types) when products are available
  useEffect(() => {
    const loadPolicyTypes = async () => {
      if (availableProducts.length === 0) return;
      
      try {
        setIsLoadingPolicyTypeDestinations(true);
        console.log('Loading policy types for available products...');
        
        // Load policy types for each product (schema) - Using schema 717 as specified
        const allPolicyTypes: TerracottaPolicyType[] = [];
        
        // Use schema 717 as specified in the requirement
        const schemaToUse = availableProducts.find(p => p.SchemaID === 717) || availableProducts[0];
        
        try {
          console.log(`Loading policy types for schema ${schemaToUse.SchemaID}: ${schemaToUse.SchemaName}`);
          const policyTypeResponse = await terracottaService.getUserProductTypePolicy(schemaToUse.SchemaID.toString());
          console.log(`Policy types for schema ${schemaToUse.SchemaID}:`, policyTypeResponse);
          
          allPolicyTypes.push(...policyTypeResponse.PolicyTypes);
        } catch (error) {
          console.error(`Error loading policy types for schema ${schemaToUse.SchemaID}:`, error);
        }
        
        setAvailablePolicyTypes(allPolicyTypes);
        console.log(`✅ Successfully loaded ${allPolicyTypes.length} policy types`);
        setIsLoadingPolicyTypeDestinations(false);
      } catch (error) {
        console.error('Error loading policy types:', error);
        setIsLoadingPolicyTypeDestinations(false);
      }
    };

    loadPolicyTypes();
  }, [availableProducts, terracottaService]);

  // Show a brief message when end date is cleared due to start date change
  useEffect(() => {
    if (formData.startDate && !formData.endDate) {
      // This effect will run when start date exists but end date is empty
      // We could add a toast notification here if needed
    }
  }, [formData.startDate, formData.endDate]);

  // Load countries of residence on component mount
  useEffect(() => {
    const loadCountriesOfResidence = async () => {
      try {
        setIsLoadingCountriesOfResidence(true);
        console.log('Loading countries of residence...');
        const response = await fetch('http://localhost:5002/api/countries');
        const data = await response.json();
        
        if (data.status === 'success') {
          setCountriesOfResidence(data.countries);
          console.log('✅ Countries of residence loaded:', data.countries.length, 'countries');
        } else {
          console.error('❌ Failed to load countries of residence:', data.message);
        }
      } catch (error) {
        console.error('❌ Error loading countries of residence:', error);
      } finally {
        setIsLoadingCountriesOfResidence(false);
      }
    };

    loadCountriesOfResidence();
  }, []);

  // Load destination categories on component mount
  useEffect(() => {
    const loadDestinationCategories = async () => {
      try {
        setIsLoadingCategories(true);
        console.log('Loading destination categories...');
        const response = await fetch('http://localhost:5002/api/destination-categories');
        const data = await response.json();
        
        if (data.status === 'success') {
          setDestinationCategories(data.categories);
          console.log('✅ Destination categories loaded:', data.categories);
        } else {
          console.error('❌ Failed to load destination categories:', data.message);
        }
      } catch (error) {
        console.error('❌ Error loading destination categories:', error);
        // Set fallback categories if API fails
        setDestinationCategories(['Europe', 'Worldwide']);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadDestinationCategories();
  }, []);

  // Load countries for each category when categories are loaded
  useEffect(() => {
    const loadCountriesForCategories = async () => {
      if (destinationCategories.length === 0) return;
      
      try {
        setIsLoadingCountries(true);
        const countriesData: {[key: string]: string[]} = {};
        
        // Load countries for each category
        for (const category of destinationCategories) {
          try {
            const response = await fetch(`http://localhost:5002/api/destination-categories/${encodeURIComponent(category)}/countries`);
            const data = await response.json();
            
            if (data.status === 'success') {
              countriesData[category] = data.countries;
            }
          } catch (error) {
            console.error(`Error loading countries for ${category}:`, error);
            countriesData[category] = [];
          }
        }
        
        setCountriesByCategory(countriesData);
      } catch (error) {
        console.error('Error loading countries:', error);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    loadCountriesForCategories();
  }, [destinationCategories]);

  // Generate quotes when component mounts or when form data is complete
  useEffect(() => {
    const generateQuotesIfNeeded = async () => {
      // Only generate quotes if we have basic form data and we're in phase 2
      if (currentPhase === 2 && quoteOptions.length === 0) {
        console.log('🔄 Generating quotes on component load...');
        try {
          const options = await generateQuoteOptions();
          setQuoteOptions(options);
        } catch (error) {
          console.error('Error generating quotes:', error);
        }
      }
    };

    generateQuotesIfNeeded();
  }, [currentPhase]);

  // Helper function to normalize SOAP policy type names to match database
  const normalizePolicyTypeName = (soapPolicyType: string): string => {
    if (!soapPolicyType) return '';
    
    // Trim and normalize whitespace
    let normalized = soapPolicyType.trim();
    
    // Map common SOAP response values to database policy type names
    const mappings: { [key: string]: string } = {
      // Annual Multi-Trip variants (handle various capitalizations)
      'Silver Annual Multi-Trip': 'Silver Annual Multi-Trip',
      'Gold Annual Multi-Trip': 'Gold Annual Multi-Trip',
      'Essential Annual Multi-Trip': 'Essential Annual Multi-Trip',
      'Silver Annual Multi Trip': 'Silver Annual Multi-Trip',
      'Gold Annual Multi Trip': 'Gold Annual Multi-Trip',
      'Essential Annual Multi Trip': 'Essential Annual Multi-Trip',
      'Silver Annual Multi-trip': 'Silver Annual Multi-Trip', // lowercase 't'
      'Gold Annual Multi-trip': 'Gold Annual Multi-Trip', // lowercase 't'
      'Essential Annual Multi-trip': 'Essential Annual Multi-Trip', // lowercase 't'
      
      // Single Trip variants
      'Silver Single Trip': 'Silver Single Trip',
      'Gold Single Trip': 'Gold Single Trip',
      'Essential Single Trip': 'Essential Single Trip',
      'Value Single Trip': 'Value Single Trip',
      
      // Long Stay variants
      'Long Stay Standard': 'Long Stay Standard',
      'Long Stay Study Abroad': 'Long Stay Study Abroad',
      'Longstay Standard': 'Long Stay Standard',
      'Longstay Study Abroad': 'Long Stay Study Abroad',
    };
    
    // Try exact match first (case-insensitive)
    for (const [key, value] of Object.entries(mappings)) {
      if (normalized.toLowerCase() === key.toLowerCase()) {
        console.log(`✅ Exact match found! Normalized policy type: "${normalized}" -> "${value}"`);
        return value;
      }
    }
    
    console.log(`⚠️ No exact mapping found for: "${normalized}", trying pattern matching...`);
    
    // Try pattern matching if exact match fails
    const lowerNormalized = normalized.toLowerCase();
    
    // Silver Annual Multi-Trip patterns
    if (lowerNormalized.includes('silver') && lowerNormalized.includes('annual')) {
      console.log(`✅ Pattern matched: "${normalized}" -> "Silver Annual Multi-Trip"`);
      return 'Silver Annual Multi-Trip';
    }
    
    // Gold Annual Multi-Trip patterns
    if (lowerNormalized.includes('gold') && lowerNormalized.includes('annual')) {
      console.log(`✅ Pattern matched: "${normalized}" -> "Gold Annual Multi-Trip"`);
      return 'Gold Annual Multi-Trip';
    }
    
    // Essential Annual Multi-Trip patterns
    if (lowerNormalized.includes('essential') && lowerNormalized.includes('annual')) {
      console.log(`✅ Pattern matched: "${normalized}" -> "Essential Annual Multi-Trip"`);
      return 'Essential Annual Multi-Trip';
    }
    
    // Silver Single Trip patterns
    if (lowerNormalized.includes('silver') && lowerNormalized.includes('single')) {
      console.log(`✅ Pattern matched: "${normalized}" -> "Silver Single Trip"`);
      return 'Silver Single Trip';
    }
    
    // Gold Single Trip patterns
    if (lowerNormalized.includes('gold') && lowerNormalized.includes('single')) {
      console.log(`✅ Pattern matched: "${normalized}" -> "Gold Single Trip"`);
      return 'Gold Single Trip';
    }
    
    // Essential Single Trip patterns
    if (lowerNormalized.includes('essential') && lowerNormalized.includes('single')) {
      console.log(`✅ Pattern matched: "${normalized}" -> "Essential Single Trip"`);
      return 'Essential Single Trip';
    }
    
    // Value Single Trip patterns
    if (lowerNormalized.includes('value') && lowerNormalized.includes('single')) {
      console.log(`✅ Pattern matched: "${normalized}" -> "Value Single Trip"`);
      return 'Value Single Trip';
    }
    
    // Long Stay patterns
    if (lowerNormalized.includes('long') && lowerNormalized.includes('stay')) {
      if (lowerNormalized.includes('study') || lowerNormalized.includes('abroad')) {
        console.log(`✅ Pattern matched: "${normalized}" -> "Long Stay Study Abroad"`);
        return 'Long Stay Study Abroad';
      }
      console.log(`✅ Pattern matched: "${normalized}" -> "Long Stay Standard"`);
      return 'Long Stay Standard';
    }
    
    // If no match found, return original and log warning
    console.warn(`⚠️ No mapping found for policy type: "${normalized}"`);
    return normalized;
  };

  // Fetch addons when entering Step 3 (Add-ons phase)
  useEffect(() => {
    const fetchAddons = async () => {
      // Only fetch addons when we're in Step 3 (Add-ons phase)
      if (currentPhase !== 3) {
        console.log('ℹ️ Not in Step 3, skipping addon fetch (current phase:', currentPhase, ')');
        return;
      }

      // Debug: Log the entire selected quote to see all available fields
      console.log('🔍 DEBUG - Selected Quote:', formData.selectedQuote);
      console.log('📍 Current Phase:', currentPhase, '- Fetching add-ons for Step 3');
      
      // Only fetch if we have a selected quote with a policy type name
      // IMPORTANT: prioritize policytypeName first as it contains the full name (e.g., "Silver Annual Multi-Trip")
      // policyTypeName often just contains "Annual Multi-Trip" without the tier (Silver/Gold/Essential)
      const rawPolicyTypeName = formData.selectedQuote?.policytypeName || formData.selectedQuote?.policyTypeName || formData.selectedQuote?.typePolicyName;
      
      console.log('🔍 DEBUG - Policy type field values:', {
        policyTypeName: formData.selectedQuote?.policyTypeName,
        policytypeName: formData.selectedQuote?.policytypeName,
        typePolicyName: formData.selectedQuote?.typePolicyName,
        rawPolicyTypeName: rawPolicyTypeName,
        selectedField: formData.selectedQuote?.policytypeName ? 'policytypeName' : 
                       formData.selectedQuote?.policyTypeName ? 'policyTypeName' : 'typePolicyName'
      });
      
      if (rawPolicyTypeName) {
        // Normalize the policy type name to match database
        const policyTypeName = normalizePolicyTypeName(rawPolicyTypeName);
        console.log('📋 Fetching addons for policy type:', policyTypeName, '(raw:', rawPolicyTypeName, ')');
        setIsLoadingAddons(true);
        
        try {
          const response = await getAddonsByPolicyType(policyTypeName);
          
          if (response.status === 'success') {
            const addonsData = (response as any).addons || [];
            console.log(`✅ Loaded ${addonsData.length} addons for ${policyTypeName}`);
            
            // Transform database addons to AdditionalPolicy format
            const transformedAddons: AdditionalPolicy[] = addonsData.map((addon: any) => {
              // Create a descriptive name combining cover name and details
              const displayName = addon.additional_cover_detail 
                ? `${addon.additional_cover_name} - ${addon.additional_cover_detail}`
                : addon.additional_cover_name;
              
              // Determine icon based on addon type
              const getIcon = (name: string) => {
                const lowerName = name.toLowerCase();
                if (lowerName.includes('winter') || lowerName.includes('sports')) return '🏂';
                if (lowerName.includes('business')) return '💼';
                if (lowerName.includes('golf')) return '⛳';
                if (lowerName.includes('hazardous') || lowerName.includes('activities')) return '🪂';
                if (lowerName.includes('wedding')) return '💍';
                if (lowerName.includes('event')) return '🎫';
                if (lowerName.includes('cancellation')) return '❌';
                if (lowerName.includes('waiver') || lowerName.includes('excess')) return '🛡️';
                if (lowerName.includes('financial') || lowerName.includes('protection')) return '💰';
                if (lowerName.includes('accident')) return '🚑';
                if (lowerName.includes('missed') || lowerName.includes('connection')) return '✈️';
                if (lowerName.includes('emigration')) return '🌍';
                if (lowerName.includes('study') || lowerName.includes('abroad')) return '📚';
                if (lowerName.includes('medical') || lowerName.includes('repatriation')) return '🏥';
                return '📋'; // Default icon
              };
              
              // Determine category based on addon type
              const getCategory = (name: string) => {
                const lowerName = name.toLowerCase();
                if (lowerName.includes('sport') || lowerName.includes('golf') || lowerName.includes('hazardous')) return 'Activities';
                if (lowerName.includes('business')) return 'Business';
                if (lowerName.includes('cancellation')) return 'Cancellation';
                if (lowerName.includes('wedding') || lowerName.includes('event')) return 'Events';
                if (lowerName.includes('protection') || lowerName.includes('waiver') || lowerName.includes('excess')) return 'Protection';
                if (lowerName.includes('medical') || lowerName.includes('accident')) return 'Medical';
                return 'Other';
              };
              
              return {
                id: `addon-${addon.alteration_id}`,
                name: displayName,
                description: addon.additional_cover_detail || addon.additional_cover_name,
                price: 0, // Price will be updated from SOAP response
                icon: getIcon(addon.additional_cover_name),
                category: getCategory(addon.additional_cover_name),
                alterationId: addon.alteration_id.toString() // Store alteration_id for SOAP calls
              };
            });
            
            setAvailableAdditionalPolicies(transformedAddons);
          } else {
            console.warn('No addons found for policy type:', policyTypeName);
            setAvailableAdditionalPolicies([]);
          }
        } catch (error) {
          console.error('Error fetching addons:', error);
          // Keep empty array on error
          setAvailableAdditionalPolicies([]);
        } finally {
          setIsLoadingAddons(false);
        }
      } else {
        // No policy type selected, try to extract from quote name as fallback
        if (formData.selectedQuote?.name) {
          console.warn('⚠️ No policy type field found, attempting to extract from quote name:', formData.selectedQuote.name);
          
          // Try to extract policy type from the name field
          // Format is usually: "SchemaName - PolicyTypeName"
          const nameParts = formData.selectedQuote.name.split(' - ');
          if (nameParts.length > 1) {
            const extractedPolicyType = nameParts[1].trim();
            console.log('🔍 Extracted policy type from name:', extractedPolicyType);
            
            const normalizedType = normalizePolicyTypeName(extractedPolicyType);
            if (normalizedType) {
              setIsLoadingAddons(true);
              try {
                const response = await getAddonsByPolicyType(normalizedType);
                if (response.status === 'success') {
                  const addonsData = (response as any).addons || [];
                  console.log(`✅ Loaded ${addonsData.length} addons using extracted type: ${normalizedType}`);
                  
                  const transformedAddons: AdditionalPolicy[] = addonsData.map((addon: any) => {
                    const displayName = addon.additional_cover_detail 
                      ? `${addon.additional_cover_name} - ${addon.additional_cover_detail}`
                      : addon.additional_cover_name;
                    
                    const getIcon = (name: string) => {
                      const lowerName = name.toLowerCase();
                      if (lowerName.includes('winter') || lowerName.includes('sports')) return '🏂';
                      if (lowerName.includes('business')) return '💼';
                      if (lowerName.includes('golf')) return '⛳';
                      if (lowerName.includes('hazardous') || lowerName.includes('activities')) return '🪂';
                      if (lowerName.includes('wedding')) return '💍';
                      if (lowerName.includes('event')) return '🎫';
                      if (lowerName.includes('cancellation')) return '❌';
                      if (lowerName.includes('waiver') || lowerName.includes('excess')) return '🛡️';
                      if (lowerName.includes('financial') || lowerName.includes('protection')) return '💰';
                      if (lowerName.includes('accident')) return '🚑';
                      if (lowerName.includes('missed') || lowerName.includes('connection')) return '✈️';
                      if (lowerName.includes('emigration')) return '🌍';
                      if (lowerName.includes('study') || lowerName.includes('abroad')) return '📚';
                      if (lowerName.includes('medical') || lowerName.includes('repatriation')) return '🏥';
                      return '📋';
                    };
                    
                    const getCategory = (name: string) => {
                      const lowerName = name.toLowerCase();
                      if (lowerName.includes('sport') || lowerName.includes('golf') || lowerName.includes('hazardous')) return 'Activities';
                      if (lowerName.includes('business')) return 'Business';
                      if (lowerName.includes('cancellation')) return 'Cancellation';
                      if (lowerName.includes('wedding') || lowerName.includes('event')) return 'Events';
                      if (lowerName.includes('protection') || lowerName.includes('waiver') || lowerName.includes('excess')) return 'Protection';
                      if (lowerName.includes('medical') || lowerName.includes('accident')) return 'Medical';
                      return 'Other';
                    };
                    
                    return {
                      id: `addon-${addon.alteration_id}`,
                      name: displayName,
                      description: addon.additional_cover_detail || addon.additional_cover_name,
                      price: 0, // Price will be updated from SOAP response
                      icon: getIcon(addon.additional_cover_name),
                      category: getCategory(addon.additional_cover_name),
                      alterationId: addon.alteration_id.toString() // Store alteration_id for SOAP calls
                    };
                  });
                  
                  setAvailableAdditionalPolicies(transformedAddons);
                }
              } catch (error) {
                console.error('Error fetching addons with extracted type:', error);
                setAvailableAdditionalPolicies([]);
              } finally {
                setIsLoadingAddons(false);
              }
              return;
            }
          }
        }
        
        console.warn('⚠️ No policy type found in selected quote, clearing addons');
        setAvailableAdditionalPolicies([]);
      }
    };

    fetchAddons();
  }, [currentPhase, formData.selectedQuote]); // Trigger when entering Step 3 OR when quote changes

  // Reset addons and pricing when the selected quote changes
  useEffect(() => {
    if (formData.selectedQuote) {
      console.log('Quote changed, resetting addons and pricing...');
      
      // Clear existing addons
      setFormData(prev => ({
        ...prev,
        additionalPolicies: []
      }));
      
      // Reset SOAP pricing
      setTotalGrossPriceWithAddons(null);
      
      // Clear available addons to force refresh
      setAvailableAdditionalPolicies([]);
      
      console.log('✅ Addons and pricing reset for new quote');
    }
  }, [formData.selectedQuote?.id]); // Only trigger when the quote ID actually changes

  // REMOVED: Auto-loading sample quotes - now using real SOAP response
  // useEffect(() => {
  //   if (currentPhase === 2) {
  //     console.log('🚀 Auto-loading TravelSafe sample quotes...');
  //     const sampleQuotes = generateSampleSOAPQuotes();
  //     setQuoteOptions(sampleQuotes);
  //     setIsLoadingQuotes(false);
  //   }
  // }, [currentPhase]);

  const generateQuoteOptions = async (): Promise<QuoteOption[]> => {
    setIsLoadingQuotes(true);
    setQuoteError('');

    try {
      console.log('🚀 Getting real quotes from Terracotta SOAP API...');
      console.log('Form data:', formData);
      
      // Make a single SOAP request to get all available quotes
      const terracottaRequest = TerracottaService.convertToTerracottaFormat(formData, availablePolicyTypes);
      console.log('SOAP Request:', terracottaRequest);
      
      // Get quotes from Terracotta SOAP API
      const response: TerracottaQuoteResponse = await terracottaService.provideQuotation(terracottaRequest);
      console.log('SOAP Response:', response);
      
      console.log('📊 SOAP Response Message:', response.Message);
      console.log('📊 Quote Results Count:', response.quoteResults?.length || 0);
      
      if (response.quoteResults && response.quoteResults.length > 0) {
        console.log('📊 Processing SOAP results:', response.quoteResults);
        // Convert SOAP response directly to QuoteOption format
        const realQuotes: QuoteOption[] = response.quoteResults.map((result, index) => {
          console.log(`Processing quote ${index + 1}:`, result);
          return {
            id: `soap-${result.QuoteID}`,
            name: `${result.schemaName} - ${result.policytypeName || result.typePolicyName}`,
            type: result.isBestBuy === 1 ? 'premium' : result.GrossPrice > 100 ? 'standard' : 'basic',
            price: result.GrossPrice || 0,
            coverage: {
              medical: result.coverLevel > 0 ? `€${(result.coverLevel * 1000000).toLocaleString()}` : '€2,000,000',
              baggage: '€1,000', // This would ideally come from SOAP response
              cancellation: '€2,000', // This would ideally come from SOAP response
              activities: ['Standard activities', 'Adventure sports']
            },
            features: [
              '24/7 Emergency Assistance',
              'Medical Coverage',
              'Trip Cancellation',
              'Baggage Protection',
              ...(result.isAnnual === 1 ? ['Annual Multi-Trip Coverage'] : []),
              ...(result.isBestBuy === 1 ? ['Best Buy Option'] : []),
              ...(result.maxDaysPerTrip > 0 ? [`Up to ${result.maxDaysPerTrip} days per trip`] : [])
            ],
            // Real SOAP response data
            terracottaQuoteId: result.QuoteID,
            schemaName: result.schemaName,
            policytypeName: result.policytypeName,
            policyTypeName: result.typePolicyName || result.policytypeName,
            typePolicyName: result.typePolicyName || result.policytypeName,
            summaryOfCoverUrl: result.SI,
            policyWordingUrl: result.PW,
            currency: result.currency,
            ipt: result.IPT,
            // Complete SOAP response fields
            schemaID: result.SchemaID,
            destinationCategory: result.destinationName,
            tripType: formData.tripType,
            residenceName: result.residenceName,
            destinationName: result.destinationName,
            packageName: result.packageName,
            typePackageName: result.typePackageName,
            isAnnual: result.isAnnual,
            isBestBuy: result.isBestBuy,
            isBestBuyText: result.isBestBuyText,
            maxDaysPerTrip: result.maxDaysPerTrip,
            coverLevel: result.coverLevel,
            discount: result.Discount,
            iconURL: result.IconURL,
            helpFile: result.HelpFile,
            policytypeShortName: result.policytypeShortName,
            // Additional SOAP fields
            keyFactsUrl: result.KF,
            policyTypeID: result.PolicyTypeID,
            destinationID: result.DestinationID,
            packageID: result.PackageID,
            screeningPremium: result.screeningPremium,
            ipRate: result.IPTRate,
            netUW: result.netUW,
            wbComm: result.wbComm,
            agentComm: result.agentComm,
            SummaryCovers: result.SummaryCovers || [],
            // Document URLs
            SI: result.SI,
            PW: result.PW
          };
        });
        
        console.log(`✅ Received ${realQuotes.length} real quotes from Terracotta SOAP API`);
        
        // Sort by IPT (highest first) and take top 3
        const sortedByIPT = realQuotes.sort((a, b) => {
          const iptA = a.ipt || 0;
          const iptB = b.ipt || 0;
          return iptB - iptA; // Descending order (highest IPT first)
        });
        
        const top3Quotes = sortedByIPT.slice(0, 3);
        
        // Sort the top 3 by price (ascending - least expensive to most expensive)
        const sortedByPrice = top3Quotes.sort((a, b) => a.price - b.price);
        
        console.log(`📊 Filtered to top 3 quotes with highest IPT, sorted by price:`, sortedByPrice.map(q => ({ 
          name: q.name, 
          price: q.price,
          ipt: q.ipt 
        })));
        
        setIsLoadingQuotes(false);
        return sortedByPrice;
      } else {
        console.log('⚠️ No quotes in SOAP response, using sample data');
        console.log('⚠️ Response message:', response.Message);
        console.log('⚠️ This might be due to:');
        console.log('   - Incorrect API credentials');
        console.log('   - Invalid parameter values');
        console.log('   - API restrictions or downtime');
        console.log('   - Date range issues (past dates)');
        setIsLoadingQuotes(false);
        return generateSampleSOAPQuotes();
      }
      
    } catch (error) {
      console.error('❌ Error getting real SOAP quotes:', error);
      setQuoteError('SOAP API unavailable. Showing sample quotes from your SOAP response.');
      setIsLoadingQuotes(false);
      
      // Fallback to sample SOAP response data
      console.log('🔄 Using sample SOAP response data');
      return generateSampleSOAPQuotes();
    }
  };

  // Generate sample quotes using your SOAP response data
  const generateSampleSOAPQuotes = (): QuoteOption[] => {
    const allSampleQuotes: QuoteOption[] = [
      {
        id: 'soap-12345',
        name: 'TravelSafe Basic 2024 - Single Trip Travel Insurance',
        type: 'premium' as const, // Best buy
        price: 72.60,
        coverage: {
          medical: '€5,000,000', // Cover level 5
          baggage: '€1,000',
          cancellation: '€2,000',
          activities: ['Standard activities', 'Adventure sports']
        },
        features: [
          '24/7 Emergency Assistance',
          'Medical Coverage',
          'Trip Cancellation',
          'Baggage Protection',
          'Best Buy Option',
          'Up to 90 days per trip'
        ],
        // Real SOAP response data from QuoteID 12345
        terracottaQuoteId: '12345',
        schemaName: 'TravelSafe Basic 2024',
        policyTypeName: 'Single Trip Travel Insurance',
        typePolicyName: 'Single Trip Travel Insurance',
        summaryOfCoverUrl: 'https://terracotta.example.com/summary/12345.pdf',
        policyWordingUrl: 'https://terracotta.example.com/wording/12345.pdf',
        currency: 'EUR',
        ipt: 12.60,
        // Complete SOAP response fields
        schemaID: 683,
        destinationCategory: 'Europe',
        tripType: formData.tripType,
        residenceName: 'Greece',
        destinationName: 'Europe',
        packageName: 'TravelSafe Standard',
        typePackageName: 'Standard Package',
        isAnnual: 0,
        isBestBuy: 1,
        isBestBuyText: 'Best Value Option',
        maxDaysPerTrip: 90,
        coverLevel: 5,
        discount: 0.00,
        iconURL: 'https://terracotta.example.com/icons/basic.png',
        helpFile: 'https://terracotta.example.com/help/12345.html',
        policytypeShortName: 'Single Trip',
        // Additional SOAP fields
        keyFactsUrl: 'https://terracotta.example.com/keyfacts/12345.pdf',
        policyTypeID: 1,
        destinationID: 2,
        packageID: 1,
        screeningPremium: 0.00,
        ipRate: 21.00,
        netUW: 60.00,
        wbComm: 5.40,
        agentComm: 7.20
      },
      {
        id: 'soap-12346',
        name: 'TravelSafe Premium 2024 - Single Trip Travel Insurance',
        type: 'standard' as const,
        price: 108.90,
        coverage: {
          medical: '€10,000,000', // Cover level 10
          baggage: '€1,000',
          cancellation: '€2,000',
          activities: ['Standard activities', 'Adventure sports']
        },
        features: [
          '24/7 Emergency Assistance',
          'Medical Coverage',
          'Trip Cancellation',
          'Baggage Protection',
          'Up to 120 days per trip'
        ],
        // Real SOAP response data from QuoteID 12346
        terracottaQuoteId: '12346',
        schemaName: 'TravelSafe Premium 2024',
        policyTypeName: 'Single Trip Travel Insurance',
        typePolicyName: 'Single Trip Travel Insurance',
        summaryOfCoverUrl: 'https://terracotta.example.com/summary/12346.pdf',
        policyWordingUrl: 'https://terracotta.example.com/wording/12346.pdf',
        currency: 'EUR',
        ipt: 18.90,
        // Complete SOAP response fields
        schemaID: 717,
        destinationCategory: 'Europe',
        tripType: formData.tripType,
        residenceName: 'Greece',
        destinationName: 'Europe',
        packageName: 'TravelSafe Premium',
        typePackageName: 'Premium Package',
        isAnnual: 0,
        isBestBuy: 0,
        isBestBuyText: '',
        maxDaysPerTrip: 120,
        coverLevel: 10,
        discount: 0.00,
        iconURL: 'https://terracotta.example.com/icons/premium.png',
        helpFile: 'https://terracotta.example.com/help/12346.html',
        policytypeShortName: 'Single Trip',
        // Additional SOAP fields
        keyFactsUrl: 'https://terracotta.example.com/keyfacts/12346.pdf',
        policyTypeID: 1,
        destinationID: 2,
        packageID: 2,
        screeningPremium: 0.00,
        ipRate: 21.00,
        netUW: 90.00,
        wbComm: 8.10,
        agentComm: 10.80
      }
    ];
    
    // Sort by IPT (highest first) and take top 3
    const sortedByIPT = allSampleQuotes.sort((a, b) => {
      const iptA = a.ipt || 0;
      const iptB = b.ipt || 0;
      return iptB - iptA; // Descending order (highest IPT first)
    });
    
    const top3 = sortedByIPT.slice(0, 3);
    
    // Sort the top 3 by price (ascending - least expensive to most expensive)
    return top3.sort((a, b) => a.price - b.price);
  };

  // Helper function to calculate coverage levels using real SOAP data
  const calculateRealCoverageLevels = (result: any, destination: string, tripType: string) => {
    // Use real data from SOAP response when available, fallback to calculated values
    const baseMedical = result.coverLevel > 0 ? `€${(result.coverLevel * 1000000).toLocaleString()}` : 
                       tripType === 'annual' ? '€5,000,000' : '€2,000,000';
    
    const baseBaggage = '€1,000'; // This would ideally come from SOAP response
    const baseCancellation = '€2,000'; // This would ideally come from SOAP response
    
    // Enhance coverage based on destination category and SOAP data
    let medicalMultiplier = 1;
    let baggageMultiplier = 1;
    let cancellationMultiplier = 1;
    
    if (destination.toLowerCase().includes('worldwide') || destination.toLowerCase().includes('america')) {
      medicalMultiplier = 2;
      baggageMultiplier = 1.5;
      cancellationMultiplier = 2;
    } else if (destination.toLowerCase().includes('europe')) {
      medicalMultiplier = 1.5;
      baggageMultiplier = 1.2;
      cancellationMultiplier = 1.5;
    }
    
    // Use SOAP cover level if available
    if (result.coverLevel > 0) {
      medicalMultiplier = 1; // Use the real cover level from SOAP
    }
    
    return {
      medical: result.coverLevel > 0 ? baseMedical : 
               `€${(parseInt(baseMedical.replace(/[€,]/g, '')) * medicalMultiplier).toLocaleString()}`,
      baggage: `€${(parseInt(baseBaggage.replace(/[€,]/g, '')) * baggageMultiplier).toLocaleString()}`,
      cancellation: `€${(parseInt(baseCancellation.replace(/[€,]/g, '')) * cancellationMultiplier).toLocaleString()}`,
      activities: generateActivitiesForDestination(destination)
    };
  };

  // Helper function to generate features using real SOAP data
  const generateFeaturesFromSOAPData = (result: any, destination: string, tripType: string): string[] => {
    const baseFeatures = [
      '24/7 Emergency Assistance',
      'Medical Coverage',
      'Trip Cancellation',
      'Baggage Protection'
    ];
    
    const soapFeatures: string[] = [];
    const destinationFeatures: string[] = [];
    
    // Add features based on SOAP response data
    if (result.isAnnual === 1) {
      soapFeatures.push('Annual Multi-Trip Coverage', 'Unlimited Trips', 'Annual Policy Benefits');
    }
    
    if (result.isBestBuy === 1) {
      soapFeatures.push('Best Buy Policy', result.isBestBuyText || 'Recommended Option');
    }
    
    if (result.maxDaysPerTrip > 0) {
      soapFeatures.push(`Up to ${result.maxDaysPerTrip} days per trip`);
    }
    
    if (result.discount > 0) {
      soapFeatures.push(`${result.discount}% Discount Applied`);
    }
    
    // Add destination-specific features
    if (destination.toLowerCase().includes('worldwide') || destination.toLowerCase().includes('america')) {
      destinationFeatures.push('Worldwide Medical Coverage', 'Emergency Repatriation', 'High-Risk Activity Coverage');
    } else if (destination.toLowerCase().includes('europe')) {
      destinationFeatures.push('EU Medical Card Coverage', 'Schengen Zone Protection');
    }
    
    if (tripType === 'comprehensive') {
      destinationFeatures.push('Enhanced Coverage', 'Adventure Sports', 'Winter Sports', 'Business Travel');
    }
    
    return [...baseFeatures, ...soapFeatures, ...destinationFeatures];
  };

  // Helper function to calculate coverage levels based on destination and trip type (fallback)
  const calculateCoverageLevels = (destination: string, tripType: string, price: number) => {
    const baseMedical = tripType === 'annual' ? '€5,000,000' : tripType === 'longstay' ? '€3,000,000' : '€2,000,000';
    const baseBaggage = '€1,000';
    const baseCancellation = '€2,000';
    
    // Enhance coverage based on destination category
    let medicalMultiplier = 1;
    let baggageMultiplier = 1;
    let cancellationMultiplier = 1;
    
    if (destination.toLowerCase().includes('worldwide') || destination.toLowerCase().includes('america')) {
      medicalMultiplier = 2;
      baggageMultiplier = 1.5;
      cancellationMultiplier = 2;
    } else if (destination.toLowerCase().includes('europe')) {
      medicalMultiplier = 1.5;
      baggageMultiplier = 1.2;
      cancellationMultiplier = 1.5;
    }
    
    // Enhance based on price level
    if (price > 200) {
      medicalMultiplier *= 2;
      baggageMultiplier *= 2;
      cancellationMultiplier *= 2;
    } else if (price > 100) {
      medicalMultiplier *= 1.5;
      baggageMultiplier *= 1.5;
      cancellationMultiplier *= 1.5;
    }
    
    return {
      medical: `€${(parseInt(baseMedical.replace(/[€,]/g, '')) * medicalMultiplier).toLocaleString()}`,
      baggage: `€${(parseInt(baseBaggage.replace(/[€,]/g, '')) * baggageMultiplier).toLocaleString()}`,
      cancellation: `€${(parseInt(baseCancellation.replace(/[€,]/g, '')) * cancellationMultiplier).toLocaleString()}`,
      activities: generateActivitiesForDestination(destination)
    };
  };

  // Helper function to determine quote type based on price and index
  const determineQuoteType = (price: number, index: number): 'basic' | 'standard' | 'premium' => {
    if (price < 50) return 'basic';
    if (price < 150) return 'standard';
    return 'premium';
  };

  // Helper function to generate features based on destination and trip type
  const generateFeaturesForDestination = (destination: string, tripType: string): string[] => {
    const baseFeatures = [
      '24/7 Emergency Assistance',
      'Medical Coverage',
      'Trip Cancellation',
      'Baggage Protection'
    ];
    
    const destinationFeatures: string[] = [];
    
    if (destination.toLowerCase().includes('worldwide') || destination.toLowerCase().includes('america')) {
      destinationFeatures.push('Worldwide Medical Coverage', 'Emergency Repatriation', 'High-Risk Activity Coverage');
    } else if (destination.toLowerCase().includes('europe')) {
      destinationFeatures.push('EU Medical Card Coverage', 'Schengen Zone Protection');
    }
    
    if (tripType === 'annual') {
      destinationFeatures.push('Multiple Trip Coverage', 'Annual Policy Benefits', 'Unlimited Trips');
    } else if (tripType === 'longstay') {
      destinationFeatures.push('Extended Stay Coverage', 'Long Term Medical', 'Extended Baggage Protection', 'Long Stay Benefits');
    } else if (tripType === 'comprehensive') {
      destinationFeatures.push('Enhanced Coverage', 'Adventure Sports', 'Winter Sports', 'Business Travel');
    }
    
    return [...baseFeatures, ...destinationFeatures];
  };

  // Helper function to generate activities based on destination
  const generateActivitiesForDestination = (destination: string): string[] => {
    const baseActivities = ['Standard activities'];
    
    if (destination.toLowerCase().includes('worldwide') || destination.toLowerCase().includes('america')) {
      return ['Standard activities', 'Adventure sports', 'Extreme sports', 'Water sports', 'Winter sports'];
    } else if (destination.toLowerCase().includes('europe')) {
      return ['Standard activities', 'Adventure sports', 'Winter sports'];
    }
    
    return baseActivities;
  };

  // Enhanced mock quote generation that simulates Terracotta-style data
  const generateEnhancedMockQuoteOptions = (): QuoteOption[] => {
    const days = formData.startDate && formData.endDate 
      ? Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 3600 * 24))
      : 7;

    let basePrice = formData.tripType === 'annual' ? 99 : formData.tripType === 'longstay' ? 60 : 40;
    const dailyRate = formData.tripType === 'annual' ? 0 : formData.tripType === 'longstay' ? 3 : 5;
    const tripMultiplier = formData.tripType === 'comprehensive' ? 1.5 : formData.tripType === 'longstay' ? 1.2 : 1;

    // Generate multiple mock quotes based on available schemas
    const mockQuotes: QuoteOption[] = [];
    
    // Create quotes for each available schema if we have them, otherwise use defaults
    const schemasToUse = availableProducts.length > 0 ? availableProducts : [
      { SchemaID: 683, SchemaName: 'TravelSafe Basic' },
      { SchemaID: 717, SchemaName: 'TravelSafe Premium' }
    ];

    schemasToUse.forEach((schema, index) => {
      const price = Math.round((basePrice + (days * dailyRate) + (index * 30)) * formData.numberOfTravelers * tripMultiplier);
      const coverage = calculateCoverageLevels(formData.destination, formData.tripType, price);
      const features = generateFeaturesForDestination(formData.destination, formData.tripType);
      const quoteType = determineQuoteType(price, index);

      mockQuotes.push({
        id: `mock-${schema.SchemaID}-${index}`,
        name: `${schema.SchemaName} - ${formData.tripType === 'annual' ? 'Annual Multi-Trip' : 'Single Trip'}`,
        type: quoteType,
        price: price,
        coverage: coverage,
        features: features,
        // Terracotta specific fields (mock)
        terracottaQuoteId: `mock-${schema.SchemaID}-${Date.now()}`,
        schemaName: schema.SchemaName,
        policyTypeName: formData.tripType === 'annual' ? 'Annual Multi-Trip' : 'Single Trip',
        summaryOfCoverUrl: 'https://terracotta.example.com/summary/mock.pdf',
        policyWordingUrl: 'https://terracotta.example.com/wording/mock.pdf',
        currency: 'EUR',
        ipt: Math.round(price * 0.21), // 21% IPT
        // Additional metadata
        schemaID: schema.SchemaID,
        destinationCategory: formData.destination,
        tripType: formData.tripType
      });
    });

    return mockQuotes;
  };

  // Legacy mock quotes (kept for backward compatibility)
  const generateLegacyMockQuoteOptions = (): QuoteOption[] => {
    const days = formData.startDate && formData.endDate 
      ? Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 3600 * 24))
      : 7;

    let basePrice = formData.tripType === 'annual' ? 99 : formData.tripType === 'longstay' ? 60 : 40;
    const dailyRate = formData.tripType === 'annual' ? 0 : formData.tripType === 'longstay' ? 3 : 5;
    const tripMultiplier = formData.tripType === 'comprehensive' ? 1.5 : formData.tripType === 'longstay' ? 1.2 : 1;

    const options: QuoteOption[] = [
      {
        id: 'terracotta-basic',
        name: 'Terracotta TravelSafe Basic',
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
        ],
        // Terracotta-specific fields (simulated)
        terracottaQuoteId: `TC-${Date.now()}-001`,
        schemaName: 'TravelSafe Basic',
        policyTypeName: formData.tripType === 'annual' ? 'Annual Multi-Trip' : 'Single Trip',
        summaryOfCoverUrl: 'https://terracotta.example.com/summary/basic.pdf',
        policyWordingUrl: 'https://terracotta.example.com/wording/basic.pdf',
        currency: 'EUR',
        ipt: 15.50
      },
      {
        id: 'terracotta-standard',
        name: 'Terracotta TravelSafe Standard',
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
        ],
        // Terracotta-specific fields (simulated)
        terracottaQuoteId: `TC-${Date.now()}-002`,
        schemaName: 'TravelSafe Standard',
        policyTypeName: formData.tripType === 'annual' ? 'Annual Multi-Trip' : 'Single Trip',
        summaryOfCoverUrl: 'https://terracotta.example.com/summary/standard.pdf',
        policyWordingUrl: 'https://terracotta.example.com/wording/standard.pdf',
        currency: 'EUR',
        ipt: 22.75
      },
      {
        id: 'terracotta-premium',
        name: 'Terracotta TravelSafe Premium',
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
        ],
        // Terracotta-specific fields (simulated)
        terracottaQuoteId: `TC-${Date.now()}-003`,
        schemaName: 'TravelSafe Premium',
        policyTypeName: formData.tripType === 'annual' ? 'Annual Multi-Trip' : 'Single Trip',
        summaryOfCoverUrl: 'https://terracotta.example.com/summary/premium.pdf',
        policyWordingUrl: 'https://terracotta.example.com/wording/premium.pdf',
        currency: 'EUR',
        ipt: 35.00
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

  const fetchGeneralConditions = async () => {
    if (formData.selectedQuote?.terracottaQuoteId) {
      try {
        console.log('🔄 Fetching general conditions (screening questions) for QuoteID:', formData.selectedQuote.terracottaQuoteId);
        const screeningResponse = await terracottaService.getScreeningQuestions(formData.selectedQuote.terracottaQuoteId);
        console.log('📥 General Conditions Response:', screeningResponse);
        
        if (screeningResponse.screeningQuestions && screeningResponse.screeningQuestions.length > 0) {
          setGeneralConditionsData(screeningResponse.screeningQuestions);
          console.log('✅ General conditions loaded from API:', screeningResponse.screeningQuestions);
          setShowGeneralConditions(true);
        } else {
          console.warn('⚠️ No general conditions in API response');
          setGeneralConditionsData([]);
          setShowGeneralConditions(true);
        }
      } catch (error) {
        console.error('❌ Error fetching general conditions:', error);
        // Show empty popup on error
        setGeneralConditionsData([]);
        setShowGeneralConditions(true);
      }
    }
  };

  const handleTermsAcceptance = (checked: boolean) => {
    setTermsAccepted(checked);
    
    if (checked && screeningQuestions.length > 0) {
      // When checkbox is checked, automatically answer "yes" to all screening questions (yesAction)
      const allYesAnswers: {[key: number]: 'yes'} = {};
      screeningQuestions.forEach((question) => {
        allYesAnswers[question.questionNumber] = 'yes';
      });
      setScreeningAnswers(allYesAnswers);
      console.log('✅ Terms accepted - All screening questions answered as "Yes" (yesAction triggered)');
    } else if (!checked) {
      // When unchecked, clear the screening answers
      setScreeningAnswers({});
      console.log('❌ Terms not accepted - Screening answers cleared');
    }
  };

  const nextPhase = async () => {
    if (currentPhase === 1) {
      // Generate quotes when moving from phase 1 to 2
      try {
        console.log('🔄 Moving from Phase 1 to Phase 2 - Fetching quotes...');
        console.log('📋 Current Form Data:', JSON.stringify(formData, null, 2));
        
        const options = await generateQuoteOptions();
        
        console.log('✅ Quote options received:', options);
        console.log('📊 Number of quotes:', options.length);
        
        setQuoteOptions(options);
        
        // Automatically pre-select the Essential plan
        const essentialPlan = options.find(option => 
          option.name?.toLowerCase().includes('essential') || 
          option.policytypeName?.toLowerCase().includes('essential')
        );
        if (essentialPlan) {
          console.log('✅ Auto-selected Essential plan:', essentialPlan);
          setFormData(prev => ({
            ...prev,
            selectedQuote: essentialPlan
          }));
        } else {
          console.log('⚠️ No Essential plan found, selecting first available quote');
          if (options.length > 0) {
            setFormData(prev => ({
              ...prev,
              selectedQuote: options[0]
            }));
          }
        }
      } catch (error) {
        console.error('❌ CRITICAL ERROR generating quotes:', error);
        console.error('Error details:', error instanceof Error ? error.message : String(error));
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        setQuoteError('Failed to generate quotes. Please try again.');
        return; // Don't proceed to next phase if quotes failed
      }
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

  const addAdditionalPolicy = async (policy: AdditionalPolicy) => {
    // Prevent multiple simultaneous requests
    if (processingAddonId) {
      return;
    }
    
    try {
      setProcessingAddonId(policy.id);
      
      // Check if quoteID is available
      if (!formData.selectedQuote?.terracottaQuoteId) {
        alert('Error: No quote selected. Please select a quote first.');
        return;
      }

      // Build comma-separated list of alteration IDs (existing + new one)
      const existingAlterationIds = formData.additionalPolicies.map(p => p.alterationId);
      const allAlterationIds = [...existingAlterationIds, policy.alterationId].join(',');
      
      // Convert travelers to Terracotta format
      const travelers: TerracottaTraveler[] = formData.travelers.map((traveler, index) => {
        const age = traveler.dateOfBirth ? 
          calculateAgeFromDOB(traveler.dateOfBirth) : 
          parseInt(traveler.age) || 25;
        
        const dateOfBirth = traveler.dateOfBirth || calculateDOBFromAge(age);
        
        return {
          TravellerNumber: index + 1,
          Title: traveler.title || 'Mr',
          FirstName: traveler.firstName || 'Customer',
          LastName: traveler.lastName || 'Name',
          DateOfBirth: formatDateForTerracotta(dateOfBirth),
          Age: age,
          TitleID: getTitleID(traveler.title || 'Mr'),
          AlterationID: '' // Empty for individual traveler alterations
        };
      });
      
      // Build contact details
      const contactDetails: TerracottaContactDetails = {
        Address: formData.billingAddress?.street || '123 Main Street',
        Postcode: formData.billingAddress?.postalCode || '12345',
        Email: formData.travelers[0]?.email || 'customer@example.com',
        Telephone: formData.travelers[0]?.phone || '+302101234567'
      };
      
      // Build SOAP request
      const alterationsRequest: TerracottaQuoteWithAlterationsRequest = {
        userID: '4072',
        userCode: '111427',
        quoteID: formData.selectedQuote.terracottaQuoteId,
        specificQuoteDetails: {
          AlterationID: allAlterationIds,
          Travellers: travelers,
          ContactDetails: contactDetails
        }
      };
      
      // Call SOAP service
      const response: TerracottaQuoteResponse = await terracottaService.provideQuotationWithAlterations(alterationsRequest);
      
      // Extract the updated price from the response
      if (response.quoteResults && response.quoteResults.length > 0) {
        const updatedQuote = response.quoteResults[0];
        const newGrossPrice = updatedQuote.GrossPrice;
        
        // Store the total GrossPrice (this is the complete price including base + all addons)
        setTotalGrossPriceWithAddons(newGrossPrice);
        
        // Add the policy to state (price will be calculated from total)
        setFormData(prev => ({
          ...prev,
          additionalPolicies: [...prev.additionalPolicies, policy]
        }));
      } else {
        // Still add the addon but with 0 price
        setFormData(prev => ({
          ...prev,
          additionalPolicies: [...prev.additionalPolicies, policy]
        }));
      }
      
    } catch (error) {
      console.error('Error adding addon with alterations:', error);
      alert(`Error adding addon: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setProcessingAddonId(null);
    }
  };
  
  // Helper functions for date/age calculations
  const calculateAgeFromDOB = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return Math.max(0, age);
  };
  
  const calculateDOBFromAge = (age: number): string => {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    return `${birthYear}/05/20`; // Use May 20 as default date
  };
  
  const formatDateForTerracotta = (dateString: string): string => {
    if (!dateString) return '';
    // Handle different formats
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3 && parts[0].length === 4) {
        return dateString; // Already in YYYY/MM/DD format
      } else if (parts.length === 3) {
        // Convert DD/MM/YYYY to YYYY/MM/DD
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
    if (dateString.includes('-')) {
      return dateString.replace(/-/g, '/');
    }
    return dateString;
  };
  
  const getTitleID = (title: string): number => {
    const titleMap: { [key: string]: number } = {
      'Mr': 1, 'Mrs': 2, 'Miss': 3, 'Ms': 4, 'Dr': 5, 'Prof': 6
    };
    return titleMap[title] || 1;
  };

  const removeAdditionalPolicy = async (policyId: string) => {
    try {
      setProcessingAddonId(policyId);
      
      // Remove the addon from the list first
      const remainingAddons = formData.additionalPolicies.filter(p => p.id !== policyId);
      
      setFormData(prev => ({
        ...prev,
        additionalPolicies: remainingAddons
      }));
      
      // If no addons remaining, reset to base price
      if (remainingAddons.length === 0) {
        setTotalGrossPriceWithAddons(null);
        setProcessingAddonId(null);
        return;
      }
      
      // If there are still addons, call SOAP to get updated price
      if (formData.selectedQuote?.terracottaQuoteId) {
        // Build comma-separated list of remaining alteration IDs
        const remainingAlterationIds = remainingAddons.map(p => p.alterationId).join(',');
        
        // Convert travelers to Terracotta format
        const travelers: TerracottaTraveler[] = formData.travelers.map((traveler, index) => {
          const age = traveler.dateOfBirth ? 
            calculateAgeFromDOB(traveler.dateOfBirth) : 
            parseInt(traveler.age) || 25;
          
          const dateOfBirth = traveler.dateOfBirth || calculateDOBFromAge(age);
          
          return {
            TravellerNumber: index + 1,
            Title: traveler.title || 'Mr',
            FirstName: traveler.firstName || 'Customer',
            LastName: traveler.lastName || 'Name',
            DateOfBirth: formatDateForTerracotta(dateOfBirth),
            Age: age,
            TitleID: getTitleID(traveler.title || 'Mr'),
            AlterationID: ''
          };
        });
        
        // Build contact details
        const contactDetails: TerracottaContactDetails = {
          Address: formData.billingAddress?.street || '123 Main Street',
          Postcode: formData.billingAddress?.postalCode || '12345',
          Email: formData.travelers[0]?.email || 'customer@example.com',
          Telephone: formData.travelers[0]?.phone || '+302101234567'
        };
        
        // Build SOAP request
        const alterationsRequest: TerracottaQuoteWithAlterationsRequest = {
          userID: '4072',
          userCode: '111427',
          quoteID: formData.selectedQuote.terracottaQuoteId,
          specificQuoteDetails: {
            AlterationID: remainingAlterationIds,
            Travellers: travelers,
            ContactDetails: contactDetails
          }
        };
        
        // Call SOAP service
        const response: TerracottaQuoteResponse = await terracottaService.provideQuotationWithAlterations(alterationsRequest);
        
        // Update the GrossPrice
        if (response.quoteResults && response.quoteResults.length > 0) {
          const updatedQuote = response.quoteResults[0];
          const newGrossPrice = updatedQuote.GrossPrice;
          setTotalGrossPriceWithAddons(newGrossPrice);
        }
      }
    } catch (error) {
      console.error('Error updating price after addon removal:', error);
      // Keep the addon removed even if SOAP call fails
    } finally {
      setProcessingAddonId(null);
    }
  };

  const calculateTotalPrice = (): number => {
    // If we have a GrossPrice from SOAP alterations, use that
    if (totalGrossPriceWithAddons !== null && formData.additionalPolicies.length > 0) {
      return totalGrossPriceWithAddons;
    }
    
    // Otherwise, use the base price + individual addon prices (fallback)
    const basePrice = typeof formData.selectedQuote?.price === 'number' 
      ? formData.selectedQuote.price 
      : parseFloat(formData.selectedQuote?.price || '0');
    const additionalPrice = formData.additionalPolicies.reduce((sum, policy) => sum + policy.price, 0);
    return basePrice + additionalPrice;
  };

  const generatePolicyPDF = async () => {
    if (!policyNumber) {
      console.error('⚠️ Cannot generate PDF: No policy number available');
      alert('Policy number not available. Please contact support.');
      return;
    }
    console.log('📄 Generating PDF for Policy ID:', policyNumber);
    await generatePDF(formData, calculateTotalPrice, formatDateToEuropean, policyNumber);
  };

  const downloadPolicyPDF = () => {
    generatePolicyPDF();
  };

  const processPayment = async () => {
    // Validate that terms are accepted before processing payment
    if (!termsAccepted) {
      alert('Please accept the Privacy Policy, Terms and Conditions and General conditions to proceed with payment.');
      return;
    }

    // Validate email address for policy holder (Traveler 1)
    const policyHolderEmail = formData.travelers[0]?.email;
    
    if (!policyHolderEmail || policyHolderEmail.trim() === '') {
      alert('❌ Policy holder email is required.\n\nPlease enter a valid email address for Traveler 1 (Policy Holder) before proceeding with payment.');
      return;
    }

    // Email validation regex pattern (RFC 5322 compliant)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(policyHolderEmail.trim())) {
      alert(`❌ Invalid Email Address\n\nThe email address "${policyHolderEmail}" is not valid.\n\nPlease enter a valid email address for Traveler 1 (Policy Holder) in the format: example@domain.com`);
      return;
    }

    // Validate emails for all other travelers if provided
    for (let i = 0; i < formData.travelers.length; i++) {
      const traveler = formData.travelers[i];
      if (traveler.email && traveler.email.trim() !== '') {
        if (!emailRegex.test(traveler.email.trim())) {
          alert(`❌ Invalid Email Address\n\nThe email address "${traveler.email}" for Traveler ${i + 1} (${traveler.firstName} ${traveler.lastName}) is not valid.\n\nPlease enter a valid email address in the format: example@domain.com`);
          return;
        }
      }
    }

    console.log('✅ Email validation passed for all travelers');

    // Validate VAT ID for Greece (Traveler 1/Policy Holder)
    if (formData.countryOfResidence === 'Greece') {
      const vatId = formData.travelers[0]?.vaxId;
      
      if (!vatId || vatId.trim() === '') {
        alert('❌ VAT ID Required\n\nFor residents of Greece, VAT ID is mandatory for the policy holder.\n\nPlease enter the VAT ID for Traveler 1 (Policy Holder) before proceeding with payment.');
        return;
      }
      
      console.log('✅ VAT ID validation passed for Greece:', vatId);
    } else {
      console.log('✅ VAT ID validation skipped (not Greece)');
    }
    
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
        
        // Convert screening answers to Terracotta format
        const terracottaScreeningAnswers = Object.entries(screeningAnswers).map(([questionNumber, answer]) => ({
          questionNumber: parseInt(questionNumber),
          answer: answer as 'yes' | 'no'
        }));

        // Build travelers array and contact details with REAL data from payment step
        console.log('🔍 DEBUG: formData.travelers at payment time:', JSON.stringify(formData.travelers, null, 2));
        console.log('🔍 DEBUG: formData.billingAddress at payment time:', JSON.stringify(formData.billingAddress, null, 2));
        
        const travelers = formData.travelers.map((traveler, index) => {
          console.log(`🔍 DEBUG: Processing traveler ${index + 1}:`, {
            firstName: traveler.firstName,
            lastName: traveler.lastName,
            age: traveler.age,
            dateOfBirth: traveler.dateOfBirth,
            title: traveler.title,
            email: traveler.email,
            phone: traveler.phone
          });
          
          const age = traveler.dateOfBirth ? 
            calculateAgeFromDOB(traveler.dateOfBirth) : 
            parseInt(traveler.age) || 30;
          
          const dateOfBirth = traveler.dateOfBirth || calculateDOBFromAge(age);
          
          const travelerData = {
            TravellerNumber: index + 1,
            Title: traveler.title || 'Mr',
            FirstName: traveler.firstName || '',
            LastName: traveler.lastName || '',
            DateOfBirth: formatDateForTerracotta(dateOfBirth),
            Age: age,
            AgebandID: getAgebandID(age),
            TitleID: getTitleID(traveler.title || 'Mr'),
            minAge: age,
            maxAge: age,
            ScreeningInformation: null
          };
          
          console.log(`✅ Built traveler ${index + 1} data:`, travelerData);
          return travelerData;
        });
        
        // Build contact details with REAL data from payment step
        const contactDetails = {
          Address: `${formData.billingAddress.street}, ${formData.billingAddress.city}, ${formData.billingAddress.country}`,
          Postcode: formData.billingAddress.postalCode || '',
          Email: formData.travelers[0]?.email || '',
          Telephone: formData.travelers[0]?.phone || ''
        };
        
        console.log('✅ Using REAL Travelers:', travelers);
        console.log('✅ Using REAL Contact Details:', contactDetails);

        // Re-fetch quote with REAL traveler data using ProvideQuotation
        if (formData.selectedQuote?.terracottaQuoteId) {
          try {
            console.log('🔄 Re-fetching quote with REAL traveler data using ProvideQuotation...');
            
            // Build quote request with REAL traveler and contact data
            const quoteRequestWithRealData = {
              userID: '4072',
              userCode: '111427',
              quoteDetails: {
                ResidenceID: getResidenceID(formData.countryOfResidence),
                TypePolicyID: getTypePolicyID(formData.tripType, availablePolicyTypes),
                TypePackageID: '1',
                Destination: formData.destination || 'Europe',
                StartDate: formatDateForTerracotta(formData.startDate),
                EndDate: formatDateForTerracotta(formData.endDate),
                Travellers: travelers, // REAL traveler data
                ContactDetails: contactDetails, // REAL contact data
                includeAnnualQuotes: 0, // Always 0 - TypePolicyID determines if it's annual
                includeUpsell: 0,
                currencyID: 1,
                schemaIDFilter: '717'
              }
            };
            
            console.log('📤 ProvideQuotation with REAL data:', quoteRequestWithRealData);
            const updatedQuoteResponse = await terracottaService.provideQuotation(quoteRequestWithRealData);
            console.log('📥 Updated quote response:', updatedQuoteResponse);
            
            // ✅ UPDATE THE QUOTE ID WITH THE NEW ONE THAT HAS REAL DATA
            if (updatedQuoteResponse.quoteResults && updatedQuoteResponse.quoteResults.length > 0) {
              const selectedPlan = updatedQuoteResponse.quoteResults.find((q: any) => 
                q.policytypeName === formData.selectedQuote?.name || 
                q.GrossPrice === formData.selectedQuote?.price
              ) || updatedQuoteResponse.quoteResults[0];
              
              if (selectedPlan && selectedPlan.QuoteID) {
                console.log('🔄 Updating quoteID from', formData.selectedQuote.terracottaQuoteId, 'to', selectedPlan.QuoteID);
                formData.selectedQuote.terracottaQuoteId = selectedPlan.QuoteID;
                console.log('✅ Using NEW QuoteID with REAL traveler data:', selectedPlan.QuoteID);
              }
            }
            
            // If add-ons were selected, re-fetch with alterations using REAL data
            if (formData.additionalPolicies && formData.additionalPolicies.length > 0) {
              console.log('🔄 Re-fetching quote with add-ons using ProvideQuotationWithAlterations...');
              
              const alterationIds = formData.additionalPolicies.map(p => p.alterationId).join(',');
              
              const alterationsRequestWithRealData = {
                userID: '4072',
                userCode: '111427',
                quoteID: formData.selectedQuote.terracottaQuoteId || '',
                specificQuoteDetails: {
                  AlterationID: alterationIds,
                  Travellers: travelers, // REAL traveler data
                  ContactDetails: contactDetails // REAL contact data
                }
              };
              
              console.log('📤 ProvideQuotationWithAlterations with REAL data:', alterationsRequestWithRealData);
              const updatedAlterationsResponse = await terracottaService.provideQuotationWithAlterations(alterationsRequestWithRealData);
              console.log('📥 Updated alterations response:', updatedAlterationsResponse);
              
              // ✅ UPDATE THE QUOTE ID WITH THE NEW ONE FROM ALTERATIONS
              if (updatedAlterationsResponse.quoteResults && updatedAlterationsResponse.quoteResults.length > 0) {
                const selectedPlan = updatedAlterationsResponse.quoteResults.find((q: any) => 
                  q.policytypeName === formData.selectedQuote?.name || 
                  q.GrossPrice === formData.selectedQuote?.price
                ) || updatedAlterationsResponse.quoteResults[0];
                
                if (selectedPlan && selectedPlan.QuoteID) {
                  console.log('🔄 Updating quoteID after alterations from', formData.selectedQuote.terracottaQuoteId, 'to', selectedPlan.QuoteID);
                  formData.selectedQuote.terracottaQuoteId = selectedPlan.QuoteID;
                  console.log('✅ Using NEW QuoteID with REAL data + alterations:', selectedPlan.QuoteID);
                }
              }
            }
          } catch (updateError) {
            console.warn('⚠️ Could not update quote with real data, continuing with existing quote:', updateError);
            console.error('⚠️ This may result in policy using dummy data from initial quote request');
          }
        }

        // Save policy details with Terracotta
        if (formData.selectedQuote?.terracottaQuoteId) {
          try {
            console.log('💾 ========================================');
            console.log('💾 Saving policy details with Terracotta...');
            console.log('💾 ========================================');
            console.log('📋 QuoteID being used for SavePolicyDetails:', formData.selectedQuote.terracottaQuoteId);
            console.log('📋 (This should be the NEW quoteID with REAL traveler data, not the original dummy data quoteID)');
            console.log('📋 Screening Answers:', terracottaScreeningAnswers);
            console.log('👥 Traveler Data (REAL from Payment Step):', formData.travelers);
            console.log('🏠 Billing Address (REAL from Payment Step):', formData.billingAddress);
            
            // Log each traveler's details clearly
            console.log('📝 SavePolicyDetails - Travelers being sent:');
            travelers.forEach((t, idx) => {
              console.log(`  Traveler ${idx + 1}: ${t.Title} ${t.FirstName} ${t.LastName}, Age: ${t.Age}, DOB: ${t.DateOfBirth}, AgebandID: ${t.AgebandID}, TitleID: ${t.TitleID}`);
            });
            console.log('📝 SavePolicyDetails - Contact Details being sent:', contactDetails);
            
            const savePolicyResponse = await terracottaService.savePolicyDetails({
              userID: '4072',
              userCode: '111427',
              quoteID: formData.selectedQuote.terracottaQuoteId,
              screeningQuestionAnswers: terracottaScreeningAnswers,
              medicalScreeningReference: 'string',
              useDefaultAnswers: 1,
              travelers: travelers,
              contactDetails: contactDetails
            });

            console.log('✅ SavePolicyDetails response:', savePolicyResponse);
            console.log('📋 Policy Saved Status:', savePolicyResponse.policySaved);
            console.log('📋 Policy ID:', savePolicyResponse.policyID);
            console.log('📄 Certificate URL:', savePolicyResponse.certificate);
            console.log('📄 Policy Wording URL:', savePolicyResponse.PW);
            console.log('📄 Summary of Cover URL:', savePolicyResponse.SI);

            // Handle both "Yes" and "true" formats for policySaved
            if (savePolicyResponse.policySaved === 'Yes' || savePolicyResponse.policySaved === 'true') {
              if (!savePolicyResponse.policyID) {
                console.error('⚠️ Warning: Policy saved but no Policy ID received!');
                throw new Error('Policy saved but no Policy ID received from Terracotta');
              }
              
              console.log('✅ Policy saved successfully! Policy ID:', savePolicyResponse.policyID);
              setPolicyNumber(savePolicyResponse.policyID);
              
              // Store policy document URLs from SavePolicyDetails response
              const documents = {
                certificate: savePolicyResponse.certificate || '',
                policyWording: savePolicyResponse.PW || '',
                summaryOfCover: savePolicyResponse.SI || '',
                keyFacts: savePolicyResponse.KF || '',
                ipid: savePolicyResponse.IPID || ''
              };
              
              console.log('📄 Setting policy documents:', documents);
              console.log('📄 SavePolicyDetails full response:', savePolicyResponse);
              setPolicyDocuments(documents);

              // Email Policy Documents to the policy holder
              // VALIDATION: Only proceed if we have ALL required parameters
              try {
                console.log('📧 Validating parameters for EmailPolicyDocuments...');
                
                // Extract required parameters
                const policyHolderEmail = formData.travelers[0]?.email;
                const policyID = savePolicyResponse.policyID;
                const userID = '4072';
                const userCode = '111427';

                // Validation checks
                const validationErrors: string[] = [];

                if (!policyID || policyID.trim() === '') {
                  validationErrors.push('Policy ID is missing or empty');
                  console.error('❌ VALIDATION FAILED: Policy ID not received from SavePolicyDetails');
                }

                if (!policyHolderEmail || policyHolderEmail.trim() === '') {
                  validationErrors.push('Policy holder email address is missing');
                  console.error('❌ VALIDATION FAILED: No email address for Traveler 1 (Policy Holder)');
                }

                if (!userID || userID.trim() === '') {
                  validationErrors.push('User ID is missing');
                  console.error('❌ VALIDATION FAILED: User ID not configured');
                }

                if (!userCode || userCode.trim() === '') {
                  validationErrors.push('User Code is missing');
                  console.error('❌ VALIDATION FAILED: User Code not configured');
                }

                // Log validation status
                if (validationErrors.length > 0) {
                  console.error('⚠️ EmailPolicyDocuments VALIDATION FAILED:');
                  validationErrors.forEach((error, index) => {
                    console.error(`   ${index + 1}. ${error}`);
                  });
                  console.error('⚠️ Skipping email sending. Policy is saved but documents will not be emailed automatically.');
                  
                  throw new Error(`Cannot send policy documents email: ${validationErrors.join(', ')}`);
                }

                // All validations passed - log parameters
                console.log('✅ All parameters validated successfully:');
                console.log('   📋 User ID:', userID);
                console.log('   📋 User Code:', userCode);
                console.log('   📋 Policy ID:', policyID);
                console.log('   📧 Email Address:', policyHolderEmail);
                console.log('📧 Proceeding to send EmailPolicyDocuments request...');

                // Send EmailPolicyDocuments request
                const emailResponse = await terracottaService.emailPolicyDocuments({
                  userID: userID,
                  userCode: userCode,
                  policyID: policyID,
                  emailAddress: policyHolderEmail
                });

                console.log('✅ EmailPolicyDocuments response:', emailResponse);

                if (emailResponse.emailSent) {
                  console.log('✅ Policy documents successfully emailed to:', policyHolderEmail);
                  alert(`✅ Success! Policy documents have been sent to ${policyHolderEmail}`);
                } else {
                  // Log the response but don't show popup to user
                  console.warn('⚠️ EmailPolicyDocuments response did not explicitly confirm success:', emailResponse.message);
                  console.warn('⚠️ emailSent value:', emailResponse.emailSent);
                  // No alert - assume success if no error was thrown
                }
              } catch (emailError) {
                console.error('❌ Error sending policy documents email:', emailError);
                console.error('⚠️ Continuing with payment process despite email error');
                
                // Detailed error logging
                if (emailError instanceof Error) {
                  console.error('   Error message:', emailError.message);
                  console.error('   Error stack:', emailError.stack);
                }
                
                // Don't throw - allow payment process to continue even if email fails
                alert('Note: There was an issue sending the policy documents email, but your policy has been saved. Please contact support to receive your documents.');
              }
              
              // Debug: Check if documents are empty and log
              if (!documents.certificate) {
                console.warn('⚠️ Certificate URL not found in SavePolicyDetails response!');
                console.warn('💡 This might be normal - certificate may need to be generated separately');
              }
              if (!documents.policyWording) {
                console.warn('⚠️ Policy Wording URL not found in SavePolicyDetails response!');
              }
              if (!documents.summaryOfCover) {
                console.warn('⚠️ Summary of Cover URL not found in SavePolicyDetails response!');
              }
              
              if (!documents.certificate && !documents.policyWording && !documents.summaryOfCover) {
                console.warn('⚠️ No document URLs received from SavePolicyDetails response!');
                console.warn('💡 Full SavePolicyDetails response:', JSON.stringify(savePolicyResponse, null, 2));
              }
              
              // Update database with Terracotta Policy ID and status
              console.log('💾 Updating database with Terracotta Policy ID...');
              const paymentData = {
                quoteId: quoteId,
                paymentMethod: formData.paymentMethod || 'card',
                cardNumber: formData.cardNumber || '',
                expiryDate: formData.expiryDate || '',
                cvv: formData.cvv || '',
                billingAddress: formData.billingAddress,
                amount: calculateTotalPrice(),
                policyNumber: savePolicyResponse.policyID // Include Terracotta Policy ID
              };

              console.log('💳 Updating quote in database with policy details...');
              const paymentResponse = await apiProcessPayment(paymentData);
              
              if (paymentResponse.status === 'success') {
                console.log('✅ Database updated successfully with Policy ID:', savePolicyResponse.policyID);
              } else {
                console.warn('⚠️ Database update failed, but policy was saved in Terracotta');
              }
              
              setIsProcessing(false);
              nextPhase(); // Move to documents phase
              return;
            } else {
              console.error('❌ Policy save failed. Message:', savePolicyResponse.Message);
              throw new Error(savePolicyResponse.Message || 'Failed to save policy with Terracotta');
            }
          } catch (terracottaError) {
            console.error('❌ Terracotta policy save error:', terracottaError);
            // Fall through to regular payment processing
          }
        }
        
        // Fallback to regular payment processing if Terracotta fails
        const paymentData = {
          quoteId: quoteId,
          paymentMethod: formData.paymentMethod,
          cardNumber: formData.cardNumber, // Note: In production, this should be tokenized
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          billingAddress: formData.billingAddress,
          amount: calculateTotalPrice(),
          policyNumber: policyNumber || undefined // Include Terracotta Policy ID if available
        };

        console.log('💳 Processing payment with data:', { ...paymentData, cardNumber: '****', cvv: '***' });
        const paymentResponse = await apiProcessPayment(paymentData);
        
        if (paymentResponse.status === 'success') {
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
          formData.countryOfResidence
        );
      case 2:
        return !!formData.selectedQuote;
      case 3:
        return true; // Additional policies phase is always valid (optional)
      case 4:
        return true; // Review phase is always valid
      case 5:
        // Validate all travelers have basic info
        const travelersBasicValid: boolean = formData.travelers.every(t => 
          !!(t.firstName && t.lastName && (t.age || t.dateOfBirth))
        );
        // Validate first traveler (policy holder) has contact details
        const policyHolderContactValid: boolean = !!(
          formData.travelers.length > 0 && 
          formData.travelers[0].email && 
          formData.travelers[0].phone
        );
        const paymentValid: boolean = !!(
          formData.cardNumber && 
          formData.expiryDate && 
          formData.cvv && 
          formData.billingAddress.street && 
          formData.billingAddress.city && 
          formData.billingAddress.postalCode && 
          formData.billingAddress.country
        );
        return travelersBasicValid && policyHolderContactValid && paymentValid;
      case 6:
        return true; // Documents phase is always valid
      default:
        return false;
    }
  };

  const renderPhase1 = () => (
    <div className="wizard-phase">
      <h2>Trip Details</h2>
      
      <div className="form-section">
        <h3>Trip Details</h3>
        
        <div className="form-group">
          <label htmlFor="tripType">
            Trip Type 
            <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '5px' }}>
              {isLoadingPolicyTypeDestinations ? '(Loading...)' : `(${availablePolicyTypes.length} types available)`}
            </span>
          </label>
          <select
            id="tripType"
            value={formData.tripType}
            onChange={(e) => handleInputChange('tripType', e.target.value)}
            required
            disabled={isLoadingPolicyTypeDestinations}
          >
            <option value="">
              {isLoadingPolicyTypeDestinations ? 'Loading trip types...' : 'Select trip type'}
            </option>
            {availablePolicyTypes.map((policyType) => {
              // Map policy type names to trip type values
              let tripTypeValue = 'single';
              const name = policyType.TypePolicyName.toLowerCase();
              if (name.includes('annual')) {
                tripTypeValue = 'annual';
              } else if (name.includes('comprehensive')) {
                tripTypeValue = 'comprehensive';
              } else if (name.includes('longstay') || name.includes('long stay')) {
                tripTypeValue = 'longstay';
              }
              
              return (
                <option key={policyType.TypePolicyID} value={tripTypeValue}>
                  {policyType.TypePolicyName}
                </option>
              );
            })}
            {/* Fallback options if no policy types loaded */}
            {!isLoadingPolicyTypeDestinations && availablePolicyTypes.length === 0 && (
              <>
                <option value="single">Regular Single Trip Insurance</option>
                <option value="annual">Annual Multi-Trip Travel Insurance</option>
                <option value="comprehensive">Comprehensive Single Trip Insurance</option>
                <option value="longstay">Long Stay Travel Insurance</option>
              </>
            )}
          </select>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="countryOfResidence">Country of Residence</label>
            <select
              id="countryOfResidence"
              value={formData.countryOfResidence}
              onChange={(e) => handleInputChange('countryOfResidence', e.target.value)}
              required
              disabled={isLoadingCountriesOfResidence}
            >
              <option value="">
                {isLoadingCountriesOfResidence ? 'Loading countries...' : 'Select your country of residence'}
              </option>
              {countriesOfResidence.map((country) => (
                <option key={country.country_id} value={country.country_name}>
                  {country.country_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="destination">
              Destination Category 
              <span 
                className="help-icon" 
                onClick={() => setShowHelpPopup(true)}
                title="Click to see all countries by category"
              >
                (?)
              </span>
            </label>
            <select
              id="destination"
              value={formData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              required
              disabled={isLoadingCategories}
            >
              <option value="">
                {isLoadingCategories ? 'Loading categories...' : 'Select destination category'}
              </option>
              {destinationCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
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
    </div>
  );

  const renderPhase2 = () => (
    <div className="wizard-phase">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ 
          fontSize: '2.2em', 
          color: '#333',
          margin: '0 0 10px 0',
          fontWeight: 'bold',
          fontFamily: 'sans-serif'
        }}>
          Choose Your Insurance Plan
        </h2>
        <p style={{ 
          fontSize: '1.1em', 
          color: '#666',
          margin: '0',
          fontWeight: '400'
        }}>
          Select the coverage that best fits your travel needs.
        </p>
      </div>
      
      
      {isLoadingQuotes && (
        <div className="loading-message">
          <p>Loading insurance quotes from Terracotta...</p>
        </div>
      )}
      
      {quoteError && (
        <div className="error-message">
          <p>⚠️ {quoteError}</p>
          <p>Using fallback quotes for demonstration.</p>
        </div>
      )}
      
      <div className="quote-options" style={{ 
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '20px',
        overflowX: 'auto',
        padding: '20px 0',
        maxWidth: '100%'
      }}>
        {quoteOptions.length > 0 ? quoteOptions.map((option) => (
          <div 
            key={option.id} 
            className={`quote-option ${formData.selectedQuote?.id === option.id ? 'selected' : ''}`}
            onClick={() => selectQuote(option)}
            style={{
              background: 'white',
              border: formData.selectedQuote?.id === option.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: formData.selectedQuote?.id === option.id 
                ? '0 4px 12px rgba(25, 118, 210, 0.15)'
                : '0 2px 8px rgba(0,0,0,0.1)',
              position: 'relative',
              minWidth: '320px',
              maxWidth: '320px',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              if (formData.selectedQuote?.id !== option.id) {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                e.currentTarget.style.borderColor = '#1976d2';
              }
            }}
            onMouseLeave={(e) => {
              if (formData.selectedQuote?.id !== option.id) {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }
            }}
          >
            {/* Plan Header */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '1.3em', 
                color: '#1976d2',
                fontWeight: 'bold'
              }}>
                {option.policytypeName || option.policyTypeName || option.name}
              </h3>
              <p style={{ 
                margin: '0 0 12px 0', 
                fontSize: '0.9em', 
                color: '#666'
              }}>
                {option.packageName || option.typePackageName}
              </p>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  fontSize: '2em', 
                  fontWeight: 'bold', 
                  color: '#333',
                  lineHeight: '1'
                }}>
                  {option.currency || '€'}{option.price}
                </div>
                <div style={{ 
                  fontSize: '0.9em', 
                  color: '#666',
                  marginTop: '4px'
                }}>
                  per trip
                </div>
              </div>
            </div>
            
            {/* Best Buy Text */}
            {option.isBestBuy === 1 && option.isBestBuyText && (
              <div style={{ 
                marginBottom: '20px',
                background: '#e8f5e8',
                border: '1px solid #4caf50',
                borderRadius: '6px',
                padding: '8px',
                fontSize: '0.85em',
                color: '#2e7d32',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                ✨ {option.isBestBuyText} ✨
              </div>
            )}
            
            {/* Summary Covers */}
            {option.SummaryCovers && option.SummaryCovers.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ 
                  fontSize: '1em', 
                  fontWeight: 'bold', 
                  marginBottom: '12px',
                  color: '#333'
                }}>Coverage Details</h4>
                {option.SummaryCovers.map((cover, index) => (
                  <div key={index} style={{ 
                    marginBottom: '10px',
                    padding: '8px',
                    background: '#f8f9fa',
                    borderRadius: '4px',
                    fontSize: '0.85em'
                  }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      color: '#1976d2',
                      marginBottom: '4px'
                    }}>
                      {cover.name}
                    </div>
                    <div style={{ fontSize: '0.9em' }}>
                      <span><strong>Limit:</strong> {cover.Limit}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Action Button */}
            <button 
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: formData.selectedQuote?.id === option.id ? '#ff6b35' : '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.95em',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = formData.selectedQuote?.id === option.id ? '#e55a2b' : '#1565c0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = formData.selectedQuote?.id === option.id ? '#ff6b35' : '#1976d2';
              }}
            >
              {formData.selectedQuote?.id === option.id ? 'SELECTED' : 'SELECT PLAN'}
            </button>
          </div>
        )) : (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '40px',
            color: '#666'
          }}>
            <p>Loading SOAP quotes...</p>
          </div>
        )}
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
        {isLoadingAddons ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            color: '#666'
          }}>
            <p>Loading available add-ons...</p>
          </div>
        ) : availableAdditionalPolicies.length === 0 ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            color: '#666'
          }}>
            <p>No additional coverage options available for this policy type.</p>
          </div>
        ) : (
          <div className="policies-grid">
            {availableAdditionalPolicies.map(policy => {
              const isSelected = formData.additionalPolicies.some(p => p.id === policy.id);
              return (
                <div key={policy.id} className={`policy-card ${isSelected ? 'selected' : ''}`}>
                  <div className="policy-header">
                    <div className="policy-icon">{policy.icon}</div>
                    <div className="policy-info">
                      <h4>{policy.name}</h4>
                      {policy.price > 0 && (
                        <div className="policy-price">€{policy.price.toFixed(2)}</div>
                      )}
                    </div>
                    <button 
                      className={`policy-btn ${isSelected ? 'remove' : 'add'}`}
                      onClick={() => isSelected ? removeAdditionalPolicy(policy.id) : addAdditionalPolicy(policy)}
                      disabled={processingAddonId !== null}
                    >
                      {processingAddonId === policy.id ? 'PROCESSING...' : (isSelected ? 'REMOVE' : 'ADD')}
                    </button>
                  </div>
                  <div className="policy-description">
                    <p>{policy.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
              <span>{policy.price > 0 ? `€${policy.price.toFixed(2)}` : 'Included in total'}</span>
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
                    formData.tripType === 'longstay' ? 'Long Stay Travel Insurance' :
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
                    <h5 style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: '1.5em',
                      fontWeight: '700',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <span style={{ fontSize: '1.2em' }}>🛡️</span>
                      Coverage Limits
                    </h5>
                    {formData.selectedQuote.SummaryCovers && formData.selectedQuote.SummaryCovers.length > 0 ? (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '15px',
                        marginTop: '15px'
                      }}>
                        {formData.selectedQuote.SummaryCovers.map((cover, index) => {
                          // Determine icon and color based on cover name
                          const getIconAndColor = (name: string) => {
                            const lowerName = name.toLowerCase();
                            if (lowerName.includes('medical') || lowerName.includes('emergency')) 
                              return { icon: '🏥', color: '#e74c3c', bgColor: '#fdeaea' };
                            if (lowerName.includes('baggage') || lowerName.includes('luggage')) 
                              return { icon: '🧳', color: '#3498db', bgColor: '#eaf2f8' };
                            if (lowerName.includes('cancellation')) 
                              return { icon: '❌', color: '#e67e22', bgColor: '#fef5e7' };
                            if (lowerName.includes('delay')) 
                              return { icon: '⏰', color: '#9b59b6', bgColor: '#f4ecf7' };
                            if (lowerName.includes('personal') && lowerName.includes('liability')) 
                              return { icon: '⚖️', color: '#16a085', bgColor: '#e8f8f5' };
                            if (lowerName.includes('accident')) 
                              return { icon: '🚑', color: '#c0392b', bgColor: '#fadbd8' };
                            if (lowerName.includes('legal')) 
                              return { icon: '⚖️', color: '#2c3e50', bgColor: '#ecf0f1' };
                            if (lowerName.includes('money') || lowerName.includes('cash')) 
                              return { icon: '💰', color: '#f39c12', bgColor: '#fef9e7' };
                            if (lowerName.includes('passport') || lowerName.includes('document')) 
                              return { icon: '📄', color: '#7f8c8d', bgColor: '#f2f3f4' };
                            if (lowerName.includes('rental') || lowerName.includes('vehicle')) 
                              return { icon: '🚗', color: '#34495e', bgColor: '#ebedef' };
                            if (lowerName.includes('winter') || lowerName.includes('sport')) 
                              return { icon: '⛷️', color: '#3498db', bgColor: '#ebf5fb' };
                            if (lowerName.includes('personal') && lowerName.includes('effect')) 
                              return { icon: '👜', color: '#8e44ad', bgColor: '#f5eef8' };
                            return { icon: '📋', color: '#27ae60', bgColor: '#eafaf1' };
                          };

                          const { icon, color, bgColor } = getIconAndColor(cover.name);

                          return (
                            <div key={index} style={{
                              background: `linear-gradient(135deg, ${bgColor} 0%, #ffffff 100%)`,
                              border: `2px solid ${bgColor}`,
                              borderRadius: '12px',
                              padding: '18px',
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-5px)';
                              e.currentTarget.style.boxShadow = `0 8px 25px rgba(0,0,0,0.15)`;
                              e.currentTarget.style.borderColor = color;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.borderColor = bgColor;
                            }}>
                              {/* Decorative background element */}
                              <div style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                width: '80px',
                                height: '80px',
                                background: color,
                                opacity: '0.1',
                                borderRadius: '50%'
                              }}></div>
                              
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative', zIndex: 1 }}>
                                <div style={{
                                  fontSize: '2.5em',
                                  background: color,
                                  width: '60px',
                                  height: '60px',
                                  borderRadius: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  boxShadow: `0 4px 15px ${color}40`
                                }}>
                                  {icon}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{
                                    fontSize: '0.9em',
                                    color: '#555',
                                    fontWeight: '500',
                                    marginBottom: '8px',
                                    lineHeight: '1.3'
                                  }}>
                                    {cover.name}
                                  </div>
                                  <div style={{
                                    fontSize: '1.3em',
                                    fontWeight: '700',
                                    color: color,
                                    marginBottom: '4px'
                                  }}>
                                    {cover.Limit}
                                  </div>
                                  {cover.Excess && cover.Excess !== '€0' && cover.Excess !== 'Nil' && (
                                    <div style={{
                                      fontSize: '0.85em',
                                      color: '#888',
                                      background: '#f8f9fa',
                                      padding: '4px 8px',
                                      borderRadius: '6px',
                                      display: 'inline-block',
                                      marginTop: '4px'
                                    }}>
                                      <span style={{ fontWeight: '600' }}>Excess:</span> {cover.Excess}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
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
                    )}
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
                    <span className="total-value">€{(() => {
                      // Calculate addon amount as Total Amount - Base Premium
                      const basePrice = typeof formData.selectedQuote?.price === 'number' 
                        ? formData.selectedQuote.price 
                        : parseFloat(formData.selectedQuote?.price || '0');
                      const totalAmount = calculateTotalPrice();
                      const addonAmount = totalAmount - basePrice;
                      return addonAmount.toFixed(2);
                    })()}</span>
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
    </div>
  );

  // Helper function to decode HTML entities and format question text
  const decodeQuestionText = (text: string): string => {
    if (!text) return '';
    
    // Create a temporary element to decode HTML entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    let decoded = textarea.value;
    
    // Replace <BR> tags (after decoding &lt;BR&gt;) with actual line breaks
    decoded = decoded.replace(/<BR>/gi, '\n');
    decoded = decoded.replace(/&lt;BR&gt;/gi, '\n');
    
    return decoded;
  };

  const renderPhase6 = () => (
    <div className="wizard-phase">
      <h2>Screening Questions</h2>
      <p>Please answer the following questions to complete your insurance application.</p>
      
      <div className="screening-questions">
        {screeningQuestions.length === 0 ? (
          <div className="no-questions">
            <p>No screening questions required for this policy.</p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              The API returned an empty response or no questions are configured for this quote.
            </p>
          </div>
        ) : (
          screeningQuestions.map((question, index) => {
            const decodedQuestion = decodeQuestionText(question.question);
            
            return (
              <div key={question.questionNumber} className="screening-question">
                <h3>Question {question.questionNumber}</h3>
                <div className="question-text" style={{ 
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6',
                  padding: '15px',
                  background: '#f9f9f9',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}>
                  {decodedQuestion}
                </div>
                
                <div className="question-options" style={{ marginTop: '20px' }}>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name={`question-${question.questionNumber}`}
                      value="yes"
                      checked={screeningAnswers[question.questionNumber] === 'yes'}
                      onChange={(e) => setScreeningAnswers(prev => ({
                        ...prev,
                        [question.questionNumber]: 'yes'
                      }))}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name={`question-${question.questionNumber}`}
                      value="no"
                      checked={screeningAnswers[question.questionNumber] === 'no'}
                      onChange={(e) => setScreeningAnswers(prev => ({
                        ...prev,
                        [question.questionNumber]: 'no'
                      }))}
                    />
                    <span>No</span>
                  </label>
                </div>
                
                {/* Show messages based on answer */}
                {screeningAnswers[question.questionNumber] && (
                  <div className={`answer-message ${screeningAnswers[question.questionNumber]}`}>
                    <p style={{ whiteSpace: 'pre-wrap' }}>
                      {screeningAnswers[question.questionNumber] === 'yes' 
                        ? decodeQuestionText(question.yesMessage)
                        : decodeQuestionText(question.noMessage)}
                    </p>
                    {/* Show action text if available */}
                    {question.yesAction && screeningAnswers[question.questionNumber] === 'yes' && question.yesActionText && (
                      <p style={{ fontSize: '13px', marginTop: '5px', fontStyle: 'italic' }}>
                        Action: {question.yesActionText}
                      </p>
                    )}
                    {question.noAction && screeningAnswers[question.questionNumber] === 'no' && question.noActionText && (
                      <p style={{ fontSize: '13px', marginTop: '5px', fontStyle: 'italic' }}>
                        Action: {question.noActionText}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const renderPhase7 = () => (
    <div className="wizard-phase">
      <h2>Payment Details</h2>
      <p>Enter your payment information to complete your purchase.</p>
      
      {/* Traveler Information and Billing Address - Grouped Background */}
      <div className="payment-traveler-billing-group">
        {/* Traveler Information Section */}
        <div className="form-section">
          <h3>Traveler Information</h3>
          {formData.travelers.map((traveler, index) => (
            <div key={index} className="traveler-info">
              <h4>Traveler {index + 1}{index === 0 ? '/Policy holder' : ''}</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`title-${index}`}>Title</label>
                <select
                  id={`title-${index}`}
                  value={traveler.title || 'Mr'}
                  onChange={(e) => handleTravelerChange(index, 'title', e.target.value)}
                  title="Select the traveler's title"
                >
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                  <option value="Prof">Prof</option>
                </select>
              </div>
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
                <label htmlFor={`dateOfBirth-${index}`}>Date of Birth</label>
                <input
                  type="date"
                  id={`dateOfBirth-${index}`}
                  value={traveler.dateOfBirth || ''}
                  onChange={(e) => {
                    const dateOfBirth = e.target.value;
                    // Auto-calculate age from date of birth
                    if (dateOfBirth) {
                      const age = calculateAgeFromDateOfBirth(dateOfBirth);
                      handleTravelerChange(index, 'dateOfBirth', dateOfBirth);
                      handleTravelerChange(index, 'age', age.toString());
                    } else {
                      handleTravelerChange(index, 'dateOfBirth', dateOfBirth);
                    }
                  }}
                  title="Enter the traveler's date of birth"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`vaxId-${index}`}>
                  VAT ID
                  {index === 0 && formData.countryOfResidence === 'Greece' && <span style={{color: 'red'}}>*</span>}
                  {index === 0 && formData.countryOfResidence === 'Greece' && <span style={{fontSize: '12px', color: '#666'}}> (Required for Greece)</span>}
                </label>
                <input
                  type="text"
                  id={`vaxId-${index}`}
                  value={traveler.vaxId}
                  onChange={(e) => handleTravelerChange(index, 'vaxId', e.target.value)}
                  placeholder={index === 0 && formData.countryOfResidence === 'Greece' ? "Enter VAT ID (Required)" : "Enter VAT ID (Optional)"}
                  title={index === 0 && formData.countryOfResidence === 'Greece' ? "VAT ID is required for Greece" : "Enter the traveler's VAT ID (optional)"}
                  required={index === 0 && formData.countryOfResidence === 'Greece'}
                />
              </div>
            </div>
            
            {/* Email and Phone - Only for first traveler/policy holder */}
            {index === 0 && (
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
            )}
            
            {/* Billing Address - Only for first traveler */}
            {index === 0 && (
              <>
                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />
                <h4>Billing Address</h4>
                <div className="form-row">
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
              </>
            )}
          </div>
        ))}
        </div>
      </div>
      
      {/* Payment Method - Separate Background */}
      <div className="payment-method-group">
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
                placeholder="mm / yyyy"
                title="Enter card expiry date in mm / yyyy format"
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
        </div>
      </div>
      
      <div className="payment-summary">
        <div className="summary-item">
          <strong>Total Amount: €{calculateTotalPrice().toFixed(2)}</strong>
        </div>
      </div>
      
      <div className="terms-section">
        <label className="checkbox-option">
          <input 
            type="checkbox" 
            required 
            checked={termsAccepted}
            onChange={(e) => handleTermsAcceptance(e.target.checked)}
          />
          <span>I have read and accept the <button 
            className="link-button" 
            onClick={(e) => { e.preventDefault(); setShowPrivacyPolicy(true); }}
            style={{ background: 'none', border: 'none', color: '#0077b6', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
          >
            Privacy Policy
          </button>, <button 
            className="link-button" 
            onClick={(e) => { e.preventDefault(); setShowTermsAndConditions(true); }}
            style={{ background: 'none', border: 'none', color: '#0077b6', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
          >
            Terms and Conditions
          </button> and <button 
            className="link-button" 
            onClick={(e) => { e.preventDefault(); fetchGeneralConditions(); }}
            style={{ background: 'none', border: 'none', color: '#0077b6', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
          >
            General conditions
          </button>.</span>
        </label>
        <label className="checkbox-option">
          <input 
            type="checkbox" 
            required
            checked={marketingEmailsAccepted}
            onChange={(e) => setMarketingEmailsAccepted(e.target.checked)}
          />
          <span>I would like to receive marketing emails about travel insurance offers</span>
        </label>
      </div>
    </div>
  );

  const renderPhase8 = () => (
    <div className="wizard-phase">
      <h2>🎉 Congratulations!</h2>
      <p>Your travel insurance has been successfully purchased.</p>
      
      <div className="success-message">
        <div className="policy-number">
          <strong>Policy Number:</strong> {policyNumber ? policyNumber : 'Processing...'}
        </div>
        <div className="confirmation-email">
          <strong>A confirmation email has been sent to {formData.travelers[0]?.email}</strong>
        </div>
      </div>
      
      <div className="documents-section">
        <h3>Your Documents</h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          Click on any document to open it in a new tab
        </p>
        <div className="document-links">
          {/* Summary of Cover from SavePolicyDetails */}
          {policyDocuments.summaryOfCover ? (
            <a 
              href={policyDocuments.summaryOfCover} 
              className="document-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Summary of Cover in new tab"
              title="View Summary of Cover from Terracotta"
            >
              📄 Summary of Cover
            </a>
          ) : formData.selectedQuote?.SI ? (
            <a 
              href={formData.selectedQuote.SI} 
              className="document-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Summary of Cover in new tab"
              title="View Summary of Cover (from quote)"
            >
              📄 Summary of Cover (from quote)
            </a>
          ) : (
            <div className="document-link disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
              📄 Summary of Cover (Not Available)
            </div>
          )}

          {/* Policy Wording from SavePolicyDetails */}
          {policyDocuments.policyWording ? (
            <a 
              href={policyDocuments.policyWording} 
              className="document-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Policy Wording in new tab"
              title="View Policy Wording from Terracotta"
            >
              📋 Policy Wording
            </a>
          ) : formData.selectedQuote?.PW ? (
            <a 
              href={formData.selectedQuote.PW} 
              className="document-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Policy Wording in new tab"
              title="View Policy Wording (from quote)"
            >
              📋 Policy Wording (from quote)
            </a>
          ) : (
            <div className="document-link disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
              📋 Policy Wording (Not Available)
            </div>
          )}

          {/* Certificate from SavePolicyDetails */}
          {policyDocuments.certificate ? (
            <a 
              href={policyDocuments.certificate} 
              className="document-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Certificate in new tab"
              title="View Certificate from Terracotta"
            >
              🆔 Certificate
            </a>
          ) : (
            <div className="document-link disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
              🆔 Certificate (Pending - may be emailed separately)
            </div>
          )}

          {/* Key Facts from SavePolicyDetails */}
          {policyDocuments.keyFacts && (
            <a 
              href={policyDocuments.keyFacts} 
              className="document-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Key Facts in new tab"
              title="View Key Facts from Terracotta"
            >
              📋 Key Facts
            </a>
          )}

          {/* IPID from SavePolicyDetails */}
          {policyDocuments.ipid && (
            <a 
              href={policyDocuments.ipid} 
              className="document-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open IPID in new tab"
              title="View Insurance Product Information Document"
            >
              📄 IPID
            </a>
          )}

          {/* Generated Policy PDF */}
          <button 
            onClick={downloadPolicyPDF} 
            className="document-link download-btn"
            aria-label="Download your policy summary as a PDF document"
            title="Download a PDF copy of your travel insurance policy summary"
            type="button"
          >
            📄 Download Your Policy Summary (PDF)
          </button>
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
        return renderPhase1(); // Trip Details
      case 2:
        return renderPhase2(); // Quotes
      case 3:
        return renderPhase3(); // Add-ons
      case 4:
        return renderPhase4(); // Review
      case 5:
        return renderPhase7(); // Payment
      case 6:
        return renderPhase8(); // Documents
      default:
        return renderPhase1();
    }
  };

  return (
    <div className="quote-page">
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
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
                    {phase === 3 && 'Add-ons'}
                    {phase === 4 && 'Review'}
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
              aria-label="Go to previous step"
              title="Go back to the previous step"
              type="button"
            >
              Previous
            </button>
          )}
          
          {currentPhase < 5 && (
            <button 
              className="btn btn-primary" 
              onClick={nextPhase}
              disabled={!isPhaseValid(currentPhase)}
              aria-label={currentPhase === 4 ? 'Proceed to payment step' : 'Go to next step'}
              title={currentPhase === 4 ? 'Continue to payment details' : 'Continue to next step'}
              type="button"
            >
              {currentPhase === 4 ? 'Proceed to Payment' : 'Next'}
            </button>
          )}
          
          {currentPhase === 5 && (
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
          
          {currentPhase === 6 && (
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
      
      {/* Help Popup for Destination Categories */}
      {showHelpPopup && (
        <div className="help-popup-overlay" onClick={() => setShowHelpPopup(false)}>
          <div className="help-popup" onClick={(e) => e.stopPropagation()}>
            <div className="help-popup-header">
              <h3>Destination Categories & Countries</h3>
              <button 
                className="help-popup-close" 
                onClick={() => setShowHelpPopup(false)}
                aria-label="Close help popup"
              >
                ×
              </button>
            </div>
            
            <div className="help-popup-content">
              {isLoadingCountries ? (
                <div className="loading-message">Loading countries...</div>
              ) : (
                <div className="categories-container">
                  {Object.entries(countriesByCategory).map(([category, countries]) => (
                    <div key={category} className="category-section">
                      <h4 className="category-title">{category}</h4>
                      <div className="countries-grid">
                        {countries.map((country) => (
                          <span key={country} className="country-item">
                            {country}
                          </span>
                        ))}
                      </div>
                      <div className="category-count">
                        {countries.length} countries
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Privacy Policy Popup */}
      {showPrivacyPolicy && (
        <div className="help-popup-overlay" onClick={() => setShowPrivacyPolicy(false)}>
          <div className="help-popup" onClick={(e) => e.stopPropagation()}>
            <div className="help-popup-header">
              <h3>Privacy Policy</h3>
              <button 
                className="help-popup-close" 
                onClick={() => setShowPrivacyPolicy(false)}
                aria-label="Close privacy policy"
              >
                ×
              </button>
            </div>
            
            <div className="help-popup-content">
              <div style={{ padding: '20px', lineHeight: '1.6' }}>
                <h4>Sample Privacy Policy</h4>
                <p>This is a sample Privacy Policy. The actual content will be added later.</p>
                
                <h5 style={{ marginTop: '20px' }}>1. Information We Collect</h5>
                <p>We collect information that you provide directly to us, including personal information such as your name, email address, date of birth, and travel details.</p>
                
                <h5 style={{ marginTop: '20px' }}>2. How We Use Your Information</h5>
                <p>We use the information we collect to provide, maintain, and improve our services, including processing your insurance quotes and policies.</p>
                
                <h5 style={{ marginTop: '20px' }}>3. Data Security</h5>
                <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                
                <h5 style={{ marginTop: '20px' }}>4. Your Rights</h5>
                <p>You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your data.</p>
                
                <h5 style={{ marginTop: '20px' }}>5. Contact Us</h5>
                <p>If you have any questions about this Privacy Policy, please contact us at privacy@example.com</p>
                
                <p style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Terms and Conditions Popup */}
      {showTermsAndConditions && (
        <div className="help-popup-overlay" onClick={() => setShowTermsAndConditions(false)}>
          <div className="help-popup" onClick={(e) => e.stopPropagation()}>
            <div className="help-popup-header">
              <h3>Terms and Conditions</h3>
              <button 
                className="help-popup-close" 
                onClick={() => setShowTermsAndConditions(false)}
                aria-label="Close terms and conditions"
              >
                ×
              </button>
            </div>
            
            <div className="help-popup-content">
              <div style={{ padding: '20px', lineHeight: '1.6' }}>
                <h4>Sample Terms and Conditions</h4>
                <p>This is a sample Terms and Conditions document. The actual content will be added later.</p>
                
                <h5 style={{ marginTop: '20px' }}>1. Acceptance of Terms</h5>
                <p>By purchasing travel insurance from us, you agree to be bound by these Terms and Conditions. Please read them carefully before proceeding with your purchase.</p>
                
                <h5 style={{ marginTop: '20px' }}>2. Insurance Coverage</h5>
                <p>The insurance coverage is subject to the terms, conditions, and exclusions set forth in the policy documents. Coverage begins on the start date specified in your policy.</p>
                
                <h5 style={{ marginTop: '20px' }}>3. Premium Payment</h5>
                <p>The insurance premium must be paid in full before coverage begins. All payments are processed securely through our payment gateway.</p>
                
                <h5 style={{ marginTop: '20px' }}>4. Claims Process</h5>
                <p>In the event of a claim, you must notify us as soon as reasonably possible and provide all required documentation to support your claim.</p>
                
                <h5 style={{ marginTop: '20px' }}>5. Cancellation Policy</h5>
                <p>You may cancel your policy within the cooling-off period specified in your policy documents for a full refund, provided no claims have been made.</p>
                
                <h5 style={{ marginTop: '20px' }}>6. Governing Law</h5>
                <p>These Terms and Conditions are governed by and construed in accordance with applicable insurance regulations.</p>
                
                <p style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* General Conditions Popup - Shows Screening Questions Response */}
      {showGeneralConditions && (
        <div className="help-popup-overlay" onClick={() => setShowGeneralConditions(false)}>
          <div className="help-popup" onClick={(e) => e.stopPropagation()}>
            <div className="help-popup-header">
              <h3>General Conditions</h3>
              <button 
                className="help-popup-close" 
                onClick={() => setShowGeneralConditions(false)}
                aria-label="Close general conditions"
              >
                ×
              </button>
            </div>
            
            <div className="help-popup-content">
              <div style={{ padding: '20px', lineHeight: '1.6' }}>
                <h4>Screening Questions & General Conditions</h4>
                <p style={{ marginBottom: '20px', color: '#666' }}>
                  These are the general conditions and screening questions for your selected policy.
                </p>
                
                {generalConditionsData.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    <p>No general conditions available for this policy.</p>
                  </div>
                ) : (
                  <div className="screening-questions">
                    {generalConditionsData.map((question, index) => {
                      const decodedQuestion = decodeQuestionText(question.question);
                      const decodedNoMessage = question.noMessage ? decodeQuestionText(question.noMessage) : '';
                      
                      // Filter out specific unwanted text from the No message
                      const filteredNoMessage = decodedNoMessage.replace(
                        /Yes\/No \(If No cannot proceed with purchase\)\.\s*If No:\s*You must confirm that you have read and accepted the following to purchase this insurance by selecting Yes\.\s*If you are unable to agree with any of the following statements, then you are unable to continue with the purchase of this insurance\.\s*/gi,
                        ''
                      ).trim();
                      
                      return (
                        <div key={question.questionNumber} style={{ 
                          marginBottom: '25px',
                          padding: '15px',
                          background: '#f9f9f9',
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0'
                        }}>
                          <div style={{ 
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1.6',
                            marginBottom: '10px'
                          }}>
                            {decodedQuestion}
                          </div>
                          
                          {question.yesMessage && (
                            <div style={{ marginTop: '10px', fontSize: '14px' }}>
                              <strong style={{ color: '#d9534f' }}>If Yes:</strong>
                              <p style={{ whiteSpace: 'pre-wrap', marginTop: '5px', color: '#555' }}>
                                {decodeQuestionText(question.yesMessage)}
                              </p>
                            </div>
                          )}
                          
                          {filteredNoMessage && (
                            <div style={{ marginTop: '10px', fontSize: '14px' }}>
                              <strong style={{ color: '#5cb85c' }}>If No:</strong>
                              <p style={{ whiteSpace: 'pre-wrap', marginTop: '5px', color: '#555' }}>
                                {filteredNoMessage}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quote2;
