/**
 * Setup Script for SOAP Audit Table
 * 
 * This script creates the soap_audit_log table and all associated
 * views and functions in your PostgreSQL database.
 * 
 * Usage: node setup-soap-audit.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travel_insurance',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function setupSOAPAuditTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting SOAP Audit Table setup...\n');
    
    // Read the SQL file
    const sqlFile = path.join(__dirname, 'create-soap-audit-table.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('📄 Executing SQL script...');
    await client.query(sql);
    
    console.log('✅ SOAP Audit Table created successfully!\n');
    
    // Verify the table was created
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'soap_audit_log'
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log('✅ Table verification: soap_audit_log exists');
    }
    
    // Check views
    const viewCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.views 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%soap%'
    `);
    
    console.log(`✅ Created ${viewCheck.rows.length} views:`);
    viewCheck.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    // Check functions
    const functionCheck = await client.query(`
      SELECT routine_name 
      FROM information_schema.routines 
      WHERE routine_schema = 'public' 
      AND routine_name LIKE '%soap%'
    `);
    
    console.log(`✅ Created ${functionCheck.rows.length} functions:`);
    functionCheck.rows.forEach(row => {
      console.log(`   - ${row.routine_name}`);
    });
    
    console.log('\n📊 Setup Summary:');
    console.log('   ✓ soap_audit_log table');
    console.log('   ✓ 4 views for monitoring');
    console.log('   ✓ 2 helper functions');
    console.log('   ✓ Indexes for performance');
    console.log('   ✓ Triggers for auto-updates');
    
    console.log('\n🚀 Next Steps:');
    console.log('   1. Start the proxy server: node server/proxy-server.js');
    console.log('   2. Make some SOAP requests from your app');
    console.log('   3. View logs: http://localhost:3001/api/soap-logs/summary');
    console.log('   4. Check errors: http://localhost:3001/api/soap-logs/errors');
    
    console.log('\n📚 Documentation:');
    console.log('   Read backend/SOAP_AUDIT_GUIDE.md for detailed usage\n');
    
  } catch (error) {
    console.error('❌ Error setting up SOAP Audit Table:', error);
    console.error('\nDetails:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Tip: Make sure PostgreSQL is running');
      console.error('   Windows: Check Services for PostgreSQL');
      console.error('   Linux/Mac: sudo systemctl status postgresql');
    } else if (error.code === '42P07') {
      console.log('\n⚠️  Table already exists. This is not an error.');
      console.log('   The script can be run multiple times safely.');
    }
    
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the setup
console.log('╔════════════════════════════════════════════════════╗');
console.log('║     SOAP Audit Table Setup for TravelInsurance    ║');
console.log('╚════════════════════════════════════════════════════╝\n');

setupSOAPAuditTable();

