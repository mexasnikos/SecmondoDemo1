#!/usr/bin/env node
/**
 * Database Setup Script for Travel Insurance Application
 * This script helps set up the PostgreSQL database
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database configuration
const config = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', // Connect to default database first
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
};

const targetDatabase = process.env.DB_NAME || 'travel_insurance';

async function setupDatabase() {
  const pool = new Pool(config);
  
  try {
    console.log('🔧 Setting up Travel Insurance Database...');
    
    // Check if database exists
    console.log('📋 Checking if database exists...');
    const dbCheckResult = await pool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDatabase]
    );
    
    if (dbCheckResult.rows.length === 0) {
      console.log(`🆕 Creating database '${targetDatabase}'...`);
      await pool.query(`CREATE DATABASE ${targetDatabase}`);
      console.log('✅ Database created successfully');
    } else {
      console.log(`📦 Database '${targetDatabase}' already exists`);
    }
    
    await pool.end();
    
    // Connect to the target database
    const targetPool = new Pool({
      ...config,
      database: targetDatabase
    });
    
    // Read and execute schema
    console.log('📋 Reading schema file...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error('Schema file not found: ' + schemaPath);
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('⚡ Executing schema...');
    await targetPool.query(schema);
    
    console.log('✅ Schema executed successfully');
    
    // Test the setup
    console.log('🧪 Testing database setup...');
    const testResult = await targetPool.query('SELECT COUNT(*) FROM quotes');
    console.log(`📊 Quotes table ready (current count: ${testResult.rows[0].count})`);
    
    await targetPool.end();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Update your .env file with the correct database credentials');
    console.log('2. Start the backend server: npm start');
    console.log('3. Start the frontend: npm start (in the main directory)');
    console.log('\n🔗 API will be available at: http://localhost:5000/api');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('- Ensure PostgreSQL is running');
    console.error('- Check your database credentials in .env');
    console.error('- Make sure you have permissions to create databases');
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
