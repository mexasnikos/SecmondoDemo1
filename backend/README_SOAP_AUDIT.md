# SOAP Audit System - Complete Package

## 🎯 What You Get

A complete SOAP request/response monitoring system for your Terracotta API integration that includes:

✅ **Database Table** - Stores all SOAP requests and responses  
✅ **Automatic Logging** - Every SOAP call is logged automatically  
✅ **Monitoring Dashboard** - Beautiful HTML dashboard to view logs  
✅ **REST API** - Query logs programmatically  
✅ **Performance Metrics** - Track response times and success rates  
✅ **Error Tracking** - Identify and debug failed requests  

## 📦 Files Included

### Core Files
| File | Purpose |
|------|---------|
| `create-soap-audit-table.sql` | SQL script to create database table, views, and functions |
| `soap-logger.js` | Node.js module for logging SOAP requests |
| `setup-soap-audit.js` | Automated setup script |
| `setup-soap-audit.bat` | Windows setup script |

### Server Files
| File | Purpose |
|------|---------|
| `../server/proxy-server.js` | Updated proxy server with automatic SOAP logging |

### Documentation
| File | Purpose |
|------|---------|
| `SOAP_AUDIT_QUICKSTART.md` | Quick start guide (start here!) |
| `SOAP_AUDIT_GUIDE.md` | Detailed documentation with examples |
| `README_SOAP_AUDIT.md` | This file - complete overview |

### Tools
| File | Purpose |
|------|---------|
| `soap-monitor-dashboard.html` | Real-time monitoring dashboard |

## 🚀 Quick Start (3 Steps)

### 1️⃣ Setup Database Table

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

### 2️⃣ Start Proxy Server

```bash
cd server
node proxy-server.js
```

### 3️⃣ Open Monitoring Dashboard

Open `backend/soap-monitor-dashboard.html` in your browser to see real-time SOAP logs!

## 📊 What Gets Tracked

Every SOAP request automatically logs:

```
📥 Request Information:
   - SOAP operation (ProvideQuotation, SavePolicyDetails, etc.)
   - Complete request XML
   - Request headers
   - Timestamp
   - Client IP and User Agent

📤 Response Information:
   - Complete response XML
   - HTTP status code
   - Response headers
   - Terracotta Quote ID
   - Terracotta Policy ID
   - Success/failure status
   - Error messages

⏱️ Performance Metrics:
   - Response time in milliseconds
   - Average response time by operation
   - Success/failure rates

🔗 Integration:
   - Link to local quote ID (if available)
   - UserID and UserCode used
   - Session information
```

## 🎨 Monitoring Dashboard

The HTML dashboard (`soap-monitor-dashboard.html`) provides:

- **Real-time Statistics** - Total requests, success rate, failures
- **Operation Summary** - Stats for each SOAP operation
- **Recent Errors** - Latest failed requests with error messages
- **Recent Logs** - Last 20 SOAP requests with filtering
- **Auto-refresh** - Updates every 10 seconds automatically

Just open the file in your browser - no server needed!

## 🔌 REST API Endpoints

The proxy server (port 3001) provides these monitoring endpoints:

```http
# Get all SOAP logs
GET http://localhost:3001/api/soap-logs
    ?operation=ProvideQuotation  # Filter by operation
    &status=success               # Filter by status
    &limit=100                    # Limit results
    &offset=0                     # Pagination

# Get summary statistics
GET http://localhost:3001/api/soap-logs/summary

# Get recent errors
GET http://localhost:3001/api/soap-logs/errors?limit=50

# Get SOAP operations for specific quote
GET http://localhost:3001/api/soap-logs/quote/{quoteId}

# Check if quote has all required operations
GET http://localhost:3001/api/soap-logs/quote/{quoteId}/completeness
```

## 💾 Database Views & Functions

### Views
- `soap_request_summary` - Aggregated stats by operation
- `quote_soap_history` - All SOAP operations per quote
- `recent_soap_errors` - Last 100 errors
- `soap_performance_by_hour` - Performance metrics by hour

### Functions
- `get_quote_soap_operations(quote_id)` - Get all operations for a quote
- `check_quote_soap_completeness(quote_id)` - Check if quote has required operations

## 📝 Common SQL Queries

### Find quotes with failed operations
```sql
SELECT DISTINCT quote_id, soap_operation, error_message
FROM soap_audit_log
WHERE status IN ('failed', 'error')
ORDER BY created_at DESC;
```

### Get today's activity
```sql
SELECT soap_operation, status, COUNT(*)
FROM soap_audit_log
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY soap_operation, status;
```

### Check quote completeness
```sql
SELECT * FROM check_quote_soap_completeness(123);
```

### Find slow requests (> 3 seconds)
```sql
SELECT soap_operation, response_time_ms, created_at
FROM soap_audit_log
WHERE response_time_ms > 3000
ORDER BY response_time_ms DESC;
```

## 🔧 Integration with Your App

The SOAP logging is **automatic** once the proxy server is running. All SOAP requests through the proxy (port 3001) are logged automatically.

To link SOAP logs with specific quotes, you can update your frontend to pass the quote ID in context. The logger will then automatically associate the SOAP operations with that quote.

## 📚 Documentation

- **Quick Start:** `SOAP_AUDIT_QUICKSTART.md` - Get started in 3 steps
- **Detailed Guide:** `SOAP_AUDIT_GUIDE.md` - Complete reference
- **Database Schema:** `create-soap-audit-table.sql` - SQL table definition

## 🎯 Use Cases

### 1. **Debugging Failed Quotes**
When a quote fails, check the SOAP logs to see exactly what happened:
```sql
SELECT * FROM get_quote_soap_operations(123);
```

### 2. **Performance Monitoring**
Track API response times to identify slowdowns:
```sql
SELECT * FROM soap_request_summary;
```

### 3. **Compliance Audit**
Maintain a complete audit trail of all API interactions:
```sql
SELECT * FROM soap_audit_log WHERE created_at > '2024-01-01';
```

### 4. **Error Alerting**
Set up automated alerts for failed requests:
```sql
SELECT * FROM recent_soap_errors;
```

## ⚙️ Configuration

The system uses your existing database configuration from `.env`:

```env
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=travel_insurance
DB_HOST=localhost
DB_PORT=5432
```

No additional configuration needed!

## 🛠️ Troubleshooting

### Proxy server won't start
1. Check PostgreSQL is running
2. Verify database credentials in `.env`
3. Make sure port 3001 is not in use

### No logs appearing
1. Verify proxy server is running: `curl http://localhost:3001/health`
2. Check proxy server console for errors
3. Make sure SOAP requests go through port 3001

### Dashboard shows no data
1. Make sure you've made some SOAP requests
2. Verify proxy server is running
3. Check browser console for CORS errors

## 📈 Performance Considerations

For production use:

1. **Archive old logs** - Keep only last 90 days in main table
2. **Index optimization** - Add indexes based on your query patterns
3. **Log rotation** - Set up automated archiving
4. **Monitoring alerts** - Alert on high error rates

Example archiving script:
```sql
-- Archive logs older than 90 days
INSERT INTO soap_audit_log_archive
SELECT * FROM soap_audit_log
WHERE created_at < NOW() - INTERVAL '90 days';

DELETE FROM soap_audit_log
WHERE created_at < NOW() - INTERVAL '90 days';
```

## 🔒 Security Notes

- Request/response bodies contain complete SOAP XML (may include customer data)
- Ensure proper database access controls
- Consider encrypting sensitive data in audit logs
- Set up regular backups

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review `SOAP_AUDIT_GUIDE.md` for detailed help
3. Query `recent_soap_errors` view for specific errors

## 🎉 What's Next?

After setup:
1. ✅ Monitor your SOAP requests in the dashboard
2. ✅ Set up alerts for failed requests
3. ✅ Use the API endpoints to build custom monitoring
4. ✅ Archive old logs regularly
5. ✅ Enjoy complete visibility into your Terracotta integration!

---

**Created for TravelInsurance Demo** | Complete SOAP Audit System Package

