#!/usr/bin/env node
/**
 * Setup Destination Categories Script
 * This script creates the destination_categories table and populates it with data
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
  port: process.env.DB_PORT || 5002, // Using the port from memory
};

async function setupDestinationCategories() {
  const pool = new Pool(config);
  
  try {
    console.log('🔧 Setting up Destination Categories...');
    
    // Read and execute the SQL file
    const sqlPath = path.join(__dirname, 'create-destination-categories.sql');
    
    if (!fs.existsSync(sqlPath)) {
      throw new Error('SQL file not found: ' + sqlPath);
    }
    
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('⚡ Executing destination categories SQL...');
    await pool.query(sql);
    
    console.log('✅ Destination categories setup completed successfully!');
    
    // Verify the data was inserted
    const result = await pool.query('SELECT COUNT(*) as total_countries FROM destination_categories');
    console.log(`📊 Total countries inserted: ${result.rows[0].total_countries}`);
    
    // Show category distribution
    const categories = await pool.query(`
      SELECT destination_category, COUNT(*) as country_count 
      FROM destination_categories 
      GROUP BY destination_category 
      ORDER BY destination_category
    `);
    
    console.log('\n📋 Destination Categories:');
    categories.rows.forEach(row => {
      console.log(`  - ${row.destination_category}: ${row.country_count} countries`);
    });
    
    await pool.end();
    
    console.log('\n🎉 Destination categories setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Destination categories setup failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('- Ensure PostgreSQL is running on port 5002');
    console.error('- Check your database credentials in .env');
    console.error('- Make sure the travel_insurance database exists');
    await pool.end();
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDestinationCategories();
}

module.exports = { setupDestinationCategories };

