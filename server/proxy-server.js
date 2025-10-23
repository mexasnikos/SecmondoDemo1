/**
 * Terracotta API Proxy Server
 * This server acts as a proxy to bypass CORS restrictions
 * Run with: node server/proxy-server.js
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { Pool } = require('pg');
require('dotenv').config();

// Import SOAP logger
const soapLogger = require('../backend/soap-logger');

const app = express();
const PORT = 3001; // Different port from your React app

// PostgreSQL connection (for SOAP logging)
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travel_insurance',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Initialize SOAP logger with database pool
soapLogger.initializePool(pool);

// Test database connection
pool.on('connect', () => {
  console.log('✅ SOAP Logger: Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ SOAP Logger: Database connection error:', err);
});

// Middleware
app.use(cors());
app.use(express.text({ type: 'text/xml' }));
app.use(express.json()); // For JSON bodies

// Terracotta API endpoint - UAT Environment
const TERRACOTTA_BASE_URL = 'https://asuauat.terracottatest.com/ws/integratedquote.asmx';

// Helper function to extract data from SOAP XML
function extractSOAPData(soapXml) {
  const data = {
    userID: null,
    userCode: null,
    quoteID: null,
    policyID: null,
    travellerNumbers: []
  };
  
  try {
    // Extract UserID
    const userIDMatch = soapXml.match(/<userID>(\d+)<\/userID>/);
    if (userIDMatch) data.userID = userIDMatch[1];
    
    // Extract UserCode
    const userCodeMatch = soapXml.match(/<userCode>(\d+)<\/userCode>/);
    if (userCodeMatch) data.userCode = userCodeMatch[1];
    
    // Extract QuoteID
    const quoteIDMatch = soapXml.match(/<quoteID>([^<]+)<\/quoteID>/);
    if (quoteIDMatch) data.quoteID = quoteIDMatch[1];
    
    // Extract PolicyID
    const policyIDMatch = soapXml.match(/<policyID>([^<]+)<\/policyID>/);
    if (policyIDMatch) data.policyID = policyIDMatch[1];
    
    // Extract TravellerNumbers from REQUEST (what we're sending to Terracotta)
    const travellerNumberMatches = soapXml.matchAll(/<TravellerNumber>([^<]+)<\/TravellerNumber>/gi);
    const travellerNumbers = Array.from(travellerNumberMatches).map(match => match[1]).filter(num => num && num.trim());
    
    if (travellerNumbers.length > 0) {
      data.travellerNumbers = travellerNumbers;
      console.log(`📤 REQUEST contains ${travellerNumbers.length} TravellerNumbers: ${travellerNumbers.join(', ')}`);
    }
  } catch (err) {
    console.error('Error extracting SOAP data:', err);
  }
  
  return data;
}

// Helper function to extract Terracotta response data
function extractResponseData(responseXml) {
  const data = {
    terracottaQuoteId: null,
    terracottaPolicyId: null,
    message: null,
    allQuoteIds: [],
    travellerNumbers: []
  };
  
  try {
    // Extract ALL QuoteIDs from response (ProvideQuotation returns multiple)
    const quoteIDMatches = responseXml.matchAll(/<QuoteID>([^<]+)<\/QuoteID>/g);
    const quoteIds = Array.from(quoteIDMatches).map(match => match[1]).filter(id => id && id.trim());
    
    if (quoteIds.length > 0) {
      data.terracottaQuoteId = quoteIds[0]; // Use first one as primary
      data.allQuoteIds = quoteIds;
      console.log(`📋 Extracted ${quoteIds.length} Quote IDs from response: ${quoteIds.join(', ')}`);
    }
    
    // Extract TravellerNumbers from response (ProvideQuotation and ProvideQuotationWithAlterations)
    const travellerNumberMatches = responseXml.matchAll(/<TravellerNumber>([^<]+)<\/TravellerNumber>/gi);
    const travellerNumbers = Array.from(travellerNumberMatches).map(match => match[1]).filter(num => num && num.trim());
    
    if (travellerNumbers.length > 0) {
      data.travellerNumbers = travellerNumbers;
      console.log(`👥 Extracted ${travellerNumbers.length} Traveller Numbers from response: ${travellerNumbers.join(', ')}`);
    }
    
    // Extract PolicyID from SavePolicyDetails response
    const policyIDMatch = responseXml.match(/<policyID>([^<]+)<\/policyID>/i);
    if (policyIDMatch && policyIDMatch[1] && policyIDMatch[1].trim()) {
      data.terracottaPolicyId = policyIDMatch[1].trim();
      console.log(`📋 Extracted Policy ID: ${data.terracottaPolicyId}`);
    }
    
    // Alternative: Check for PolicyNumber tag (some APIs use this)
    if (!data.terracottaPolicyId) {
      const policyNumberMatch = responseXml.match(/<PolicyNumber>([^<]+)<\/PolicyNumber>/i);
      if (policyNumberMatch && policyNumberMatch[1] && policyNumberMatch[1].trim()) {
        data.terracottaPolicyId = policyNumberMatch[1].trim();
        console.log(`📋 Extracted Policy Number: ${data.terracottaPolicyId}`);
      }
    }
    
    // Extract Message from response
    const messageMatch = responseXml.match(/<[Mm]essage>([^<]+)<\/[Mm]essage>/);
    if (messageMatch) {
      data.message = messageMatch[1];
    }
    
    // Extract error message if present
    const errorMatch = responseXml.match(/<[Ee]rror[Mm]essage>([^<]+)<\/[Ee]rror[Mm]essage>/);
    if (errorMatch) {
      data.message = errorMatch[1];
    }
    
  } catch (err) {
    console.error('❌ Error extracting response data:', err);
  }
  
  return data;
}

// Proxy endpoint for all Terracotta API calls
app.post('/api/terracotta/*', async (req, res) => {
  const startTime = Date.now();
  let logId = null;
  
  try {
    const method = req.params[0]; // Extract method from URL
    const soapBody = req.body;
    
    console.log(`🔄 Proxying request to Terracotta API: ${method}`);
    console.log('📤 SOAP Body:', soapBody.substring(0, 500) + '...'); // Log first 500 chars
    
    // Extract data from SOAP request
    const requestData = extractSOAPData(soapBody);
    
    // Log SOAP request to database
    logId = await soapLogger.logSOAPRequest({
      soapOperation: method,
      soapMethod: 'POST',
      endpointUrl: TERRACOTTA_BASE_URL,
      requestBody: soapBody,
      requestHeaders: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': `WS-IntegratedQuote/${method}`
      },
      userId: requestData.userID,
      userCode: requestData.userCode,
      terracottaQuoteId: requestData.quoteID,
      status: 'pending',
      clientIp: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      parsedResponse: {
        requestTravellerNumbers: requestData.travellerNumbers || [],
        requestTravellerCount: requestData.travellerNumbers ? requestData.travellerNumbers.length : 0
      }
    });
    
    console.log(`📝 SOAP request logged with ID: ${logId}`);
    
    // Make the request to Terracotta API
    const response = await fetch(TERRACOTTA_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': `WS-IntegratedQuote/${method}`
      },
      body: soapBody
    });

    const responseText = await response.text();
    const responseTimeMs = Date.now() - startTime;
    
    console.log('📥 Terracotta API Response Status:', response.status);
    console.log('📥 Terracotta API Response:', responseText.substring(0, 500) + '...'); // Log first 500 chars
    console.log(`⏱️  Response time: ${responseTimeMs}ms`);
    
    // Extract response data
    const responseData = extractResponseData(responseText);
    
    // Determine status based on response
    let status = 'success';
    let errorMessage = null;
    
    if (!response.ok) {
      status = 'failed';
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    } else if (responseText.includes('error') || responseText.includes('Error')) {
      status = 'error';
      errorMessage = responseData.message || 'API returned an error';
    }
    
    // Update SOAP log with response
    if (logId) {
      // Prepare enhanced parsed response with all extracted data
      const enhancedParsedResponse = {
        ...responseData,
        operation: method,
        allQuoteIds: responseData.allQuoteIds || [],
        quoteCount: responseData.allQuoteIds ? responseData.allQuoteIds.length : 0,
        hasMultipleQuotes: responseData.allQuoteIds && responseData.allQuoteIds.length > 1,
        travellerNumbers: responseData.travellerNumbers || [],
        travellerCount: responseData.travellerNumbers ? responseData.travellerNumbers.length : 0
      };
      
      await soapLogger.updateSOAPLog(logId, {
        responseBody: responseText,
        responseHeaders: Object.fromEntries(response.headers.entries()),
        httpStatusCode: response.status,
        terracottaQuoteId: responseData.terracottaQuoteId || requestData.quoteID,
        terracottaPolicyId: responseData.terracottaPolicyId,
        status: status,
        errorMessage: errorMessage,
        responseTimeMs: responseTimeMs,
        parsedResponse: enhancedParsedResponse
      });
      
      console.log(`✅ SOAP log updated (ID: ${logId}) - Status: ${status}`);
      
      // Log what we captured
      if (requestData.travellerNumbers && requestData.travellerNumbers.length > 0) {
        console.log(`   👥 REQUEST TravellerNumbers: ${requestData.travellerNumbers.join(', ')}`);
      }
      if (responseData.terracottaQuoteId) {
        console.log(`   📋 Terracotta Quote ID stored: ${responseData.terracottaQuoteId}`);
      }
      if (responseData.terracottaPolicyId) {
        console.log(`   🎫 Terracotta Policy ID stored: ${responseData.terracottaPolicyId}`);
      }
      if (responseData.allQuoteIds && responseData.allQuoteIds.length > 1) {
        console.log(`   📋 Total quote IDs in response: ${responseData.allQuoteIds.length}`);
      }
      if (responseData.travellerNumbers && responseData.travellerNumbers.length > 0) {
        console.log(`   👥 Total traveller numbers in response: ${responseData.travellerNumbers.length}`);
      }
    }
    
    // Return the response to the client
    res.set('Content-Type', 'text/xml; charset=utf-8');
    res.status(response.status).send(responseText);
    
  } catch (error) {
    const responseTimeMs = Date.now() - startTime;
    
    console.error('❌ Proxy error:', error);
    
    // Update log with error if we created one
    if (logId) {
      await soapLogger.updateSOAPLog(logId, {
        status: 'error',
        errorMessage: error.message,
        responseTimeMs: responseTimeMs
      });
    }
    
    res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Terracotta Proxy Server is running',
    timestamp: new Date().toISOString()
  });
});

// SOAP Monitoring Endpoints

// Get recent SOAP errors
app.get('/api/soap-logs/errors', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const errors = await soapLogger.getRecentSOAPErrors(limit);
    res.json({
      status: 'success',
      count: errors.length,
      errors: errors
    });
  } catch (error) {
    console.error('Error fetching SOAP errors:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get SOAP request summary statistics
app.get('/api/soap-logs/summary', async (req, res) => {
  try {
    const summary = await soapLogger.getSOAPRequestSummary();
    res.json({
      status: 'success',
      summary: summary
    });
  } catch (error) {
    console.error('Error fetching SOAP summary:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get SOAP operations for a specific quote
app.get('/api/soap-logs/quote/:quoteId', async (req, res) => {
  try {
    const { quoteId } = req.params;
    const operations = await soapLogger.getQuoteSOAPOperations(quoteId);
    res.json({
      status: 'success',
      quoteId: quoteId,
      count: operations.length,
      operations: operations
    });
  } catch (error) {
    console.error('Error fetching quote SOAP operations:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Check SOAP completeness for a quote
app.get('/api/soap-logs/quote/:quoteId/completeness', async (req, res) => {
  try {
    const { quoteId } = req.params;
    const completeness = await soapLogger.checkQuoteSOAPCompleteness(quoteId);
    res.json({
      status: 'success',
      quoteId: quoteId,
      completeness: completeness
    });
  } catch (error) {
    console.error('Error checking quote SOAP completeness:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get all SOAP logs with filtering
app.get('/api/soap-logs', async (req, res) => {
  try {
    const {
      operation,
      status,
      limit = 100,
      offset = 0
    } = req.query;
    
    let query = 'SELECT * FROM soap_audit_log WHERE 1=1';
    const values = [];
    let valueIndex = 1;
    
    if (operation) {
      query += ` AND soap_operation = $${valueIndex}`;
      values.push(operation);
      valueIndex++;
    }
    
    if (status) {
      query += ` AND status = $${valueIndex}`;
      values.push(status);
      valueIndex++;
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`;
    values.push(parseInt(limit), parseInt(offset));
    
    const result = await pool.query(query, values);
    
    res.json({
      status: 'success',
      count: result.rows.length,
      logs: result.rows
    });
  } catch (error) {
    console.error('Error fetching SOAP logs:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Terracotta Proxy Server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying requests to: ${TERRACOTTA_BASE_URL}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 SOAP Logs: http://localhost:${PORT}/api/soap-logs`);
  console.log(`📊 SOAP Summary: http://localhost:${PORT}/api/soap-logs/summary`);
  console.log(`❌ SOAP Errors: http://localhost:${PORT}/api/soap-logs/errors`);
});

module.exports = app;
