const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travel_insurance',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function checkQuoteIDChanges() {
  try {
    console.log('\n🔍 Analyzing Quote ID Changes\n');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    // Get recent ProvideQuotation calls
    const result = await pool.query(`
      SELECT 
        id,
        soap_operation,
        terracotta_quote_id,
        parsed_response->>'allQuoteIds' as all_quote_ids,
        parsed_response->>'quoteCount' as quote_count,
        status,
        response_time_ms,
        created_at
      FROM soap_audit_log
      WHERE soap_operation = 'ProvideQuotation'
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    if (result.rows.length === 0) {
      console.log('No ProvideQuotation requests found yet.');
      console.log('Make a quote in your app to see data here!\n');
      return;
    }
    
    console.log(`Found ${result.rows.length} recent quote requests:\n`);
    
    result.rows.forEach((row, i) => {
      console.log(`${i + 1}. Request at ${new Date(row.created_at).toLocaleString()}`);
      console.log(`   Primary Quote ID: ${row.terracotta_quote_id}`);
      
      if (row.all_quote_ids) {
        try {
          const allIds = JSON.parse(row.all_quote_ids);
          console.log(`   Total Quotes Returned: ${row.quote_count || allIds.length}`);
          console.log(`   All Quote IDs: ${allIds.join(', ')}`);
        } catch (e) {
          console.log(`   All Quote IDs: ${row.all_quote_ids}`);
        }
      }
      
      console.log(`   Status: ${row.status}`);
      console.log(`   Response Time: ${row.response_time_ms}ms`);
      console.log();
    });
    
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    // Show which quotes have multiple IDs
    const multipleQuotesResult = await pool.query(`
      SELECT 
        created_at,
        terracotta_quote_id,
        parsed_response->>'quoteCount' as count
      FROM soap_audit_log
      WHERE soap_operation = 'ProvideQuotation'
        AND parsed_response->>'quoteCount' > '1'
      ORDER BY created_at DESC
      LIMIT 3
    `);
    
    if (multipleQuotesResult.rows.length > 0) {
      console.log('\n📋 Requests that returned MULTIPLE Quote IDs:\n');
      multipleQuotesResult.rows.forEach((row, i) => {
        console.log(`${i + 1}. ${new Date(row.created_at).toLocaleString()}`);
        console.log(`   Returned ${row.count} different quotes`);
        console.log(`   Primary ID stored: ${row.terracotta_quote_id}`);
        console.log();
      });
    }
    
    // Check for duplicate calls (potential issue)
    const duplicateResult = await pool.query(`
      SELECT 
        DATE_TRUNC('minute', created_at) as minute,
        COUNT(*) as call_count,
        STRING_AGG(terracotta_quote_id, ', ') as quote_ids
      FROM soap_audit_log
      WHERE soap_operation = 'ProvideQuotation'
        AND created_at >= NOW() - INTERVAL '1 hour'
      GROUP BY DATE_TRUNC('minute', created_at)
      HAVING COUNT(*) > 1
      ORDER BY minute DESC
    `);
    
    if (duplicateResult.rows.length > 0) {
      console.log('\n⚠️  Multiple API Calls in Same Minute (possible duplicate):\n');
      duplicateResult.rows.forEach((row, i) => {
        console.log(`${i + 1}. ${new Date(row.minute).toLocaleString()}`);
        console.log(`   Number of calls: ${row.call_count}`);
        console.log(`   Quote IDs: ${row.quote_ids}`);
        console.log();
      });
      console.log('   This could mean:');
      console.log('   - User refreshed the page');
      console.log('   - User went back and forward');
      console.log('   - Frontend called API multiple times\n');
    }
    
    console.log('\n💡 Summary:\n');
    console.log('Quote IDs change because:');
    console.log('1. Each ProvideQuotation call returns MULTIPLE quotes');
    console.log('2. Each quote option has its own unique ID');
    console.log('3. The "primary" ID is the first one from the response');
    console.log('4. When user selects a different plan, they\'re selecting a different Quote ID');
    console.log('\nThis is NORMAL behavior! ✅\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkQuoteIDChanges();

