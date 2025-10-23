const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travel_insurance',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function addPolicyIdColumn() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Adding policy_id column to soap_audit_log table...');
    
    // Check if column already exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'soap_audit_log' AND column_name = 'policy_id'
    `);
    
    if (checkColumn.rows.length > 0) {
      console.log('✅ Column policy_id already exists in soap_audit_log table');
      return;
    }
    
    // Add the policy_id column
    await client.query(`
      ALTER TABLE soap_audit_log ADD COLUMN policy_id VARCHAR(100)
    `);
    console.log('✅ Added policy_id column');
    
    // Add comment
    await client.query(`
      COMMENT ON COLUMN soap_audit_log.policy_id IS 'Local policy number from quotes table - maps to which policy the SOAP action corresponds to'
    `);
    console.log('✅ Added column comment');
    
    // Create index for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_soap_audit_policy_id ON soap_audit_log(policy_id)
    `);
    console.log('✅ Created index for policy_id');
    
    // Verify the column was added
    const verifyResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'soap_audit_log' AND column_name = 'policy_id'
    `);
    
    console.log('✅ Verification result:', verifyResult.rows[0]);
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the migration
addPolicyIdColumn()
  .then(() => {
    console.log('✅ Policy ID column migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
