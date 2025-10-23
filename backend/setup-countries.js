#!/usr/bin/env node
/**
 * Setup Countries Table
 * This script creates the countries table and populates it with EU/EEA countries
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database configuration
const config = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travel_insurance',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
};

async function setupCountriesTable() {
  const pool = new Pool(config);
  
  try {
    console.log('🔧 Setting up Countries table...');
    console.log(`📦 Connecting to database: ${config.database}`);
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create-countries-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('⚡ Executing SQL script...');
    await pool.query(sql);
    
    // Verify the table was created
    console.log('🧪 Verifying table creation...');
    const countResult = await pool.query('SELECT COUNT(*) FROM countries');
    const count = countResult.rows[0].count;
    
    console.log(`✅ Countries table created successfully!`);
    console.log(`📊 Total countries: ${count}`);
    
    // Show a sample of countries
    const sampleResult = await pool.query('SELECT country_name FROM countries ORDER BY country_name LIMIT 5');
    console.log('\n📋 Sample countries:');
    sampleResult.rows.forEach(row => {
      console.log(`   - ${row.country_name}`);
    });
    console.log('   ... and more\n');
    
    await pool.end();
    
    console.log('🎉 Setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Restart your backend server if it\'s running');
    console.log('2. The Country of Residence dropdown will now be populated');
    console.log('3. Test the API: http://localhost:5002/api/countries');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('- Ensure PostgreSQL is running');
    console.error('- Check your database credentials in .env or backend/server.js');
    console.error('- Verify the database "travel_insurance" exists');
    console.error('- Error details:', error);
    process.exit(1);
  }
}

// Run setup
setupCountriesTable();



