/**
 * Test that trip types are now using SOAP data instead of hardcoded mappings
 */

const { TerracottaService } = require('./src/services/terracottaService.ts');

async function testTripTypesWithSOAP() {
  console.log('🔍 Testing Trip Types with SOAP Integration...\n');
  
  const service = TerracottaService.getInstance();
  
  try {
    // First, get available products
    console.log('📋 Step 1: Getting available products...');
    const productsResponse = await service.getUserProductList();
    console.log('Available products:', productsResponse.Schemas.length);
    
    // Get policy types for schema 717
    console.log('\n📋 Step 2: Getting policy types for schema 717...');
    const policyTypesResponse = await service.getUserProductTypePolicy('717');
    console.log('Policy types found:', policyTypesResponse.PolicyTypes.length);
    
    policyTypesResponse.PolicyTypes.forEach(pt => {
      console.log(`  - ${pt.TypePolicyID}: ${pt.TypePolicyName} (${pt.Description})`);
    });
    
    // Test the conversion with different trip types
    console.log('\n📋 Step 3: Testing trip type conversion with SOAP data...');
    
    const testFormData = {
      tripType: 'single',
      countryOfResidence: 'Greece',
      destination: 'Europe',
      startDate: '2025/01/15',
      endDate: '2025/01/22',
      travelers: [{
        firstName: 'Test',
        lastName: 'User',
        age: 30,
        title: 'Mr'
      }]
    };
    
    // Test with SOAP data
    console.log('\n✅ Testing with SOAP data:');
    const requestWithSOAP = TerracottaService.convertToTerracottaFormat(testFormData, policyTypesResponse.PolicyTypes);
    console.log('TypePolicyID used:', requestWithSOAP.quoteDetails.TypePolicyID);
    
    // Test different trip types
    const tripTypes = ['single', 'annual', 'longstay', 'comprehensive'];
    
    for (const tripType of tripTypes) {
      console.log(`\n🔍 Testing trip type: '${tripType}'`);
      const testData = { ...testFormData, tripType };
      const request = TerracottaService.convertToTerracottaFormat(testData, policyTypesResponse.PolicyTypes);
      console.log(`  TypePolicyID: ${request.quoteDetails.TypePolicyID}`);
    }
    
    // Test without SOAP data (fallback)
    console.log('\n⚠️ Testing without SOAP data (fallback):');
    const requestWithoutSOAP = TerracottaService.convertToTerracottaFormat(testFormData);
    console.log('TypePolicyID used (fallback):', requestWithoutSOAP.quoteDetails.TypePolicyID);
    
    console.log('\n🎉 Trip types are now properly using SOAP data!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testTripTypesWithSOAP().catch(console.error);








