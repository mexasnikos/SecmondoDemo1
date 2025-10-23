const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travel_insurance',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function applyViews() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Applying Terracotta ID tracking views...\n');
    
    const sqlFile = path.join(__dirname, 'add-terracotta-views.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    await client.query(sql);
    
    console.log('✅ Views created successfully!\n');
    
    // Test the views
    console.log('📊 Testing views:\n');
    
    const viewsResult = await client.query(`
      SELECT table_name 
      FROM information_schema.views 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%terracotta%'
      ORDER BY table_name
    `);
    
    console.log('Created views:');
    viewsResult.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });
    
    console.log('\n📋 Quick test - Recent Terracotta operations:\n');
    
    const testResult = await client.query(`
      SELECT 
        soap_operation,
        terracotta_quote_id,
        terracotta_policy_id,
        status,
        created_at
      FROM soap_audit_log
      WHERE terracotta_quote_id IS NOT NULL 
         OR terracotta_policy_id IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    if (testResult.rows.length > 0) {
      testResult.rows.forEach((row, i) => {
        console.log(`${i + 1}. ${row.soap_operation}`);
        console.log(`   Quote ID: ${row.terracotta_quote_id || 'N/A'}`);
        console.log(`   Policy ID: ${row.terracotta_policy_id || 'N/A'}`);
        console.log(`   Status: ${row.status}`);
        console.log();
      });
    } else {
      console.log('   No Terracotta IDs captured yet.');
      console.log('   Make a quote to see data appear here!\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

applyViews();

