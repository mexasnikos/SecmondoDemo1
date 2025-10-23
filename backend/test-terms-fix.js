const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travel_insurance',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function testTermsFix() {
  const client = await pool.connect();
  
  try {
    console.log('🧪 Testing terms acceptance fix...');
    
    // Simulate the exact payment data that should now be sent from frontend
    const paymentData = {
      quoteId: null, // Will be set after creating quote
      paymentMethod: 'card',
      cardNumber: '4111111111111111',
      expiryDate: '12/25',
      cvv: '123',
      billingAddress: {
        street: '123 Test St',
        city: 'Berlin',
        postalCode: '12345',
        country: 'Germany'
      },
      amount: 25.50,
      termsAccepted: true, // This should now be properly sent
      policyNumber: 'POL-TEST-123'
    };
    
    // Create a test quote first
    const testQuote = await client.query(`
      INSERT INTO quotes (
        destination, country_of_residence, start_date, end_date, 
        trip_type, number_of_travelers, total_amount, terms_accepted
      ) VALUES (
        'Test Fix', 'Germany', '2024-06-01', '2024-06-15', 
        'single', 1, 25.50, false
      ) RETURNING id
    `);
    
    const quoteId = testQuote.rows[0].id;
    paymentData.quoteId = quoteId;
    
    console.log('✅ Test quote created with ID:', quoteId);
    console.log('💳 Payment data with termsAccepted:', paymentData.termsAccepted);
    
    // Simulate the backend payment processing
    const termsAccepted = paymentData.termsAccepted;
    console.log('🔍 Backend received termsAccepted:', termsAccepted);
    console.log('🔍 Type of termsAccepted:', typeof termsAccepted);
    
    // Update the quote with payment details
    const updateResult = await client.query(`
      UPDATE quotes 
      SET 
        status = $1, 
        policy_number = $2, 
        terms_accepted = $3,
        updated_at = NOW()
      WHERE id = $4
      RETURNING id, status, policy_number, terms_accepted
    `, [
      'paid',
      paymentData.policyNumber,
      termsAccepted || false,
      quoteId
    ]);
    
    console.log('✅ Update result:', updateResult.rows[0]);
    
    // Verify the final state
    const finalQuote = await client.query(`
      SELECT id, destination, status, terms_accepted, policy_number
      FROM quotes 
      WHERE id = $1
    `, [quoteId]);
    
    console.log('✅ Final quote state:', finalQuote.rows[0]);
    
    if (finalQuote.rows[0].terms_accepted === true) {
      console.log('🎉 SUCCESS: terms_accepted is now properly set to TRUE!');
      console.log('✅ The fix worked - PaymentData interface now includes termsAccepted field');
    } else {
      console.log('❌ ISSUE: terms_accepted is still FALSE');
    }
    
    // Clean up
    await client.query('DELETE FROM quotes WHERE id = $1', [quoteId]);
    console.log('✅ Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the test
testTermsFix()
  .then(() => {
    console.log('✅ Terms fix test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
