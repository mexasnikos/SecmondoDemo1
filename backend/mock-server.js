const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5002;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for testing
let quotes = [];
let contacts = [];
let payments = [];
let quoteIdCounter = 1;
let messageIdCounter = 1;
let paymentIdCounter = 1;

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
    message: 'Mock database connection successful',
    tables: 7,
    records: quotes.length + contacts.length + payments.length
  });
});

// Create new quote
app.post('/api/quotes', (req, res) => {
  try {
    const quoteData = req.body;
    
    const newQuote = {
      id: quoteIdCounter++,
      destination: quoteData.destination,
      startDate: quoteData.startDate,
      endDate: quoteData.endDate,
      tripType: quoteData.tripType,
      numberOfTravelers: quoteData.numberOfTravelers,
      travelers: quoteData.travelers,
      selectedQuote: quoteData.selectedQuote,
      additionalPolicies: quoteData.additionalPolicies,
      totalAmount: quoteData.totalAmount,
      status: 'pending',
      policy_number: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    quotes.push(newQuote);
    
    console.log('✅ Quote created:', { id: newQuote.id, destination: quoteData.destination });
    
    res.json({
      status: 'success',
      message: 'Quote created successfully',
      data: { quoteId: newQuote.id }
    });
  } catch (error) {
    console.error('❌ Quote creation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create quote',
      error: error.message
    });
  }
});

// Get quote by ID
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
    message: 'Quote retrieved successfully',
    data: quote
  });
});

// Submit contact form
app.post('/api/contact', (req, res) => {
  try {
    const contactData = req.body;
    
    const newMessage = {
      id: messageIdCounter++,
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject,
      message: contactData.message,
      status: 'new',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    contacts.push(newMessage);
    
    console.log('✅ Contact message created:', { id: newMessage.id, subject: contactData.subject });
    
    res.json({
      status: 'success',
      message: 'Contact message submitted successfully',
      data: { messageId: newMessage.id }
    });
  } catch (error) {
    console.error('❌ Contact submission error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit contact message',
      error: error.message
    });
  }
});

// Process payment
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
        id: quoteIdCounter++,
        destination: 'Unknown',
        tripType: 'single',
        status: 'pending',
        totalAmount: paymentData.amount,
        created_at: new Date().toISOString()
      };
      quotes.push(quote);
    }

    // Simulate payment processing
    const policyNumber = `POL-${Date.now()}`;
    
    const newPayment = {
      id: paymentIdCounter++,
      quote_id: quote.id,
      payment_method: paymentData.paymentMethod,
      amount: paymentData.amount,
      status: 'completed',
      policy_number: policyNumber,
      transaction_id: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      billing_address: paymentData.billingAddress || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    payments.push(newPayment);
    
    // Update quote status
    quote.status = 'paid';
    quote.policy_number = policyNumber;
    quote.updated_at = new Date().toISOString();
    
    console.log('✅ Payment processed successfully:', policyNumber);
    
    res.json({
      status: 'success',
      message: 'Payment processed successfully',
      data: { 
        policyNumber: policyNumber,
        paymentId: newPayment.id
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

// Get statistics
app.get('/api/stats', (req, res) => {
  const totalQuotes = quotes.length;
  const completedPayments = payments.filter(p => p.status === 'completed').length;
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);
  
  res.json({
    status: 'success',
    message: 'Statistics retrieved successfully',
    data: {
      totalQuotes,
      completedPayments,
      totalRevenue,
      totalContacts: contacts.length,
      lastUpdate: new Date().toISOString()
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Travel Insurance Mock API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  Database test: http://localhost:${PORT}/api/db-test`);
  console.log(`💳 Payment processing: ENABLED (Mock mode)`);
  console.log(`📧 Contact forms: ENABLED`);
  console.log(`📈 Quote system: ENABLED`);
});
