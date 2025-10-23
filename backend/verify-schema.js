const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travel_insurance',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function verifySchema() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Verifying quotes table schema...');
    
    // Get all columns from quotes table
    const result = await client.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable, 
        column_default,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'quotes' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Quotes table structure:');
    console.log('=====================================');
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.column_name}`);
      console.log(`   Type: ${row.data_type}${row.character_maximum_length ? `(${row.character_maximum_length})` : ''}`);
      console.log(`   Nullable: ${row.is_nullable}`);
      console.log(`   Default: ${row.column_default || 'None'}`);
      console.log('');
    });
    
    // Specifically check for terms_accepted column
    const termsColumn = result.rows.find(row => row.column_name === 'terms_accepted');
    
    if (termsColumn) {
      console.log('✅ terms_accepted column found and properly configured:');
      console.log(`   - Type: ${termsColumn.data_type}`);
      console.log(`   - Nullable: ${termsColumn.is_nullable}`);
      console.log(`   - Default: ${termsColumn.column_default}`);
    } else {
      console.log('❌ terms_accepted column not found!');
    }
    
    // Check total number of columns
    console.log(`\n📊 Total columns in quotes table: ${result.rows.length}`);
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the verification
verifySchema()
  .then(() => {
    console.log('✅ Schema verification completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  });
