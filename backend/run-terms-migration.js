const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travel_insurance',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function runTermsMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting terms_accepted column migration...');
    
    // Check if column already exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'quotes' AND column_name = 'terms_accepted'
    `);
    
    if (checkColumn.rows.length > 0) {
      console.log('✅ Column terms_accepted already exists in quotes table');
      return;
    }
    
    // Add the terms_accepted column
    await client.query(`
      ALTER TABLE quotes ADD COLUMN terms_accepted BOOLEAN DEFAULT FALSE
    `);
    console.log('✅ Added terms_accepted column');
    
    // Update existing records to have terms_accepted as FALSE
    const updateResult = await client.query(`
      UPDATE quotes SET terms_accepted = FALSE WHERE terms_accepted IS NULL
    `);
    console.log(`✅ Updated ${updateResult.rowCount} existing records`);
    
    // Make the column NOT NULL
    await client.query(`
      ALTER TABLE quotes ALTER COLUMN terms_accepted SET NOT NULL
    `);
    console.log('✅ Set terms_accepted as NOT NULL');
    
    // Add default value
    await client.query(`
      ALTER TABLE quotes ALTER COLUMN terms_accepted SET DEFAULT FALSE
    `);
    console.log('✅ Set default value for terms_accepted');
    
    // Add comment
    await client.query(`
      COMMENT ON COLUMN quotes.terms_accepted IS 'Tracks whether user accepted Privacy Policy, Terms and Conditions, and General conditions during payment'
    `);
    console.log('✅ Added column comment');
    
    // Verify the column was added
    const verifyResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'quotes' AND column_name = 'terms_accepted'
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
runTermsMigration()
  .then(() => {
    console.log('✅ Terms acceptance migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
