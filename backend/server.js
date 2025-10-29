const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://192.168.1.225:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'http://localhost:3002',
      'http://127.0.0.1:3002'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  optionsSuccessStatus: 200,
  preflightContinue: false
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  console.log('📨 Origin:', req.headers.origin);
  console.log('📨 User-Agent:', req.headers['user-agent']);
  next();
});

// Handle preflight requests explicitly
app.options('*', (req, res) => {
  console.log('🔄 Preflight request:', req.method, req.url);
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Add error handling for JSON parsing
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      if (buf && buf.length > 0) {
        JSON.parse(buf);
      }
    } catch (e) {
      console.error('❌ JSON Parse Error:', e.message);
      console.error('❌ Raw buffer:', buf.toString());
      console.error('❌ Buffer length:', buf.length);
      throw new Error('Invalid JSON');
    }
  }
}));

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

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
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

// Get destination categories
app.get('/api/destination-categories', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT destination_category 
      FROM destination_categories 
      ORDER BY destination_category
    `);
    
    const categories = result.rows.map(row => row.destination_category);
    
    res.json({ 
      status: 'success', 
      categories: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('❌ Error fetching destination categories:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch destination categories',
      error: error.message 
    });
  }
});

// Get countries by destination category
app.get('/api/destination-categories/:category/countries', async (req, res) => {
  try {
    const { category } = req.params;
    
    const result = await pool.query(`
      SELECT country 
      FROM destination_categories 
      WHERE destination_category = $1 
      ORDER BY country
    `, [category]);
    
    const countries = result.rows.map(row => row.country);
    
    res.json({ 
      status: 'success', 
      category: category,
      countries: countries,
      count: countries.length
    });
  } catch (error) {
    console.error('❌ Error fetching countries for category:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch countries for destination category',
      error: error.message 
    });
  }
});

// Get all countries with their destination categories for autocomplete
app.get('/api/destination-categories/all-countries', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT country, destination_category 
      FROM destination_categories 
      ORDER BY country
    `);
    
    res.json({ 
      status: 'success', 
      countries: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('❌ Error fetching all countries with categories:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch countries with destination categories',
      error: error.message 
    });
  }
});

// Get addons by policy type
app.get('/api/addons/:policyType', async (req, res) => {
  try {
    const { policyType } = req.params;
    
    console.log(`📋 Fetching addons for policy type: ${policyType}`);
    
    // First try exact match
    let result = await pool.query(`
      SELECT 
        id,
        policy_type_name,
        additional_cover_name,
        additional_cover_detail,
        alteration_id,
        created_at
      FROM addons_cover 
      WHERE policy_type_name = $1 
      ORDER BY additional_cover_name, additional_cover_detail
    `, [policyType]);
    
    // If no results, try case-insensitive match
    if (result.rows.length === 0) {
      console.log(`⚠️ No exact match, trying case-insensitive search for: ${policyType}`);
      result = await pool.query(`
        SELECT 
          id,
          policy_type_name,
          additional_cover_name,
          additional_cover_detail,
          alteration_id,
          created_at
        FROM addons_cover 
        WHERE LOWER(policy_type_name) = LOWER($1)
        ORDER BY additional_cover_name, additional_cover_detail
      `, [policyType]);
    }
    
    // If still no results, try pattern matching
    if (result.rows.length === 0) {
      console.log(`⚠️ No case-insensitive match, trying pattern search for: ${policyType}`);
      result = await pool.query(`
        SELECT 
          id,
          policy_type_name,
          additional_cover_name,
          additional_cover_detail,
          alteration_id,
          created_at
        FROM addons_cover 
        WHERE policy_type_name ILIKE $1
        ORDER BY additional_cover_name, additional_cover_detail
      `, [`%${policyType}%`]);
    }
    
    console.log(`✅ Found ${result.rows.length} addons for ${policyType}`);
    
    res.json({ 
      status: 'success', 
      policyType: policyType,
      addons: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('❌ Error fetching addons:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch addons',
      error: error.message 
    });
  }
});

// Get all countries of residence for dropdown
app.get('/api/countries', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT country_id, country_name 
      FROM countries 
      ORDER BY country_name
    `);
    
    res.json({ 
      status: 'success', 
      countries: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('❌ Error fetching countries:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch countries',
      error: error.message 
    });
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

// Create quote endpoint
app.post('/api/quotes', async (req, res) => {
  console.log('📝 Quote creation request received');
  console.log('📝 Request body type:', typeof req.body);
  console.log('📝 Request body keys:', Object.keys(req.body || {}));
  console.log('📝 Request body:', JSON.stringify(req.body, null, 2));

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      destination,
      countryOfResidence,
      startDate,
      endDate,
      tripType,
      numberOfTravelers,
      travelers,
      selectedQuote,
      additionalPolicies,
      totalAmount
    } = req.body;

    // Validate required fields
    if (!destination || !countryOfResidence || !startDate || !endDate || !tripType || !numberOfTravelers) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: destination, countryOfResidence, startDate, endDate, tripType, numberOfTravelers'
      });
    }

    // Insert quote
    const quoteResult = await client.query(
      `INSERT INTO quotes (
        destination, country_of_residence, start_date, end_date, trip_type, 
        number_of_travelers, selected_plan, 
        total_amount, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) 
      RETURNING id`,
      [destination, countryOfResidence, startDate, endDate, tripType, numberOfTravelers, 
       JSON.stringify({ plan: selectedQuote || 'basic' }), 
       totalAmount, 'pending']
    );

    const quoteId = quoteResult.rows[0].id;

    // Insert travelers if provided
    if (travelers && Array.isArray(travelers)) {
      for (const traveler of travelers) {
        // Calculate age from date of birth
        let age = null;
        console.log(`Processing traveler: ${traveler.firstName} ${traveler.lastName}`);
        console.log(`Date of birth: ${traveler.dateOfBirth}`);
        
        if (traveler.dateOfBirth) {
          const birthDate = new Date(traveler.dateOfBirth);
          const today = new Date();
          age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          console.log(`Calculated age: ${age}`);
        } else {
          console.log('⚠️ No dateOfBirth provided, using default age');
          age = 25;
        }

        // Ensure age is never null (database constraint)
        const finalAge = age || 25;
        // Ensure email is never null (database constraint)  
        const finalEmail = traveler.email || 'noemail@example.com';
        
        console.log(`Inserting traveler with age: ${finalAge}, email: ${finalEmail}`);
        if (traveler.travellerNumber) {
          console.log(`Traveller Number from Terracotta: ${traveler.travellerNumber}`);
        }

        await client.query(
          `INSERT INTO travelers (
            quote_id, first_name, last_name, age, 
            email, phone, traveller_number, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
          [quoteId, traveler.firstName, traveler.lastName, 
           finalAge, finalEmail, traveler.phone || null, traveler.travellerNumber || null]
        );
      }
    }

    await client.query('COMMIT');

    console.log('✅ Quote created successfully:', quoteId);
    res.status(201).json({
      status: 'success',
      message: 'Quote created successfully',
      data: { quoteId: quoteId }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating quote:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create quote',
      error: error.message
    });
  } finally {
    client.release();
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
      amount,
      termsAccepted, // New field to track terms acceptance
      policyNumber: terracottaPolicyNumber // Policy ID from Terracotta SavePolicyDetails
    } = req.body;

    // Debug logging
    console.log('Payment request body:', req.body);
    console.log('Extracted quoteId:', quoteId);
    console.log('Terracotta Policy Number:', terracottaPolicyNumber);
    console.log('🔍 DEBUG: termsAccepted received:', termsAccepted);
    console.log('🔍 DEBUG: termsAccepted type:', typeof termsAccepted);

    // Validate required fields
    if (!quoteId) {
      return res.status(400).json({
        status: 'error',
        message: 'Quote ID is required for payment processing'
      });
    }

    // Check if quote already has a policy number
    const existingQuoteResult = await client.query(
      'SELECT policy_number FROM quotes WHERE id = $1',
      [quoteId]
    );

    let policyNumber;
    if (existingQuoteResult.rows[0]?.policy_number) {
      // Use existing policy number if quote already has one
      policyNumber = existingQuoteResult.rows[0].policy_number;
      console.log('Using existing policy number from database:', policyNumber);
    } else if (terracottaPolicyNumber) {
      // Use Terracotta Policy ID if provided
      policyNumber = terracottaPolicyNumber;
      console.log('Using Terracotta Policy ID:', policyNumber);
    } else {
      // Fallback: Generate new policy number with better uniqueness
      const timestamp = Date.now().toString();
      const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      policyNumber = `TI-${timestamp.slice(-5)}${randomSuffix}`;
      console.log('Generated fallback policy number:', policyNumber);
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

    // Update quote status, policy number, and terms acceptance
    console.log('🔍 DEBUG: Updating quote with termsAccepted:', termsAccepted || false);
    await client.query(
      'UPDATE quotes SET status = $1, policy_number = $2, terms_accepted = $3 WHERE id = $4',
      ['paid', policyNumber, termsAccepted || false, quoteId]
    );
    console.log('✅ Quote updated with terms_accepted =', termsAccepted || false);
    
    // Update SOAP audit log with policy_id for ALL SOAP operations related to this quote
    if (policyNumber) {
      console.log('🔍 DEBUG: Updating SOAP audit log with policy_id:', policyNumber);
      
      // Get the quote details to find the terracotta_quote_id
      const quoteDetails = await client.query(
        'SELECT policy_number, created_at FROM quotes WHERE id = $1',
        [quoteId]
      );
      
      if (quoteDetails.rows.length > 0) {
        const quoteCreatedAt = quoteDetails.rows[0].created_at;
        
        // Calculate time window manually
        const oneHourBefore = new Date(quoteCreatedAt.getTime() - 60 * 60 * 1000);
        const oneHourAfter = new Date(quoteCreatedAt.getTime() + 60 * 60 * 1000);
        
        // Update SOAP logs by multiple criteria to catch ALL related operations:
        // 1. Direct quote_id link
        // 2. Same terracotta_quote_id (from quotes table if available)
        // 3. Operations within the same time window (for operations without direct links)
        // 4. ALL operations with same terracotta_quote_id (ENHANCED - no time restriction)
        
        // First, get the terracotta_quote_id and terracotta_policy_id from related operations
        const terracottaIdsResult = await client.query(`
          SELECT 
            terracotta_quote_id,
            terracotta_policy_id
          FROM soap_audit_log 
          WHERE quote_id = $1 
          AND terracotta_quote_id IS NOT NULL
          ORDER BY created_at DESC
          LIMIT 1
        `, [quoteId]);
        
        const terracottaQuoteId = terracottaIdsResult.rows[0]?.terracotta_quote_id;
        const terracottaPolicyId = terracottaIdsResult.rows[0]?.terracotta_policy_id;
        
        console.log('🔍 Found Terracotta IDs:', {
          terracotta_quote_id: terracottaQuoteId,
          terracotta_policy_id: terracottaPolicyId
        });
        
        const updateResult = await client.query(`
          UPDATE soap_audit_log 
          SET 
            policy_id = $1,
            terracotta_quote_id = COALESCE(terracotta_quote_id, $5),
            terracotta_policy_id = COALESCE(terracotta_policy_id, $6)
          WHERE (
            quote_id = $2 
            OR terracotta_quote_id IN (
              SELECT DISTINCT terracotta_quote_id 
              FROM soap_audit_log 
              WHERE quote_id = $2 
              AND terracotta_quote_id IS NOT NULL
            )
            OR (
              created_at >= $3 AND created_at <= $4
              AND soap_operation IN ('ProvideQuotation', 'ProvideQuotationWithAlterations', 'SavePolicyDetails', 'ScreeningQuestions', 'EmailPolicyDocuments')
              AND policy_id IS NULL
            )
            OR (
              terracotta_quote_id IN (
                SELECT DISTINCT terracotta_quote_id 
                FROM soap_audit_log 
                WHERE quote_id = $2 
                AND terracotta_quote_id IS NOT NULL
              )
              AND soap_operation IN ('ProvideQuotation', 'ProvideQuotationWithAlterations', 'SavePolicyDetails', 'ScreeningQuestions', 'EmailPolicyDocuments')
              AND policy_id IS NULL
            )
          )
          AND policy_id IS NULL
        `, [policyNumber, quoteId, oneHourBefore, oneHourAfter, terracottaQuoteId, terracottaPolicyId]);
        
        // ENHANCED: Also update operations that already have policy_id but missing Terracotta IDs
        const updateExistingPolicyId = await client.query(`
          UPDATE soap_audit_log 
          SET 
            terracotta_quote_id = COALESCE(terracotta_quote_id, $1),
            terracotta_policy_id = COALESCE(terracotta_policy_id, $2)
          WHERE policy_id = $3 
          AND (terracotta_quote_id IS NULL OR terracotta_policy_id IS NULL)
        `, [terracottaQuoteId, terracottaPolicyId, policyNumber]);
        
        console.log('✅ Updated existing policy_id operations with Terracotta IDs:', updateExistingPolicyId.rowCount);
        
        console.log('✅ SOAP audit log updated with policy_id =', policyNumber);
        console.log('📊 Rows updated:', updateResult.rowCount);
      }
    }

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
  console.error('❌ Server Error:', err.stack);
  
  // Handle CORS errors specifically
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      status: 'error',
      message: 'CORS Error: Origin not allowed',
      error: 'The request origin is not allowed by CORS policy'
    });
  }
  
  // Handle JSON parsing errors
  if (err.message === 'Invalid JSON') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid JSON',
      error: 'The request body contains invalid JSON'
    });
  }
  
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('🚫 404 - Route not found:', req.method, req.originalUrl);
  console.log('🚫 Headers:', req.headers);
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Travel Insurance API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  Database test: http://localhost:${PORT}/api/db-test`);
  console.log(`🌐 Server accessible from: http://0.0.0.0:${PORT}`);
});

module.exports = app;
