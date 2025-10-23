const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travel_insurance',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function debugTermsAcceptance() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Debugging terms acceptance issue...');
    
    // First, let's check the current state of quotes
    const currentQuotes = await client.query(`
      SELECT id, destination, status, terms_accepted, created_at 
      FROM quotes 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    console.log('\n📋 Recent quotes:');
    currentQuotes.rows.forEach(quote => {
      console.log(`ID: ${quote.id}, Destination: ${quote.destination}, Status: ${quote.status}, Terms Accepted: ${quote.terms_accepted}, Created: ${quote.created_at}`);
    });
    
    // Test the exact payment flow that should happen
    console.log('\n🧪 Testing payment flow with termsAccepted = true...');
    
    // Create a test quote
    const testQuote = await client.query(`
      INSERT INTO quotes (
        destination, country_of_residence, start_date, end_date, 
        trip_type, number_of_travelers, total_amount, terms_accepted
      ) VALUES (
        'Test Debug', 'Germany', '2024-06-01', '2024-06-15', 
        'single', 1, 25.50, false
      ) RETURNING id, terms_accepted
    `);
    
    const quoteId = testQuote.rows[0].id;
    console.log(`✅ Test quote created with ID: ${quoteId}, terms_accepted: ${testQuote.rows[0].terms_accepted}`);
    
    // Simulate the exact payment update that should happen
    const termsAccepted = true; // This should come from frontend
    console.log(`💳 Simulating payment with termsAccepted = ${termsAccepted}`);
    
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
      `POL-DEBUG-${Date.now()}`,
      termsAccepted,
      quoteId
    ]);
    
    console.log('✅ Update result:', updateResult.rows[0]);
    
    // Verify the update
    const finalQuote = await client.query(`
      SELECT id, destination, status, terms_accepted, policy_number
      FROM quotes 
      WHERE id = $1
    `, [quoteId]);
    
    console.log('✅ Final quote state:', finalQuote.rows[0]);
    
    if (finalQuote.rows[0].terms_accepted === true) {
      console.log('🎉 SUCCESS: terms_accepted was properly set to TRUE');
    } else {
      console.log('❌ ISSUE: terms_accepted is still FALSE');
    }
    
    // Check if there are any recent quotes that should have terms_accepted = true
    const recentPaidQuotes = await client.query(`
      SELECT id, destination, status, terms_accepted, created_at
      FROM quotes 
      WHERE status = 'paid' 
      AND created_at > NOW() - INTERVAL '1 hour'
      ORDER BY created_at DESC
    `);
    
    console.log('\n📊 Recent paid quotes (last hour):');
    recentPaidQuotes.rows.forEach(quote => {
      console.log(`ID: ${quote.id}, Status: ${quote.status}, Terms Accepted: ${quote.terms_accepted}, Created: ${quote.created_at}`);
    });
    
    // Clean up test data
    await client.query('DELETE FROM quotes WHERE id = $1', [quoteId]);
    console.log('✅ Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the debug
debugTermsAcceptance()
  .then(() => {
    console.log('✅ Debug completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Debug failed:', error);
    process.exit(1);
  });
