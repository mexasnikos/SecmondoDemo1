const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travel_insurance',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function testAddons() {
  const client = await pool.connect();
  
  try {
    console.log('🧪 Testing addons_cover table...\n');
    
    // Check if table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'addons_cover'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ Table addons_cover does not exist!');
      console.log('Run: node backend/setup-addons-cover.js');
      return;
    }
    
    console.log('✅ Table addons_cover exists\n');
    
    // Get all unique policy types
    const policyTypes = await client.query(`
      SELECT DISTINCT policy_type_name, COUNT(*) as addon_count
      FROM addons_cover
      GROUP BY policy_type_name
      ORDER BY policy_type_name
    `);
    
    console.log('📋 Available Policy Types in Database:');
    console.log('=====================================');
    policyTypes.rows.forEach(row => {
      console.log(`  ✓ "${row.policy_type_name}" (${row.addon_count} add-ons)`);
    });
    
    console.log('\n');
    
    // Test specific policy type
    const testPolicyType = 'Silver Annual Multi-Trip';
    console.log(`🔍 Testing fetch for: "${testPolicyType}"`);
    
    const addons = await client.query(`
      SELECT 
        additional_cover_name,
        additional_cover_detail,
        alteration_id
      FROM addons_cover
      WHERE policy_type_name = $1
      ORDER BY additional_cover_name
    `, [testPolicyType]);
    
    console.log(`\n✅ Found ${addons.rows.length} add-ons:`);
    addons.rows.slice(0, 5).forEach(addon => {
      const detail = addon.additional_cover_detail ? ` - ${addon.additional_cover_detail}` : '';
      console.log(`  - ${addon.additional_cover_name}${detail} (ID: ${addon.alteration_id})`);
    });
    
    if (addons.rows.length > 5) {
      console.log(`  ... and ${addons.rows.length - 5} more`);
    }
    
    console.log('\n');
    
    // Test case-insensitive match
    const testCaseInsensitive = 'silver annual multi-trip';
    console.log(`🔍 Testing case-insensitive match for: "${testCaseInsensitive}"`);
    
    const caseResult = await client.query(`
      SELECT COUNT(*) as count
      FROM addons_cover
      WHERE LOWER(policy_type_name) = LOWER($1)
    `, [testCaseInsensitive]);
    
    console.log(`✅ Case-insensitive match found ${caseResult.rows[0].count} add-ons\n`);
    
    // Test pattern matching
    const testPattern = 'Silver Annual';
    console.log(`🔍 Testing pattern match for: "${testPattern}"`);
    
    const patternResult = await client.query(`
      SELECT DISTINCT policy_type_name
      FROM addons_cover
      WHERE policy_type_name ILIKE $1
    `, [`%${testPattern}%`]);
    
    console.log(`✅ Pattern match found ${patternResult.rows.length} policy types:`);
    patternResult.rows.forEach(row => {
      console.log(`  - ${row.policy_type_name}`);
    });
    
    console.log('\n');
    console.log('✨ Test complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

testAddons();









