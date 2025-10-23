# Quick Guide: Apply TravellerNumber Migration

## Step 1: Run Database Migration

### Option A: Using psql command line
```bash
psql -U postgres -d travel_insurance -f backend/add-traveller-number-column.sql
```

### Option B: Using psql interactive
```bash
# Connect to database
psql -U postgres -d travel_insurance

# Run the migration script
\i backend/add-traveller-number-column.sql

# Verify the column was added
\d travelers
```

### Option C: Using pgAdmin or other GUI tools
1. Open pgAdmin and connect to your database
2. Open Query Tool
3. Copy and paste the contents of `backend/add-traveller-number-column.sql`
4. Execute the query

---

## Step 2: Verify Migration

Run this query to confirm the column exists:
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'travelers' AND column_name = 'traveller_number';
```

Expected output:
```
 column_name     | data_type         | is_nullable
-----------------|-------------------|-------------
 traveller_number| character varying | YES
```

---

## Step 3: Restart Your Servers

### Windows (PowerShell):
```powershell
# Stop all servers
.\stop-all-servers.ps1

# Start proxy server (handles SOAP extraction)
node server/proxy-server.js

# In a new terminal, start backend server
node backend/server.js

# In a new terminal, start frontend
npm start
```

### Or use your existing batch files:
```batch
start-all-servers.ps1
```

---

## Step 4: Test the Integration

### Monitor Proxy Logs
When you make a quote request, you should see in the proxy server console:
```
👥 Extracted 2 Traveller Numbers from response: TRV001, TRV002
   👥 Total traveller numbers in response: 2
```

### Check Database
After creating a quote, verify TravellerNumbers are stored:
```sql
SELECT 
  id,
  first_name,
  last_name,
  traveller_number,
  created_at
FROM travelers
ORDER BY created_at DESC
LIMIT 10;
```

### Check SOAP Audit Logs
Verify TravellerNumbers are captured in SOAP responses:
```sql
SELECT 
  soap_operation,
  terracotta_quote_id,
  parsed_response->'travellerNumbers' as traveller_numbers,
  created_at
FROM soap_audit_log
WHERE soap_operation IN ('ProvideQuotation', 'ProvideQuotationWithAlterations')
ORDER BY created_at DESC
LIMIT 5;
```

---

## What Was Changed

✅ **Database**: Added `traveller_number` column to `travelers` table  
✅ **Proxy Server**: Extracts TravellerNumber from SOAP responses  
✅ **Backend API**: Saves TravellerNumber when creating quotes  
✅ **Schema**: Updated documentation and indexes  

---

## Troubleshooting

### Column already exists error
If you see "column already exists", the migration is already applied. You can skip Step 1.

### No TravellerNumbers in logs
- Check that the proxy server is running
- Verify you're making requests through the proxy (port 3001)
- Check SOAP response XML contains `<TravellerNumber>` tags

### TravellerNumbers not saving to database
- Check backend server logs for "Traveller Number from Terracotta: XXX"
- Verify frontend is sending `travellerNumber` in the request body
- Confirm the column exists: `\d travelers`

---

## Need More Info?

See the comprehensive guide: `backend/TRAVELLER_NUMBER_INTEGRATION.md`



