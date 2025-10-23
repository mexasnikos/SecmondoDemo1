const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5003;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Optimized PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travel_insurance',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  // Connection pool optimizations
  max: 20, // Maximum number of clients in the pool
  min: 5,  // Minimum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  maxUses: 7500, // Close (and replace) a connection after it has been used 7500 times
});

// Connection event handlers
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
  process.exit(-1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

// Cache for frequently accessed data
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Cache middleware
const cacheMiddleware = (key, ttl = CACHE_TTL) => {
  return (req, res, next) => {
    const cacheKey = `${key}_${JSON.stringify(req.query)}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return res.json(cached.data);
    }
    
    res.sendResponse = res.json;
    res.json = (data) => {
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      res.sendResponse(data);
    };
    
    next();
  };
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Travel Insurance API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Database test with caching
app.get('/api/db-test', cacheMiddleware('db-test', 30000), async (req, res) => {
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

// Statistics with caching
app.get('/api/stats', cacheMiddleware('stats'), async (req, res) => {
  try {
    // Use Promise.all for parallel queries
    const [
      totalQuotesResult,
      paidQuotesResult,
      revenueResult,
      destinationsResult,
      recentActivityResult
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM quotes'),
      pool.query("SELECT COUNT(*) FROM quotes WHERE status = 'paid'"),
      pool.query("SELECT SUM(total_amount) FROM quotes WHERE status = 'paid'"),
      pool.query(`
        SELECT destination, COUNT(*) as count 
        FROM quotes 
        GROUP BY destination 
        ORDER BY count DESC 
        LIMIT 5
      `),
      pool.query(`
        SELECT DATE(created_at) as date, COUNT(*) as quotes
        FROM quotes 
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `)
    ]);

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

// Create quote with transaction optimization
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

    // Batch insert travelers
    if (travelers && travelers.length > 0) {
      const travelerValues = travelers.map((traveler, index) => {
        const baseIndex = index * 9;
        return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7}, $${baseIndex + 8}, $${baseIndex + 9})`;
      }).join(', ');

      const travelerParams = travelers.flatMap(traveler => [
        quoteId, traveler.firstName, traveler.lastName, 
        traveler.age, traveler.email, traveler.phone, 
        traveler.vaxId, traveler.nationality, traveler.travellerNumber || null
      ]);

      await client.query(
        `INSERT INTO travelers (
          quote_id, first_name, last_name, age, email, 
          phone, vax_id, nationality, traveller_number
        ) VALUES ${travelerValues}`,
        travelerParams
      );
    }

    // Batch insert additional policies
    if (additionalPolicies && additionalPolicies.length > 0) {
      const policyValues = additionalPolicies.map((policy, index) => {
        const baseIndex = index * 5;
        return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5})`;
      }).join(', ');

      const policyParams = additionalPolicies.flatMap(policy => [
        quoteId, policy.id, policy.name, policy.description, policy.price
      ]);

      await client.query(
        `INSERT INTO additional_policies (
          quote_id, policy_id, name, description, price
        ) VALUES ${policyValues}`,
        policyParams
      );
    }

    await client.query('COMMIT');

    // Clear relevant cache
    cache.delete('stats');

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

// Get quotes with pagination and caching
app.get('/api/quotes', cacheMiddleware('quotes', 60000), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Max 100 per page
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

// Process payment with optimization
app.post('/api/payments', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      quoteId,
      paymentMethod,
      amount,
      billingAddress,
      termsAccepted, // New field to track terms acceptance
      policyNumber: terracottaPolicyNumber // Policy ID from Terracotta SavePolicyDetails
    } = req.body;

    console.log('Payment request - QuoteId:', quoteId, 'Terracotta Policy Number:', terracottaPolicyNumber);

    // Check if quote already has a policy number
    const existingQuoteResult = await client.query(
      'SELECT policy_number FROM quotes WHERE id = $1',
      [quoteId]
    );

    let policyNumber;
    if (existingQuoteResult.rows[0]?.policy_number) {
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

    // Insert payment record
    const paymentResult = await client.query(
      `INSERT INTO payments (
        quote_id, payment_method, amount, status, 
        policy_number, billing_address, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
      RETURNING id`,
      [quoteId, paymentMethod, amount, 'completed', 
       policyNumber, JSON.stringify(billingAddress)]
    );

    // Update quote status and terms acceptance
    await client.query(
      'UPDATE quotes SET status = $1, policy_number = $2, terms_accepted = $3 WHERE id = $4',
      ['paid', policyNumber, termsAccepted || false, quoteId]
    );
    
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

    await client.query('COMMIT');

    // Clear cache
    cache.delete('stats');
    cache.delete('quotes');

    res.status(201).json({
      status: 'success',
      message: 'Payment processed successfully',
      data: {
        policyNumber: policyNumber,
        paymentId: paymentResult.rows[0].id,
        quoteId: quoteId
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
  console.log(`⚡ Performance optimizations enabled`);
});

module.exports = app;
