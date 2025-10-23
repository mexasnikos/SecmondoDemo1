const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travel_insurance',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function testTermsAcceptance() {
  const client = await pool.connect();
  
  try {
    console.log('🧪 Testing terms acceptance implementation...');
    
    // Check if column exists
    const columnCheck = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'quotes' AND column_name = 'terms_accepted'
    `);
    
    if (columnCheck.rows.length === 0) {
      console.log('❌ terms_accepted column not found. Please run the migration first.');
      return;
    }
    
    console.log('✅ terms_accepted column found:', columnCheck.rows[0]);
    
    // Test inserting a quote with terms_accepted = true
    const testQuote = await client.query(`
      INSERT INTO quotes (
        destination, country_of_residence, start_date, end_date, 
        trip_type, number_of_travelers, total_amount, terms_accepted
      ) VALUES (
        'France', 'Germany', '2024-06-01', '2024-06-15', 
        'single', 1, 25.50, true
      ) RETURNING id, terms_accepted
    `);
    
    console.log('✅ Test quote created with terms_accepted = true:', testQuote.rows[0]);
    
    // Test updating terms_accepted
    const updateResult = await client.query(`
      UPDATE quotes 
      SET terms_accepted = false 
      WHERE id = $1 
      RETURNING id, terms_accepted
    `, [testQuote.rows[0].id]);
    
    console.log('✅ Updated terms_accepted to false:', updateResult.rows[0]);
    
    // Test querying quotes with terms acceptance filter
    const acceptedQuotes = await client.query(`
      SELECT id, destination, terms_accepted, created_at 
      FROM quotes 
      WHERE terms_accepted = true
    `);
    
    console.log(`✅ Found ${acceptedQuotes.rows.length} quotes with terms accepted`);
    
    // Clean up test data
    await client.query('DELETE FROM quotes WHERE id = $1', [testQuote.rows[0].id]);
    console.log('✅ Test data cleaned up');
    
    console.log('🎉 Terms acceptance implementation test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the test
testTermsAcceptance()
  .then(() => {
    console.log('✅ Terms acceptance test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
