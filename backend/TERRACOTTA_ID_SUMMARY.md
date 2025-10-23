# ✅ Terracotta ID Tracking - Implementation Summary

## What Was Requested

> "Please apply again the changes for quote_id (terracotta) and then do the same for policy id (terracotta)"

## ✅ What Was Delivered

### 1. **Enhanced Proxy Server** (`server/proxy-server.js`)

**Updated Functions:**
- `extractResponseData()` - Now extracts:
  - ✅ **ALL Terracotta Quote IDs** from ProvideQuotation responses (not just the first one)
  - ✅ **Terracotta Policy IDs** from SavePolicyDetails responses
  - ✅ **Error messages** from failed responses
  - ✅ **Multiple ID formats** (`<policyID>`, `<PolicyNumber>`)

**Enhanced Logging:**
```javascript
📋 Extracted 5 Quote IDs from response: 8546669, 8546670, 8546671, 8546672, 8546673
📋 Extracted Policy ID: POL-12345
✅ SOAP log updated (ID: 123) - Status: success
   📋 Terracotta Quote ID stored: 8546669
   🎫 Terracotta Policy ID stored: POL-12345
   📋 Total quote IDs in response: 5
```

**Enhanced Storage:**
- Primary Terracotta Quote ID → `soap_audit_log.terracotta_quote_id`
- Terracotta Policy ID → `soap_audit_log.terracotta_policy_id`
- All Quote IDs array → `soap_audit_log.parsed_response->>'allQuoteIds'`
- Quote count → `soap_audit_log.parsed_response->>'quoteCount'`

---

### 2. **New Database Views** (`backend/add-terracotta-views.sql`)

#### View 1: `terracotta_quote_tracking`
**Purpose:** Track all unique Terracotta Quote IDs

**Shows:**
- Terracotta Quote ID
- Local quote ID (if linked)
- All SOAP operations performed
- Success/failure counts
- First and last seen timestamps
- Associated Policy ID

**Usage:**
```sql
SELECT * FROM terracotta_quote_tracking;
```

---

#### View 2: `terracotta_policy_tracking`
**Purpose:** Track all Terracotta Policy IDs

**Shows:**
- Terracotta Policy ID
- Associated Quote ID
- Local database IDs
- Creation timestamp
- Save status
- Quote amount

**Usage:**
```sql
SELECT * FROM terracotta_policy_tracking;
```

---

#### View 3: `quote_id_mapping`
**Purpose:** Map local IDs ↔ Terracotta IDs

**Shows:**
- Local quote ID → Terracotta Quote ID
- Local policy number → Terracotta Policy ID
- Quote status and amount
- Links between all ID types

**Usage:**
```sql
SELECT * FROM quote_id_mapping;
```

---

#### View 4: `soap_operation_summary_with_ids`
**Purpose:** Summary statistics with ID counts

**Shows:**
- Operations performed
- Unique Quote IDs captured
- Unique Policy IDs captured
- Success/failure rates
- Performance metrics

**Usage:**
```sql
SELECT * FROM soap_operation_summary_with_ids;
```

---

### 3. **Helper Functions** (`backend/add-terracotta-views.sql`)

#### Function 1: `get_terracotta_ids_for_quote(quote_id)`
**Get all Terracotta IDs for a local quote**

```sql
SELECT * FROM get_terracotta_ids_for_quote(120);
```

**Returns:**
| terracotta_quote_id | terracotta_policy_id | soap_operation | status | created_at |
|---------------------|----------------------|----------------|--------|------------|
| 8546669 | NULL | ProvideQuotation | success | 2025-10-07... |
| 8546669 | POL-12345 | SavePolicyDetails | success | 2025-10-07... |

---

#### Function 2: `find_quote_by_terracotta_id(terracotta_quote_id)`
**Find local quote by Terracotta Quote ID**

```sql
SELECT * FROM find_quote_by_terracotta_id('8546669');
```

**Returns:**
| local_quote_id | policy_number | status | total_amount | soap_operations |
|----------------|---------------|--------|--------------|-----------------|
| 120 | TI-39734624 | paid | 62.74 | ProvideQuotation, SavePolicyDetails |

---

### 4. **Documentation Files Created**

| File | Purpose |
|------|---------|
| `backend/add-terracotta-views.sql` | SQL script with views and functions |
| `backend/apply-terracotta-views.js` | Script to apply views to database |
| `backend/TERRACOTTA_ID_TRACKING.md` | Complete usage guide |
| `backend/TERRACOTTA_ID_SUMMARY.md` | This summary file |

---

## 🎯 How It Works

### Automatic Tracking Flow:

```
1. User requests quotes
   ↓
2. Frontend → Terracotta API (via proxy)
   ↓
3. Proxy receives ProvideQuotation response with multiple Quote IDs
   ↓
4. Proxy extracts ALL Quote IDs: [8546669, 8546670, 8546671, ...]
   ↓
5. Stores in soap_audit_log:
   - terracotta_quote_id: 8546669 (first one)
   - parsed_response->allQuoteIds: ["8546669", "8546670", ...]
   ↓
6. User selects a quote and purchases
   ↓
7. Frontend → SavePolicyDetails API
   ↓
8. Proxy receives response with Policy ID
   ↓
9. Stores in soap_audit_log:
   - terracotta_policy_id: POL-12345
   ↓
10. Done! Now you can query:
    - Which quotes have policies
    - Conversion rates
    - Failed policy saves
    - Complete audit trail
```

---

## 📊 Data Storage Summary

### Three Levels of ID Storage:

**Level 1: Main Quote Table**
```sql
quotes.id                                        → 120
quotes.policy_number                             → TI-39734624
quotes.selected_plan->'plan'->>'terracottaQuoteId' → 8546669
```

**Level 2: SOAP Audit Log** (⭐ **New Enhanced**)
```sql
soap_audit_log.terracotta_quote_id              → 8546669
soap_audit_log.terracotta_policy_id             → POL-12345
soap_audit_log.parsed_response->>'allQuoteIds' → ["8546669", "8546670", ...]
```

**Level 3: Convenient Views** (⭐ **New**)
```sql
terracotta_quote_tracking    → All Quote IDs with operations
terracotta_policy_tracking   → All Policy IDs
quote_id_mapping             → Local ↔ Terracotta mappings
```

---

## ✅ Quick Verification

### Test that it's working:

```sql
-- 1. Check recent Terracotta Quote IDs captured
SELECT 
    terracotta_quote_id,
    soap_operation,
    status,
    created_at
FROM soap_audit_log
WHERE terracotta_quote_id IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;

-- 2. Check recent Terracotta Policy IDs captured
SELECT 
    terracotta_policy_id,
    terracotta_quote_id,
    status,
    created_at
FROM soap_audit_log
WHERE terracotta_policy_id IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;

-- 3. See the mapping
SELECT * FROM quote_id_mapping
WHERE terracotta_quote_id_from_soap IS NOT NULL
ORDER BY local_quote_id DESC
LIMIT 5;
```

---

## 🎉 What You Can Now Do

✅ **Track Quote Journey**
```sql
-- See complete journey of Quote ID 8546669
SELECT * FROM get_terracotta_ids_for_quote(120);
```

✅ **Monitor Conversions**
```sql
-- See which quotes became policies
SELECT * FROM terracotta_policy_tracking;
```

✅ **Find by Terracotta ID**
```sql
-- Find local quote for Terracotta ID
SELECT * FROM find_quote_by_terracotta_id('8546669');
```

✅ **Debug Failed Policies**
```sql
-- See why SavePolicyDetails failed
SELECT 
    terracotta_quote_id,
    error_message,
    request_body,
    response_body
FROM soap_audit_log
WHERE soap_operation = 'SavePolicyDetails'
  AND status = 'failed';
```

✅ **Analyze Performance**
```sql
-- See SOAP operation stats with ID counts
SELECT * FROM soap_operation_summary_with_ids;
```

---

## 🚀 Status

**✅ Proxy Server:** Running with enhanced ID extraction  
**✅ Database Views:** Created and ready to use  
**✅ Helper Functions:** Available for querying  
**✅ Documentation:** Complete with examples  

**Next Step:** Make a test quote and watch the Terracotta IDs get captured automatically! 🎯

---

## 📚 Documentation Files

For detailed usage, see:
- **Complete Guide:** `backend/TERRACOTTA_ID_TRACKING.md`
- **SQL Views:** `backend/add-terracotta-views.sql`
- **Original SOAP Guide:** `backend/SOAP_AUDIT_GUIDE.md`

