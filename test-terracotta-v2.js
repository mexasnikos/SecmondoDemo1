const https = require('https');

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

// Test CheckUserProductResidence
async function testCheckUserProductResidence(residenceID, schemaID) {
  console.log(`\n=== Testing CheckUserProductResidence: Residence=${residenceID}, Schema=${schemaID} ===`);
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <CheckUserProductResidence xmlns="WS-IntegratedQuote">
      <userID>${USER_ID}</userID>
      <userCode>${USER_CODE}</userCode>
      <residenceID>${residenceID}</residenceID>
      <schemaID>${schemaID}</schemaID>
    </CheckUserProductResidence>
  </soap:Body>
</soap:Envelope>`;
  
  const result = await makeSoapRequest('CheckUserProductResidence', xml);
  console.log(result);
  return result;
}

// Test ProvideQuotationV2
async function testProvideQuotationV2(combo) {
  console.log(`\n=== Testing ProvideQuotationV2: ${JSON.stringify(combo)} ===`);
  
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ProvideQuotationV2 xmlns="WS-IntegratedQuote">
      <userID>${USER_ID}</userID>
      <userCode>${USER_CODE}</userCode>
      <quoteDetails>
        <ResidenceID>${combo.residenceID}</ResidenceID>
        <TypePolicyID>${combo.typePolicyID}</TypePolicyID>
        <TypePackageID>${combo.typePackageID}</TypePackageID>
        <Destination>${combo.destination}</Destination>
        <StartDate>${combo.startDate}</StartDate>
        <EndDate>${combo.endDate}</EndDate>
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
        <useCoverLevelUpsell>true</useCoverLevelUpsell>
        <quoteVisitAuditID>1703123456789</quoteVisitAuditID>
      </quoteDetails>
    </ProvideQuotationV2>
  </soap:Body>
</soap:Envelope>`;
  
  const result = await makeSoapRequest('ProvideQuotationV2', xml);
  
  if (result.includes('found 0 quotes')) {
    console.log('❌ No quotes found');
  } else if (result.includes('<quoteResults>') && !result.includes('<quoteResults />')) {
    console.log('✅ QUOTES FOUND!');
    console.log(result);
  } else {
    console.log('⚠️ Response:');
    console.log(result.substring(0, 500));
  }
  
  return result;
}

// Test minimal ProvideQuotation (without optional fields)
async function testMinimalProvideQuotation(combo) {
  console.log(`\n=== Testing Minimal ProvideQuotation: ${JSON.stringify(combo)} ===`);
  
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
        <Destination>${combo.destination}</Destination>
        <StartDate>${combo.startDate}</StartDate>
        <EndDate>${combo.endDate}</EndDate>
        <Travellers>
          <Traveller>
            <TravellerNumber>1</TravellerNumber>
            <DateOfBirth>1990/01/01</DateOfBirth>
            <Age>35</Age>
          </Traveller>
        </Travellers>
        <ContactDetails>
          <Email>test@example.com</Email>
        </ContactDetails>
      </quoteDetails>
    </ProvideQuotation>
  </soap:Body>
</soap:Envelope>`;
  
  const result = await makeSoapRequest('ProvideQuotation', xml);
  
  if (result.includes('found 0 quotes')) {
    console.log('❌ No quotes found');
  } else if (result.includes('<quoteResults>') && !result.includes('<quoteResults />')) {
    console.log('✅ QUOTES FOUND!');
    console.log(result);
  } else {
    console.log('⚠️ Response:');
    console.log(result.substring(0, 500));
  }
  
  return result;
}

// Main testing function
async function runTests() {
  try {
    const schemaIDs = [683, 717];
    const residenceIDs = [1, 2, 3, 4, 5, 10, 20, 38, 84, 100, 200, 217, 224];
    
    // Test CheckUserProductResidence for both schemas
    console.log('\n========== TESTING CheckUserProductResidence ==========');
    for (const schemaID of schemaIDs) {
      for (const resID of [1, 2, 3, 4, 5]) {
        await testCheckUserProductResidence(resID, schemaID);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    // Test minimal ProvideQuotation with various combinations
    console.log('\n========== TESTING Minimal ProvideQuotation ==========');
    const destinations = ['Europe', 'Worldwide', 'United Kingdom', 'USA', 'Spain', 'France', 'Germany'];
    
    for (const dest of destinations) {
      await testMinimalProvideQuotation({
        residenceID: 1,
        destination: dest,
        startDate: '2025/11/01',
        endDate: '2025/11/08'
      });
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Try different residence IDs with Europe
    for (const resID of [1, 2, 3, 4, 5, 38, 84, 217, 224]) {
      await testMinimalProvideQuotation({
        residenceID: resID,
        destination: 'Europe',
        startDate: '2025/11/01',
        endDate: '2025/11/08'
      });
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log('\n========== TESTING Complete ==========');
    
  } catch (error) {
    console.error('Error during testing:', error.message);
  }
}

// Run the tests
runTests();












