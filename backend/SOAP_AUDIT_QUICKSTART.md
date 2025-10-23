# SOAP Audit System - Quick Start Guide

## What is This?

This SOAP audit system automatically logs **every** Terracotta API request and response to your database, allowing you to:

✅ Monitor which quotes have proper SOAP interactions  
✅ Track ProvideQuotation, SavePolicyDetails, and other operations  
✅ Debug failed API calls  
✅ Measure API performance  
✅ Maintain compliance audit trails  

## Quick Setup (3 Steps)

### Step 1: Create the Database Table

**Windows:**
```cmd
cd backend
setup-soap-audit.bat
```

**Linux/Mac:**
```bash
cd backend
node setup-soap-audit.js
```

This creates:
- `soap_audit_log` table
- 4 monitoring views
- 2 helper functions
- Performance indexes

### Step 2: Start the Proxy Server

The proxy server on port 3001 handles all SOAP requests and automatically logs them.

```bash
cd server
node proxy-server.js
```

You should see:
```
🚀 Terracotta Proxy Server running on http://localhost:3001
✅ SOAP Logger: Connected to PostgreSQL database
📡 Proxying requests to: https://www.asuaonline.com/ws/integratedquote.asmx
```

### Step 3: Test It!

Make a quote in your application, then check the logs:

**View Summary:**
```bash
curl http://localhost:3001/api/soap-logs/summary
```

**View Recent Logs:**
```bash
curl http://localhost:3001/api/soap-logs?limit=10
```

**View Errors:**
```bash
curl http://localhost:3001/api/soap-logs/errors
```

## What Gets Logged?

Every SOAP request logs:
- ✓ Complete SOAP XML request and response
- ✓ HTTP status code and headers
- ✓ Response time in milliseconds
- ✓ Terracotta Quote ID and Policy ID
- ✓ Success/failure status
- ✓ Error messages (if any)
- ✓ Timestamp of request

## Quick Database Queries

### See all SOAP operations
```sql
SELECT * FROM soap_audit_log ORDER BY created_at DESC LIMIT 10;
```

### Check quote's SOAP history
```sql
SELECT * FROM get_quote_soap_operations(123);  -- Replace 123 with your quote ID
```

### Find failed requests
```sql
SELECT * FROM recent_soap_errors;
```

### Get performance stats
```sql
SELECT * FROM soap_request_summary;
```

### Check if quote has all required operations
```sql
SELECT * FROM check_quote_soap_completeness(123);  -- Replace 123 with your quote ID
```

## API Endpoints

All endpoints run on the proxy server (http://localhost:3001):

| Endpoint | Purpose |
|----------|---------|
| `GET /api/soap-logs` | Get all SOAP logs (with filtering) |
| `GET /api/soap-logs/summary` | Get summary statistics by operation |
| `GET /api/soap-logs/errors` | Get recent errors |
| `GET /api/soap-logs/quote/:id` | Get all SOAP operations for a quote |
| `GET /api/soap-logs/quote/:id/completeness` | Check if quote has all required operations |

### Examples

```bash
# Get last 10 ProvideQuotation requests
curl "http://localhost:3001/api/soap-logs?operation=ProvideQuotation&limit=10"

# Get summary statistics
curl http://localhost:3001/api/soap-logs/summary

# Get SOAP history for quote #42
curl http://localhost:3001/api/soap-logs/quote/42

# Check completeness for quote #42
curl http://localhost:3001/api/soap-logs/quote/42/completeness
```

## Monitoring Dashboard (Example)

You can build a simple monitoring page:

```javascript
// Fetch statistics
async function getSOAPStats() {
  const response = await fetch('http://localhost:3001/api/soap-logs/summary');
  const data = await response.json();
  
  data.summary.forEach(op => {
    console.log(`${op.soap_operation}:`);
    console.log(`  Total: ${op.total_requests}`);
    console.log(`  Success: ${op.successful_requests}`);
    console.log(`  Failed: ${op.failed_requests}`);
    console.log(`  Avg Response Time: ${op.avg_response_time_ms}ms`);
  });
}

// Check quote completeness
async function checkQuote(quoteId) {
  const response = await fetch(
    `http://localhost:3001/api/soap-logs/quote/${quoteId}/completeness`
  );
  const data = await response.json();
  
  console.log('Quote Completeness:', data.completeness);
  // {
  //   has_provide_quotation: true,
  //   has_save_policy_details: true,
  //   all_operations_successful: true,
  //   operation_summary: "ProvideQuotation:success, SavePolicyDetails:success"
  // }
}
```

## Common Use Cases

### 1. Find quotes with failed SOAP operations
```sql
SELECT DISTINCT quote_id, soap_operation, error_message
FROM soap_audit_log
WHERE status IN ('failed', 'error')
ORDER BY created_at DESC;
```

### 2. Monitor today's API activity
```sql
SELECT soap_operation, status, COUNT(*)
FROM soap_audit_log
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY soap_operation, status;
```

### 3. Find slow requests (> 3 seconds)
```sql
SELECT soap_operation, response_time_ms, created_at
FROM soap_audit_log
WHERE response_time_ms > 3000
ORDER BY response_time_ms DESC;
```

### 4. Get average response time by operation
```sql
SELECT soap_operation, AVG(response_time_ms) as avg_ms
FROM soap_audit_log
WHERE status = 'success'
GROUP BY soap_operation;
```

## Troubleshooting

### "No logs appearing"
1. Check proxy server is running: `curl http://localhost:3001/health`
2. Verify database connection in proxy server console
3. Make sure you're making requests through the proxy (port 3001)

### "Database connection failed"
1. Check PostgreSQL is running
2. Verify `.env` file has correct credentials:
   ```
   DB_USER=postgres
   DB_PASSWORD=password
   DB_NAME=travel_insurance
   DB_HOST=localhost
   DB_PORT=5432
   ```

### "quote_id is always NULL"
This is normal! The `quote_id` links to your local database quote. Initially, this may be NULL because the SOAP request happens before the quote is saved to your database. You can update your frontend to link them later.

## File Structure

```
backend/
├── create-soap-audit-table.sql  # SQL script to create table
├── soap-logger.js                # Logger module
├── setup-soap-audit.js           # Setup script
├── setup-soap-audit.bat          # Windows setup script
├── SOAP_AUDIT_GUIDE.md           # Detailed documentation
└── SOAP_AUDIT_QUICKSTART.md      # This file

server/
└── proxy-server.js               # Proxy server with logging
```

## Next Steps

1. ✅ **Set up the database table** (Step 1)
2. ✅ **Start the proxy server** (Step 2)
3. ✅ **Test with a quote** (Step 3)
4. 📊 **Monitor your SOAP requests**
5. 🔍 **Debug any issues using the logs**

## Need More Help?

- **Detailed Guide:** See `SOAP_AUDIT_GUIDE.md`
- **API Reference:** See API Endpoints section in the detailed guide
- **Database Schema:** See table structure in `create-soap-audit-table.sql`

## Performance Tips

For production use:
1. Archive old logs (older than 90 days)
2. Add monitoring alerts for failed requests
3. Set up regular backups of audit logs
4. Consider log rotation for large volumes

---

**Ready to start?** Run `setup-soap-audit.bat` (Windows) or `node setup-soap-audit.js` (Linux/Mac) now!

