#!/usr/bin/env node
/**
 * Database Integration Test
 * This script tests the database integration by creating sample data
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travel_insurance',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function testDatabaseIntegration() {
  console.log('🧪 Testing Database Integration...\n');
  
  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing database connection...');
    const connectionTest = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Connected successfully at:', connectionTest.rows[0].current_time);
    
    // Test 2: Create a sample quote
    console.log('\n2️⃣ Creating sample quote...');
    const quoteResult = await pool.query(`
      INSERT INTO quotes (
        destination, start_date, end_date, trip_type, 
        number_of_travelers, total_amount, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING id, created_at
    `, [
      'Europe', 
      '2024-08-01', 
      '2024-08-15', 
      'single', 
      2, 
      299.99, 
      'pending'
    ]);
    
    const quoteId = quoteResult.rows[0].id;
    console.log('✅ Sample quote created with ID:', quoteId);
    
    // Test 3: Add travelers
    console.log('\n3️⃣ Adding sample travelers...');
    await pool.query(`
      INSERT INTO travelers (
        quote_id, first_name, last_name, age, email, nationality
      ) VALUES 
        ($1, $2, $3, $4, $5, $6),
        ($1, $7, $8, $9, $10, $11)
    `, [
      quoteId,
      'John', 'Doe', 35, 'john.doe@example.com', 'American',
      'Jane', 'Doe', 32, 'jane.doe@example.com', 'American'
    ]);
    console.log('✅ Sample travelers added');
    
    // Test 4: Add contact message
    console.log('\n4️⃣ Creating sample contact message...');
    await pool.query(`
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES ($1, $2, $3, $4)
    `, [
      'Test User',
      'test@example.com',
      'general',
      'This is a test message to verify the database integration is working properly.'
    ]);
    console.log('✅ Sample contact message created');
    
    // Test 5: Query data back
    console.log('\n5️⃣ Querying data back...');
    
    const quotesQuery = await pool.query(`
      SELECT q.*, COUNT(t.id) as traveler_count
      FROM quotes q
      LEFT JOIN travelers t ON q.id = t.quote_id
      GROUP BY q.id
      ORDER BY q.created_at DESC
      LIMIT 5
    `);
    
    console.log('📊 Recent Quotes:');
    quotesQuery.rows.forEach((quote, index) => {
      console.log(`   ${index + 1}. ${quote.destination} - €${quote.total_amount} (${quote.traveler_count} travelers)`);
    });
    
    const contactQuery = await pool.query(`
      SELECT name, subject, created_at
      FROM contact_messages
      ORDER BY created_at DESC
      LIMIT 3
    `);
    
    console.log('\n📨 Recent Contact Messages:');
    contactQuery.rows.forEach((msg, index) => {
      console.log(`   ${index + 1}. ${msg.name} - ${msg.subject}`);
    });
    
    // Test 6: Statistics
    console.log('\n6️⃣ Testing statistics...');
    const statsQuery = await pool.query(`
      SELECT 
        COUNT(*) as total_quotes,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_quotes,
        SUM(total_amount) as total_value,
        AVG(total_amount) as avg_value
      FROM quotes
    `);
    
    const stats = statsQuery.rows[0];
    console.log('📈 Statistics:');
    console.log(`   Total Quotes: ${stats.total_quotes}`);
    console.log(`   Paid Quotes: ${stats.paid_quotes}`);
    console.log(`   Total Value: €${parseFloat(stats.total_value || 0).toFixed(2)}`);
    console.log(`   Average Value: €${parseFloat(stats.avg_value || 0).toFixed(2)}`);
    
    console.log('\n🎉 All database integration tests passed!');
    console.log('\n📋 Database is ready for the Travel Insurance application');
    console.log('🔗 You can now start the backend server and frontend application');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('\n🔧 Please check:');
    console.error('- PostgreSQL is running');
    console.error('- Database credentials in .env are correct');
    console.error('- Database and tables have been created');
  } finally {
    await pool.end();
  }
}

// Run test if called directly
if (require.main === module) {
  testDatabaseIntegration();
}

module.exports = { testDatabaseIntegration };
