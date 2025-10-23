/**
 * Terracotta API WSDL-Based Parameter Discovery Tool
 * 
 * This tool uses the WSDL discovery methods to find valid parameter values
 * for the ProvideQuotation API.
 * 
 * Run with: node terracotta-wsdl-discovery.js
 */

const fetch = require('node-fetch');

const PROXY_BASE_URL = 'http://localhost:3001/api/terracotta';
const USER_ID = '4072';
const USER_CODE = '111427';

// Results storage
const results = {
  validResidences: [],
  validDestinations: [],
  validPackages: [],
  workingCombinations: []
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

// Get valid residences for each schema
async function getValidResidences() {
  console.log('🔍 Getting valid residences for each schema...');
  
  const schemas = [683, 717]; // Your available schemas
  
  for (const schemaId of schemas) {
    console.log(`\n📋 Testing Schema ${schemaId}...`);
    
    const soapBody = `
      <GetUserProductResidence xmlns="WS-IntegratedQuote">
        <userID>${USER_ID}</userID>
        <userCode>${USER_CODE}</userCode>
        <schemaId>${schemaId}</schemaId>
      </GetUserProductResidence>`;

    const result = await makeSOAPRequest('GetUserProductResidence', soapBody);
    
    if (result.success) {
      console.log(`✅ Schema ${schemaId} residences retrieved`);
      
      // Parse residences from response
      const residenceMatches = result.response.match(/<ResidenceID>(\d+)<\/ResidenceID>/g);
      const nameMatches = result.response.match(/<Name>([^<]+)<\/Name>/g);
      
      if (residenceMatches && nameMatches) {
        const residences = residenceMatches.map((match, index) => ({
          id: match.match(/\d+/)[0],
          name: nameMatches[index] ? nameMatches[index].replace(/<\/?Name>/g, '') : 'Unknown'
        }));
        
        console.log(`📋 Residences for Schema ${schemaId}:`, residences);
        results.validResidences.push(...residences);
      }
    } else {
      console.log(`❌ Schema ${schemaId} failed:`, result.error || result.response);
    }
  }
}

// Get valid destinations for each schema
async function getValidDestinations() {
  console.log('\n🔍 Getting valid destinations for each schema...');
  
  const schemas = [683, 717]; // Your available schemas
  
  for (const schemaId of schemas) {
    console.log(`\n📋 Testing Schema ${schemaId}...`);
    
    const soapBody = `
      <GetUserProductDestination xmlns="WS-IntegratedQuote">
        <userID>${USER_ID}</userCode>
        <userCode>${USER_CODE}</userCode>
        <schemaId>${schemaId}</schemaId>
      </GetUserProductDestination>`;

    const result = await makeSOAPRequest('GetUserProductDestination', soapBody);
    
    if (result.success) {
      console.log(`✅ Schema ${schemaId} destinations retrieved`);
      
      // Parse destinations from response
      const destinationMatches = result.response.match(/<DestinationID>(\d+)<\/DestinationID>/g);
      const nameMatches = result.response.match(/<Name>([^<]+)<\/Name>/g);
      
      if (destinationMatches && nameMatches) {
        const destinations = destinationMatches.map((match, index) => ({
          id: match.match(/\d+/)[0],
          name: nameMatches[index] ? nameMatches[index].replace(/<\/?Name>/g, '') : 'Unknown'
        }));
        
        console.log(`📋 Destinations for Schema ${schemaId}:`, destinations);
        results.validDestinations.push(...destinations);
      }
    } else {
      console.log(`❌ Schema ${schemaId} failed:`, result.error || result.response);
    }
  }
}

// Get valid packages for each schema
async function getValidPackages() {
  console.log('\n🔍 Getting valid packages for each schema...');
  
  const schemas = [683, 717]; // Your available schemas
  
  for (const schemaId of schemas) {
    console.log(`\n📋 Testing Schema ${schemaId}...`);
    
    const soapBody = `
      <GetUserProductTypePackage xmlns="WS-IntegratedQuote">
        <userID>${USER_ID}</userID>
        <userCode>${USER_CODE}</userCode>
        <schemaId>${schemaId}</schemaId>
      </GetUserProductTypePackage>`;

    const result = await makeSOAPRequest('GetUserProductTypePackage', soapBody);
    
    if (result.success) {
      console.log(`✅ Schema ${schemaId} packages retrieved`);
      
      // Parse packages from response
      const packageMatches = result.response.match(/<TypePackageID>(\d+)<\/TypePackageID>/g);
      const nameMatches = result.response.match(/<Name>([^<]+)<\/Name>/g);
      
      if (packageMatches && nameMatches) {
        const packages = packageMatches.map((match, index) => ({
          id: match.match(/\d+/)[0],
          name: nameMatches[index] ? nameMatches[index].replace(/<\/?Name>/g, '') : 'Unknown'
        }));
        
        console.log(`📋 Packages for Schema ${schemaId}:`, packages);
        results.validPackages.push(...packages);
      }
    } else {
      console.log(`❌ Schema ${schemaId} failed:`, result.error || result.response);
    }
  }
}

// Test ProvideQuotation with discovered parameters
async function testProvideQuotation() {
  console.log('\n🔍 Testing ProvideQuotation with discovered parameters...');
  
  // Use the first valid residence, destination, and package
  const residence = results.validResidences[0];
  const destination = results.validDestinations[0];
  const package_ = results.validPackages[0];
  
  if (!residence || !destination || !package_) {
    console.log('❌ Missing required parameters for testing');
    return;
  }
  
  console.log(`\n📋 Testing with:`);
  console.log(`   Residence: ${residence.name} (ID: ${residence.id})`);
  console.log(`   Destination: ${destination.name} (ID: ${destination.id})`);
  console.log(`   Package: ${package_.name} (ID: ${package_.id})`);
  
  const soapBody = createSOAPEnvelope(`
    <ProvideQuotation xmlns="WS-IntegratedQuote">
      <userID>${USER_ID}</userID>
      <userCode>${USER_CODE}</userCode>
      <quoteDetails>
        <ResidenceID>${residence.id}</ResidenceID>
        <TypePolicyID>2</TypePolicyID>
        <TypePackageID>${package_.id}</TypePackageID>
        <Destination>${destination.name}</Destination>
        <StartDate>2025/06/01</StartDate>
        <EndDate>2025/06/08</EndDate>
        <Travellers>
          <Traveller>
            <TravellerNumber>1</TravellerNumber>
            <Title>Mr</Title>
            <FirstName>John</FirstName>
            <LastName>Doe</LastName>
            <DateOfBirth>1990/01/01</DateOfBirth>
            <Age>35</Age>
            <AgebandID>4</AgebandID>
            <TitleID>1</TitleID>
            <minAge>35</minAge>
            <maxAge>35</maxAge>
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
        <includeAnnualQuotes>0</includeAnnualQuotes>
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
    </ProvideQuotation>`);

  const result = await makeSOAPRequest('ProvideQuotation', soapBody);
  
  if (result.success) {
    const hasQuotes = result.response.includes('<quoteResults>') && 
                     !result.response.includes('<quoteResults />');
    
    if (hasQuotes) {
      console.log(`✅ SUCCESS: Found quotes!`);
      
      // Try to extract quote details
      const quoteMatches = result.response.match(/<quoteResults>/g);
      const quoteCount = quoteMatches ? quoteMatches.length : 0;
      
      // Try to extract quote prices
      const priceMatches = result.response.match(/<GrossPrice>([0-9.]+)<\/GrossPrice>/g);
      const prices = priceMatches ? priceMatches.map(match => match.match(/[0-9.]+/)[0]) : [];
      
      console.log(`📊 Quote count: ${quoteCount}`);
      if (prices.length > 0) {
        console.log(`💰 Prices: ${prices.join(', ')}`);
      }
      
      results.workingCombinations.push({
        residence: residence.name,
        residenceID: residence.id,
        destination: destination.name,
        destinationID: destination.id,
        package: package_.name,
        packageID: package_.id,
        policyTypeID: 2,
        quoteCount,
        prices
      });
    } else {
      console.log(`⚠️  No quotes found (but request was valid)`);
    }
  } else {
    console.log(`❌ ERROR: ${result.error || 'Request failed'}`);
  }
}

// Generate comprehensive report
function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 TERRACOTTA WSDL-BASED PARAMETER DISCOVERY REPORT');
  console.log('='.repeat(80));
  
  console.log('\n✅ DISCOVERED PARAMETERS:');
  console.log('─'.repeat(40));
  
  if (results.validResidences.length > 0) {
    console.log(`\n🏠 Valid Residences:`);
    results.validResidences.forEach((res, index) => {
      console.log(`   ${index + 1}. ${res.name} (ID: ${res.id})`);
    });
  }
  
  if (results.validDestinations.length > 0) {
    console.log(`\n🌍 Valid Destinations:`);
    results.validDestinations.forEach((dest, index) => {
      console.log(`   ${index + 1}. ${dest.name} (ID: ${dest.id})`);
    });
  }
  
  if (results.validPackages.length > 0) {
    console.log(`\n📦 Valid Packages:`);
    results.validPackages.forEach((pkg, index) => {
      console.log(`   ${index + 1}. ${pkg.name} (ID: ${pkg.id})`);
    });
  }
  
  if (results.workingCombinations.length > 0) {
    console.log('\n🎯 WORKING COMBINATIONS:');
    console.log('─'.repeat(40));
    results.workingCombinations.forEach((combo, index) => {
      console.log(`${index + 1}. ${combo.residence} → ${combo.destination} (${combo.package})`);
      console.log(`   ResidenceID: ${combo.residenceID}, DestinationID: ${combo.destinationID}, PackageID: ${combo.packageID}`);
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
    console.log('This might indicate account restrictions or the need to contact Terracotta support.');
  }
  
  console.log('\n' + '='.repeat(80));
}

// Main execution
async function main() {
  console.log('🚀 Starting Terracotta WSDL-Based Parameter Discovery...');
  console.log(`🔗 Testing against: ${PROXY_BASE_URL}`);
  console.log(`👤 Using credentials: ${USER_ID} / ${USER_CODE}`);
  
  try {
    // Step 1: Get valid parameters using WSDL discovery methods
    await getValidResidences();
    await getValidDestinations();
    await getValidPackages();
    
    // Step 2: Test ProvideQuotation with discovered parameters
    if (results.validResidences.length > 0 && 
        results.validDestinations.length > 0 && 
        results.validPackages.length > 0) {
      await testProvideQuotation();
    }
    
    // Step 3: Generate report
    generateReport();
    
  } catch (error) {
    console.error('❌ Discovery failed:', error);
  }
}

// Run the discovery
main();



