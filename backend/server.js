const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travel_insurance',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Travel Insurance API is running' });
});

// Test database connection
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'success', 
      message: 'Database connection successful',
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Create quote
app.post('/api/quotes', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      destination,
      startDate,
      endDate,
      tripType,
      numberOfTravelers,
      travelers,
      selectedQuote,
      additionalPolicies,
      totalAmount
    } = req.body;

    // Insert quote
    const quoteResult = await client.query(
      `INSERT INTO quotes (
        destination, start_date, end_date, trip_type, 
        number_of_travelers, selected_plan, total_amount, 
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
      RETURNING id`,
      [destination, startDate, endDate, tripType, numberOfTravelers, 
       JSON.stringify(selectedQuote), totalAmount]
    );

    const quoteId = quoteResult.rows[0].id;

    // Insert travelers
    for (const traveler of travelers) {
      await client.query(
        `INSERT INTO travelers (
          quote_id, first_name, last_name, age, email, 
          phone, vax_id, nationality
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [quoteId, traveler.firstName, traveler.lastName, 
         traveler.age, traveler.email, traveler.phone, 
         traveler.vaxId, traveler.nationality]
      );
    }

    // Insert additional policies
    for (const policy of additionalPolicies) {
      await client.query(
        `INSERT INTO additional_policies (
          quote_id, policy_id, name, description, price
        ) VALUES ($1, $2, $3, $4, $5)`,
        [quoteId, policy.id, policy.name, policy.description, policy.price]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      status: 'success',
      message: 'Quote created successfully',
      data: { quoteId: quoteId }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating quote:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create quote',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Get quote by ID
app.get('/api/quotes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get quote details
    const quoteResult = await pool.query(
      'SELECT * FROM quotes WHERE id = $1',
      [id]
    );

    if (quoteResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Quote not found'
      });
    }

    const quote = quoteResult.rows[0];

    // Get travelers
    const travelersResult = await pool.query(
      'SELECT * FROM travelers WHERE quote_id = $1',
      [id]
    );

    // Get additional policies
    const policiesResult = await pool.query(
      'SELECT * FROM additional_policies WHERE quote_id = $1',
      [id]
    );

    res.json({
      status: 'success',
      data: {
        quote,
        travelers: travelersResult.rows,
        additionalPolicies: policiesResult.rows
      }
    });

  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch quote',
      error: error.message
    });
  }
});

// Get all quotes (with pagination)
app.get('/api/quotes', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT q.*, COUNT(t.id) as traveler_count 
       FROM quotes q 
       LEFT JOIN travelers t ON q.id = t.quote_id 
       GROUP BY q.id 
       ORDER BY q.created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM quotes');
    const totalQuotes = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalQuotes / limit);

    res.json({
      status: 'success',
      data: {
        quotes: result.rows,
        pagination: {
          page,
          limit,
          totalQuotes,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch quotes',
      error: error.message
    });
  }
});

// Submit contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING id`,
      [name, email, subject, message]
    );

    res.status(201).json({
      status: 'success',
      message: 'Contact message submitted successfully',
      data: { messageId: result.rows[0].id }
    });

  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit contact form',
      error: error.message
    });
  }
});

// Process payment (placeholder)
app.post('/api/payments', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      quoteId,
      paymentMethod,
      cardNumber, // This should be tokenized in production
      expiryDate,
      cvv, // This should never be stored
      billingAddress,
      amount
    } = req.body;

    // Check if quote already has a policy number
    const existingQuoteResult = await client.query(
      'SELECT policy_number FROM quotes WHERE id = $1',
      [quoteId]
    );

    let policyNumber;
    if (existingQuoteResult.rows[0]?.policy_number) {
      // Use existing policy number if quote already has one
      policyNumber = existingQuoteResult.rows[0].policy_number;
    } else {
      // Generate new policy number with better uniqueness
      const timestamp = Date.now().toString();
      const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      policyNumber = `TI-${timestamp.slice(-5)}${randomSuffix}`;
    }

    // Insert payment record (without sensitive data)
    const paymentResult = await client.query(
      `INSERT INTO payments (
        quote_id, payment_method, amount, status, 
        policy_number, billing_address, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
      RETURNING id`,
      [quoteId, paymentMethod, amount, 'completed', 
       policyNumber, JSON.stringify(billingAddress)]
    );

    // Update quote status and ensure policy number is set
    await client.query(
      'UPDATE quotes SET status = $1, policy_number = $2 WHERE id = $3',
      ['paid', policyNumber, quoteId]
    );

    // Get the complete quote information to return
    const quoteDetails = await client.query(
      'SELECT * FROM quotes WHERE id = $1',
      [quoteId]
    );

    await client.query('COMMIT');

    res.status(201).json({
      status: 'success',
      message: 'Payment processed successfully',
      data: {
        policyNumber: policyNumber,
        paymentId: paymentResult.rows[0].id,
        quoteId: quoteId,
        quote: quoteDetails.rows[0]
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing payment:', error);
    res.status(500).json({
      status: 'error',
      message: 'Payment processing failed',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Get statistics dashboard
app.get('/api/stats', async (req, res) => {
  try {
    // Total quotes
    const totalQuotesResult = await pool.query('SELECT COUNT(*) FROM quotes');
    
    // Paid quotes
    const paidQuotesResult = await pool.query(
      "SELECT COUNT(*) FROM quotes WHERE status = 'paid'"
    );
    
    // Total revenue
    const revenueResult = await pool.query(
      "SELECT SUM(total_amount) FROM quotes WHERE status = 'paid'"
    );
    
    // Top destinations
    const destinationsResult = await pool.query(`
      SELECT destination, COUNT(*) as count 
      FROM quotes 
      GROUP BY destination 
      ORDER BY count DESC 
      LIMIT 5
    `);
    
    // Recent activity (last 30 days)
    const recentActivityResult = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as quotes
      FROM quotes 
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    res.json({
      status: 'success',
      data: {
        totalQuotes: parseInt(totalQuotesResult.rows[0].count),
        paidQuotes: parseInt(paidQuotesResult.rows[0].count),
        totalRevenue: parseFloat(revenueResult.rows[0].sum || 0),
        topDestinations: destinationsResult.rows,
        recentActivity: recentActivityResult.rows
      }
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// Get contact messages
app.get('/api/contact-messages', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT * FROM contact_messages 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM contact_messages');
    const totalMessages = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalMessages / limit);

    res.json({
      status: 'success',
      data: {
        messages: result.rows,
        pagination: {
          page,
          limit,
          totalMessages,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch contact messages',
      error: error.message
    });
  }
});

// Get audit log entries
app.get('/api/audit-log', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT * FROM audit_log 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM audit_log');
    const totalEntries = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalEntries / limit);

    res.json({
      status: 'success',
      data: {
        entries: result.rows,
        pagination: {
          page,
          limit,
          totalEntries,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching audit log:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch audit log',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Travel Insurance API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  Database test: http://localhost:${PORT}/api/db-test`);
});

module.exports = app;
