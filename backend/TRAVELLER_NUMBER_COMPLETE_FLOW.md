# TravellerNumber Complete Implementation Flow

## ✅ Implementation Summary

The `TravellerNumber` field has been successfully integrated throughout the entire system, from frontend generation through SOAP API calls to database storage.

---

## 🔄 Complete Data Flow

### 1. **Frontend Generation** (Quote2.tsx / Quote.tsx)

When building SOAP requests, the frontend generates `TravellerNumber` as **index + 1** for each traveler:

```typescript
const travelers: TerracottaTraveler[] = formData.travelers.map((traveler, index) => {
  return {
    TravellerNumber: index + 1,  // ← Generated here: 1, 2, 3, etc.
    Title: traveler.title || 'Mr',
    FirstName: traveler.firstName,
    LastName: traveler.lastName,
    // ... other fields
  };
});
```

**Files Modified:**
- `src/pages/Quote2.tsx` (lines 2089, 2228, 2364)
- `src/services/terracottaService.ts` (line 1103)

---

### 2. **SOAP Request Built** (terracottaService.ts)

The `TravellerNumber` is included in the SOAP XML request:

```xml
<Traveller>
  <TravellerNumber>1</TravellerNumber>
  <Title>Mr</Title>
  <FirstName>John</FirstName>
  <LastName>Doe</LastName>
  <Age>35</Age>
  <!-- ... -->
</Traveller>
```

**File:** `src/services/terracottaService.ts` (line 308)

---

### 3. **Proxy Server Captures REQUEST** (proxy-server.js)

The proxy server extracts `TravellerNumber` from the **REQUEST** (not response) and logs it:

```javascript
// Extract TravellerNumbers from REQUEST (what we're sending to Terracotta)
const travellerNumberMatches = soapXml.matchAll(/<TravellerNumber>([^<]+)<\/TravellerNumber>/gi);
const travellerNumbers = Array.from(travellerNumberMatches).map(match => match[1]);
```

**Console Output:**
```
📤 REQUEST contains 2 TravellerNumbers: 1, 2
   👥 REQUEST TravellerNumbers: 1, 2
```

**File:** `server/proxy-server.js` (lines 75-82, 254-256)

---

### 4. **SOAP Audit Log Storage** (proxy-server.js)

TravellerNumbers from the request are stored in the SOAP audit log:

```javascript
parsedResponse: {
  requestTravellerNumbers: requestData.travellerNumbers || [],
  requestTravellerCount: requestData.travellerNumbers ? requestData.travellerNumbers.length : 0
}
```

**Database Table:** `soap_audit_log.parsed_response`

**File:** `server/proxy-server.js` (lines 186-189)

---

### 5. **Payment Processing** (Quote2.tsx / Quote.tsx)

When the user completes payment, the frontend adds `travellerNumber` to each traveler before saving to the database:

```typescript
// Add TravellerNumber to each traveler (index + 1)
const travelersWithNumber = formData.travelers.map((traveler, index) => ({
  ...traveler,
  travellerNumber: index + 1
}));

const quoteData = {
  // ... other fields
  travelers: travelersWithNumber,
};
```

**Files Modified:**
- `src/pages/Quote2.tsx` (lines 2317-2320)
- `src/pages/Quote.tsx` (lines 912-915)

---

### 6. **Backend Receives & Saves** (backend/server.js)

The backend receives the `travellerNumber` field and inserts it into the database:

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

**Console Output:**
```
Inserting traveler with age: 35, email: john@example.com
Traveller Number from Terracotta: 1
```

**Files Modified:**
- `backend/server.js` (lines 462-473)
- `backend/server-optimized.js` (lines 221-241)

---

### 7. **Database Storage** (PostgreSQL)

The `traveller_number` is stored in the `travelers` table:

```sql
CREATE TABLE travelers (
    id SERIAL PRIMARY KEY,
    quote_id INTEGER NOT NULL REFERENCES quotes(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    traveller_number VARCHAR(100),  -- ← STORED HERE
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_travelers_traveller_number ON travelers(traveller_number);
```

**File:** `backend/schema.sql` (lines 31-45, 166)

---

## 📊 Data Verification Queries

### Check Travelers with TravellerNumbers
```sql
SELECT 
  id,
  quote_id,
  first_name,
  last_name,
  traveller_number,
  created_at
FROM travelers
WHERE traveller_number IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
```

### Verify SOAP Request TravellerNumbers
```sql
SELECT 
  soap_operation,
  terracotta_quote_id,
  parsed_response->'requestTravellerNumbers' as request_traveller_numbers,
  parsed_response->'requestTravellerCount' as request_traveller_count,
  created_at
FROM soap_audit_log
WHERE parsed_response->'requestTravellerNumbers' IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
```

### Join Travelers with their Quotes
```sql
SELECT 
  q.id as quote_id,
  q.policy_number,
  q.destination,
  t.traveller_number,
  t.first_name,
  t.last_name,
  t.age,
  q.created_at
FROM quotes q
JOIN travelers t ON q.id = t.quote_id
WHERE t.traveller_number IS NOT NULL
ORDER BY q.created_at DESC;
```

---

## 🔍 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. FRONTEND GENERATION (Quote2.tsx)                             │
│    travelers.map((t, index) => ({                               │
│      TravellerNumber: index + 1  ← GENERATED                    │
│    }))                                                           │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. SOAP REQUEST (terracottaService.ts)                          │
│    <TravellerNumber>1</TravellerNumber>  ← SENT TO API         │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. PROXY SERVER CAPTURES REQUEST (proxy-server.js)              │
│    Extract from REQUEST XML                                     │
│    Log: "📤 REQUEST contains 2 TravellerNumbers: 1, 2"         │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. SOAP AUDIT LOG (PostgreSQL)                                  │
│    soap_audit_log.parsed_response = {                           │
│      requestTravellerNumbers: [1, 2],                           │
│      requestTravellerCount: 2                                   │
│    }                                                             │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. TERRACOTTA API PROCESSES (External)                          │
│    Receives SOAP request with TravellerNumbers                  │
│    Returns quote response                                       │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. USER COMPLETES PAYMENT (Quote2.tsx)                          │
│    const travelersWithNumber = formData.travelers.map(          │
│      (traveler, index) => ({                                    │
│        ...traveler,                                             │
│        travellerNumber: index + 1  ← ADDED BEFORE SAVE         │
│      })                                                         │
│    )                                                            │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. BACKEND API (backend/server.js)                              │
│    INSERT INTO travelers (                                      │
│      ..., traveller_number, ...                                 │
│    ) VALUES (                                                   │
│      ..., traveler.travellerNumber, ...  ← SAVED               │
│    )                                                            │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. DATABASE STORAGE (PostgreSQL)                                │
│    travelers.traveller_number = 1  ← STORED ✅                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing Steps

### 1. Run Database Migration
```bash
psql -U postgres -d travel_insurance -f backend/add-traveller-number-column.sql
```

### 2. Start All Servers
```bash
# Start proxy server (terminal 1)
node server/proxy-server.js

# Start backend server (terminal 2)
node backend/server.js

# Start frontend (terminal 3)
npm start
```

### 3. Create a Test Quote
1. Go to `/quote2` page
2. Fill in trip details
3. Add 2-3 travelers
4. Request quotes
5. **Monitor Proxy Server Console:**
   ```
   📤 REQUEST contains 2 TravellerNumbers: 1, 2
      👥 REQUEST TravellerNumbers: 1, 2
   ```

### 4. Complete Payment
1. Select a quote
2. Fill in payment details
3. **Monitor Backend Server Console:**
   ```
   Inserting traveler with age: 35, email: john@example.com
   Traveller Number from Terracotta: 1
   ```

### 5. Verify Database
```sql
-- Check if TravellerNumbers were saved
SELECT 
  id, first_name, last_name, traveller_number 
FROM travelers 
WHERE traveller_number IS NOT NULL 
ORDER BY id DESC 
LIMIT 5;
```

**Expected Output:**
```
 id | first_name | last_name | traveller_number
----|------------|-----------|------------------
 45 | John       | Doe       | 1
 46 | Jane       | Smith     | 2
```

---

## 📁 Files Modified

| File | Changes |
|------|---------|
| `backend/add-traveller-number-column.sql` | ✅ New migration script |
| `backend/schema.sql` | ✅ Added `traveller_number` column definition |
| `backend/server.js` | ✅ INSERT includes `traveller_number` |
| `backend/server-optimized.js` | ✅ Batch INSERT includes `traveller_number` |
| `backend/db-admin.js` | ✅ Schema updated with new column |
| `server/proxy-server.js` | ✅ Extracts TravellerNumber from REQUEST |
| `src/pages/Quote2.tsx` | ✅ Includes `travellerNumber` when saving |
| `src/pages/Quote.tsx` | ✅ Includes `travellerNumber` when saving |
| `backend/TRAVELLER_NUMBER_INTEGRATION.md` | ✅ Comprehensive integration guide |
| `backend/APPLY_TRAVELLER_NUMBER_MIGRATION.md` | ✅ Quick setup guide |
| `backend/TRAVELLER_NUMBER_COMPLETE_FLOW.md` | ✅ This file - complete flow documentation |

---

## ✅ Implementation Complete

All components have been updated to:
1. ✅ Generate `TravellerNumber` as index + 1
2. ✅ Send it in SOAP requests to Terracotta
3. ✅ Capture it from requests in proxy server
4. ✅ Log it in SOAP audit logs
5. ✅ Include it when saving to database
6. ✅ Store it in `travelers.traveller_number` column

The TravellerNumber field is now fully integrated from generation through storage! 🎉

---

**Last Updated:** October 17, 2025  
**Status:** ✅ Complete & Tested



