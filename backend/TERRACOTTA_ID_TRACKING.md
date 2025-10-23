# Terracotta Quote & Policy ID Tracking Guide

## ✅ What Was Updated

The SOAP audit system has been enhanced to **automatically extract and store both Terracotta Quote IDs and Policy IDs** from all SOAP responses.

### Changes Made:

1. ✅ **Enhanced Quote ID Extraction** - Now captures ALL Quote IDs from `ProvideQuotation` responses
2. ✅ **Enhanced Policy ID Extraction** - Captures Policy IDs from `SavePolicyDetails` responses
3. ✅ **Better Logging** - Console shows exactly what IDs are captured
4. ✅ **New Database Views** - Easy queries for tracking Terracotta IDs
5. ✅ **Helper Functions** - SQL functions to find quotes by Terracotta ID

---

## 📊 Where Terracotta IDs Are Stored

### 1. **Terracotta Quote ID**
```
Database Table: soap_audit_log
Column:         terracotta_quote_id
Example Value:  8546669
Captured From:  ProvideQuotation, ProvideQuotationWithAlterations responses
```

### 2. **Terracotta Policy ID**
```
Database Table: soap_audit_log
Column:         terracotta_policy_id
Example Value:  POL-12345
Captured From:  SavePolicyDetails response
```

### 3. **All Quote IDs (Multiple)**
```
Database Table: soap_audit_log
Column:         parsed_response->>'allQuoteIds'
Example Value:  ["8546669", "8546670", "8546671"]
Captured From:  ProvideQuotation returns multiple quotes
```

---

## 🔍 Database Views Created

### 1. `terracotta_quote_tracking`
**Purpose:** Track all unique Terracotta Quote IDs and their operations

```sql
SELECT * FROM terracotta_quote_tracking;
```

**Shows:**
- Terracotta Quote ID
- Local Quote ID (if linked)
- How many SOAP operations were performed
- Which operations (ProvideQuotation, SavePolicyDetails, etc.)
- Success/failure counts
- When quote was first/last seen
- Associated Terracotta Policy ID

**Example:**
```sql
terracotta_quote_id | local_quote_id | operations_performed                    | successful | failed
--------------------|----------------|-----------------------------------------|------------|--------
8546669             | 120            | ProvideQuotation, ScreeningQuestions   | 2          | 0
8546670             | NULL           | ProvideQuotation                        | 1          | 0
```

---

### 2. `terracotta_policy_tracking`
**Purpose:** Track all Terracotta Policy IDs created

```sql
SELECT * FROM terracotta_policy_tracking;
```

**Shows:**
- Terracotta Policy ID
- Associated Terracotta Quote ID
- Local quote ID and policy number
- When policy was created
- Save status (success/failed)
- Quote amount and status

**Example:**
```sql
terracotta_policy_id | terracotta_quote_id | local_policy_number | save_status
---------------------|---------------------|---------------------|-------------
POL-12345            | 8546669             | TI-39734624         | success
```

---

### 3. `quote_id_mapping`
**Purpose:** See the relationship between local and Terracotta IDs

```sql
SELECT * FROM quote_id_mapping;
```

**Shows:**
- Local quote ID
- Local policy number
- Terracotta Quote ID (from JSON in database)
- Terracotta Quote ID (from SOAP log)
- Terracotta Policy ID
- Quote status and amount

**Example:**
```sql
local_quote_id | local_policy_number | terracotta_quote_id_from_soap | terracotta_policy_id
---------------|---------------------|-------------------------------|---------------------
120            | TI-39734624         | 8546669                       | POL-12345
119            | TI-89759055         | 8546668                       | NULL
```

---

### 4. `soap_operation_summary_with_ids`
**Purpose:** Summary statistics including unique ID counts

```sql
SELECT * FROM soap_operation_summary_with_ids;
```

**Shows:**
- Operation name
- Total operations
- Success/failure counts
- Unique Quote IDs captured
- Unique Policy IDs captured
- Average response time

---

## 🛠️ Helper Functions

### 1. Get all Terracotta IDs for a local quote

```sql
SELECT * FROM get_terracotta_ids_for_quote(120);
```

**Returns:**
```
terracotta_quote_id | terracotta_policy_id | soap_operation      | status  | created_at
--------------------|----------------------|---------------------|---------|------------
8546669             | NULL                 | ProvideQuotation    | success | 2025-10-07...
8546669             | NULL                 | ScreeningQuestions  | success | 2025-10-07...
8546669             | POL-12345            | SavePolicyDetails   | success | 2025-10-07...
```

---

### 2. Find quote by Terracotta Quote ID

```sql
SELECT * FROM find_quote_by_terracotta_id('8546669');
```

**Returns:**
```
local_quote_id | policy_number | status | total_amount | soap_operations
---------------|---------------|--------|--------------|-------------------------------------------
120            | TI-39734624   | paid   | 62.74        | ProvideQuotation, ScreeningQuestions, ...
```

---

## 📝 Common Queries

### Find all quotes with Terracotta IDs
```sql
SELECT 
    local_quote_id,
    local_policy_number,
    terracotta_quote_id_from_soap,
    terracotta_policy_id
FROM quote_id_mapping
WHERE terracotta_quote_id_from_soap IS NOT NULL
ORDER BY local_quote_id DESC;
```

---

### Find quotes that have Quote ID but no Policy ID yet
```sql
SELECT 
    local_quote_id,
    terracotta_quote_id_from_soap,
    quote_status
FROM quote_id_mapping
WHERE terracotta_quote_id_from_soap IS NOT NULL 
  AND terracotta_policy_id IS NULL
ORDER BY local_quote_id DESC;
```

This shows quotes where the user got a quotation but hasn't completed the policy purchase yet.

---

### Get all SOAP operations for a specific Terracotta Quote ID
```sql
SELECT 
    soap_operation,
    status,
    response_time_ms,
    created_at,
    error_message
FROM soap_audit_log
WHERE terracotta_quote_id = '8546669'
ORDER BY created_at ASC;
```

---

### Check today's Terracotta activity
```sql
SELECT 
    soap_operation,
    COUNT(*) as count,
    COUNT(DISTINCT terracotta_quote_id) as unique_quotes,
    COUNT(DISTINCT terracotta_policy_id) as unique_policies
FROM soap_audit_log
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY soap_operation;
```

---

### Find failed SavePolicyDetails operations
```sql
SELECT 
    terracotta_quote_id,
    terracotta_policy_id,
    error_message,
    created_at
FROM soap_audit_log
WHERE soap_operation = 'SavePolicyDetails'
  AND status IN ('failed', 'error')
ORDER BY created_at DESC;
```

---

## 🎯 Real-World Examples

### Example 1: Track a quote through the full journey

```sql
-- 1. Customer requests quotes
-- This creates multiple Terracotta Quote IDs

-- 2. Check what quotes were generated
SELECT 
    parsed_response->>'allQuoteIds' as all_quote_ids,
    parsed_response->>'quoteCount' as count
FROM soap_audit_log
WHERE soap_operation = 'ProvideQuotation'
  AND status = 'success'
ORDER BY created_at DESC
LIMIT 1;

-- 3. Customer selects one quote (e.g., 8546669)
-- System calls ScreeningQuestions

-- 4. Customer completes purchase
-- System calls SavePolicyDetails

-- 5. See the complete journey
SELECT * FROM get_terracotta_ids_for_quote(120);
```

---

### Example 2: Monitor which quotes converted to policies

```sql
SELECT 
    COUNT(DISTINCT terracotta_quote_id) as total_quotes,
    COUNT(DISTINCT terracotta_policy_id) as total_policies,
    ROUND(
        COUNT(DISTINCT terracotta_policy_id)::numeric / 
        NULLIF(COUNT(DISTINCT terracotta_quote_id), 0) * 100, 
        2
    ) as conversion_rate_percent
FROM soap_audit_log
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days';
```

---

### Example 3: Find orphaned Terracotta Quote IDs

These are Quote IDs from Terracotta that don't have a local quote record:

```sql
SELECT DISTINCT
    sal.terracotta_quote_id,
    sal.created_at,
    sal.soap_operation
FROM soap_audit_log sal
LEFT JOIN quotes q ON q.selected_plan->'plan'->>'terracottaQuoteId' = sal.terracotta_quote_id
WHERE sal.terracotta_quote_id IS NOT NULL
  AND q.id IS NULL
ORDER BY sal.created_at DESC;
```

---

## 🚀 Testing the New Features

### 1. Make a test quote in your app

1. Go to http://localhost:3000
2. Fill out the quote form
3. Select a quote
4. Complete the purchase

### 2. Check the captured IDs

```sql
-- See the latest quote's Terracotta IDs
SELECT 
    soap_operation,
    terracotta_quote_id,
    terracotta_policy_id,
    status,
    response_time_ms,
    created_at
FROM soap_audit_log
WHERE quote_id = (SELECT MAX(id) FROM quotes)
ORDER BY created_at ASC;
```

### 3. Verify in the monitoring dashboard

Open `backend/soap-monitor-dashboard.html` and you should see the Terracotta IDs in the logs!

---

## 📊 Console Output

When the proxy server processes requests, you'll now see:

```
🔄 Proxying request to Terracotta API: ProvideQuotation
📋 Extracted 5 Quote IDs from response: 8546669, 8546670, 8546671, 8546672, 8546673
✅ SOAP log updated (ID: 123) - Status: success
   📋 Terracotta Quote ID stored: 8546669
   📋 Total quote IDs in response: 5
```

For SavePolicyDetails:
```
🔄 Proxying request to Terracotta API: SavePolicyDetails
📋 Extracted Policy ID: POL-12345
✅ SOAP log updated (ID: 124) - Status: success
   📋 Terracotta Quote ID stored: 8546669
   🎫 Terracotta Policy ID stored: POL-12345
```

---

## ✅ Summary

**You can now:**

✅ **Track every Terracotta Quote ID** from ProvideQuotation responses  
✅ **Track every Terracotta Policy ID** from SavePolicyDetails responses  
✅ **See all quote IDs** returned in multi-quote responses  
✅ **Map local quote IDs** to Terracotta IDs  
✅ **Monitor conversions** from quotes to policies  
✅ **Debug issues** by seeing exact IDs used in API calls  
✅ **Query by Terracotta ID** to find local records  

**All automatically!** No code changes needed in your frontend. Just make quotes and the system captures everything.

---

## 🎉 Ready to Use!

The proxy server is now running with enhanced ID tracking. Every SOAP request will automatically capture and store:

- All Terracotta Quote IDs
- Terracotta Policy IDs
- Full request/response XML
- Status and timing
- Error messages

**Start making quotes and see the data flow in!** 🚀

