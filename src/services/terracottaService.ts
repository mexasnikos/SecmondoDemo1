/**
 * Terracotta Insurance Quote Integration Service
 * 
 * This service handles all communication with the Terracotta Integrated Quote web service
 * using SOAP protocol. It provides methods for:
 * - Requesting quotes (ProvideQuotation)
 * - Updating quotes with additional covers (ProvideQuotationWithAlterations)
 * - Getting screening questions (ScreeningQuestions)
 * - Saving policy details (SavePolicyDetails)
 */

// Import xmldom for Node.js XML parsing
let DOMParser: any;
if (typeof window === 'undefined') {
  // Node.js environment
  const { DOMParser: XMDOMParser } = require('xmldom');
  DOMParser = XMDOMParser;
} else {
  // Browser environment
  DOMParser = window.DOMParser;
}

// Terracotta API Configuration
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TERRACOTTA_BASE_URL = 'https://www.asuaonline.com/ws/integratedquote.asmx';
const PROXY_BASE_URL = 'http://localhost:3001/api/terracotta';
const TERRACOTTA_USER_ID = '4072';
const TERRACOTTA_USER_CODE = '111427';

// TypeScript interfaces for Terracotta API data structures

export interface TerracottaPolicyType {
  TypePolicyID: string;
  TypePolicyName: string;
  Description?: string;
}

export interface TerracottaPolicyTypeDestination {
  TypePolicyDestinationID: string;
  Name: string;
  PolicyTypeID?: string;
}

export interface TerracottaPolicyTypeDestinationResponse {
  Message: string;
  ResultID: number;
  PolicyTypeDestinations: TerracottaPolicyTypeDestination[];
}

export interface TerracottaPolicyTypeResponse {
  Message: string;
  ResultID: number;
  PolicyTypes: TerracottaPolicyType[];
}

export interface TerracottaTraveler {
  TravellerNumber: number;
  Title: string;
  FirstName: string;
  LastName: string;
  DateOfBirth: string; // Format: YYYY/MM/DD
  Age: number;
  AgebandID?: number;
  TitleID?: number;
  minAge?: number;
  maxAge?: number;
  AlterationID?: string;
  msPrice?: number;
  msPriceExcIPT?: number;
  msConditions?: string;
  ScreeningInformation?: any;
}

export interface TerracottaContactDetails {
  Address: string;
  Postcode: string;
  Email: string;
  Telephone: string;
  VehicleMakeModel?: string;
  VehicleLicensePlate?: string;
  VehicleYearManufacture?: string;
}

export interface TerracottaQuoteDetails {
  ResidenceID: string;
  TypePolicyID: string; // Comma-separated list of policy type IDs
  TypePackageID: string;
  Destination: string;
  StartDate: string; // Format: YYYY/MM/DD
  EndDate: string; // Format: YYYY/MM/DD
  Travellers: TerracottaTraveler[];
  ContactDetails: TerracottaContactDetails;
  includeAnnualQuotes?: number;
  includeUpsell?: number;
  alterionGenericID?: string;
  voucherCode?: string;
  isCYTI?: boolean;
  currencyID?: number;
  groupPerProduct?: boolean;
  priceOrder?: number;
  schemaIDFilter?: string;
  useCoverLevelUpsell?: boolean;
  sellOnBehalfOf?: number;
  customerUniqueID?: number;
  quoteVisitAuditID?: number;
}

export interface TerracottaQuoteRequest {
  userID: string;
  userCode: string;
  quoteDetails: TerracottaQuoteDetails;
}

export interface TerracottaDynamicDetail {
  Position: number;
  FieldName: string;
  FieldValue: string;
  FieldSize: number;
}

export interface TerracottaEligibilityQuestionAnswer {
  questionNumber: number;
  answer: 'yes' | 'no';
}

export interface TerracottaQuoteWithAlterationsRequest {
  userID: string;
  userCode: string;
  quoteID: string; // Note: lowercase 'q' as per documentation
  specificQuoteDetails: {
    AlterationID: string; // Comma-separated list of alteration IDs
    Travellers: TerracottaTraveler[];
    ContactDetails: TerracottaContactDetails;
    DynamicDetails?: TerracottaDynamicDetail[];
    screeningQuestionAnswers?: TerracottaScreeningQuestionAnswer[];
    EligibilityQuestionAnswers?: TerracottaEligibilityQuestionAnswer[];
  };
}

export interface SummaryCover {
  name: string;
  Limit: string;
  Excess: string;
  position?: number;
}

export interface TerracottaQuoteResult {
  QuoteID: string;
  schemaName: string;
  policytypeName: string;
  residenceName: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  SI: string; // Summary of cover PDF URL
  PW: string; // Policy wording PDF URL
  KF: string;
  HelpFile: string;
  currency: string;
  IPT: number; // IPT amount
  IPTRate: number;
  GrossPrice: number; // Quote price
  screeningPremium: number;
  IconURL: string;
  SchemaID: number;
  PolicyTypeID: number;
  DestinationID: number;
  PackageID: number;
  MaxAgeAgebandID: number;
  ScreeningID: number;
  groupPerProduct: boolean;
  priceOrder: number;
  IPID: string;
  typePolicyName: string;
  typePackageName: string;
  currencyHTMLEncoded: string;
  AlterationID: string;
  packageName: string;
  isAnnual: number;
  isBestBuy: number;
  maxDaysPerTrip: number;
  isBestBuyText: string;
  isBestBuyLocation: number;
  numberToSort: number;
  coverLevel: number;
  Discount: number;
  netUW: number;
  wbComm: number;
  agentComm: number;
  screeningPremiumPerPersonCSV: string;
  screeningPremiumExcIPTPerPersonCSV: string;
  isNotCoveredPerPersonCSV: string;
  policytypeShortName: string;
  SummaryCovers?: SummaryCover[];
}

export interface TerracottaQuoteResponse {
  Message: string;
  quoteResults: TerracottaQuoteResult[];
}

export interface TerracottaScreeningQuestionAnswer {
  questionNumber: number;
  answer: 'yes' | 'no';
}

export interface TerracottaSavePolicyRequest {
  userID: string;
  userCode: string;
  quoteID: string;
  screeningQuestionAnswers: TerracottaScreeningQuestionAnswer[];
  medicalScreeningReference?: string;
  useDefaultAnswers?: number;
  travelers?: TerracottaTraveler[];
  contactDetails?: TerracottaContactDetails;
}

export interface TerracottaEmailPolicyDocumentsRequest {
  userID: string;
  userCode: string;
  policyID: string;
  emailAddress: string;
}

export interface TerracottaEmailPolicyDocumentsResponse {
  emailSent: boolean;
  message?: string;
}

export interface TerracottaSavePolicyResponse {
  Message: string;
  policySaved: 'Yes' | 'No' | 'true' | 'false';
  policyID: string;
  certificate: string; // URL for policy certificate
  PW: string; // Policy wording PDF URL
  SI: string; // Summary of cover PDF URL
  KF?: string; // Key Facts PDF URL
  IPID?: string; // Insurance Product Information Document URL
}

export interface TerracottaScreeningQuestion {
  questionNumber: number;
  question: string;
  yesMessage: string;
  noMessage: string;
  yesAction: string;
  noAction: string;
  yesActionText: string;
  noActionText: string;
}

export interface TerracottaScreeningQuestionsResponse {
  Message: string;
  screeningQuestions: TerracottaScreeningQuestion[];
}

export interface TerracottaProduct {
  SchemaID: number;
  SchemaName: string;
}

export interface TerracottaProductListResponse {
  Message: string;
  ResultID: number;
  Schemas: TerracottaProduct[];
}

/**
 * Helper function to decode HTML entities and format currency
 */
function formatCurrencyLimit(htmlString: string): string {
  if (!htmlString) return '';
  
  // Decode HTML entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = htmlString;
  let decoded = textarea.value;
  
  // Additional manual replacements for common entities
  decoded = decoded
    .replace(/&euro;/gi, '€')
    .replace(/&pound;/gi, '£')
    .replace(/&dollar;/gi, '$')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
  
  // Format numbers with thousand separators
  // Match patterns like €32000 or euro32000 and add commas
  decoded = decoded.replace(/([€£$]|euro|pound|dollar)?\s*(\d{4,})/gi, (match, currency, number) => {
    const formattedNumber = parseInt(number).toLocaleString('en-US');
    return currency ? `${currency}${formattedNumber}` : formattedNumber;
  });
  
  // Fix spacing: "Up to€32,000" -> "Up to €32,000"
  decoded = decoded.replace(/(\w)([€£$])/g, '$1 $2');
  
  return decoded;
}

/**
 * SOAP XML Builder utility functions
 */
class SOAPBuilder {
  static createEnvelope(body: string): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    ${body}
  </soap:Body>
</soap:Envelope>`;
  }

  static buildTravelerXML(traveler: TerracottaTraveler): string {
    return `
      <Traveller>
        <TravellerNumber>${traveler.TravellerNumber}</TravellerNumber>
        <Title>${traveler.Title}</Title>
        <FirstName>${traveler.FirstName}</FirstName>
        <LastName>${traveler.LastName}</LastName>
        <DateOfBirth>${traveler.DateOfBirth}</DateOfBirth>
        <Age>${traveler.Age}</Age>
        <AgebandID>${traveler.AgebandID || 0}</AgebandID>
        <TitleID>${traveler.TitleID || 0}</TitleID>
        <minAge>${traveler.minAge || traveler.Age}</minAge>
        <maxAge>${traveler.maxAge || traveler.Age}</maxAge>
        <AlterationID>${traveler.AlterationID || ''}</AlterationID>
        <msPrice>${traveler.msPrice || 0}</msPrice>
        <msPriceExcIPT>${traveler.msPriceExcIPT || 0}</msPriceExcIPT>
        <msConditions>${traveler.msConditions || ''}</msConditions>
        <ScreeningInformation xsi:nil="true" />
      </Traveller>`;
  }

  static buildContactDetailsXML(contact: TerracottaContactDetails): string {
    return `
      <ContactDetails>
        <Address>${contact.Address}</Address>
        <Postcode>${contact.Postcode}</Postcode>
        <Email>${contact.Email}</Email>
        <Telephone>${contact.Telephone}</Telephone>
        ${contact.VehicleMakeModel ? `<VehicleMakeModel>${contact.VehicleMakeModel}</VehicleMakeModel>` : ''}
        ${contact.VehicleLicensePlate ? `<VehicleLicensePlate>${contact.VehicleLicensePlate}</VehicleLicensePlate>` : ''}
        ${contact.VehicleYearManufacture ? `<VehicleYearManufacture>${contact.VehicleYearManufacture}</VehicleYearManufacture>` : ''}
      </ContactDetails>`;
  }

  static buildQuoteDetailsXML(details: TerracottaQuoteDetails): string {
    const travelersXML = details.Travellers.map(traveler => 
      this.buildTravelerXML(traveler)
    ).join('');

    const contactXML = this.buildContactDetailsXML(details.ContactDetails);

    return `
      <quoteDetails>
        <ResidenceID>${parseInt(details.ResidenceID) || 1}</ResidenceID>
        <TypePolicyID>${details.TypePolicyID}</TypePolicyID>
        <TypePackageID>${parseInt(details.TypePackageID) || 1}</TypePackageID>
        <Destination>${details.Destination}</Destination>
        <StartDate>${details.StartDate}</StartDate>
        <EndDate>${details.EndDate}</EndDate>
        <Travellers>
          ${travelersXML}
        </Travellers>
        ${contactXML}
        ${details.includeAnnualQuotes !== undefined ? `<includeAnnualQuotes>${details.includeAnnualQuotes}</includeAnnualQuotes>` : ''}
        ${details.includeUpsell !== undefined ? `<includeUpsell>${details.includeUpsell}</includeUpsell>` : ''}
        ${details.currencyID ? `<currencyID>${details.currencyID}</currencyID>` : ''}
        ${details.schemaIDFilter ? `<schemaIDFilter>${details.schemaIDFilter}</schemaIDFilter>` : ''}
      </quoteDetails>`;
  }

  static buildScreeningAnswersXML(answers: TerracottaScreeningQuestionAnswer[]): string {
    return '<screeningQuestionAnswers>' + 
      answers.map(answer => `
        <screeningQuestionAnswer>
          <questionNumber>${answer.questionNumber}</questionNumber>
          <answer>${answer.answer}</answer>
        </screeningQuestionAnswer>`
      ).join('') + '</screeningQuestionAnswers>';
  }

  static buildEligibilityAnswersXML(answers: TerracottaEligibilityQuestionAnswer[]): string {
    return '<EligibilityQuestionAnswers>' + 
      answers.map(answer => `
        <eligibilityQuestionAnswer>
          <questionNumber>${answer.questionNumber}</questionNumber>
          <answer>${answer.answer}</answer>
        </eligibilityQuestionAnswer>`
      ).join('') + '</EligibilityQuestionAnswers>';
  }

  static buildDynamicDetailsXML(details: TerracottaDynamicDetail[]): string {
    return '<DynamicDetails>' + 
      details.map(detail => `
        <DynamicDetail_SavedValue>
          <Position>${detail.Position}</Position>
          <FieldName>${detail.FieldName}</FieldName>
          <FieldValue>${detail.FieldValue}</FieldValue>
          <FieldSize>${detail.FieldSize}</FieldSize>
        </DynamicDetail_SavedValue>`
      ).join('') + '</DynamicDetails>';
  }

  static buildSpecificQuoteDetailsXML(details: any): string {
    const travelersXML = details.Travellers.map((traveler: TerracottaTraveler) => 
      this.buildTravelerXML(traveler)
    ).join('');

    const contactXML = this.buildContactDetailsXML(details.ContactDetails);
    
    const dynamicDetailsXML = details.DynamicDetails ? 
      this.buildDynamicDetailsXML(details.DynamicDetails) : '';
    
    const screeningAnswersXML = details.screeningQuestionAnswers ? 
      this.buildScreeningAnswersXML(details.screeningQuestionAnswers) : '';
    
    const eligibilityAnswersXML = details.EligibilityQuestionAnswers ? 
      this.buildEligibilityAnswersXML(details.EligibilityQuestionAnswers) : '';

    return `
      <specificQuoteDetails>
        <AlterationID>${details.AlterationID}</AlterationID>
        <Travellers>
          ${travelersXML}
        </Travellers>
        ${contactXML}
        ${dynamicDetailsXML}
        ${screeningAnswersXML}
        ${eligibilityAnswersXML}
      </specificQuoteDetails>`;
  }
}

/**
 * XML Parser utility functions
 */
class XMLParser {
  static getXMLParser(): any {
    return new DOMParser();
  }


  static parseQuoteResponse(xmlText: string): TerracottaQuoteResponse {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Check for parsing errors
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error(`XML parsing error: ${parseError.textContent}`);
      }

      const message = xmlDoc.querySelector('message')?.textContent || '';
      const quoteResults: TerracottaQuoteResult[] = [];

      // Select only child quoteResults, not the parent container
      // Handle both ProvideQuotation and ProvideQuotationWithAlterations responses
      let quoteResultNodes = xmlDoc.querySelectorAll('ProvideQuotationResult > quoteResults > quoteResults');
      
      // If not found, try ProvideQuotationWithAlterationsResult
      if (quoteResultNodes.length === 0) {
        quoteResultNodes = xmlDoc.querySelectorAll('ProvideQuotationWithAlterationsResult > quoteResults > quoteResults');
      }
      
      // If still not found, try without the parent Result element
      if (quoteResultNodes.length === 0) {
        quoteResultNodes = xmlDoc.querySelectorAll('quoteResults > quoteResults');
      }
      
      console.log(`📊 Found ${quoteResultNodes.length} quote result nodes in XML`);
      
      quoteResultNodes.forEach((node: any) => {
        // Only process nodes that have QuoteID (skip empty parent nodes)
        const quoteID = node.querySelector('QuoteID')?.textContent || '';
        if (!quoteID) {
          console.log('⚠️ Skipping node without QuoteID');
          return; // Skip empty nodes
        }
        console.log(`✅ Processing quote result with QuoteID: ${quoteID}`);
        
        const grossPriceText = node.querySelector('GrossPrice')?.textContent || '0';
        const grossPriceValue = parseFloat(grossPriceText);
        console.log(`💰 Extracted GrossPrice: ${grossPriceText} -> ${grossPriceValue}`);
        
        const result: TerracottaQuoteResult = {
          QuoteID: quoteID,
          schemaName: node.querySelector('schemaName')?.textContent || '',
          policytypeName: node.querySelector('policytypeName')?.textContent || '',
          residenceName: node.querySelector('residenceName')?.textContent || '',
          destinationName: node.querySelector('destinationName')?.textContent || '',
          startDate: node.querySelector('startDate')?.textContent || '',
          endDate: node.querySelector('endDate')?.textContent || '',
          SI: node.querySelector('SI')?.textContent || '',
          PW: node.querySelector('PW')?.textContent || '',
          KF: node.querySelector('KF')?.textContent || '',
          HelpFile: node.querySelector('HelpFile')?.textContent || '',
          currency: node.querySelector('currency')?.textContent || '',
          IPT: parseFloat(node.querySelector('IPT')?.textContent || '0'),
          IPTRate: parseFloat(node.querySelector('IPTRate')?.textContent || '0'),
          GrossPrice: grossPriceValue,
          screeningPremium: parseFloat(node.querySelector('screeningPremium')?.textContent || '0'),
          IconURL: node.querySelector('IconURL')?.textContent || '',
          SchemaID: parseInt(node.querySelector('SchemaID')?.textContent || '0'),
          PolicyTypeID: parseInt(node.querySelector('PolicyTypeID')?.textContent || '0'),
          DestinationID: parseInt(node.querySelector('DestinationID')?.textContent || '0'),
          PackageID: parseInt(node.querySelector('PackageID')?.textContent || '0'),
          MaxAgeAgebandID: parseInt(node.querySelector('MaxAgeAgebandID')?.textContent || '0'),
          ScreeningID: parseInt(node.querySelector('ScreeningID')?.textContent || '0'),
          groupPerProduct: node.querySelector('groupPerProduct')?.textContent === 'true',
          priceOrder: parseInt(node.querySelector('priceOrder')?.textContent || '0'),
          IPID: node.querySelector('IPID')?.textContent || '',
          typePolicyName: node.querySelector('typePolicyName')?.textContent || '',
          typePackageName: node.querySelector('typePackageName')?.textContent || '',
          currencyHTMLEncoded: node.querySelector('currencyHTMLEncoded')?.textContent || '',
          AlterationID: node.querySelector('AlterationID')?.textContent || '',
          packageName: node.querySelector('packageName')?.textContent || '',
          isAnnual: parseInt(node.querySelector('isAnnual')?.textContent || '0'),
          isBestBuy: parseInt(node.querySelector('isBestBuy')?.textContent || '0'),
          maxDaysPerTrip: parseInt(node.querySelector('maxDaysPerTrip')?.textContent || '0'),
          isBestBuyText: node.querySelector('isBestBuyText')?.textContent || '',
          isBestBuyLocation: parseInt(node.querySelector('isBestBuyLocation')?.textContent || '0'),
          numberToSort: parseFloat(node.querySelector('numberToSort')?.textContent || '0'),
          coverLevel: parseInt(node.querySelector('coverLevel')?.textContent || '0'),
          Discount: parseFloat(node.querySelector('Discount')?.textContent || '0'),
          netUW: parseFloat(node.querySelector('netUW')?.textContent || '0'),
          wbComm: parseFloat(node.querySelector('wbComm')?.textContent || '0'),
          agentComm: parseFloat(node.querySelector('agentComm')?.textContent || '0'),
          screeningPremiumPerPersonCSV: node.querySelector('screeningPremiumPerPersonCSV')?.textContent || '',
          screeningPremiumExcIPTPerPersonCSV: node.querySelector('screeningPremiumExcIPTPerPersonCSV')?.textContent || '',
          isNotCoveredPerPersonCSV: node.querySelector('isNotCoveredPerPersonCSV')?.textContent || '',
          policytypeShortName: node.querySelector('policytypeShortName')?.textContent || '',
          SummaryCovers: []
        };
        
        // Parse SummaryCovers
        const summaryCoversNode = node.querySelector('SummaryCovers');
        if (summaryCoversNode) {
          const summaryCoverNodes = summaryCoversNode.querySelectorAll('summaryCover');
          const summaryCovers: SummaryCover[] = [];
          summaryCoverNodes.forEach((coverNode: any) => {
            const rawLimit = coverNode.querySelector('Limit')?.textContent || '';
            const rawExcess = coverNode.querySelector('Excess')?.textContent || '';
            
            summaryCovers.push({
              name: coverNode.querySelector('name')?.textContent || '',
              Limit: formatCurrencyLimit(rawLimit),
              Excess: formatCurrencyLimit(rawExcess),
              position: parseInt(coverNode.querySelector('position')?.textContent || '0')
            });
          });
          result.SummaryCovers = summaryCovers;
        }
        
        quoteResults.push(result);
      });

      return { Message: message, quoteResults };
    } catch (error) {
      console.error('Error parsing quote response:', error);
      throw new Error(`Failed to parse quote response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static parseScreeningQuestionsResponse(xmlText: string): TerracottaScreeningQuestionsResponse {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error(`XML parsing error: ${parseError.textContent}`);
      }

      const message = xmlDoc.querySelector('message')?.textContent || '';
      const screeningQuestions: TerracottaScreeningQuestion[] = [];

      const questionNodes = xmlDoc.querySelectorAll('screeningQuestion');
      questionNodes.forEach((node: any) => {
        const question: TerracottaScreeningQuestion = {
          questionNumber: parseInt(node.querySelector('questionNumber')?.textContent || '0'),
          question: node.querySelector('Question')?.textContent || '',  // Capital Q to match API response
          yesMessage: node.querySelector('yesMessage')?.textContent || '',
          noMessage: node.querySelector('noMessage')?.textContent || '',
          yesAction: node.querySelector('yesAction')?.textContent || '',
          noAction: node.querySelector('noAction')?.textContent || '',
          yesActionText: node.querySelector('yesActionText')?.textContent || '',
          noActionText: node.querySelector('noActionText')?.textContent || ''
        };
        screeningQuestions.push(question);
      });

      return { Message: message, screeningQuestions };
    } catch (error) {
      console.error('Error parsing screening questions response:', error);
      throw new Error(`Failed to parse screening questions response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static parseEmailPolicyDocumentsResponse(xmlText: string): TerracottaEmailPolicyDocumentsResponse {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error(`XML parsing error: ${parseError.textContent}`);
      }

      console.log('🔍 Full EmailPolicyDocuments XML Response:', xmlText);
      
      // Check for success indicators
      const messageNode = xmlDoc.querySelector('Message, message');
      const emailSentNode = xmlDoc.querySelector('emailSent, EmailSent, success, Success');
      
      const message = messageNode?.textContent?.trim() || '';
      const emailSentValue = emailSentNode?.textContent?.trim() || '';
      
      // Determine if email was sent successfully
      const emailSent = 
        emailSentValue.toLowerCase() === 'true' || 
        emailSentValue.toLowerCase() === 'yes' ||
        message.toLowerCase().includes('success') ||
        message.toLowerCase().includes('sent');
      
      console.log('📧 Email sent status:', emailSent);
      console.log('📧 Response message:', message);
      
      return {
        emailSent,
        message
      };
    } catch (error) {
      console.error('❌ Error parsing EmailPolicyDocuments response:', error);
      throw new Error(`Failed to parse EmailPolicyDocuments response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static parseSavePolicyResponse(xmlText: string): TerracottaSavePolicyResponse {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error(`XML parsing error: ${parseError.textContent}`);
      }

      // Log the full XML for debugging
      console.log('🔍 Full SavePolicyDetails XML Response:', xmlText);
      
      // Try different possible XML structures and field names
      const messageNode = xmlDoc.querySelector('Message, message');
      const policySavedNode = xmlDoc.querySelector('policySaved, PolicySaved');
      const policyIDNode = xmlDoc.querySelector('policyID, PolicyID');
      
      // Try multiple variations for certificate
      const certificateNode = xmlDoc.querySelector('certificate, Certificate, cert, Cert, CertificateURL, certificateURL');
      const pwNode = xmlDoc.querySelector('PW, pw, PolicyWording, policyWording');
      const siNode = xmlDoc.querySelector('SI, si, SummaryInsurance, summaryInsurance, SummaryCover, summaryCover');
      const kfNode = xmlDoc.querySelector('KF, kf, KeyFacts, keyFacts');
      const ipidNode = xmlDoc.querySelector('IPID, ipid');
      
      const message = messageNode?.textContent || '';
      const policySavedRaw = policySavedNode?.textContent || 'No';
      // Handle both "Yes"/"No" and "true"/"false" formats
      const policySaved = (policySavedRaw === 'true' ? 'Yes' : policySavedRaw === 'false' ? 'No' : policySavedRaw) as 'Yes' | 'No' | 'true' | 'false';
      const policyID = policyIDNode?.textContent || '';
      const certificate = certificateNode?.textContent || '';
      const pw = pwNode?.textContent || '';
      const si = siNode?.textContent || '';
      const kf = kfNode?.textContent || '';
      const ipid = ipidNode?.textContent || '';
      
      console.log('📋 Parsed SavePolicyDetails fields:');
      console.log('  - Message:', message);
      console.log('  - policySaved (raw):', policySavedRaw);
      console.log('  - policySaved (normalized):', policySaved);
      console.log('  - policyID:', policyID);
      console.log('  - certificate:', certificate || '⚠️ EMPTY/NOT FOUND');
      console.log('  - PW:', pw || '⚠️ EMPTY/NOT FOUND');
      console.log('  - SI:', si || '⚠️ EMPTY/NOT FOUND');
      console.log('  - KF:', kf || '⚠️ EMPTY/NOT FOUND');
      console.log('  - IPID:', ipid || '⚠️ EMPTY/NOT FOUND');
      
      // List all XML nodes for debugging
      console.log('📋 All XML element names in response:');
      const allElements = xmlDoc.querySelectorAll('*');
      const elementNames = Array.from(allElements as NodeListOf<Element>).map(el => el.tagName);
      console.log('  Available elements:', Array.from(new Set(elementNames)).join(', '));

      return {
        Message: message,
        policySaved: policySaved,
        policyID: policyID,
        certificate: certificate,
        PW: pw,
        SI: si,
        KF: kf,
        IPID: ipid
      };
    } catch (error) {
      console.error('Error parsing save policy response:', error);
      throw new Error(`Failed to parse save policy response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static parseProductListResponse(xmlText: string): TerracottaProductListResponse {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error(`XML parsing error: ${parseError.textContent}`);
      }

      const message = xmlDoc.querySelector('message')?.textContent || '';
      const resultID = parseInt(xmlDoc.querySelector('errorID')?.textContent || '0');
      const schemas: TerracottaProduct[] = [];

      const schemaNodes = xmlDoc.querySelectorAll('Schema');
      schemaNodes.forEach((node: any) => {
        const schema: TerracottaProduct = {
          SchemaID: parseInt(node.querySelector('SchemaID')?.textContent || '0'),
          SchemaName: node.querySelector('SchemaName')?.textContent || ''
        };
        schemas.push(schema);
      });

      return { Message: message, ResultID: resultID, Schemas: schemas };
    } catch (error) {
      console.error('Error parsing product list response:', error);
      throw new Error(`Failed to parse product list response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static parsePolicyTypeResponse(xmlText: string): TerracottaPolicyTypeResponse {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error(`XML parsing error: ${parseError.textContent}`);
      }

      const message = xmlDoc.querySelector('message')?.textContent || '';
      const resultID = parseInt(xmlDoc.querySelector('errorID')?.textContent || '0');
      const policyTypes: TerracottaPolicyType[] = [];

      const policyTypeNodes = xmlDoc.querySelectorAll('TypePolicy');
      policyTypeNodes.forEach((node: any) => {
        const policyType: TerracottaPolicyType = {
          TypePolicyID: node.querySelector('TypePolicyID')?.textContent || '',
          TypePolicyName: node.querySelector('Name')?.textContent || '', // Changed from TypePolicyName to Name
          Description: node.querySelector('IsAnnual')?.textContent === '1' ? 'Annual Policy' : 'Single Trip Policy'
        };
        policyTypes.push(policyType);
      });

      return { Message: message, ResultID: resultID, PolicyTypes: policyTypes };
    } catch (error) {
      console.error('Error parsing policy type response:', error);
      throw new Error(`Failed to parse policy type response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static parsePolicyTypeDestinationResponse(xmlText: string): TerracottaPolicyTypeDestinationResponse {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error(`XML parsing error: ${parseError.textContent}`);
      }

      const message = xmlDoc.querySelector('message')?.textContent || '';
      const resultID = parseInt(xmlDoc.querySelector('errorID')?.textContent || '0');
      const policyTypeDestinations: TerracottaPolicyTypeDestination[] = [];

      const destinationNodes = xmlDoc.querySelectorAll('PolicyTypeDestination');
      destinationNodes.forEach((node: any) => {
        const destination: TerracottaPolicyTypeDestination = {
          TypePolicyDestinationID: node.querySelector('TypePolicyDestinationID')?.textContent || '',
          Name: node.querySelector('Name')?.textContent || '',
          PolicyTypeID: node.querySelector('PolicyTypeID')?.textContent || ''
        };
        policyTypeDestinations.push(destination);
      });

      return { Message: message, ResultID: resultID, PolicyTypeDestinations: policyTypeDestinations };
    } catch (error) {
      console.error('Error parsing policy type destination response:', error);
      throw new Error(`Failed to parse policy type destination response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Main Terracotta Service Class
 */
export class TerracottaService {
  private static instance: TerracottaService;
  private userID: string;
  private userCode: string;

  constructor(userID: string = TERRACOTTA_USER_ID, userCode: string = TERRACOTTA_USER_CODE) {
    this.userID = userID;
    this.userCode = userCode;
  }

  static getInstance(userID?: string, userCode?: string): TerracottaService {
    if (!TerracottaService.instance) {
      TerracottaService.instance = new TerracottaService(
        userID || TERRACOTTA_USER_ID, 
        userCode || TERRACOTTA_USER_CODE
      );
    }
    return TerracottaService.instance;
  }

  /**
   * Generic SOAP request method
   */
  private async makeSOAPRequest(method: string, requestBody: string): Promise<string> {
    const soapEnvelope = SOAPBuilder.createEnvelope(requestBody);
    
    console.log('Making SOAP request via proxy to:', `${PROXY_BASE_URL}/${method}`);
    console.log('SOAP Envelope:', soapEnvelope);
    
    try {
      const response = await fetch(`${PROXY_BASE_URL}/${method}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset=utf-8'
        },
        body: soapEnvelope
      });

      console.log('SOAP Response Status:', response.status, response.statusText);
      const responseText = await response.text();
      console.log('SOAP Response Body:', responseText);

      if (!response.ok) {
        throw new Error(`SOAP request failed: ${response.status} ${response.statusText}`);
      }

      return responseText;
    } catch (error) {
      console.error('Proxy request failed:', error);
      throw new Error(`Failed to connect to Terracotta API via proxy: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Test connection with HelloWorld method
   */
  async testConnection(): Promise<boolean> {
    try {
      const soapBody = `
        <HelloWorld xmlns="WS-IntegratedQuote">
        </HelloWorld>`;

      const responseText = await this.makeSOAPRequest('HelloWorld', soapBody);
      console.log('Connection test successful:', responseText);
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Get available policy types for a specific schema
   */
  async getUserProductTypePolicy(schemaId: string): Promise<TerracottaPolicyTypeResponse> {
    try {
      const userID = parseInt(this.userID) || parseInt(TERRACOTTA_USER_ID);
      const userCode = parseInt(this.userCode) || parseInt(TERRACOTTA_USER_CODE);
      
      console.log('getUserProductTypePolicy - schemaId:', schemaId, 'userID:', userID, 'userCode:', userCode);
      
      const soapBody = `
        <GetUserProductTypePolicy xmlns="WS-IntegratedQuote">
          <userID>${userID}</userID>
          <userCode>${userCode}</userCode>
          <schemaId>${schemaId}</schemaId>
        </GetUserProductTypePolicy>`;

      const responseText = await this.makeSOAPRequest('GetUserProductTypePolicy', soapBody);
      return XMLParser.parsePolicyTypeResponse(responseText);
    } catch (error) {
      console.error('Error in getUserProductTypePolicy:', error);
      throw new Error(`Failed to get policy types: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get available destinations for a specific schema
   */
  async getUserProductDestination(schemaId: string): Promise<TerracottaPolicyTypeDestinationResponse> {
    try {
      const userID = parseInt(this.userID) || parseInt(TERRACOTTA_USER_ID);
      const userCode = parseInt(this.userCode) || parseInt(TERRACOTTA_USER_CODE);
      
      console.log('getUserProductDestination - schemaId:', schemaId, 'userID:', userID, 'userCode:', userCode);
      
      const soapBody = `
        <GetUserProductDestination xmlns="WS-IntegratedQuote">
          <userID>${userID}</userID>
          <userCode>${userCode}</userCode>
          <schemaId>${schemaId}</schemaId>
        </GetUserProductDestination>`;

      const responseText = await this.makeSOAPRequest('GetUserProductDestination', soapBody);
      return XMLParser.parsePolicyTypeDestinationResponse(responseText);
    } catch (error) {
      console.error('Error in getUserProductDestination:', error);
      throw new Error(`Failed to get policy type destinations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get available products for the user
   */
  async getUserProductList(): Promise<TerracottaProductListResponse> {
    try {
      const userID = parseInt(this.userID) || parseInt(TERRACOTTA_USER_ID);
      const userCode = parseInt(this.userCode) || parseInt(TERRACOTTA_USER_CODE);
      
      console.log('getUserProductList - userID:', userID, 'userCode:', userCode);
      console.log('getUserProductList - this.userID:', this.userID, 'this.userCode:', this.userCode);
      
      const soapBody = `
        <GetUserProductList xmlns="WS-IntegratedQuote">
          <userID>${userID}</userID>
          <userCode>${userCode}</userCode>
        </GetUserProductList>`;

      const responseText = await this.makeSOAPRequest('GetUserProductList', soapBody);
      return XMLParser.parseProductListResponse(responseText);
    } catch (error) {
      console.error('Error in getUserProductList:', error);
      throw new Error(`Failed to get user product list: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 1. Request for quotations
   * Calls the ProvideQuotation method to obtain a list of possible quotes
   */
  async provideQuotation(request: TerracottaQuoteRequest): Promise<TerracottaQuoteResponse> {
    try {
      console.log('🚀 Building SOAP request for ProvideQuotation...');
      console.log('📦 Request object:', request);
      
      const quoteDetailsXML = SOAPBuilder.buildQuoteDetailsXML(request.quoteDetails);
      console.log('📄 Quote Details XML:', quoteDetailsXML);
      
      const soapBody = `
        <ProvideQuotation xmlns="WS-IntegratedQuote">
          <userID>${parseInt(request.userID)}</userID>
          <userCode>${parseInt(request.userCode)}</userCode>
          ${quoteDetailsXML}
        </ProvideQuotation>`;

      console.log('📤 Complete SOAP Body:', soapBody);
      console.log('🌐 Sending SOAP request to:', `${PROXY_BASE_URL}/ProvideQuotation`);
      
      const responseText = await this.makeSOAPRequest('ProvideQuotation', soapBody);
      
      console.log('📥 Raw SOAP Response received');
      console.log('📄 Response length:', responseText.length, 'characters');
      console.log('📄 First 500 chars of response:', responseText.substring(0, 500));
      
      const parsedResponse = XMLParser.parseQuoteResponse(responseText);
      console.log('✅ Parsed response:', parsedResponse);
      
      return parsedResponse;
    } catch (error) {
      console.error('❌ Error in provideQuotation:', error);
      console.error('❌ Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('❌ Error message:', error instanceof Error ? error.message : String(error));
      throw new Error(`Failed to get quotes from Terracotta: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 3. Obtain Screening Questions
   * Calls ScreeningQuestions to get screening questions for the selected quote
   */
  async getScreeningQuestions(quoteID: string): Promise<TerracottaScreeningQuestionsResponse> {
    try {
      console.log('🔄 Building SOAP request for ScreeningQuestions...');
      console.log('📦 QuoteID:', quoteID);
      console.log('👤 UserID:', this.userID, 'UserCode:', this.userCode);
      
      const soapBody = `
        <ScreeningQuestions xmlns="WS-IntegratedQuote">
          <userID>${parseInt(this.userID) || parseInt(TERRACOTTA_USER_ID)}</userID>
          <userCode>${parseInt(this.userCode) || parseInt(TERRACOTTA_USER_CODE)}</userCode>
          <quoteID>${quoteID}</quoteID>
        </ScreeningQuestions>`;

      console.log('📤 SOAP Body for ScreeningQuestions:', soapBody);
      
      const responseText = await this.makeSOAPRequest('ScreeningQuestions', soapBody);
      
      console.log('📥 Raw Response from ScreeningQuestions:', responseText.substring(0, 1000));
      
      const parsed = XMLParser.parseScreeningQuestionsResponse(responseText);
      console.log('✅ Parsed Screening Questions Response:', parsed);
      console.log('📋 Number of questions:', parsed.screeningQuestions?.length || 0);
      
      if (parsed.screeningQuestions && parsed.screeningQuestions.length > 0) {
        console.log('📝 Questions details:');
        parsed.screeningQuestions.forEach((q, idx) => {
          console.log(`  ${idx + 1}. Q${q.questionNumber}: ${q.question}`);
        });
      }
      
      return parsed;
    } catch (error) {
      console.error('❌ Error in getScreeningQuestions:', error);
      console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      throw new Error(`Failed to get screening questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 2. Update quotes with additional covers
   * Calls ProvideQuotationWithAlterations to get quotes with specific alterations/add-ons
   * This method can only be called AFTER obtaining a quote reference from ProvideQuotation
   */
  async provideQuotationWithAlterations(request: TerracottaQuoteWithAlterationsRequest): Promise<TerracottaQuoteResponse> {
    try {
      console.log('🚀 Building SOAP request for ProvideQuotationWithAlterations...');
      console.log('📦 Request object:', request);
      
      const specificQuoteDetailsXML = SOAPBuilder.buildSpecificQuoteDetailsXML(request.specificQuoteDetails);
      console.log('📄 Specific Quote Details XML:', specificQuoteDetailsXML);
      
      const soapBody = `
        <ProvideQuotationWithAlterations xmlns="WS-IntegratedQuote">
          <userID>${parseInt(request.userID)}</userID>
          <userCode>${parseInt(request.userCode)}</userCode>
          <quoteID>${request.quoteID}</quoteID>
          ${specificQuoteDetailsXML}
        </ProvideQuotationWithAlterations>`;

      console.log('📤 Complete SOAP Body:', soapBody);
      console.log('🌐 Sending SOAP request to:', `${PROXY_BASE_URL}/ProvideQuotationWithAlterations`);
      
      const responseText = await this.makeSOAPRequest('ProvideQuotationWithAlterations', soapBody);
      
      console.log('📥 Raw SOAP Response received');
      console.log('📄 Response length:', responseText.length, 'characters');
      console.log('📄 First 500 chars of response:', responseText.substring(0, 500));
      
      const parsedResponse = XMLParser.parseQuoteResponse(responseText);
      console.log('✅ Parsed response:', parsedResponse);
      
      return parsedResponse;
    } catch (error) {
      console.error('❌ Error in provideQuotationWithAlterations:', error);
      console.error('❌ Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('❌ Error message:', error instanceof Error ? error.message : String(error));
      throw new Error(`Failed to get quotes with alterations from Terracotta: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 3. Save a quote as a Live policy
   * Calls SavePolicyDetails to convert the quote into a live policy
   */
  async savePolicyDetails(request: TerracottaSavePolicyRequest): Promise<TerracottaSavePolicyResponse> {
    try {
      console.log('🚀 Building SOAP request for SavePolicyDetails...');
      console.log('📦 Request object:', request);
      console.log('👥 Travelers in request:', JSON.stringify(request.travelers, null, 2));
      console.log('📧 Contact Details in request:', JSON.stringify(request.contactDetails, null, 2));
      
      const screeningAnswersXML = SOAPBuilder.buildScreeningAnswersXML(request.screeningQuestionAnswers);
      
      // Build travelers XML if provided
      if (request.travelers && request.travelers.length > 0) {
        console.log(`🔨 Building XML for ${request.travelers.length} traveler(s)...`);
        request.travelers.forEach((t, idx) => {
          console.log(`  Traveler ${idx + 1}: ${t.Title} ${t.FirstName} ${t.LastName}, Age: ${t.Age}, DOB: ${t.DateOfBirth}`);
        });
      }
      
      const travelersXML = request.travelers && request.travelers.length > 0
        ? request.travelers.map(traveler => SOAPBuilder.buildTravelerXML(traveler)).join('')
        : '';
      
      // Build contact details XML if provided
      const contactDetailsXML = request.contactDetails
        ? SOAPBuilder.buildContactDetailsXML(request.contactDetails)
        : '';
      
      const soapBody = `
        <SavePolicyDetails xmlns="WS-IntegratedQuote">
          <userID>${parseInt(request.userID)}</userID>
          <userCode>${parseInt(request.userCode)}</userCode>
          <quoteID>${request.quoteID}</quoteID>
          ${screeningAnswersXML}
          ${request.medicalScreeningReference ? `<medicalScreeningReference>${request.medicalScreeningReference}</medicalScreeningReference>` : '<medicalScreeningReference>string</medicalScreeningReference>'}
          ${request.useDefaultAnswers !== undefined ? `<useDefaultAnswers>${request.useDefaultAnswers}</useDefaultAnswers>` : '<useDefaultAnswers>1</useDefaultAnswers>'}
          ${travelersXML}
          ${contactDetailsXML}
        </SavePolicyDetails>`;

      console.log('📤 Complete SOAP Body for SavePolicyDetails:', soapBody);
      console.log('🌐 Sending SOAP request to:', `${PROXY_BASE_URL}/SavePolicyDetails`);

      const responseText = await this.makeSOAPRequest('SavePolicyDetails', soapBody);
      
      console.log('📥 Raw SOAP Response from SavePolicyDetails:', responseText);
      
      const parsedResponse = XMLParser.parseSavePolicyResponse(responseText);
      console.log('✅ Parsed SavePolicyDetails response:', parsedResponse);
      
      return parsedResponse;
    } catch (error) {
      console.error('❌ Error in savePolicyDetails:', error);
      throw new Error(`Failed to save policy details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 4. Email Policy Documents
   * Calls EmailPolicyDocuments to send policy documents to the policy holder's email
   */
  async emailPolicyDocuments(request: TerracottaEmailPolicyDocumentsRequest): Promise<TerracottaEmailPolicyDocumentsResponse> {
    try {
      console.log('🚀 Building SOAP request for EmailPolicyDocuments...');
      console.log('📦 Request object:', request);
      
      const soapBody = `
        <EmailPolicyDocuments xmlns="WS-IntegratedQuote">
          <userID>${parseInt(request.userID)}</userID>
          <userCode>${parseInt(request.userCode)}</userCode>
          <policyID>${request.policyID}</policyID>
          <emailAddress>${request.emailAddress}</emailAddress>
        </EmailPolicyDocuments>`;

      console.log('📤 Complete SOAP Body for EmailPolicyDocuments:', soapBody);
      console.log('📧 Sending policy documents to:', request.emailAddress);
      console.log('🌐 Sending SOAP request to:', `${PROXY_BASE_URL}/EmailPolicyDocuments`);

      const responseText = await this.makeSOAPRequest('EmailPolicyDocuments', soapBody);
      
      console.log('📥 Raw SOAP Response from EmailPolicyDocuments:', responseText);
      
      const parsedResponse = XMLParser.parseEmailPolicyDocumentsResponse(responseText);
      console.log('✅ Parsed EmailPolicyDocuments response:', parsedResponse);
      
      return parsedResponse;
    } catch (error) {
      console.error('❌ Error in emailPolicyDocuments:', error);
      throw new Error(`Failed to email policy documents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Utility method to convert frontend data to Terracotta format
   */
  static convertToTerracottaFormat(formData: any, availablePolicyTypes?: TerracottaPolicyType[]): TerracottaQuoteRequest {
    console.log('Converting form data to Terracotta format:', formData);
    
    // Use DUMMY data for travelers to get quotation
    // Real traveler data will be collected later in the payment step
    const travelers: TerracottaTraveler[] = Array.from({ length: formData.numberOfTravelers || 1 }, (_, index) => {
      const dummyAge = 30; // Default dummy age
      const dummyDateOfBirth = calculateDateOfBirth(dummyAge);
      
      console.log(`Traveler ${index + 1} (DUMMY): DOB=${dummyDateOfBirth}, Age=${dummyAge}`);
      
      return {
        TravellerNumber: index + 1,
        Title: 'Mr', // Dummy title
        FirstName: 'John', // Dummy first name
        LastName: 'Doe', // Dummy last name
        DateOfBirth: formatDateForTerracotta(dummyDateOfBirth),
        Age: dummyAge,
        AgebandID: getAgebandID(dummyAge),
        TitleID: getTitleID('Mr'),
        minAge: dummyAge,
        maxAge: dummyAge,
        ScreeningInformation: null
      };
    });

    // Use DUMMY contact details to get quotation
    // Real contact details will be collected later in the payment step
    const contactDetails: TerracottaContactDetails = {
      Address: '123 Main Street', // Dummy address
      Postcode: '12345', // Dummy postcode
      Email: 'customer@example.com', // Dummy email
      Telephone: '+302101234567', // Dummy telephone
      VehicleMakeModel: formData.vehicleMakeModel,
      VehicleLicensePlate: formData.vehicleLicensePlate,
      VehicleYearManufacture: formData.vehicleYearManufacture
    };

           // Convert trip details using actual user data
           const quoteDetails: TerracottaQuoteDetails = {
             ResidenceID: getResidenceID(formData.countryOfResidence),
             TypePolicyID: getTypePolicyID(formData.tripType, availablePolicyTypes),
             TypePackageID: '1', // Fixed value as requested (string)
             Destination: formData.destination || 'Europe',
             StartDate: formatDateForTerracotta(formData.startDate),
             EndDate: formatDateForTerracotta(formData.endDate),
             Travellers: travelers,
             ContactDetails: contactDetails,
             includeAnnualQuotes: 0, // Always 0 - TypePolicyID determines if it's annual
             includeUpsell: 0, // Simplified for now
             currencyID: 1, // EUR
             schemaIDFilter: '717' // Use schema 717
           };

    console.log('Converted Terracotta request:', quoteDetails);
    
    // Use fixed values as requested
    return {
      userID: '4072',
      userCode: '111427',
      quoteDetails
    };
  }
}

/**
 * Utility functions for data conversion
 */

function formatDateForTerracotta(dateString: string): string {
  if (!dateString) return '';
  
  // Handle different date formats
  if (dateString.includes('/')) {
    // Handle DD/MM/YYYY format
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}/${month}/${day}`;
    }
  }
  
  // Handle YYYY-MM-DD format
  if (dateString.includes('-')) {
    return dateString.replace(/-/g, '/');
  }
  
  return dateString;
}

function calculateDateOfBirth(age: number): string {
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - age;
  // Use January 1st as default date
  return `${birthYear}/01/01`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function calculateAgeFromDateOfBirth(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return Math.max(0, age);
}

export function getResidenceID(country: string): string {
  // Map countries to Terracotta Residence IDs
  // Based on Terracotta API - Greece is ResidenceID 24
  const residenceMap: { [key: string]: string } = {
    'Greece': '24',     // Correct ResidenceID for Greece
    'Austria': '4',
    'Belgium': '6',
    'Bulgaria': '10',
    'Croatia (Hrvatska)': '14',
    'Czech Republic': '16',
    'Denmark': '17',
    'Estonia': '20',
    'Finland': '21',
    'France': '22',
    'Germany': '23',
    'Hungary': '27',
    'Iceland': '28',
    'Italy': '33',
    'Latvia': '38',
    'Liechtenstein': '40',
    'Lithuania': '41',
    'Luxembourg': '42',
    'Malta': '93',
    'Netherlands': '47',
    'Norway': '49',
    'Poland': '53',
    'Portugal': '54',
    'Republic of Cyprus': '283',
    'Republic of Ireland': '19',
    'Romania': '55',
    'Slovak Republic': '59',
    'Slovenia': '60',
    'Spain': '62',
    'Sweden': '63'
  };
  
  return residenceMap[country] || '24'; // Default to Greece
}

export function getTypePolicyID(tripType: string, availablePolicyTypes?: TerracottaPolicyType[]): string {
  // If we have SOAP data, use it to find the correct TypePolicyID
  if (availablePolicyTypes && availablePolicyTypes.length > 0) {
    const policyType = availablePolicyTypes.find(pt => {
      const name = pt.TypePolicyName.toLowerCase();
      switch (tripType) {
        case 'single':
          return name.includes('single') && !name.includes('annual');
        case 'annual':
          return name.includes('annual') || name.includes('multi-trip');
        case 'longstay':
          return name.includes('longstay') || name.includes('long stay');
        case 'comprehensive':
          return name.includes('comprehensive');
        default:
          return false;
      }
    });
    
    if (policyType) {
      console.log(`✅ Found TypePolicyID ${policyType.TypePolicyID} for trip type '${tripType}' (${policyType.TypePolicyName})`);
      return policyType.TypePolicyID;
    }
  }
  
  // Fallback to hardcoded mappings if SOAP data not available
  console.log(`⚠️ Using fallback mapping for trip type '${tripType}'`);
  const policyMap: { [key: string]: string } = {
    'single': '2',        // Single Trip TypePolicyID
    'annual': '23',       // Annual Multi-Trip TypePolicyID
    'longstay': '3',      // Longstay TypePolicyID
    'comprehensive': '2'  // Use Single Trip as default
  };
  
  return policyMap[tripType] || '2'; // Default to Single Trip TypePolicyID
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTypePackageID(tripType: string): string {
  // Use correct Package IDs (not SchemaIDs)
  // Package IDs are typically 1, 2, 3, etc. for different coverage levels
  const packageMap: { [key: string]: string } = {
    'single': '1',        // Basic package for single trip
    'annual': '1',        // Basic package for annual
    'comprehensive': '2'  // Higher coverage package
  };
  
  return packageMap[tripType] || '1'; // Default to basic package
}

export function getAgebandID(age: number): number {
  // Map age to Terracotta Ageband ID
  if (age <= 17) return 1;
  if (age <= 30) return 2;
  if (age <= 40) return 3;
  if (age <= 50) return 4;
  if (age <= 60) return 5;
  if (age <= 70) return 6;
  return 7; // 70+
}

export function getTitleID(title: string): number {
  // Map title to Terracotta Title ID
  const titleMap: { [key: string]: number } = {
    'Mr': 1,
    'Mrs': 2,
    'Miss': 3,
    'Ms': 4,
    'Dr': 5,
    'Prof': 6
  };
  
  return titleMap[title] || 1; // Default to Mr
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCurrencyID(currency: string): number {
  // Map currency to Terracotta Currency ID
  const currencyMap: { [key: string]: number } = {
    'EUR': 1,
    'USD': 2,
    'GBP': 3,
    'CHF': 4
  };
  
  return currencyMap[currency] || 1; // Default to EUR
}

export default TerracottaService;
