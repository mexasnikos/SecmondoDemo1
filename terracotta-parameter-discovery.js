/**
 * Terracotta API Parameter Discovery Tool
 * 
 * This tool systematically tests all possible parameter combinations
 * to discover valid values for the ProvideQuotation API.
 * 
 * Run with: node terracotta-parameter-discovery.js
 */

const fetch = require('node-fetch');

const PROXY_BASE_URL = 'http://localhost:3001/api/terracotta';
const USER_ID = '4072';
const USER_CODE = '111427';

// Test data sets
const RESIDENCE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const POLICY_TYPE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
const PACKAGE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const DESTINATIONS = [
  'Europe', 'Worldwide', 'Greece', 'Germany', 'France', 'Italy', 'Spain', 
  'United Kingdom', 'Netherlands', 'Belgium', 'Austria', 'Switzerland',
  'United States', 'Canada', 'Australia', 'Asia', 'Africa', 'South America',
  'North America', 'Oceania', 'Mediterranean', 'Schengen', 'EU'
];
const CURRENCY_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const AGEBAND_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const TITLE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Results storage
const results = {
  validResidenceIDs: [],
  validPolicyTypeIDs: [],
  validPackageIDs: [],
  validDestinations: [],
  validCurrencyIDs: [],
  validAgebandIDs: [],
  validTitleIDs: [],
  workingCombinations: [],
  errors: []
};

// Helper function to make SOAP request
async function makeSOAPRequest(method, soapBody) {
  try {
    const response = await fetch(`${PROXY_BASE_URL}/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': `WS-IntegratedQuote/${method}`
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
function createSOAPEnvelope(body) {
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    ${body}
  </soap:Body>
</soap:Envelope>`;
}

// Test GetUserProductList
async function testGetUserProductList() {
  console.log('🔍 Testing GetUserProductList...');
  
  const soapBody = `
    <GetUserProductList xmlns="WS-IntegratedQuote">
      <userID>${USER_ID}</userID>
      <userCode>${USER_CODE}</userCode>
    </GetUserProductList>`;

  const result = await makeSOAPRequest('GetUserProductList', soapBody);
  
  if (result.success) {
    console.log('✅ GetUserProductList successful');
    console.log('Response:', result.response);
    
    // Parse schemas from response
    const schemaMatches = result.response.match(/<SchemaID>(\d+)<\/SchemaID>/g);
    if (schemaMatches) {
      const schemas = schemaMatches.map(match => match.match(/\d+/)[0]);
      console.log('📋 Available Schemas:', schemas);
      return schemas;
    }
  } else {
    console.log('❌ GetUserProductList failed:', result.error || result.response);
  }
  
  return [];
}

// Test GetUserProductTypePolicy for each schema
async function testGetUserProductTypePolicy(schemas) {
  console.log('\n🔍 Testing GetUserProductTypePolicy for each schema...');
  
  for (const schemaId of schemas) {
    console.log(`\n📋 Testing Schema ${schemaId}...`);
    
    const soapBody = `
      <GetUserProductTypePolicy xmlns="WS-IntegratedQuote">
        <userID>${USER_ID}</userID>
        <userCode>${USER_CODE}</userCode>
        <schemaId>${schemaId}</schemaId>
      </GetUserProductTypePolicy>`;

    const result = await makeSOAPRequest('GetUserProductTypePolicy', soapBody);
    
    if (result.success) {
      console.log(`✅ Schema ${schemaId} policy types retrieved`);
      
      // Parse policy types from response
      const policyMatches = result.response.match(/<TypePolicyID>(\d+)<\/TypePolicyID>/g);
      if (policyMatches) {
        const policyTypes = policyMatches.map(match => match.match(/\d+/)[0]);
        console.log(`📋 Policy Types for Schema ${schemaId}:`, policyTypes);
        results.validPolicyTypeIDs.push(...policyTypes);
      }
    } else {
      console.log(`❌ Schema ${schemaId} failed:`, result.error || result.response);
    }
  }
}

// Test different Residence IDs
async function testResidenceIDs() {
  console.log('\n🔍 Testing different Residence IDs...');
  
  for (const residenceID of RESIDENCE_IDS) {
    const soapBody = createSOAPEnvelope(`
      <ProvideQuotation xmlns="WS-IntegratedQuote">
        <userID>${USER_ID}</userID>
        <userCode>${USER_CODE}</userCode>
        <quoteDetails>
          <ResidenceID>${residenceID}</ResidenceID>
          <TypePolicyID>2</TypePolicyID>
          <TypePackageID>1</TypePackageID>
          <Destination>Europe</Destination>
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
        </quoteDetails>
      </ProvideQuotation>`);

    const result = await makeSOAPRequest('ProvideQuotation', soapBody);
    
    if (result.success) {
      const hasQuotes = result.response.includes('<quoteResults>') && 
                       !result.response.includes('<quoteResults />');
      
      if (hasQuotes) {
        console.log(`✅ ResidenceID ${residenceID}: Found quotes!`);
        results.validResidenceIDs.push(residenceID);
        results.workingCombinations.push({
          residenceID,
          policyTypeID: 2,
          packageID: 1,
          destination: 'Europe',
          quotes: true
        });
      } else {
        console.log(`⚠️  ResidenceID ${residenceID}: No quotes (but valid)`);
      }
    } else {
      console.log(`❌ ResidenceID ${residenceID}: Error - ${result.error || 'Invalid'}`);
    }
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// Test different Destinations
async function testDestinations() {
  console.log('\n🔍 Testing different Destinations...');
  
  for (const destination of DESTINATIONS) {
    const soapBody = createSOAPEnvelope(`
      <ProvideQuotation xmlns="WS-IntegratedQuote">
        <userID>${USER_ID}</userID>
        <userCode>${USER_CODE}</userCode>
        <quoteDetails>
          <ResidenceID>1</ResidenceID>
          <TypePolicyID>2</TypePolicyID>
          <TypePackageID>1</TypePackageID>
          <Destination>${destination}</Destination>
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
        </quoteDetails>
      </ProvideQuotation>`);

    const result = await makeSOAPRequest('ProvideQuotation', soapBody);
    
    if (result.success) {
      const hasQuotes = result.response.includes('<quoteResults>') && 
                       !result.response.includes('<quoteResults />');
      
      if (hasQuotes) {
        console.log(`✅ Destination "${destination}": Found quotes!`);
        results.validDestinations.push(destination);
        results.workingCombinations.push({
          residenceID: 1,
          policyTypeID: 2,
          packageID: 1,
          destination,
          quotes: true
        });
      } else {
        console.log(`⚠️  Destination "${destination}": No quotes (but valid)`);
      }
    } else {
      console.log(`❌ Destination "${destination}": Error - ${result.error || 'Invalid'}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// Test different Package IDs
async function testPackageIDs() {
  console.log('\n🔍 Testing different Package IDs...');
  
  for (const packageID of PACKAGE_IDS) {
    const soapBody = createSOAPEnvelope(`
      <ProvideQuotation xmlns="WS-IntegratedQuote">
        <userID>${USER_ID}</userID>
        <userCode>${USER_CODE}</userCode>
        <quoteDetails>
          <ResidenceID>1</ResidenceID>
          <TypePolicyID>2</TypePolicyID>
          <TypePackageID>${packageID}</TypePackageID>
          <Destination>Europe</Destination>
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
        </quoteDetails>
      </ProvideQuotation>`);

    const result = await makeSOAPRequest('ProvideQuotation', soapBody);
    
    if (result.success) {
      const hasQuotes = result.response.includes('<quoteResults>') && 
                       !result.response.includes('<quoteResults />');
      
      if (hasQuotes) {
        console.log(`✅ PackageID ${packageID}: Found quotes!`);
        results.validPackageIDs.push(packageID);
        results.workingCombinations.push({
          residenceID: 1,
          policyTypeID: 2,
          packageID,
          destination: 'Europe',
          quotes: true
        });
      } else {
        console.log(`⚠️  PackageID ${packageID}: No quotes (but valid)`);
      }
    } else {
      console.log(`❌ PackageID ${packageID}: Error - ${result.error || 'Invalid'}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// Generate comprehensive report
function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 TERRACOTTA API PARAMETER DISCOVERY REPORT');
  console.log('='.repeat(80));
  
  console.log('\n✅ VALID PARAMETERS FOUND:');
  console.log('─'.repeat(40));
  
  if (results.validResidenceIDs.length > 0) {
    console.log(`\n🏠 Valid Residence IDs: ${results.validResidenceIDs.join(', ')}`);
  }
  
  if (results.validPolicyTypeIDs.length > 0) {
    console.log(`\n📋 Valid Policy Type IDs: ${results.validPolicyTypeIDs.join(', ')}`);
  }
  
  if (results.validPackageIDs.length > 0) {
    console.log(`\n📦 Valid Package IDs: ${results.validPackageIDs.join(', ')}`);
  }
  
  if (results.validDestinations.length > 0) {
    console.log(`\n🌍 Valid Destinations: ${results.validDestinations.join(', ')}`);
  }
  
  if (results.workingCombinations.length > 0) {
    console.log('\n🎯 WORKING COMBINATIONS:');
    console.log('─'.repeat(40));
    results.workingCombinations.forEach((combo, index) => {
      console.log(`${index + 1}. ResidenceID: ${combo.residenceID}, PolicyTypeID: ${combo.policyTypeID}, PackageID: ${combo.packageID}, Destination: "${combo.destination}"`);
    });
  }
  
  console.log('\n📝 RECOMMENDATIONS:');
  console.log('─'.repeat(40));
  console.log('1. Use the working combinations above in your application');
  console.log('2. Test with different date ranges for the working combinations');
  console.log('3. Test with different traveler ages and profiles');
  console.log('4. Contact Terracotta support if you need more parameter combinations');
  
  console.log('\n' + '='.repeat(80));
}

// Main execution
async function main() {
  console.log('🚀 Starting Terracotta API Parameter Discovery...');
  console.log(`🔗 Testing against: ${PROXY_BASE_URL}`);
  console.log(`👤 Using credentials: ${USER_ID} / ${USER_CODE}`);
  
  try {
    // Step 1: Get available products and policy types
    const schemas = await testGetUserProductList();
    if (schemas.length > 0) {
      await testGetUserProductTypePolicy(schemas);
    }
    
    // Step 2: Test different parameter combinations
    await testResidenceIDs();
    await testDestinations();
    await testPackageIDs();
    
    // Step 3: Generate report
    generateReport();
    
  } catch (error) {
    console.error('❌ Discovery failed:', error);
  }
}

// Run the discovery
main();



