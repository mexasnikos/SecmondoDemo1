/**
 * Test the SOAP request structure for ProvideQuotationWithAlterations
 */

const { TerracottaService } = require('./src/services/terracottaService.ts');

async function testSOAPStructure() {
  console.log('🔍 Testing SOAP request structure...\n');
  
  const service = TerracottaService.getInstance();
  
  // Create the request object
  const request = {
    userID: '4072',
    userCode: '111427',
    quoteID: '8547484',
    specificQuoteDetails: {
      AlterationID: '39855,39794',
      Travellers: [{
        TravellerNumber: 1,
        Title: 'Mr',
        FirstName: 'ΣΑΡΑ',
        LastName: 'ΜΟΡΤΕΝΣΕΝ',
        DateOfBirth: '2000/05/20',
        Age: 25,
        AgebandID: 22989,
        TitleID: 1,
        minAge: 18,
        maxAge: 55,
        AlterationID: '',
        msPrice: 0,
        msPriceExcIPT: 0,
        msConditions: '',
        ScreeningInformation: null
      }],
      ContactDetails: {
        Address: '123 Main Street',
        Postcode: '12345',
        Email: 'sara.mansola@gmail.com',
        Telephone: '+496977772100'
      }
    }
  };
  
  try {
    console.log('📤 Generated SOAP Request:');
    console.log('='.repeat(60));
    
    // This will show us the exact SOAP structure being generated
    const response = await service.provideQuotationWithAlterations(request);
    
    console.log('📥 Response received successfully!');
    console.log('Response:', response);
    
  } catch (error) {
    console.log('❌ Error occurred:');
    console.log('Error message:', error.message);
    console.log('Error type:', error.constructor.name);
    
    // Even if there's an error, we can see the SOAP structure in the logs
    console.log('\n📋 Check the console logs above for the generated SOAP request structure');
  }
}

// Run the test
testSOAPStructure().catch(console.error);








