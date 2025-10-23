# SOAP Audit System - Installation Checklist

## ✅ Pre-Installation Check

Before you begin, make sure you have:

- [ ] PostgreSQL running and accessible
- [ ] Database `travel_insurance` created
- [ ] `.env` file configured with database credentials
- [ ] Node.js installed
- [ ] Access to run SQL scripts

## 📋 Installation Steps

### Step 1: Create Database Table ⏱️ ~1 minute

Choose your platform:

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

**Manual (if scripts fail):**
```bash
psql -U postgres -d travel_insurance -f create-soap-audit-table.sql
```

**Expected Output:**
```
✅ SOAP Audit Table created successfully!
✅ Table verification: soap_audit_log exists
✅ Created 4 views
✅ Created 2 functions
```

**Verification:**
```sql
-- Run in psql or pgAdmin
SELECT COUNT(*) FROM soap_audit_log;
-- Should return: 0 (empty table)
```

---

### Step 2: Start Proxy Server ⏱️ ~30 seconds

```bash
cd server
node proxy-server.js
```

**Expected Output:**
```
🚀 Terracotta Proxy Server running on http://localhost:3001
✅ SOAP Logger: Connected to PostgreSQL database
📡 Proxying requests to: https://www.asuaonline.com/ws/integratedquote.asmx
📊 SOAP Logs: http://localhost:3001/api/soap-logs
```

**Verification:**
```bash
curl http://localhost:3001/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Terracotta Proxy Server is running",
  "timestamp": "2024-..."
}
```

---

### Step 3: Test the System ⏱️ ~2 minutes

**Option A: Open Monitoring Dashboard**

1. Open `backend/soap-monitor-dashboard.html` in your browser
2. You should see the dashboard (all zeros initially)

**Option B: Test API Endpoints**

```bash
# Get summary (should be empty initially)
curl http://localhost:3001/api/soap-logs/summary

# Get logs
curl http://localhost:3001/api/soap-logs
```

---

### Step 4: Make a Test Request ⏱️ ~1 minute

1. Open your TravelInsurance app: http://localhost:3000
2. Fill out the quote form
3. Submit a quote

**Verification:**
```bash
# Check if logs appeared
curl http://localhost:3001/api/soap-logs/summary
```

You should now see statistics for SOAP operations!

---

## ✅ Post-Installation Verification

### Database Check

```sql
-- Check table exists
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'soap_audit_log';

-- Check views exist
SELECT table_name FROM information_schema.views 
WHERE table_name LIKE '%soap%';

-- Check if data is being logged
SELECT COUNT(*) FROM soap_audit_log;
```

### API Check

```bash
# Summary endpoint
curl http://localhost:3001/api/soap-logs/summary

# Recent logs
curl "http://localhost:3001/api/soap-logs?limit=5"

# Errors (should be empty if everything works)
curl http://localhost:3001/api/soap-logs/errors
```

### Dashboard Check

Open `backend/soap-monitor-dashboard.html` and verify:

- [ ] Statistics are showing numbers (not dashes)
- [ ] Summary table shows operations
- [ ] Recent logs table has entries
- [ ] Auto-refresh is working

---

## 🎯 Success Criteria

You've successfully installed the SOAP Audit System if:

✅ Database table `soap_audit_log` exists  
✅ Proxy server is running on port 3001  
✅ `/health` endpoint responds  
✅ After making a quote, logs appear in the dashboard  
✅ SQL queries return data  
✅ API endpoints return JSON responses  

---

## 🔧 Troubleshooting

### ❌ Setup script fails

**Error:** "Database connection failed"
```bash
# Solution: Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Check credentials in .env file
cat .env | grep DB_
```

**Error:** "Table already exists"
```
# This is OK! The table was created previously
# You can safely ignore this
```

---

### ❌ Proxy server won't start

**Error:** "ECONNREFUSED"
```bash
# Solution: PostgreSQL not running
# Windows: Check Services
# Linux: sudo systemctl start postgresql
```

**Error:** "Port 3001 already in use"
```bash
# Solution: Kill the existing process
# Windows: netstat -ano | findstr :3001
# Linux: lsof -i :3001
```

---

### ❌ No logs appearing

**Checklist:**
- [ ] Proxy server is running
- [ ] React app is using port 3001 for Terracotta API calls
- [ ] Database connection is working
- [ ] No errors in proxy server console

**Test manually:**
```bash
# Test that proxy can log
# (This creates a test log entry)
curl -X POST http://localhost:3001/api/terracotta/HelloWorld \
  -H "Content-Type: text/xml" \
  -d '<?xml version="1.0"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><HelloWorld xmlns="WS-IntegratedQuote"/></soap:Body></soap:Envelope>'

# Check if it was logged
curl http://localhost:3001/api/soap-logs?limit=1
```

---

### ❌ Dashboard shows "Loading..." forever

**Solutions:**
1. Check if proxy server is running (port 3001)
2. Open browser console (F12) for error messages
3. Try accessing API directly: http://localhost:3001/api/soap-logs/summary
4. Check CORS is not blocking requests

---

## 🎉 Next Steps

After successful installation:

1. **Monitor Dashboard:** Keep it open while testing
2. **Review Logs:** Check what data is being captured
3. **Test Error Handling:** Try invalid requests to see error logging
4. **Set Up Alerts:** Create monitoring for failed requests
5. **Read Documentation:** Review `SOAP_AUDIT_GUIDE.md` for advanced usage

---

## 📚 Quick Reference

| Task | Command/URL |
|------|-------------|
| Setup database | `node backend/setup-soap-audit.js` |
| Start proxy | `node server/proxy-server.js` |
| View dashboard | Open `backend/soap-monitor-dashboard.html` |
| API summary | http://localhost:3001/api/soap-logs/summary |
| API errors | http://localhost:3001/api/soap-logs/errors |
| Health check | http://localhost:3001/health |
| Database query | `SELECT * FROM soap_audit_log ORDER BY created_at DESC LIMIT 10;` |

---

## ✉️ Getting Help

If you're stuck:

1. Check error messages carefully
2. Review the Troubleshooting section above
3. Check proxy server console logs
4. Query `recent_soap_errors` view in database
5. Review `SOAP_AUDIT_GUIDE.md` for detailed help

---

**Installation Time:** ~5 minutes total  
**Difficulty:** Easy  
**Prerequisites:** PostgreSQL, Node.js  
**Platform:** Windows, Linux, Mac  

✅ **You're all set! Start monitoring your SOAP requests!**

