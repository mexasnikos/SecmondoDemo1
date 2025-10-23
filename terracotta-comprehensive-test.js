/**
 * Terracotta API Comprehensive Parameter Test Tool
 * 
 * This tool tests various date ranges, traveler profiles, and parameter combinations
 * to find working configurations.
 * 
 * Run with: node terracotta-comprehensive-test.js
 */

const fetch = require('node-fetch');

const PROXY_BASE_URL = 'http://localhost:3001/api/terracotta';
const USER_ID = '4072';
const USER_CODE = '111427';

// Test different date ranges
const DATE_RANGES = [
  { start: '2024/12/01', end: '2024/12/08', description: 'December 2024' },
  { start: '2025/01/01', end: '2025/01/08', description: 'January 2025' },
  { start: '2025/06/01', end: '2025/06/08', description: 'June 2025' },
  { start: '2025/12/01', end: '2025/12/08', description: 'December 2025' },
  { start: '2026/01/01', end: '2026/01/08', description: 'January 2026' },
];

// Test different traveler profiles
const TRAVELER_PROFILES = [
  { age: 25, title: 'Mr', description: 'Young adult male' },
  { age: 35, title: 'Mrs', description: 'Adult female' },
  { age: 45, title: 'Mr', description: 'Middle-aged male' },
  { age: 55, title: 'Mrs', description: 'Senior female' },
  { age: 65, title: 'Mr', description: 'Senior male' },
];

// Test different destinations
const DESTINATIONS = [
  'Europe', 'Worldwide', 'Greece', 'Germany', 'France', 'Italy', 'Spain',
  'United Kingdom', 'Netherlands', 'Belgium', 'Austria', 'Switzerland',
  'United States', 'Canada', 'Australia', 'Asia', 'Africa'
];

// Helper function to make SOAP request
async function makeSOAPRequest(soapBody) {
  try {
    const response = await fetch(`${PROXY_BASE_URL}/ProvideQuotation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'WS-IntegratedQuote/ProvideQuotation'
      },
      body: soapBody
    });

    const responseText = await response.text();
    return { success: response.ok, response: responseText, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Helper function to create SOAP envelope
function createSOAPEnvelope(config) {
  const birthYear = new Date().getFullYear() - config.traveler.age;
  const dateOfBirth = `${birthYear}/01/01`;
  
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ProvideQuotation xmlns="WS-IntegratedQuote">
      <userID>${USER_ID}</userID>
      <userCode>${USER_CODE}</userCode>
      <quoteDetails>
        <ResidenceID>${config.residenceID}</ResidenceID>
        <TypePolicyID>${config.policyTypeID}</TypePolicyID>
        <TypePackageID>${config.packageID}</TypePackageID>
        <Destination>${config.destination}</Destination>
        <StartDate>${config.startDate}</StartDate>
        <EndDate>${config.endDate}</EndDate>
        <Travellers>
          <Traveller>
            <TravellerNumber>1</TravellerNumber>
            <Title>${config.traveler.title}</Title>
            <FirstName>John</FirstName>
            <LastName>Doe</LastName>
            <DateOfBirth>${dateOfBirth}</DateOfBirth>
            <Age>${config.traveler.age}</Age>
            <AgebandID>${Math.min(Math.floor(config.traveler.age / 10) + 1, 7)}</AgebandID>
            <TitleID>${config.traveler.title === 'Mr' ? 1 : 2}</TitleID>
            <minAge>${config.traveler.age}</minAge>
            <maxAge>${config.traveler.age}</maxAge>
            <AlterationID></AlterationID>
            <msPrice>0</msPrice>
            <msPriceExcIPT>0</msPriceExcIPT>
            <msConditions></msConditions>
            <ScreeningInformation xsi:nil="true" />
          </Traveller>
        </Travellers>
        <ContactDetails>
          <Address>123 Main Street</Address>
          <Postcode>12345</Postcode>
          <Email>test@example.com</Email>
          <Telephone>+30123456789</Telephone>
        </ContactDetails>
        <includeAnnualQuotes>${config.policyTypeID === 23 ? 1 : 0}</includeAnnualQuotes>
        <includeUpsell>1</includeUpsell>
        <isCYTI>false</isCYTI>
        <currencyID>1</currencyID>
        <groupPerProduct>false</groupPerProduct>
        <priceOrder>1</priceOrder>
        <schemaIDFilter>683,717</schemaIDFilter>
        <useCoverLevelUpsell>true</useCoverLevelUpsell>
        <sellOnBehalfOf>0</sellOnBehalfOf>
        <customerUniqueID>0</customerUniqueID>
        <quoteVisitAuditID>${Date.now()}</quoteVisitAuditID>
      </quoteDetails>
    </ProvideQuotation>
  </soap:Body>
</soap:Envelope>`;
}

// Test a single configuration
async function testConfiguration(config, index) {
  console.log(`\n${index + 1}. Testing: ${config.description}`);
  console.log(`   Parameters: ResidenceID=${config.residenceID}, PolicyTypeID=${config.policyTypeID}, PackageID=${config.packageID}`);
  console.log(`   Destination: "${config.destination}", Dates: ${config.startDate} to ${config.endDate}`);
  console.log(`   Traveler: ${config.traveler.description} (Age: ${config.traveler.age})`);
  
  const soapBody = createSOAPEnvelope(config);
  const result = await makeSOAPRequest(soapBody);
  
  if (result.success) {
    const hasQuotes = result.response.includes('<quoteResults>') && 
                     !result.response.includes('<quoteResults />');
    
    if (hasQuotes) {
      console.log(`   ✅ SUCCESS: Found quotes!`);
      
      // Try to extract quote details
      const quoteMatches = result.response.match(/<quoteResults>/g);
      const quoteCount = quoteMatches ? quoteMatches.length : 0;
      
      // Try to extract quote prices
      const priceMatches = result.response.match(/<GrossPrice>([0-9.]+)<\/GrossPrice>/g);
      const prices = priceMatches ? priceMatches.map(match => match.match(/[0-9.]+/)[0]) : [];
      
      console.log(`   📊 Quote count: ${quoteCount}`);
      if (prices.length > 0) {
        console.log(`   💰 Prices: ${prices.join(', ')}`);
      }
      
      return { ...config, success: true, quoteCount, prices };
    } else {
      console.log(`   ⚠️  No quotes found (but request was valid)`);
      return { ...config, success: false, quoteCount: 0 };
    }
  } else {
    console.log(`   ❌ ERROR: ${result.error || 'Request failed'}`);
    return { ...config, success: false, error: result.error };
  }
}

// Generate test configurations
function generateTestConfigurations() {
  const configurations = [];
  
  // Test with different date ranges and traveler profiles
  for (const dateRange of DATE_RANGES) {
    for (const traveler of TRAVELER_PROFILES) {
      for (const destination of DESTINATIONS.slice(0, 5)) { // Test first 5 destinations
        configurations.push({
          residenceID: 1,
          policyTypeID: 2, // Single Trip
          packageID: 1,
          destination,
          startDate: dateRange.start,
          endDate: dateRange.end,
          traveler,
          description: `Single Trip - ${destination} - ${dateRange.description} - ${traveler.description}`
        });
      }
    }
  }
  
  // Test with different residence IDs
  for (let residenceID = 1; residenceID <= 5; residenceID++) {
    configurations.push({
      residenceID,
      policyTypeID: 2,
      packageID: 1,
      destination: 'Europe',
      startDate: '2025/06/01',
      endDate: '2025/06/08',
      traveler: { age: 35, title: 'Mr', description: 'Adult male' },
      description: `Single Trip - Europe - June 2025 - Residence ${residenceID}`
    });
  }
  
  return configurations;
}

// Main execution
async function main() {
  console.log('🚀 Terracotta API Comprehensive Parameter Test');
  console.log(`🔗 Testing against: ${PROXY_BASE_URL}`);
  console.log(`👤 Using credentials: ${USER_ID} / ${USER_CODE}`);
  
  const configurations = generateTestConfigurations();
  console.log(`📋 Testing ${configurations.length} configurations...`);
  
  const results = [];
  let successCount = 0;
  
  for (let i = 0; i < configurations.length; i++) {
    const result = await testConfiguration(configurations[i], i);
    results.push(result);
    
    if (result.success) {
      successCount++;
    }
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Stop if we find some working combinations
    if (successCount >= 5) {
      console.log('\n🎉 Found 5 working combinations! Stopping early...');
      break;
    }
  }
  
  // Generate summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPREHENSIVE TEST SUMMARY');
  console.log('='.repeat(80));
  
  const successful = results.filter(r => r.success);
  const withQuotes = results.filter(r => r.quoteCount > 0);
  
  console.log(`\n✅ Successful requests: ${successful.length}/${results.length}`);
  console.log(`🎯 Requests with quotes: ${withQuotes.length}/${results.length}`);
  
  if (withQuotes.length > 0) {
    console.log('\n🎉 WORKING COMBINATIONS:');
    console.log('─'.repeat(40));
    withQuotes.forEach((combo, index) => {
      console.log(`${index + 1}. ${combo.description}`);
      console.log(`   ResidenceID: ${combo.residenceID}, PolicyTypeID: ${combo.policyTypeID}, PackageID: ${combo.packageID}`);
      console.log(`   Destination: "${combo.destination}", Dates: ${combo.startDate} to ${combo.endDate}`);
      console.log(`   Traveler: ${combo.traveler.description} (Age: ${combo.traveler.age})`);
      console.log(`   Quotes found: ${combo.quoteCount}`);
      if (combo.prices && combo.prices.length > 0) {
        console.log(`   Prices: ${combo.prices.join(', ')}`);
      }
      console.log('');
    });
    
    console.log('💡 RECOMMENDATION:');
    console.log('Use these working combinations in your application!');
  } else {
    console.log('\n⚠️  No working combinations found.');
    console.log('This indicates:');
    console.log('- Account restrictions or limitations');
    console.log('- Need to contact Terracotta support');
    console.log('- Possible API configuration issues');
  }
  
  console.log('\n' + '='.repeat(80));
}

// Run the test
main().catch(console.error);



