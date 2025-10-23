/**
 * Simple test to parse the SOAP response manually
 */

// Your actual SOAP response (first 500 chars shown)
const soapResponse = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body><ProvideQuotationWithAlterationsResponse xmlns="WS-IntegratedQuote"><ProvideQuotationWithAlterationsResult><message>Web service found 1 quotes for your details</message><errorID>0</errorID><quoteResults><quoteResults><QuoteID>8547484</QuoteID><schemaName>KTRM Travel Insurance 2025`;

// Simple regex-based parser
function parseSOAPResponse(xmlText) {
  console.log('🔍 Parsing SOAP Response...\n');
  
  // Extract message
  const messageMatch = xmlText.match(/<message>(.*?)<\/message>/);
  const message = messageMatch ? messageMatch[1] : '';
  
  // Extract errorID
  const errorIDMatch = xmlText.match(/<errorID>(.*?)<\/errorID>/);
  const errorID = errorIDMatch ? parseInt(errorIDMatch[1]) : 0;
  
  // Extract QuoteID
  const quoteIDMatch = xmlText.match(/<QuoteID>(.*?)<\/QuoteID>/);
  const quoteID = quoteIDMatch ? quoteIDMatch[1] : '';
  
  // Extract schemaName
  const schemaNameMatch = xmlText.match(/<schemaName>(.*?)<\/schemaName>/);
  const schemaName = schemaNameMatch ? schemaNameMatch[1] : '';
  
  // Extract policytypeName
  const policytypeNameMatch = xmlText.match(/<policytypeName>(.*?)<\/policytypeName>/);
  const policytypeName = policytypeNameMatch ? policytypeNameMatch[1] : '';
  
  // Extract GrossPrice
  const grossPriceMatch = xmlText.match(/<GrossPrice>(.*?)<\/GrossPrice>/);
  const grossPrice = grossPriceMatch ? parseFloat(grossPriceMatch[1]) : 0;
  
  // Extract currency
  const currencyMatch = xmlText.match(/<currency>(.*?)<\/currency>/);
  const currency = currencyMatch ? currencyMatch[1] : '';
  
  // Extract AlterationID
  const alterationIDMatch = xmlText.match(/<AlterationID>(.*?)<\/AlterationID>/);
  const alterationID = alterationIDMatch ? alterationIDMatch[1] : '';
  
  console.log('✅ Parsed Response:');
  console.log('Message:', message);
  console.log('Error ID:', errorID);
  console.log('Quote ID:', quoteID);
  console.log('Schema Name:', schemaName);
  console.log('Policy Type Name:', policytypeName);
  console.log('Gross Price:', grossPrice);
  console.log('Currency:', currency);
  console.log('Alteration ID:', alterationID);
  
  return {
    Message: message,
    quoteResults: [{
      QuoteID: quoteID,
      schemaName: schemaName,
      policytypeName: policytypeName,
      GrossPrice: grossPrice,
      currency: currency,
      AlterationID: alterationID
    }]
  };
}

// Test with your response
const result = parseSOAPResponse(soapResponse);
console.log('\n📊 Final Result:');
console.log(JSON.stringify(result, null, 2));








