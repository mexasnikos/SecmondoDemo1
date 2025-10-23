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

// Test GetUserProductResidence
async function testGetUserProductResidence() {
  console.log('\n=== Testing GetUserProductResidence ===');
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetUserProductResidence xmlns="WS-IntegratedQuote">
      <userID>${USER_ID}</userID>
      <userCode>${USER_CODE}</userCode>
    </GetUserProductResidence>
  </soap:Body>
</soap:Envelope>`;
  
  const result = await makeSoapRequest('GetUserProductResidence', xml);
  console.log(result);
  return result;
}

// Test GetUserProductTypePolicy for a given residenceID
async function testGetUserProductTypePolicy(residenceID) {
  console.log(`\n=== Testing GetUserProductTypePolicy for Residence=${residenceID} ===`);
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetUserProductTypePolicy xmlns="WS-IntegratedQuote">
      <userID>${USER_ID}</userID>
      <userCode>${USER_CODE}</userCode>
      <residenceID>${residenceID}</residenceID>
    </GetUserProductTypePolicy>
  </soap:Body>
</soap:Envelope>`;
  
  const result = await makeSoapRequest('GetUserProductTypePolicy', xml);
  console.log(result);
  return result;
}

// Test GetUserProductTypePackage
async function testGetUserProductTypePackage(residenceID, typePolicyID) {
  console.log(`\n=== Testing GetUserProductTypePackage for Residence=${residenceID}, Policy=${typePolicyID} ===`);
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetUserProductTypePackage xmlns="WS-IntegratedQuote">
      <userID>${USER_ID}</userID>
      <userCode>${USER_CODE}</userCode>
      <residenceID>${residenceID}</residenceID>
      <typePolicyID>${typePolicyID}</typePolicyID>
    </GetUserProductTypePackage>
  </soap:Body>
</soap:Envelope>`;
  
  const result = await makeSoapRequest('GetUserProductTypePackage', xml);
  console.log(result);
  return result;
}

// Test GetUserProductDestination
async function testGetUserProductDestination(residenceID, typePolicyID, typePackageID) {
  console.log(`\n=== Testing GetUserProductDestination for Residence=${residenceID}, Policy=${typePolicyID}, Package=${typePackageID} ===`);
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetUserProductDestination xmlns="WS-IntegratedQuote">
      <userID>${USER_ID}</userID>
      <userCode>${USER_CODE}</userCode>
      <residenceID>${residenceID}</residenceID>
      <typePolicyID>${typePolicyID}</typePolicyID>
      <typePackageID>${typePackageID}</typePackageID>
    </GetUserProductDestination>
  </soap:Body>
</soap:Envelope>`;
  
  const result = await makeSoapRequest('GetUserProductDestination', xml);
  console.log(result);
  return result;
}

// Main testing function
async function runTests() {
  try {
    // Get valid residences
    await testGetUserProductResidence();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test with common residence IDs
    const residenceIDs = [1, 2, 3, 4, 5];
    
    for (const resID of residenceIDs) {
      await testGetUserProductTypePolicy(resID);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Test common combinations
    await testGetUserProductTypePackage(1, 1);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testGetUserProductDestination(1, 1, 1);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('\n=== Parameter Discovery Complete ===');
    
  } catch (error) {
    console.error('Error during testing:', error.message);
  }
}

// Run the tests
runTests();












