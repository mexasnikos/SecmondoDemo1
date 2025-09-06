const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for testing (instead of PostgreSQL)
let quotes = [];
let contacts = [];
let payments = [];
let nextId = 1;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Travel Insurance API is running',
    timestamp: new Date().toISOString()
  });
});

// Database test endpoint
app.get('/api/db-test', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Using in-memory storage (PostgreSQL not required)',
    stats: {
      quotes: quotes.length,
      contacts: contacts.length,
      payments: payments.length
    }
  });
});

// Create quote endpoint
app.post('/api/quotes', (req, res) => {
  try {
    const quoteData = req.body;
    
    // Validate required fields
    if (!quoteData.destination || !quoteData.startDate || !quoteData.endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: destination, startDate, endDate'
      });
    }

    const quote = {
      id: nextId++,
      ...quoteData,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    quotes.push(quote);

    console.log('✅ Quote created:', quote.id);
    res.json({
      status: 'success',
      message: 'Quote created successfully',
      data: { quoteId: quote.id }
    });
  } catch (error) {
    console.error('❌ Error creating quote:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create quote',
      error: error.message
    });
  }
});

// Get quote endpoint
app.get('/api/quotes/:id', (req, res) => {
  const quoteId = parseInt(req.params.id);
  const quote = quotes.find(q => q.id === quoteId);
  
  if (!quote) {
    return res.status(404).json({
      status: 'error',
      message: 'Quote not found'
    });
  }

  res.json({
    status: 'success',
    data: quote
  });
});

// Submit contact form endpoint
app.post('/api/contact', (req, res) => {
  try {
    const contactData = req.body;
    
    // Validate required fields
    if (!contactData.name || !contactData.email || !contactData.message) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: name, email, message'
      });
    }

    const contact = {
      id: nextId++,
      ...contactData,
      status: 'new',
      created_at: new Date().toISOString()
    };

    contacts.push(contact);

    console.log('✅ Contact message saved:', contact.id);
    res.json({
      status: 'success',
      message: 'Contact message saved successfully',
      data: { messageId: contact.id }
    });
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to save contact message',
      error: error.message
    });
  }
});

// Process payment endpoint
app.post('/api/payments', (req, res) => {
  try {
    const paymentData = req.body;
    
    console.log('💳 Processing payment:', { 
      quoteId: paymentData.quoteId, 
      amount: paymentData.amount,
      method: paymentData.paymentMethod 
    });

    // Validate required fields
    if (!paymentData.amount || !paymentData.paymentMethod) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required payment fields'
      });
    }

    // If quoteId is provided, try to find the quote, otherwise create a mock one
    let quote = null;
    if (paymentData.quoteId) {
      quote = quotes.find(q => q.id === paymentData.quoteId);
    }
    
    // If no quote found or no quoteId provided, create a temporary one for payment processing
    if (!quote) {
      console.log('⚠️ No quote found, creating temporary quote for payment');
      quote = {
        id: nextId++,
        destination: 'Unknown',
        tripType: 'single',
        status: 'pending',
        totalAmount: paymentData.amount,
        created_at: new Date().toISOString()
      };
      quotes.push(quote);
    }

    // Simulate payment processing
    const payment = {
      id: nextId++,
      quote_id: quote.id,
      payment_method: paymentData.paymentMethod,
      amount: paymentData.amount,
      status: 'completed',
      policy_number: `POL-${Date.now()}`,
      transaction_id: `TXN-${Math.random().toString(36).substring(7).toUpperCase()}`,
      billing_address: paymentData.billingAddress || {},
      created_at: new Date().toISOString()
    };

    // Update quote status
    quote.status = 'paid';
    quote.policy_number = payment.policy_number;

    payments.push(payment);

    console.log('✅ Payment processed successfully:', payment.policy_number);
    res.json({
      status: 'success',
      message: 'Payment processed successfully',
      data: {
        policyNumber: payment.policy_number,
        paymentId: payment.id,
        transactionId: payment.transaction_id
      }
    });
  } catch (error) {
    console.error('❌ Payment processing error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Payment processing failed',
      error: error.message
    });
  }
});

// Get statistics endpoint
app.get('/api/stats', (req, res) => {
  const stats = {
    totalQuotes: quotes.length,
    totalContacts: contacts.length,
    totalPayments: payments.length,
    paidQuotes: quotes.filter(q => q.status === 'paid').length,
    pendingQuotes: quotes.filter(q => q.status === 'pending').length,
    completedPayments: payments.filter(p => p.status === 'completed').length,
    totalRevenue: payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  };

  res.json({
    status: 'success',
    data: stats
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Travel Insurance API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  Database test: http://localhost:${PORT}/api/db-test`);
  console.log(`💾 Using in-memory storage (no PostgreSQL required)`);
  console.log(`🧪 Ready for testing quote and payment flows!`);
});
