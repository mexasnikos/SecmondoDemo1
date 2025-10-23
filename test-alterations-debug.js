/**
 * Debug script for ProvideQuotationWithAlterations
 * This script helps identify why the request returns "No Quotes Found"
 */

const { TerracottaService } = require('./src/services/terracottaService.ts');

async function testAlterations() {
  console.log('🔍 Testing ProvideQuotationWithAlterations...\n');
  
  const service = TerracottaService.getInstance();
  
  // Test 1: Corrected request based on official documentation
  console.log('📋 Test 1: Corrected request based on official documentation');
  const request1 = {
    userID: '4072',
    userCode: '111427',
    quoteID: '8547466', // Note: lowercase 'q' as per documentation
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
    console.log('Sending request...');
    const response1 = await service.provideQuotationWithAlterations(request1);
    console.log('✅ Response 1:', response1);
  } catch (error) {
    console.log('❌ Error 1:', error.message);
  }
  
  console.log('\n' + '='.repeat(80) + '\n');
  
  // Test 2: Try with single AlterationID
  console.log('📋 Test 2: Try with single AlterationID (39855 only)');
  const request2 = { ...request1 };
  request2.specificQuoteDetails.AlterationID = '39855';
  
  try {
    console.log('Sending request...');
    const response2 = await service.provideQuotationWithAlterations(request2);
    console.log('✅ Response 2:', response2);
  } catch (error) {
    console.log('❌ Error 2:', error.message);
  }
  
  console.log('\n' + '='.repeat(80) + '\n');
  
  // Test 3: Try with different AlterationID
  console.log('📋 Test 3: Try with different AlterationID (39794 only)');
  const request3 = { ...request1 };
  request3.specificQuoteDetails.AlterationID = '39794';
  
  try {
    console.log('Sending request...');
    const response3 = await service.provideQuotationWithAlterations(request3);
    console.log('✅ Response 3:', response3);
  } catch (error) {
    console.log('❌ Error 3:', error.message);
  }
  
  console.log('\n' + '='.repeat(80) + '\n');
  
  // Test 4: Try without AlterationID (regular ProvideQuotation)
  console.log('📋 Test 4: Try regular ProvideQuotation first to get a valid QuoteID');
  const regularRequest = {
    userID: '4072',
    userCode: '111427',
    quoteDetails: {
      ResidenceID: '6',
      TypePolicyID: '2',
      TypePackageID: '1',
      Destination: 'Domestic and European',
      StartDate: '2025/10/06',
      EndDate: '2025/10/24',
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
      },
      includeAnnualQuotes: 0,
      includeUpsell: 1,
      currencyID: 1,
      schemaIDFilter: '717'
    }
  };
  
  try {
    console.log('Sending regular ProvideQuotation...');
    const regularResponse = await service.provideQuotation(regularRequest);
    console.log('✅ Regular Response:', regularResponse);
    
    if (regularResponse.quoteResults && regularResponse.quoteResults.length > 0) {
      const validQuoteID = regularResponse.quoteResults[0].QuoteID;
      console.log(`\n📋 Test 5: Use valid QuoteID ${validQuoteID} with alterations`);
      
      const request5 = { ...request1 };
      request5.quoteID = validQuoteID;
      
      try {
        const response5 = await service.provideQuotationWithAlterations(request5);
        console.log('✅ Response 5:', response5);
      } catch (error) {
        console.log('❌ Error 5:', error.message);
      }
    }
  } catch (error) {
    console.log('❌ Regular Quote Error:', error.message);
  }
}

// Run the test
testAlterations().catch(console.error);
