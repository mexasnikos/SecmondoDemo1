/**
 * Terracotta API Focused Parameter Test Tool
 * 
 * This tool tests specific parameter combinations that are most likely to work
 * based on the API documentation and your account setup.
 * 
 * Run with: node terracotta-focused-test.js
 */

const fetch = require('node-fetch');

const PROXY_BASE_URL = 'http://localhost:3001/api/terracotta';
const USER_ID = '4072';
const USER_CODE = '111427';

// Focused test combinations based on your account
const FOCUSED_TESTS = [
  // Test with different date ranges (current and future)
  { residenceID: 1, policyTypeID: 2, packageID: 1, destination: 'Europe', startDate: '2024/12/01', endDate: '2024/12/08', description: 'Single Trip - Europe - Dec 2024' },
  { residenceID: 1, policyTypeID: 2, packageID: 1, destination: 'Europe', startDate: '2025/01/01', endDate: '2025/01/08', description: 'Single Trip - Europe - Jan 2025' },
  { residenceID: 1, policyTypeID: 2, packageID: 1, destination: 'Europe', startDate: '2025/06/01', endDate: '2025/06/08', description: 'Single Trip - Europe - Jun 2025' },
  
  // Test with different destinations
  { residenceID: 1, policyTypeID: 2, packageID: 1, destination: 'Greece', startDate: '2025/06/01', endDate: '2025/06/08', description: 'Single Trip - Greece - Jun 2025' },
  { residenceID: 1, policyTypeID: 2, packageID: 1, destination: 'Germany', startDate: '2025/06/01', endDate: '2025/06/08', description: 'Single Trip - Germany - Jun 2025' },
  { residenceID: 1, policyTypeID: 2, packageID: 1, destination: 'Worldwide', startDate: '2025/06/01', endDate: '2025/06/08', description: 'Single Trip - Worldwide - Jun 2025' },
  
  // Test with different residence IDs
  { residenceID: 2, policyTypeID: 2, packageID: 1, destination: 'Europe', startDate: '2025/06/01', endDate: '2025/06/08', description: 'Single Trip - Europe - Residence 2' },
  { residenceID: 3, policyTypeID: 2, packageID: 1, destination: 'Europe', startDate: '2025/06/01', endDate: '2025/06/08', description: 'Single Trip - Europe - Residence 3' },
  
  // Test with different package IDs
  { residenceID: 1, policyTypeID: 2, packageID: 2, destination: 'Europe', startDate: '2025/06/01', endDate: '2025/06/08', description: 'Single Trip - Europe - Package 2' },
  { residenceID: 1, policyTypeID: 2, packageID: 3, destination: 'Europe', startDate: '2025/06/01', endDate: '2025/06/08', description: 'Single Trip - Europe - Package 3' },
  
  // Test with different traveler ages
  { residenceID: 1, policyTypeID: 2, packageID: 1, destination: 'Europe', startDate: '2025/06/01', endDate: '2025/06/08', travelerAge: 25, description: 'Single Trip - Europe - Age 25' },
  { residenceID: 1, policyTypeID: 2, packageID: 1, destination: 'Europe', startDate: '2025/06/01', endDate: '2025/06/08', travelerAge: 45, description: 'Single Trip - Europe - Age 45' },
  { residenceID: 1, policyTypeID: 2, packageID: 1, destination: 'Europe', startDate: '2025/06/01', endDate: '2025/06/08', travelerAge: 65, description: 'Single Trip - Europe - Age 65' },
  
  // Test with Annual Multi-Trip
  { residenceID: 1, policyTypeID: 23, packageID: 1, destination: 'Europe', startDate: '2025/06/01', endDate: '2025/06/08', description: 'Annual Multi-Trip - Europe' },
  { residenceID: 1, policyTypeID: 23, packageID: 1, destination: 'Worldwide', startDate: '2025/06/01', endDate: '2025/06/08', description: 'Annual Multi-Trip - Worldwide' },
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
function createSOAPEnvelope(test) {
  const age = test.travelerAge || 35;
  const birthYear = new Date().getFullYear() - age;
  const dateOfBirth = `${birthYear}/01/01`;
  const agebandID = Math.min(Math.floor(age / 10) + 1, 7);
  
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ProvideQuotation xmlns="WS-IntegratedQuote">
      <userID>${USER_ID}</userID>
      <userCode>${USER_CODE}</userCode>
      <quoteDetails>
        <ResidenceID>${test.residenceID}</ResidenceID>
        <TypePolicyID>${test.policyTypeID}</TypePolicyID>
        <TypePackageID>${test.packageID}</TypePackageID>
        <Destination>${test.destination}</Destination>
        <StartDate>${test.startDate}</StartDate>
        <EndDate>${test.endDate}</EndDate>
        <Travellers>
          <Traveller>
            <TravellerNumber>1</TravellerNumber>
            <Title>Mr</Title>
            <FirstName>John</FirstName>
            <LastName>Doe</LastName>
            <DateOfBirth>${dateOfBirth}</DateOfBirth>
            <Age>${age}</Age>
            <AgebandID>${agebandID}</AgebandID>
            <TitleID>1</TitleID>
            <minAge>${age}</minAge>
            <maxAge>${age}</maxAge>
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
        <includeAnnualQuotes>${test.policyTypeID === 23 ? 1 : 0}</includeAnnualQuotes>
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
async function testConfiguration(test, index) {
  console.log(`\n${index + 1}. Testing: ${test.description}`);
  console.log(`   Parameters: ResidenceID=${test.residenceID}, PolicyTypeID=${test.policyTypeID}, PackageID=${test.packageID}`);
  console.log(`   Destination: "${test.destination}", Dates: ${test.startDate} to ${test.endDate}`);
  if (test.travelerAge) {
    console.log(`   Traveler Age: ${test.travelerAge}`);
  }
  
  const soapBody = createSOAPEnvelope(test);
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
      
      return { ...test, success: true, quoteCount, prices };
    } else {
      console.log(`   ⚠️  No quotes found (but request was valid)`);
      return { ...test, success: false, quoteCount: 0 };
    }
  } else {
    console.log(`   ❌ ERROR: ${result.error || 'Request failed'}`);
    return { ...test, success: false, error: result.error };
  }
}

// Main execution
async function main() {
  console.log('🚀 Terracotta API Focused Parameter Test');
  console.log(`🔗 Testing against: ${PROXY_BASE_URL}`);
  console.log(`👤 Using credentials: ${USER_ID} / ${USER_CODE}`);
  console.log(`📋 Testing ${FOCUSED_TESTS.length} focused combinations...`);
  
  const results = [];
  let successCount = 0;
  
  for (let i = 0; i < FOCUSED_TESTS.length; i++) {
    const result = await testConfiguration(FOCUSED_TESTS[i], i);
    results.push(result);
    
    if (result.success) {
      successCount++;
    }
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Generate summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 FOCUSED TEST SUMMARY');
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
      if (combo.travelerAge) {
        console.log(`   Traveler Age: ${combo.travelerAge}`);
      }
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
    console.log('- The API might require specific parameter combinations not tested');
  }
  
  console.log('\n' + '='.repeat(80));
}

// Run the test
main().catch(console.error);



