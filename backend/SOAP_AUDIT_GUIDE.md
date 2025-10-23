# SOAP Audit System Guide

## Overview

This guide explains how to use the SOAP audit logging system to monitor and track all Terracotta API interactions for your Travel Insurance application.

## Database Table: `soap_audit_log`

### Purpose
The `soap_audit_log` table stores comprehensive information about every SOAP request and response, allowing you to:
- Monitor API performance and response times
- Debug integration issues
- Track which quotes have successful Terracotta interactions
- Ensure compliance and maintain audit trails
- Identify and troubleshoot failed requests

### Table Structure

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `quote_id` | INTEGER | Reference to local quote (may be NULL) |
| `soap_operation` | VARCHAR(100) | SOAP operation name (e.g., 'ProvideQuotation') |
| `soap_method` | VARCHAR(50) | HTTP method (usually 'POST') |
| `endpoint_url` | VARCHAR(500) | Full endpoint URL |
| `request_body` | TEXT | Complete SOAP XML request |
| `request_headers` | JSONB | HTTP request headers |
| `response_body` | TEXT | Complete SOAP XML response |
| `response_headers` | JSONB | HTTP response headers |
| `http_status_code` | INTEGER | HTTP status code (200, 500, etc.) |
| `terracotta_quote_id` | VARCHAR(100) | QuoteID from Terracotta |
| `terracotta_policy_id` | VARCHAR(100) | PolicyID from SavePolicyDetails |
| `user_id` | VARCHAR(50) | Terracotta UserID |
| `user_code` | VARCHAR(50) | Terracotta UserCode |
| `status` | VARCHAR(50) | Status: 'pending', 'success', 'failed', 'timeout', 'error' |
| `error_message` | TEXT | Error message if failed |
| `response_time_ms` | INTEGER | Response time in milliseconds |
| `created_at` | TIMESTAMP | When the request was made |
| `updated_at` | TIMESTAMP | Last update time |
| `client_ip` | INET | Client IP address |
| `user_agent` | TEXT | Client user agent |
| `session_id` | VARCHAR(255) | Session identifier |
| `parsed_response` | JSONB | Parsed response data |

## Setup Instructions

### 1. Create the Database Table

Run the SQL script to create the table and all associated views and functions:

```bash
cd backend
psql -U postgres -d travel_insurance -f create-soap-audit-table.sql
```

Or if you're using Windows:

```powershell
psql -U postgres -d travel_insurance -f create-soap-audit-table.sql
```

### 2. Start the Proxy Server

The proxy server (port 3001) automatically logs all SOAP requests:

```bash
cd server
node proxy-server.js
```

The proxy will connect to your PostgreSQL database and start logging all SOAP interactions.

### 3. Verify the Setup

Check the proxy server health:
```bash
curl http://localhost:3001/health
```

## API Endpoints

### Monitoring Endpoints

#### Get SOAP Logs
```http
GET http://localhost:3001/api/soap-logs
```

Query parameters:
- `operation` - Filter by SOAP operation (e.g., 'ProvideQuotation')
- `status` - Filter by status (e.g., 'success', 'failed', 'error')
- `limit` - Number of records to return (default: 100)
- `offset` - Offset for pagination (default: 0)

Example:
```bash
curl "http://localhost:3001/api/soap-logs?operation=ProvideQuotation&status=success&limit=10"
```

#### Get SOAP Summary Statistics
```http
GET http://localhost:3001/api/soap-logs/summary
```

Returns aggregated statistics by operation:
- Total requests
- Successful requests
- Failed requests
- Average/min/max response times
- Last request timestamp

Example:
```bash
curl http://localhost:3001/api/soap-logs/summary
```

#### Get Recent SOAP Errors
```http
GET http://localhost:3001/api/soap-logs/errors?limit=50
```

Returns the most recent failed/error SOAP requests.

Example:
```bash
curl http://localhost:3001/api/soap-logs/errors
```

#### Get SOAP Operations for a Quote
```http
GET http://localhost:3001/api/soap-logs/quote/{quoteId}
```

Returns all SOAP operations associated with a specific quote.

Example:
```bash
curl http://localhost:3001/api/soap-logs/quote/123
```

#### Check SOAP Completeness for a Quote
```http
GET http://localhost:3001/api/soap-logs/quote/{quoteId}/completeness
```

Checks if a quote has completed all required SOAP operations.

Example:
```bash
curl http://localhost:3001/api/soap-logs/quote/123/completeness
```

Response:
```json
{
  "status": "success",
  "quoteId": "123",
  "completeness": {
    "has_provide_quotation": true,
    "has_save_policy_details": true,
    "all_operations_successful": true,
    "operation_summary": "ProvideQuotation:success, SavePolicyDetails:success"
  }
}
```

## Database Views

### 1. `soap_request_summary`
Provides a summary of SOAP requests by operation:
```sql
SELECT * FROM soap_request_summary;
```

### 2. `quote_soap_history`
Shows all SOAP operations for each quote:
```sql
SELECT * FROM quote_soap_history WHERE quote_id = 123;
```

### 3. `recent_soap_errors`
Shows the last 100 SOAP errors:
```sql
SELECT * FROM recent_soap_errors;
```

### 4. `soap_performance_by_hour`
Performance metrics aggregated by hour:
```sql
SELECT * FROM soap_performance_by_hour;
```

## Database Functions

### 1. `get_quote_soap_operations(quote_id)`
Returns all SOAP operations for a specific quote:
```sql
SELECT * FROM get_quote_soap_operations(123);
```

### 2. `check_quote_soap_completeness(quote_id)`
Checks if a quote has completed all required operations:
```sql
SELECT * FROM check_quote_soap_completeness(123);
```

## Common Queries

### Find quotes with failed SOAP operations
```sql
SELECT DISTINCT quote_id, soap_operation, error_message, created_at
FROM soap_audit_log
WHERE status IN ('failed', 'error')
ORDER BY created_at DESC;
```

### Get average response time by operation
```sql
SELECT 
    soap_operation,
    COUNT(*) as total_requests,
    AVG(response_time_ms) as avg_response_time,
    MIN(response_time_ms) as min_response_time,
    MAX(response_time_ms) as max_response_time
FROM soap_audit_log
WHERE status = 'success'
GROUP BY soap_operation;
```

### Find quotes without SavePolicyDetails
```sql
SELECT DISTINCT q.id, q.policy_number, q.status
FROM quotes q
LEFT JOIN soap_audit_log sal 
    ON q.id = sal.quote_id 
    AND sal.soap_operation = 'SavePolicyDetails' 
    AND sal.status = 'success'
WHERE sal.id IS NULL
AND q.created_at >= NOW() - INTERVAL '7 days';
```

### Get today's SOAP activity
```sql
SELECT 
    soap_operation,
    status,
    COUNT(*) as count
FROM soap_audit_log
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY soap_operation, status
ORDER BY soap_operation, status;
```

### Find slow SOAP requests (> 5 seconds)
```sql
SELECT 
    id,
    soap_operation,
    response_time_ms,
    http_status_code,
    created_at
FROM soap_audit_log
WHERE response_time_ms > 5000
ORDER BY response_time_ms DESC;
```

## Monitoring Dashboard Example

You can create a simple monitoring dashboard by querying these endpoints:

```javascript
// Fetch SOAP summary
fetch('http://localhost:3001/api/soap-logs/summary')
  .then(res => res.json())
  .then(data => {
    console.log('SOAP Summary:', data.summary);
  });

// Fetch recent errors
fetch('http://localhost:3001/api/soap-logs/errors?limit=10')
  .then(res => res.json())
  .then(data => {
    console.log('Recent Errors:', data.errors);
  });

// Check completeness for a quote
fetch('http://localhost:3001/api/soap-logs/quote/123/completeness')
  .then(res => res.json())
  .then(data => {
    console.log('Quote Completeness:', data.completeness);
  });
```

## Troubleshooting

### No logs appearing in the database

1. **Check database connection:**
   ```bash
   psql -U postgres -d travel_insurance -c "SELECT COUNT(*) FROM soap_audit_log;"
   ```

2. **Verify proxy server is running:**
   ```bash
   curl http://localhost:3001/health
   ```

3. **Check proxy server logs:**
   Look for messages like "✅ SOAP request logged with ID: X"

### Logs showing but quote_id is NULL

This is normal for initial SOAP requests. The `quote_id` is only linked when you update the frontend to pass the quote ID in the SOAP request context.

### Database connection errors

1. Check your `.env` file has correct database credentials
2. Verify PostgreSQL is running:
   ```bash
   pg_isready -h localhost -p 5432
   ```

### Performance issues with large log tables

Consider these optimizations:

1. **Archive old logs:**
   ```sql
   -- Create archive table
   CREATE TABLE soap_audit_log_archive AS 
   SELECT * FROM soap_audit_log 
   WHERE created_at < NOW() - INTERVAL '90 days';
   
   -- Delete old logs
   DELETE FROM soap_audit_log 
   WHERE created_at < NOW() - INTERVAL '90 days';
   ```

2. **Add additional indexes if needed:**
   ```sql
   CREATE INDEX idx_soap_audit_created_at_status 
   ON soap_audit_log(created_at, status);
   ```

## Best Practices

1. **Regular Monitoring:** Check the `soap_request_summary` view daily
2. **Error Alerts:** Set up alerts for entries in `recent_soap_errors`
3. **Performance Tracking:** Monitor `response_time_ms` for degradation
4. **Data Retention:** Archive logs older than 90 days
5. **Security:** Don't log sensitive customer data in the audit logs

## Integration with Quote Workflow

To link SOAP logs with specific quotes in your application, you can update the `Quote2.tsx` to store the quote ID context before making Terracotta API calls. This allows you to track the complete journey of each quote through the Terracotta system.

## Support

For issues or questions about the SOAP audit system:
1. Check the proxy server console for error messages
2. Review the PostgreSQL logs
3. Query the `recent_soap_errors` view for specific error details
4. Check the `parsed_response` JSONB field for detailed response data

## License

This SOAP audit system is part of the Travel Insurance Demo application.

