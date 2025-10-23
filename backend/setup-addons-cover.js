const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travel_insurance',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function setupAddOnsCoverTable() {
  const client = await pool.connect();
  
  try {
    console.log('📋 Setting up addons_cover table...');
    
    // Read the SQL file
    const sqlFile = path.join(__dirname, 'create-addons-cover-table.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Execute the SQL
    await client.query(sql);
    
    console.log('✅ addons_cover table created successfully!');
    
    // Verify the data
    const countResult = await client.query('SELECT COUNT(*) FROM addons_cover');
    console.log(`📊 Total records inserted: ${countResult.rows[0].count}`);
    
    // Show sample data
    const sampleResult = await client.query(`
      SELECT policy_type_name, COUNT(*) as addon_count 
      FROM addons_cover 
      GROUP BY policy_type_name 
      ORDER BY policy_type_name
    `);
    
    console.log('\n📈 Add-ons per policy type:');
    sampleResult.rows.forEach(row => {
      console.log(`  - ${row.policy_type_name}: ${row.addon_count} add-ons`);
    });
    
  } catch (error) {
    console.error('❌ Error setting up addons_cover table:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the setup
setupAddOnsCoverTable()
  .then(() => {
    console.log('\n✨ Setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Setup failed:', error);
    process.exit(1);
  });









