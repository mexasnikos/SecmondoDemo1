const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travel_insurance',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function checkRawData() {
  try {
    // Get the latest quote's raw data
    const result = await pool.query(`
      SELECT 
        id,
        policy_number,
        selected_plan
      FROM quotes
      ORDER BY id DESC
      LIMIT 1
    `);
    
    const quote = result.rows[0];
    
    console.log('\n📊 Quote ID Storage Locations:\n');
    console.log('═════════════════════════════════════════════════════════════\n');
    
    console.log('1️⃣  LOCAL QUOTE ID (Primary Key in quotes table):');
    console.log(`   ├─ Database: quotes.id`);
    console.log(`   ├─ Value: ${quote.id}`);
    console.log(`   └─ Purpose: Your internal database record ID\n`);
    
    console.log('2️⃣  POLICY NUMBER (Generated after payment):');
    console.log(`   ├─ Database: quotes.policy_number`);
    console.log(`   ├─ Value: ${quote.policy_number}`);
    console.log(`   └─ Purpose: Customer-facing policy identifier\n`);
    
    if (quote.selected_plan) {
      console.log('3️⃣  TERRACOTTA QUOTE ID (From Terracotta API):');
      console.log(`   ├─ Database: quotes.selected_plan->>'terracottaQuoteId'`);
      console.log(`   ├─ Value: ${quote.selected_plan.terracottaQuoteId || 'NOT STORED'}`);
      console.log(`   └─ Purpose: Reference to Terracotta's quote\n`);
      
      console.log('4️⃣  FULL selected_plan JSONB Data:');
      console.log(JSON.stringify(quote.selected_plan, null, 2));
    }
    
    console.log('\n═════════════════════════════════════════════════════════════\n');
    
    // Now check the SOAP audit log
    console.log('5️⃣  SOAP AUDIT LOG (soap_audit_log table):');
    const soapCheck = await pool.query(`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_name = 'soap_audit_log'
    `);
    
    if (parseInt(soapCheck.rows[0].count) > 0) {
      const soapLogs = await pool.query(`
        SELECT 
          id,
          quote_id,
          soap_operation,
          terracotta_quote_id,
          terracotta_policy_id,
          status,
          created_at
        FROM soap_audit_log
        ORDER BY id DESC
        LIMIT 5
      `);
      
      console.log(`   ├─ Total SOAP logs: ${soapLogs.rows.length}`);
      if (soapLogs.rows.length > 0) {
        console.log('   ├─ Recent SOAP operations:');
        soapLogs.rows.forEach((log, i) => {
          console.log(`   │  ${i+1}. Operation: ${log.soap_operation}`);
          console.log(`   │     Quote ID: ${log.quote_id || 'NULL'}`);
          console.log(`   │     Terracotta Quote ID: ${log.terracotta_quote_id || 'NULL'}`);
          console.log(`   │     Status: ${log.status}`);
          console.log(`   │`);
        });
      } else {
        console.log('   └─ No SOAP logs yet - proxy server needs to be running\n');
      }
    } else {
      console.log('   └─ Table not created yet - run: node backend/setup-soap-audit.js\n');
    }
    
    console.log('\n📝 SUMMARY:');
    console.log('───────────────────────────────────────────────────────────\n');
    console.log('Quote IDs are stored in THREE places:\n');
    console.log('1. quotes.id               → Local database ID (e.g., 120)');
    console.log('2. quotes.policy_number    → Generated policy number (e.g., TI-39734624)');
    console.log('3. quotes.selected_plan    → JSONB with Terracotta data');
    console.log('4. soap_audit_log          → All SOAP request/response logs');
    console.log('\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkRawData();

