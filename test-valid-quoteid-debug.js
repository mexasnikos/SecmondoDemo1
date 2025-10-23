/**
 * Test ProvideQuotationWithAlterations with valid quoteID
 */

const { TerracottaService } = require('./src/services/terracottaService.ts');

async function testWithValidQuoteID() {
  console.log('🔍 Testing ProvideQuotationWithAlterations with valid quoteID...\n');
  
  const service = TerracottaService.getInstance();
  
  // Test with your valid quoteID
  console.log('📋 Test: Using valid quoteID 8547484');
  const request = {
    userID: '4072',
    userCode: '111427',
    quoteID: '8547484', // Your valid quoteID
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
    console.log('Sending request with valid quoteID...');
    console.log('Request structure:', JSON.stringify(request, null, 2));
    
    const response = await service.provideQuotationWithAlterations(request);
    console.log('✅ SUCCESS! Response received:');
    console.log('Message:', response.Message);
    console.log('Number of quotes:', response.quoteResults?.length || 0);
    
    if (response.quoteResults && response.quoteResults.length > 0) {
      console.log('\n📊 Quote Results:');
      response.quoteResults.forEach((quote, index) => {
        console.log(`\nQuote ${index + 1}:`);
        console.log(`  QuoteID: ${quote.QuoteID}`);
        console.log(`  Policy Type: ${quote.policytypeName}`);
        console.log(`  Schema: ${quote.schemaName}`);
        console.log(`  Price: ${quote.GrossPrice} ${quote.currency}`);
        console.log(`  AlterationID: ${quote.AlterationID}`);
        console.log(`  Summary of Cover: ${quote.SI}`);
        console.log(`  Policy Wording: ${quote.PW}`);
      });
    } else {
      console.log('⚠️ No quote results returned');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Error details:', error);
  }
  
  console.log('\n' + '='.repeat(80) + '\n');
  
  // Test with single AlterationID
  console.log('📋 Test: Single AlterationID (39855 only)');
  const requestSingle = { ...request };
  requestSingle.specificQuoteDetails.AlterationID = '39855';
  
  try {
    console.log('Sending request with single AlterationID...');
    const responseSingle = await service.provideQuotationWithAlterations(requestSingle);
    console.log('✅ Single AlterationID Response:');
    console.log('Message:', responseSingle.Message);
    console.log('Number of quotes:', responseSingle.quoteResults?.length || 0);
  } catch (error) {
    console.log('❌ Single AlterationID Error:', error.message);
  }
}

// Run the test
testWithValidQuoteID().catch(console.error);








