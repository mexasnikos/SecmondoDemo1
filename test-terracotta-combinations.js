const https = require('https');

const TERRACOTTA_URL = 'https://asuauat.terracottatest.com/ws/integratedquote.asmx';
const USER_ID = '4072';
const USER_CODE = '111427';

// Helper function to make SOAP request
async function makeSoapRequest(soapAction, xmlBody) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'asuauat.terracottatest.com',
      port: 443,
      path: '/ws/integratedquote.asmx',
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': `WS-IntegratedQuote/${soapAction}`,
        'Content-Length': Buffer.byteLength(xmlBody)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    });

    req.on('error', (error) => { reject(error); });
    req.write(xmlBody);
    req.end();
  });
}

// Test GetUserProductList
async function testGetUserProductList() {
  console.log('\n=== Testing GetUserProductList ===');
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetUserProductList xmlns="WS-IntegratedQuote">
      <userID>${USER_ID}</userID>
      <userCode>${USER_CODE}</userCode>
    </GetUserProductList>
  </soap:Body>
</soap:Envelope>`;
  
  const result = await makeSoapRequest('GetUserProductList', xml);
  console.log(result);
  return result;
}

// Test ProvideQuotation with different combinations
async function testProvideQuotation(combo) {
  console.log(`\n=== Testing Combination: Residence=${combo.residenceID}, Policy=${combo.typePolicyID}, Package=${combo.typePackageID}, Destination=${combo.destination} ===`);
  
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ProvideQuotation xmlns="WS-IntegratedQuote">
      <userID>${USER_ID}</userID>
      <userCode>${USER_CODE}</userCode>
      <quoteDetails>
        <ResidenceID>${combo.residenceID}</ResidenceID>
        <TypePolicyID>${combo.typePolicyID}</TypePolicyID>
        <TypePackageID>${combo.typePackageID}</TypePackageID>
        <Destination>${combo.destination}</Destination>
        <StartDate>2025/10/15</StartDate>
        <EndDate>2025/10/22</EndDate>
        <Travellers>
          <Traveller>
            <TravellerNumber>1</TravellerNumber>
            <Title>Mr</Title>
            <FirstName>John</FirstName>
            <LastName>Doe</LastName>
            <DateOfBirth>1990/01/01</DateOfBirth>
            <Age>35</Age>
            <AgebandID>3</AgebandID>
            <TitleID>1</TitleID>
            <minAge>35</minAge>
            <maxAge>35</maxAge>
            <ScreeningInformation xsi:nil="true" />
          </Traveller>
        </Travellers>
        <ContactDetails>
          <Address>123 Main Street</Address>
          <Postcode>12345</Postcode>
          <Email>test@example.com</Email>
          <Telephone>+30123456789</Telephone>
        </ContactDetails>
        <includeAnnualQuotes>1</includeAnnualQuotes>
        <includeUpsell>1</includeUpsell>
        <currencyID>1</currencyID>
        <groupPerProduct>false</groupPerProduct>
        <priceOrder>1</priceOrder>
        ${combo.schemaIDFilter ? `<schemaIDFilter>${combo.schemaIDFilter}</schemaIDFilter>` : ''}
        <useCoverLevelUpsell>true</useCoverLevelUpsell>
        <quoteVisitAuditID>1703123456789</quoteVisitAuditID>
      </quoteDetails>
    </ProvideQuotation>
  </soap:Body>
</soap:Envelope>`;
  
  const result = await makeSoapRequest('ProvideQuotation', xml);
  
  // Check if we got quotes
  if (result.includes('found 0 quotes')) {
    console.log('❌ No quotes found');
  } else if (result.includes('<quoteResults>')) {
    console.log('✅ QUOTES FOUND!');
    console.log(result);
  } else {
    console.log('⚠️ Unexpected response:');
    console.log(result);
  }
  
  return result;
}

// Main testing function
async function runTests() {
  try {
    // First, try to get the product list
    await testGetUserProductList();
    
    // Test various combinations
    const combinations = [
      // Basic combinations
      { residenceID: 1, typePolicyID: 1, typePackageID: 1, destination: 'Europe' },
      { residenceID: 1, typePolicyID: 1, typePackageID: 1, destination: 'Worldwide' },
      { residenceID: 1, typePolicyID: 2, typePackageID: 1, destination: 'Europe' },
      { residenceID: 1, typePolicyID: 2, typePackageID: 2, destination: 'Europe' },
      
      // ResidenceID 2 combinations
      { residenceID: 2, typePolicyID: 1, typePackageID: 1, destination: 'Europe' },
      { residenceID: 2, typePolicyID: 717, typePackageID: 717, destination: 'Worldwide', schemaIDFilter: '683,717' },
      
      // Common policy type 717
      { residenceID: 1, typePolicyID: 717, typePackageID: 717, destination: 'Europe', schemaIDFilter: '717' },
      { residenceID: 1, typePolicyID: 717, typePackageID: 717, destination: 'Worldwide', schemaIDFilter: '717' },
      
      // Try without schemaIDFilter
      { residenceID: 1, typePolicyID: 1, typePackageID: 1, destination: 'Europe', schemaIDFilter: '' },
      { residenceID: 2, typePolicyID: 1, typePackageID: 1, destination: 'Europe', schemaIDFilter: '' },
      
      // More ResidenceID variations
      { residenceID: 3, typePolicyID: 1, typePackageID: 1, destination: 'Europe' },
      { residenceID: 4, typePolicyID: 1, typePackageID: 1, destination: 'Europe' },
    ];
    
    for (const combo of combinations) {
      await testProvideQuotation(combo);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n=== Testing Complete ===');
    
  } catch (error) {
    console.error('Error during testing:', error.message);
  }
}

// Run the tests
runTests();

