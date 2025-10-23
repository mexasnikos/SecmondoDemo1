# TravellerNumber Integration Guide

## Overview

The `traveller_number` column has been added to the `travelers` table to store the TravellerNumber field that comes from the Terracotta SOAP API responses in both `ProvideQuotation` and `ProvideQuotationWithAlterations` operations.

---

## What Was Added

### 1. **Database Changes**

#### New Column: `traveller_number`
```sql
ALTER TABLE travelers ADD COLUMN traveller_number VARCHAR(100);
```

**Purpose:** Store the TravellerNumber value from Terracotta API responses

**Properties:**
- Type: `VARCHAR(100)`
- Nullable: Yes (allows NULL for backward compatibility)
- Indexed: Yes (for fast lookups)

**Location in Database:**
- Table: `travelers`
- Column: `traveller_number`

---

### 2. **Proxy Server Updates** (`server/proxy-server.js`)

#### Enhanced Response Extraction
The `extractResponseData()` function now extracts TravellerNumber from SOAP responses:

```javascript
// Extract TravellerNumbers from response
const travellerNumberMatches = responseXml.matchAll(/<TravellerNumber>([^<]+)<\/TravellerNumber>/gi);
const travellerNumbers = Array.from(travellerNumberMatches).map(match => match[1]);
```

**What It Captures:**
- All `<TravellerNumber>` tags from SOAP XML responses
- Supports case-insensitive matching
- Stores array of traveller numbers in parsed response

**Logging:**
```
👥 Extracted 2 Traveller Numbers from response: TRV001, TRV002
   👥 Total traveller numbers in response: 2
```

**Data Storage:**
The extracted traveller numbers are stored in:
1. `soap_audit_log.parsed_response->>'travellerNumbers'` - Array of all numbers
2. `soap_audit_log.parsed_response->>'travellerCount'` - Count of travellers

---

### 3. **Backend API Updates**

#### `backend/server.js` - Quote Creation Endpoint

**Updated INSERT statement:**
```javascript
await client.query(
  `INSERT INTO travelers (
    quote_id, first_name, last_name, age, 
    email, phone, traveller_number, created_at
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
  [quoteId, traveler.firstName, traveler.lastName, 
   finalAge, finalEmail, traveler.phone || null, traveler.travellerNumber || null]
);
```

**Frontend Request Format:**
```json
{
  "travelers": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "travellerNumber": "TRV123456"
    }
  ]
}
```

#### `backend/server-optimized.js` - Batch Insert

**Updated batch insert:**
```javascript
const travelerParams = travelers.flatMap(traveler => [
  quoteId, traveler.firstName, traveler.lastName, 
  traveler.age, traveler.email, traveler.phone, 
  traveler.vaxId, traveler.nationality, traveler.travellerNumber || null
]);
```

---

## How It Works - Complete Flow

### Step 1: User Requests Quote
```
Frontend → Proxy Server → Terracotta API
```

### Step 2: Terracotta Returns Quote with Traveller Numbers
```xml
<soap:Envelope>
  <soap:Body>
    <ProvideQuotationResponse>
      <Quote>
        <QuoteID>8546669</QuoteID>
        <Traveller>
          <TravellerNumber>TRV123456</TravellerNumber>
          <FirstName>John</FirstName>
          <LastName>Doe</LastName>
        </Traveller>
        <Traveller>
          <TravellerNumber>TRV123457</TravellerNumber>
          <FirstName>Jane</FirstName>
          <LastName>Doe</LastName>
        </Traveller>
      </Quote>
    </ProvideQuotationResponse>
  </soap:Body>
</soap:Envelope>
```

### Step 3: Proxy Server Extracts Data
```javascript
// Proxy extracts:
travellerNumbers: ["TRV123456", "TRV123457"]
travellerCount: 2
```

### Step 4: Frontend Receives Response
Frontend gets the SOAP response and parses traveller numbers.

### Step 5: User Selects Quote & Submits
Frontend sends traveller data with TravellerNumbers:
```json
{
  "travelers": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "travellerNumber": "TRV123456"
    },
    {
      "firstName": "Jane",
      "lastName": "Doe",
      "travellerNumber": "TRV123457"
    }
  ]
}
```

### Step 6: Backend Stores in Database
```sql
INSERT INTO travelers (
  quote_id, first_name, last_name, age, email, 
  phone, traveller_number, created_at
) VALUES (1, 'John', 'Doe', 35, 'john@example.com', 
  '+1234567890', 'TRV123456', NOW());
```

---

## Database Queries

### Find Travelers by TravellerNumber
```sql
SELECT 
  t.id,
  t.quote_id,
  t.first_name,
  t.last_name,
  t.traveller_number,
  q.policy_number,
  q.destination
FROM travelers t
JOIN quotes q ON t.quote_id = q.id
WHERE t.traveller_number = 'TRV123456';
```

### Find All Quotes with TravellerNumbers
```sql
SELECT 
  q.id as quote_id,
  q.policy_number,
  q.destination,
  t.first_name,
  t.last_name,
  t.traveller_number
FROM quotes q
JOIN travelers t ON q.id = t.quote_id
WHERE t.traveller_number IS NOT NULL
ORDER BY q.created_at DESC;
```

### Count Travelers with/without TravellerNumbers
```sql
SELECT 
  COUNT(*) FILTER (WHERE traveller_number IS NOT NULL) as with_number,
  COUNT(*) FILTER (WHERE traveller_number IS NULL) as without_number,
  COUNT(*) as total
FROM travelers;
```

### View SOAP Logs with TravellerNumbers
```sql
SELECT 
  id,
  soap_operation,
  terracotta_quote_id,
  parsed_response->>'travellerNumbers' as traveller_numbers,
  parsed_response->>'travellerCount' as traveller_count,
  status,
  created_at
FROM soap_audit_log
WHERE parsed_response->>'travellerCount' IS NOT NULL
ORDER BY created_at DESC;
```

---

## Setup Instructions

### 1. Run Database Migration
```bash
# Connect to PostgreSQL
psql -U postgres -d travel_insurance

# Run migration script
\i backend/add-traveller-number-column.sql
```

### 2. Verify Column Added
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

### 3. Restart Servers
```bash
# Stop all servers
npm run stop-all

# Start proxy server
npm run start-proxy

# Start backend server
npm run start-server

# Start frontend
npm start
```

---

## Frontend Integration

### Parse SOAP Response
```javascript
// After receiving SOAP response from Terracotta
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(soapResponse, 'text/xml');

// Extract traveller numbers
const travellerElements = xmlDoc.getElementsByTagName('TravellerNumber');
const travellerNumbers = Array.from(travellerElements).map(el => el.textContent);

// Map to traveler objects
travelers.forEach((traveler, index) => {
  traveler.travellerNumber = travellerNumbers[index] || null;
});
```

### Include in API Request
```javascript
// When creating quote
const response = await fetch('/api/quotes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    destination: 'France',
    travelers: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        travellerNumber: 'TRV123456' // Include TravellerNumber
      }
    ]
  })
});
```

---

## Testing

### 1. Test SOAP Response Extraction
```bash
# Check proxy server logs when making quote requests
# You should see:
👥 Extracted 2 Traveller Numbers from response: TRV001, TRV002
   👥 Total traveller numbers in response: 2
```

### 2. Test Database Storage
```sql
-- After creating a quote, check if TravellerNumbers are stored
SELECT * FROM travelers WHERE quote_id = [YOUR_QUOTE_ID];
```

### 3. Test SOAP Audit Log
```sql
-- Check if TravellerNumbers are captured in parsed_response
SELECT 
  parsed_response->'travellerNumbers' as traveller_numbers
FROM soap_audit_log
WHERE soap_operation IN ('ProvideQuotation', 'ProvideQuotationWithAlterations')
ORDER BY created_at DESC
LIMIT 5;
```

---

## Benefits

1. ✅ **Complete Traceability** - Track travelers from Terracotta to your database
2. ✅ **Easy Reconciliation** - Match local travelers with Terracotta records
3. ✅ **Audit Trail** - Full visibility of TravellerNumbers in SOAP logs
4. ✅ **Data Integrity** - Ensure travelers match between systems
5. ✅ **Support Queries** - Quickly find travelers using Terracotta IDs
6. ✅ **Debugging** - Trace issues between systems more easily

---

## Backward Compatibility

- ✅ Column is nullable - existing records work fine
- ✅ Default value is NULL - no data migration needed
- ✅ Frontend can omit field - backend handles gracefully
- ✅ Index added - no performance impact on existing queries

---

## Files Modified

| File | Purpose |
|------|---------|
| `backend/add-traveller-number-column.sql` | Database migration script |
| `server/proxy-server.js` | Extract TravellerNumber from SOAP responses |
| `backend/server.js` | Store TravellerNumber when creating quotes |
| `backend/server-optimized.js` | Store TravellerNumber in batch inserts |
| `backend/schema.sql` | Updated schema definition with new column |
| `backend/db-admin.js` | Updated schema documentation |
| `backend/TRAVELLER_NUMBER_INTEGRATION.md` | This documentation file |

---

## Support

For questions or issues:
1. Check SOAP logs: `SELECT * FROM soap_audit_log ORDER BY created_at DESC LIMIT 10`
2. Check proxy server console for extraction logs
3. Verify column exists: `\d travelers` in psql
4. Test with sample quote request

---

**Last Updated:** October 17, 2025  
**Version:** 1.0.0



