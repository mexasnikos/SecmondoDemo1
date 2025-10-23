/**
 * Terracotta API Quick Parameter Test Tool
 * 
 * This tool quickly tests specific parameter combinations
 * to find working configurations.
 * 
 * Run with: node terracotta-quick-test.js
 */

const fetch = require('node-fetch');

const PROXY_BASE_URL = 'http://localhost:3001/api/terracotta';
const USER_ID = '4072';
const USER_CODE = '111427';

// Quick test combinations
const TEST_COMBINATIONS = [
  // Test with different policy types
  { residenceID: 1, policyTypeID: 2, packageID: 1, destination: 'Europe', description: 'Single Trip - Europe' },
  { residenceID: 1, policyTypeID: 23, packageID: 1, destination: 'Europe', description: 'Annual Multi-Trip - Europe' },
  { residenceID: 1, policyTypeID: 3, packageID: 1, destination: 'Europe', description: 'Longstay - Europe' },
  
  // Test with different destinations
  { residenceID: 1, policyTypeID: 2, packageID: 1, destination: 'Worldwide', description: 'Single Trip - Worldwide' },
  { residenceID: 1, policyTypeID: 2, packageID: 1, destination: 'Greece', description: 'Single Trip - Greece' },
  { residenceID: 1, policyTypeID: 2, packageID: 1, destination: 'Germany', description: 'Single Trip - Germany' },
  
  // Test with different residence IDs
  { residenceID: 2, policyTypeID: 2, packageID: 1, destination: 'Europe', description: 'Single Trip - Residence 2' },
  { residenceID: 3, policyTypeID: 2, packageID: 1, destination: 'Europe', description: 'Single Trip - Residence 3' },
  
  // Test with different package IDs
  { residenceID: 1, policyTypeID: 2, packageID: 2, destination: 'Europe', description: 'Single Trip - Package 2' },
  { residenceID: 1, policyTypeID: 2, packageID: 3, destination: 'Europe', description: 'Single Trip - Package 3' },
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
function createSOAPEnvelope(combo) {
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ProvideQuotation xmlns="WS-IntegratedQuote">
      <userID>${USER_ID}</userID>
      <userCode>${USER_CODE}</userCode>
      <quoteDetails>
        <ResidenceID>${combo.residenceID}</ResidenceID>
        <TypePolicyID>${combo.policyTypeID}</TypePolicyID>
        <TypePackageID>${combo.packageID}</TypePackageID>
        <Destination>${combo.destination}</Destination>
        <StartDate>2025/10/01</StartDate>
        <EndDate>2025/10/08</EndDate>
        <Travellers>
          <Traveller>
            <TravellerNumber>1</TravellerNumber>
            <Title>Mr</Title>
            <FirstName>John</FirstName>
            <LastName>Doe</LastName>
            <DateOfBirth>1990/01/01</DateOfBirth>
            <Age>34</Age>
            <AgebandID>3</AgebandID>
            <TitleID>1</TitleID>
            <minAge>34</minAge>
            <maxAge>34</maxAge>
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
        <includeAnnualQuotes>${combo.policyTypeID === 23 ? 1 : 0}</includeAnnualQuotes>
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

// Test a single combination
async function testCombination(combo, index) {
  console.log(`\n${index + 1}. Testing: ${combo.description}`);
  console.log(`   Parameters: ResidenceID=${combo.residenceID}, PolicyTypeID=${combo.policyTypeID}, PackageID=${combo.packageID}, Destination="${combo.destination}"`);
  
  const soapBody = createSOAPEnvelope(combo);
  const result = await makeSOAPRequest(soapBody);
  
  if (result.success) {
    const hasQuotes = result.response.includes('<quoteResults>') && 
                     !result.response.includes('<quoteResults />');
    
    if (hasQuotes) {
      console.log(`   ✅ SUCCESS: Found quotes!`);
      
      // Try to extract quote count
      const quoteMatches = result.response.match(/<quoteResults>/g);
      const quoteCount = quoteMatches ? quoteMatches.length : 0;
      console.log(`   📊 Quote count: ${quoteCount}`);
      
      return { ...combo, success: true, quoteCount };
    } else {
      console.log(`   ⚠️  No quotes found (but request was valid)`);
      return { ...combo, success: false, quoteCount: 0 };
    }
  } else {
    console.log(`   ❌ ERROR: ${result.error || 'Request failed'}`);
    return { ...combo, success: false, error: result.error };
  }
}

// Main execution
async function main() {
  console.log('🚀 Terracotta API Quick Parameter Test');
  console.log(`🔗 Testing against: ${PROXY_BASE_URL}`);
  console.log(`👤 Using credentials: ${USER_ID} / ${USER_CODE}`);
  console.log(`📋 Testing ${TEST_COMBINATIONS.length} combinations...`);
  
  const results = [];
  
  for (let i = 0; i < TEST_COMBINATIONS.length; i++) {
    const result = await testCombination(TEST_COMBINATIONS[i], i);
    results.push(result);
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Generate summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 QUICK TEST SUMMARY');
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
      console.log(`   ResidenceID: ${combo.residenceID}, PolicyTypeID: ${combo.policyTypeID}, PackageID: ${combo.packageID}, Destination: "${combo.destination}"`);
      console.log(`   Quotes found: ${combo.quoteCount}`);
      console.log('');
    });
    
    console.log('💡 RECOMMENDATION:');
    console.log('Use these working combinations in your application!');
  } else {
    console.log('\n⚠️  No working combinations found.');
    console.log('This might indicate:');
    console.log('- Account restrictions');
    console.log('- Invalid parameter values');
    console.log('- Business logic limitations');
    console.log('- Need to contact Terracotta support');
  }
  
  console.log('\n' + '='.repeat(80));
}

// Run the test
main().catch(console.error);



