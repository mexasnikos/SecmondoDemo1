/**
 * SOAP Audit Logger Module
 * 
 * This module provides functions to log SOAP requests and responses
 * to the soap_audit_log table for monitoring and debugging.
 */

const { Pool } = require('pg');

// Database connection pool (reuse from main server or create new)
let pool;

function initializePool(dbPool) {
  pool = dbPool;
}

/**
 * Log a SOAP request/response to the database
 * 
 * @param {Object} logData - The SOAP audit log data
 * @param {number} logData.quoteId - Local quote ID (optional)
 * @param {string} logData.soapOperation - SOAP operation name (e.g., 'ProvideQuotation')
 * @param {string} logData.soapMethod - HTTP method (usually 'POST')
 * @param {string} logData.endpointUrl - Full endpoint URL
 * @param {string} logData.requestBody - Complete SOAP XML request
 * @param {Object} logData.requestHeaders - Request headers as object
 * @param {string} logData.responseBody - Complete SOAP XML response
 * @param {Object} logData.responseHeaders - Response headers as object
 * @param {number} logData.httpStatusCode - HTTP status code
 * @param {string} logData.terracottaQuoteId - Terracotta QuoteID from response
 * @param {string} logData.terracottaPolicyId - Terracotta PolicyID from response
 * @param {string} logData.userId - Terracotta UserID
 * @param {string} logData.userCode - Terracotta UserCode
 * @param {string} logData.status - Status: 'pending', 'success', 'failed', 'timeout', 'error'
 * @param {string} logData.errorMessage - Error message if failed
 * @param {number} logData.responseTimeMs - Response time in milliseconds
 * @param {string} logData.clientIp - Client IP address
 * @param {string} logData.userAgent - User agent string
 * @param {string} logData.sessionId - Session identifier
 * @param {Object} logData.parsedResponse - Parsed response data as object
 * 
 * @returns {Promise<number>} The ID of the created log entry
 */
async function logSOAPRequest(logData) {
  try {
    if (!pool) {
      console.error('Database pool not initialized. Call initializePool() first.');
      return null;
    }

    const query = `
      INSERT INTO soap_audit_log (
        quote_id,
        soap_operation,
        soap_method,
        endpoint_url,
        request_body,
        request_headers,
        response_body,
        response_headers,
        http_status_code,
        terracotta_quote_id,
        terracotta_policy_id,
        user_id,
        user_code,
        status,
        error_message,
        response_time_ms,
        client_ip,
        user_agent,
        session_id,
        parsed_response
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
      ) RETURNING id
    `;

    const values = [
      logData.quoteId || null,
      logData.soapOperation,
      logData.soapMethod || 'POST',
      logData.endpointUrl,
      logData.requestBody,
      logData.requestHeaders ? JSON.stringify(logData.requestHeaders) : null,
      logData.responseBody || null,
      logData.responseHeaders ? JSON.stringify(logData.responseHeaders) : null,
      logData.httpStatusCode || null,
      logData.terracottaQuoteId || null,
      logData.terracottaPolicyId || null,
      logData.userId || null,
      logData.userCode || null,
      logData.status || 'pending',
      logData.errorMessage || null,
      logData.responseTimeMs || null,
      logData.clientIp || null,
      logData.userAgent || null,
      logData.sessionId || null,
      logData.parsedResponse ? JSON.stringify(logData.parsedResponse) : null
    ];

    const result = await pool.query(query, values);
    const logId = result.rows[0].id;
    
    console.log(`✅ SOAP request logged successfully (ID: ${logId}) - Operation: ${logData.soapOperation}`);
    return logId;
  } catch (error) {
    console.error('❌ Error logging SOAP request:', error);
    // Don't throw error - logging should not break the main flow
    return null;
  }
}

/**
 * Update an existing SOAP log entry (useful for updating after receiving response)
 * 
 * @param {number} logId - The ID of the log entry to update
 * @param {Object} updateData - The data to update
 */
async function updateSOAPLog(logId, updateData) {
  try {
    if (!pool) {
      console.error('Database pool not initialized. Call initializePool() first.');
      return false;
    }

    const updates = [];
    const values = [];
    let valueIndex = 1;

    // Build dynamic UPDATE query based on provided fields
    const fieldMapping = {
      responseBody: 'response_body',
      responseHeaders: 'response_headers',
      httpStatusCode: 'http_status_code',
      terracottaQuoteId: 'terracotta_quote_id',
      terracottaPolicyId: 'terracotta_policy_id',
      status: 'status',
      errorMessage: 'error_message',
      responseTimeMs: 'response_time_ms',
      parsedResponse: 'parsed_response'
    };

    for (const [jsField, dbField] of Object.entries(fieldMapping)) {
      if (updateData.hasOwnProperty(jsField)) {
        let value = updateData[jsField];
        
        // Convert objects to JSON strings for JSONB fields
        if (['responseHeaders', 'parsedResponse'].includes(jsField) && value !== null) {
          value = JSON.stringify(value);
        }
        
        updates.push(`${dbField} = $${valueIndex}`);
        values.push(value);
        valueIndex++;
      }
    }

    if (updates.length === 0) {
      console.warn('No fields to update in SOAP log');
      return false;
    }

    // Always update the updated_at timestamp
    updates.push(`updated_at = NOW()`);

    const query = `
      UPDATE soap_audit_log 
      SET ${updates.join(', ')}
      WHERE id = $${valueIndex}
    `;
    
    values.push(logId);

    await pool.query(query, values);
    console.log(`✅ SOAP log updated successfully (ID: ${logId})`);
    return true;
  } catch (error) {
    console.error('❌ Error updating SOAP log:', error);
    return false;
  }
}

/**
 * Get all SOAP operations for a specific quote
 * 
 * @param {number} quoteId - The quote ID
 * @returns {Promise<Array>} Array of SOAP operations
 */
async function getQuoteSOAPOperations(quoteId) {
  try {
    if (!pool) {
      console.error('Database pool not initialized.');
      return [];
    }

    const query = `
      SELECT * FROM get_quote_soap_operations($1)
    `;
    
    const result = await pool.query(query, [quoteId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching quote SOAP operations:', error);
    return [];
  }
}

/**
 * Check SOAP operation completeness for a quote
 * 
 * @param {number} quoteId - The quote ID
 * @returns {Promise<Object>} Completeness check result
 */
async function checkQuoteSOAPCompleteness(quoteId) {
  try {
    if (!pool) {
      console.error('Database pool not initialized.');
      return null;
    }

    const query = `
      SELECT * FROM check_quote_soap_completeness($1)
    `;
    
    const result = await pool.query(query, [quoteId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error checking quote SOAP completeness:', error);
    return null;
  }
}

/**
 * Get recent SOAP errors for monitoring
 * 
 * @param {number} limit - Maximum number of errors to return (default: 50)
 * @returns {Promise<Array>} Array of recent errors
 */
async function getRecentSOAPErrors(limit = 50) {
  try {
    if (!pool) {
      console.error('Database pool not initialized.');
      return [];
    }

    const query = `
      SELECT * FROM recent_soap_errors
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching recent SOAP errors:', error);
    return [];
  }
}

/**
 * Get SOAP request summary statistics
 * 
 * @returns {Promise<Array>} Array of summary statistics by operation
 */
async function getSOAPRequestSummary() {
  try {
    if (!pool) {
      console.error('Database pool not initialized.');
      return [];
    }

    const query = `SELECT * FROM soap_request_summary`;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching SOAP request summary:', error);
    return [];
  }
}

/**
 * Wrapper function to track a SOAP request from start to finish
 * 
 * Usage:
 * const tracker = await trackSOAPRequest({
 *   soapOperation: 'ProvideQuotation',
 *   endpointUrl: 'https://api.terracotta.com/...',
 *   requestBody: soapXml,
 *   userId: '4072',
 *   userCode: '111427'
 * });
 * 
 * // ... make SOAP request ...
 * 
 * await tracker.complete({
 *   responseBody: responseXml,
 *   httpStatusCode: 200,
 *   status: 'success',
 *   terracottaQuoteId: 'ABC123'
 * });
 */
async function trackSOAPRequest(initialData) {
  const startTime = Date.now();
  const logId = await logSOAPRequest({
    ...initialData,
    status: 'pending'
  });

  return {
    logId,
    async complete(responseData) {
      const responseTimeMs = Date.now() - startTime;
      await updateSOAPLog(logId, {
        ...responseData,
        responseTimeMs
      });
    },
    async fail(errorMessage) {
      const responseTimeMs = Date.now() - startTime;
      await updateSOAPLog(logId, {
        status: 'error',
        errorMessage,
        responseTimeMs
      });
    }
  };
}

module.exports = {
  initializePool,
  logSOAPRequest,
  updateSOAPLog,
  getQuoteSOAPOperations,
  checkQuoteSOAPCompleteness,
  getRecentSOAPErrors,
  getSOAPRequestSummary,
  trackSOAPRequest
};

