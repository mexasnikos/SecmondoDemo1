const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travel_insurance',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5002,
});

async function checkQuotes() {
  try {
    // Get recent quotes with their Terracotta Quote IDs
    const result = await pool.query(`
      SELECT 
        q.id as local_quote_id,
        q.policy_number,
        q.status,
        q.total_amount,
        q.selected_plan->>'terracottaQuoteId' as terracotta_quote_id,
        q.created_at,
        COUNT(t.id) as num_travelers
      FROM quotes q
      LEFT JOIN travelers t ON q.id = t.quote_id
      GROUP BY q.id
      ORDER BY q.id DESC
      LIMIT 10
    `);
    
    console.log('\n📊 Recent Quotes:\n');
    console.log('┌─────────┬──────────────┬─────────┬─────────────┬───────────────────┬──────────────┐');
    console.log('│ Local ID│ Policy #     │ Status  │ Amount (€)  │ Terracotta ID     │ Travelers    │');
    console.log('├─────────┼──────────────┼─────────┼─────────────┼───────────────────┼──────────────┤');
    
    result.rows.forEach(row => {
      console.log(
        `│ ${String(row.local_quote_id).padEnd(7)} │ ` +
        `${String(row.policy_number || 'N/A').padEnd(12)} │ ` +
        `${String(row.status).padEnd(7)} │ ` +
        `${String(row.total_amount || '0').padEnd(11)} │ ` +
        `${String(row.terracotta_quote_id || 'N/A').padEnd(17)} │ ` +
        `${String(row.num_travelers).padEnd(12)} │`
      );
    });
    
    console.log('└─────────┴──────────────┴─────────┴─────────────┴───────────────────┴──────────────┘\n');
    
    // Show latest quote details
    const latest = result.rows[0];
    if (latest) {
      console.log(`\n📋 Latest Quote Details (ID: ${latest.local_quote_id}):\n`);
      
      // Get travelers
      const travelers = await pool.query(
        'SELECT first_name, last_name, email, age FROM travelers WHERE quote_id = $1',
        [latest.local_quote_id]
      );
      
      console.log('Travelers:');
      travelers.rows.forEach((t, i) => {
        console.log(`  ${i + 1}. ${t.first_name} ${t.last_name} (Age: ${t.age}) - ${t.email}`);
      });
      
      // Get additional policies
      const policies = await pool.query(
        'SELECT name, price FROM additional_policies WHERE quote_id = $1',
        [latest.local_quote_id]
      );
      
      if (policies.rows.length > 0) {
        console.log('\nAdditional Policies:');
        policies.rows.forEach((p, i) => {
          console.log(`  ${i + 1}. ${p.name} - €${p.price}`);
        });
      }
      
      console.log(`\nTotal Amount: €${latest.total_amount}`);
      console.log(`Status: ${latest.status}`);
      console.log(`Created: ${latest.created_at}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkQuotes();

