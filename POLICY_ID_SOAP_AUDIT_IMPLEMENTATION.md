# Policy ID SOAP Audit Implementation

## ✅ Implementation Complete

This implementation adds a `policy_id` column to the `soap_audit_log` table that maps to the local policy number from the `quotes` table, allowing you to track which SOAP action corresponds to which policy ID.

## 🎯 What Was Requested

> "on step payment, always populate on soap_audit_log the policy_id to terracotta_policy_id. the reason of that is to know exactly on which policy id corresponds the soapaction, respectively, is that clear?"

## ✅ What Was Delivered

### 1. **Database Schema Enhancement**

**New Column Added:**
- **Table**: `soap_audit_log`
- **Column**: `policy_id`
- **Type**: `VARCHAR(100)`
- **Purpose**: Maps to local policy number from quotes table
- **Index**: Created for better query performance

### 2. **SOAP Logger Updates**

**Files Modified:**
- `backend/soap-logger.js` - Updated to handle `policy_id` field
- Added `policyId` parameter to `logSOAPRequest()` function
- Added `policyId` to `updateSOAPLog()` function
- Updated SQL queries to include `policy_id` column

### 3. **Payment Process Integration**

**Files Modified:**
- `backend/server.js` - Main payment endpoint
- `backend/server-optimized.js` - Optimized payment endpoint

**Enhancement:**
- After payment processing, updates all SOAP audit log entries for the quote with the policy_id
- Ensures every SOAP operation can be traced back to the specific policy

## 🔄 How It Works

### **Step 1: SOAP Operations Logged**
When SOAP requests are made (ProvideQuotation, SavePolicyDetails, etc.):
- Proxy server logs the request to `soap_audit_log`
- Initially `policy_id` is NULL (no policy number yet)

### **Step 2: Payment Processing**
When user completes payment:
- Quote is updated with `policy_number` and `status = 'paid'`
- **NEW**: All SOAP audit log entries for that quote are updated with `policy_id = policy_number`

### **Step 3: Complete Traceability**
Now you can:
- Query all SOAP operations for a specific policy: `WHERE policy_id = 'POL-12345'`
- Track the complete journey from quote to policy
- Debug issues by correlating SOAP actions with specific policies

## 📊 Database Structure

### **Before Implementation:**
```sql
soap_audit_log:
- terracotta_quote_id (from Terracotta API)
- terracotta_policy_id (from Terracotta API)
- policy_id: NULL (not available)
```

### **After Implementation:**
```sql
soap_audit_log:
- terracotta_quote_id (from Terracotta API)
- terracotta_policy_id (from Terracotta API)  
- policy_id: 'POL-12345' (local policy number) ← NEW!
```

## 🧪 Test Results

```
✅ policy_id column exists in soap_audit_log table
✅ Payment process updates SOAP audit log with policy_id
✅ All SOAP operations can be mapped to local policy numbers
✅ You can now query SOAP operations by policy_id

📈 Mapping Statistics:
   - Total SOAP operations: 2
   - Operations with policy_id: 2
   - Operations with correct policy_id: 2
🎉 SUCCESS: All SOAP operations correctly mapped to policy_id!
```

## 📋 Usage Examples

### **Query SOAP Operations by Policy ID**
```sql
SELECT 
  soap_operation,
  terracotta_quote_id,
  terracotta_policy_id,
  policy_id,
  created_at
FROM soap_audit_log 
WHERE policy_id = 'POL-12345'
ORDER BY created_at;
```

### **Find All Policies with SOAP Issues**
```sql
SELECT 
  policy_id,
  COUNT(*) as soap_operations,
  COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_ops,
  COUNT(CASE WHEN status = 'error' THEN 1 END) as failed_ops
FROM soap_audit_log 
WHERE policy_id IS NOT NULL
GROUP BY policy_id
HAVING COUNT(CASE WHEN status = 'error' THEN 1 END) > 0;
```

### **Track Complete Policy Journey**
```sql
SELECT 
  q.policy_number,
  q.status as quote_status,
  sal.soap_operation,
  sal.status as soap_status,
  sal.terracotta_policy_id,
  sal.created_at
FROM quotes q
JOIN soap_audit_log sal ON q.policy_number = sal.policy_id
WHERE q.policy_number = 'POL-12345'
ORDER BY sal.created_at;
```

## 🎯 Benefits

1. **Complete Traceability**: Every SOAP operation can be traced to a specific policy
2. **Debugging**: Easily identify which SOAP actions caused issues for specific policies
3. **Compliance**: Maintain audit trails linking policies to all API interactions
4. **Analytics**: Analyze SOAP performance and success rates per policy
5. **Support**: Quickly find all SOAP operations related to a customer's policy

## 📁 Files Created/Modified

### **New Files:**
- `backend/add-policy-id-to-soap-audit.sql` - Database migration script
- `backend/add-policy-id-migration.js` - Migration runner
- `backend/test-policy-id-mapping.js` - Test script
- `POLICY_ID_SOAP_AUDIT_IMPLEMENTATION.md` - This documentation

### **Modified Files:**
- `backend/soap-logger.js` - Updated to handle policy_id field
- `backend/server.js` - Updated payment process to set policy_id
- `backend/server-optimized.js` - Updated payment process to set policy_id

## 🚀 Ready for Production

The implementation is complete and ready for use:

- ✅ Database schema updated with policy_id column
- ✅ SOAP logger handles policy_id field
- ✅ Payment process updates SOAP audit log
- ✅ All tests passing
- ✅ Complete traceability achieved

**Now you can track exactly which SOAP action corresponds to which policy ID!** 🎯
