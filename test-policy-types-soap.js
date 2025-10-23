/**
 * Test the GetUserProductTypePolicy SOAP request to see actual policy type names
 */

const { TerracottaService } = require('./src/services/terracottaService.ts');

async function testPolicyTypesSOAP() {
  console.log('🔍 Testing GetUserProductTypePolicy SOAP Request...\n');
  
  const service = TerracottaService.getInstance();
  
  try {
    console.log('📋 Making SOAP request to GetUserProductTypePolicy...');
    console.log('Request details:');
    console.log('  userID: 4072');
    console.log('  userCode: 111427');
    console.log('  schemaId: 717');
    console.log('');
    
    const response = await service.getUserProductTypePolicy('717');
    
    console.log('✅ SOAP Response received:');
    console.log('Message:', response.Message);
    console.log('ResultID:', response.ResultID);
    console.log('Number of policy types:', response.PolicyTypes.length);
    console.log('');
    
    console.log('📊 Policy Types from SOAP:');
    console.log('='.repeat(60));
    
    response.PolicyTypes.forEach((policyType, index) => {
      console.log(`${index + 1}. TypePolicyID: ${policyType.TypePolicyID}`);
      console.log(`   TypePolicyName: "${policyType.TypePolicyName}"`);
      console.log(`   Description: ${policyType.Description || 'N/A'}`);
      console.log('');
    });
    
    console.log('🎯 These are the actual policy type names that should be displayed in the UI!');
    
    // Test how they would be mapped to trip types
    console.log('\n🔍 Trip Type Mapping:');
    console.log('='.repeat(40));
    
    response.PolicyTypes.forEach(policyType => {
      const name = policyType.TypePolicyName.toLowerCase();
      let tripTypeValue = 'single';
      
      if (name.includes('annual')) {
        tripTypeValue = 'annual';
      } else if (name.includes('comprehensive')) {
        tripTypeValue = 'comprehensive';
      } else if (name.includes('longstay') || name.includes('long stay')) {
        tripTypeValue = 'longstay';
      }
      
      console.log(`"${policyType.TypePolicyName}" → tripType: '${tripTypeValue}'`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testPolicyTypesSOAP().catch(console.error);








