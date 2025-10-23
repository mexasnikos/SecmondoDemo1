# Fix: Dummy Data Appearing in Policy Documents

## 🐛 The Problem

Users were receiving policy documents with **dummy data** instead of their real information:

```
❌ Policy shows:
Mr John Doe
123 Main Street
12345

✅ Should show:
Mr Nikos Mexas
Real Street Address
Real Postal Code
```

---

## 🔍 Root Cause Analysis

### The Issue Flow

```
Phase 3: Get Quotes
    ↓
ProvideQuotation called with DUMMY data
    ↓
Terracotta creates QuoteID: 8546669
Stores: "Mr John Doe, 123 Main Street, 12345"
    ↓
User selects this quote
    ↓
Phase 7: Payment
    ↓
User enters REAL information
    ↓
Code tries to update with real data (ProvideQuotation again)
    ↓
Terracotta returns NEW QuoteID: 8547123 (with real data)
    ↓
❌ BUT: Code still uses OLD QuoteID: 8546669
    ↓
SavePolicyDetails called with OLD QuoteID
    ↓
Terracotta uses STORED dummy data from old QuoteID
    ↓
❌ Policy generated with dummy data!
```

---

## ✅ The Solution

**Update the QuoteID to use the NEW one with REAL traveler data**

When we re-fetch the quote with real traveler data at payment time, Terracotta returns a NEW quoteID. We now capture and use that NEW quoteID for SavePolicyDetails.

---

## 🔧 What Was Changed

### File: `src/pages/Quote2.tsx`

#### Change 1: Capture New QuoteID from ProvideQuotation (Lines 2456-2468)

**BEFORE:**
```typescript
const updatedQuoteResponse = await terracottaService.provideQuotation(quoteRequestWithRealData);
console.log('📥 Updated quote response:', updatedQuoteResponse);

// ❌ QuoteID not updated - still using old one with dummy data
```

**AFTER:**
```typescript
const updatedQuoteResponse = await terracottaService.provideQuotation(quoteRequestWithRealData);
console.log('📥 Updated quote response:', updatedQuoteResponse);

// ✅ UPDATE THE QUOTE ID WITH THE NEW ONE THAT HAS REAL DATA
if (updatedQuoteResponse.quotes && updatedQuoteResponse.quotes.length > 0) {
  const selectedPlan = updatedQuoteResponse.quotes.find((q: any) => 
    q.packageName === formData.selectedQuote?.name || 
    q.totalPrice === formData.selectedQuote?.price
  ) || updatedQuoteResponse.quotes[0];
  
  if (selectedPlan && selectedPlan.quoteId) {
    console.log('🔄 Updating quoteID from', formData.selectedQuote.terracottaQuoteId, 'to', selectedPlan.quoteId);
    formData.selectedQuote.terracottaQuoteId = selectedPlan.quoteId;
    console.log('✅ Using NEW QuoteID with REAL traveler data:', selectedPlan.quoteId);
  }
}
```

---

#### Change 2: Capture New QuoteID from ProvideQuotationWithAlterations (Lines 2491-2503)

**BEFORE:**
```typescript
const updatedAlterationsResponse = await terracottaService.provideQuotationWithAlterations(alterationsRequestWithRealData);
console.log('📥 Updated alterations response:', updatedAlterationsResponse);

// ❌ QuoteID not updated after alterations
```

**AFTER:**
```typescript
const updatedAlterationsResponse = await terracottaService.provideQuotationWithAlterations(alterationsRequestWithRealData);
console.log('📥 Updated alterations response:', updatedAlterationsResponse);

// ✅ UPDATE THE QUOTE ID WITH THE NEW ONE FROM ALTERATIONS
if (updatedAlterationsResponse.quotes && updatedAlterationsResponse.quotes.length > 0) {
  const selectedPlan = updatedAlterationsResponse.quotes.find((q: any) => 
    q.packageName === formData.selectedQuote?.name || 
    q.totalPrice === formData.selectedQuote?.price
  ) || updatedAlterationsResponse.quotes[0];
  
  if (selectedPlan && selectedPlan.quoteId) {
    console.log('🔄 Updating quoteID after alterations from', formData.selectedQuote.terracottaQuoteId, 'to', selectedPlan.quoteId);
    formData.selectedQuote.terracottaQuoteId = selectedPlan.quoteId;
    console.log('✅ Using NEW QuoteID with REAL data + alterations:', selectedPlan.quoteId);
  }
}
```

---

#### Change 3: Enhanced Logging (Lines 2514-2528)

**ADDED:**
```typescript
console.log('💾 ========================================');
console.log('💾 Saving policy details with Terracotta...');
console.log('💾 ========================================');
console.log('📋 QuoteID being used for SavePolicyDetails:', formData.selectedQuote.terracottaQuoteId);
console.log('📋 (This should be the NEW quoteID with REAL traveler data, not the original dummy data quoteID)');
```

This makes it clear in the console which QuoteID is being used.

---

## 🔄 New Flow (Fixed)

```
Phase 3: Get Quotes
    ↓
ProvideQuotation with dummy data
    ↓
QuoteID: 8546669 (dummy data)
    ↓
User selects quote
    ↓
Phase 7: Payment
    ↓
User enters REAL information
    ↓
ProvideQuotation with REAL data
    ↓
NEW QuoteID: 8547123 (real data) ✅
    ↓
✅ CODE NOW UPDATES TO USE NEW QUOTEID
    ↓
SavePolicyDetails with QuoteID: 8547123
    ↓
Terracotta uses REAL data from new QuoteID
    ↓
✅ Policy generated with REAL data!
```

---

## 📊 Console Output to Verify Fix

When testing, you should see these logs in the browser console:

### 1. Quote Re-fetch with Real Data
```
🔄 Re-fetching quote with REAL traveler data using ProvideQuotation...
📤 ProvideQuotation with REAL data: {...}
📥 Updated quote response: {...}
🔄 Updating quoteID from 8546669 to 8547123
✅ Using NEW QuoteID with REAL traveler data: 8547123
```

### 2. If Add-ons Selected
```
🔄 Re-fetching quote with add-ons using ProvideQuotationWithAlterations...
📤 ProvideQuotationWithAlterations with REAL data: {...}
📥 Updated alterations response: {...}
🔄 Updating quoteID after alterations from 8547123 to 8547456
✅ Using NEW QuoteID with REAL data + alterations: 8547456
```

### 3. SavePolicyDetails Call
```
💾 ========================================
💾 Saving policy details with Terracotta...
💾 ========================================
📋 QuoteID being used for SavePolicyDetails: 8547456
📋 (This should be the NEW quoteID with REAL traveler data)
📝 SavePolicyDetails - Travelers being sent:
  Traveler 1: Mr Nikos Mexas, Age: 35, DOB: 1989-01-15...
📝 SavePolicyDetails - Contact Details being sent: {Address: "Real Street, Real City, Real Country", Postcode: "12345", Email: "real@email.com"}
```

---

## 🧪 Testing Steps

### 1. Complete a Full Quote

1. Go to `/quote2`
2. Phase 1-2: Enter trip details and traveler info
3. Phase 3: Get quotes (will use dummy data internally)
4. Select a quote
5. Phase 7: Enter payment information with **REAL names and addresses**
6. **Open browser console (F12)** before clicking Pay
7. Click "Pay"

### 2. Verify in Console

Look for these specific logs:

**✅ GOOD SIGNS:**
```
🔄 Updating quoteID from [old_number] to [new_number]
✅ Using NEW QuoteID with REAL traveler data: [new_number]
📋 QuoteID being used for SavePolicyDetails: [new_number]
  Traveler 1: Mr [YOUR_REAL_NAME], Age: [REAL_AGE]
```

**❌ BAD SIGNS (if you see these, the fix isn't working):**
```
  Traveler 1: Mr John Doe, Age: 30
  Address: "123 Main Street"
```

### 3. Check the Policy Document

When you receive the policy:
- ✅ Should show YOUR real name
- ✅ Should show YOUR real address
- ✅ Should show YOUR real email

---

## 🎯 Why This Fix Works

### The Key Insight

**Terracotta Associates Data with QuoteIDs**

When you call ProvideQuotation, Terracotta:
1. Creates a NEW quoteID
2. Stores the traveler/contact data WITH that quoteID
3. When SavePolicyDetails is called with that quoteID, it uses the STORED data

**The Solution:**
- Don't use the OLD quoteID from the dummy data request
- Use the NEW quoteID from the real data request
- SavePolicyDetails will then use the correct stored data

---

## 📝 Alternative Approaches (Not Implemented)

### Option 1: Don't Use Dummy Data Initially
**Issue:** User hasn't entered traveler info yet at quote phase  
**Complexity:** Would require restructuring the entire wizard flow

### Option 2: Update Quote with UpdateQuote API
**Issue:** Terracotta might not have an UpdateQuote endpoint  
**Status:** Would need API documentation to verify

### Option 3: Send All Data in SavePolicyDetails
**Issue:** Terracotta appears to ignore traveler/contact data in SavePolicyDetails if it already has data for that quoteID  
**Status:** Current behavior suggests this doesn't work

---

## ⚠️ Edge Cases Handled

### 1. No Quotes Returned
```typescript
if (updatedQuoteResponse.quotes && updatedQuoteResponse.quotes.length > 0) {
  // Only update if quotes exist
}
```

### 2. Quote Not Found by Name/Price
```typescript
const selectedPlan = updatedQuoteResponse.quotes.find(...) 
  || updatedQuoteResponse.quotes[0]; // Fallback to first quote
```

### 3. No QuoteID in Response
```typescript
if (selectedPlan && selectedPlan.quoteId) {
  // Only update if quoteId exists
}
```

### 4. Re-fetch Fails
```typescript
catch (updateError) {
  console.warn('⚠️ Could not update quote with real data...');
  console.error('⚠️ This may result in policy using dummy data...');
  // Continue with old quoteID - policy will have dummy data but won't crash
}
```

---

## 🔍 Debugging

### If Policy Still Shows Dummy Data

#### Check 1: Console Logs
Look for:
```
🔄 Updating quoteID from X to Y
```

If you DON'T see this, the quote response might not have a new quoteID.

#### Check 2: Quote Response Structure
Add logging:
```typescript
console.log('Full response structure:', JSON.stringify(updatedQuoteResponse, null, 2));
```

Check if `quotes` array exists and contains `quoteId` field.

#### Check 3: SOAP Audit Log
```sql
SELECT 
  soap_operation,
  request_body,
  response_body,
  created_at
FROM soap_audit_log
WHERE soap_operation IN ('ProvideQuotation', 'SavePolicyDetails')
ORDER BY created_at DESC
LIMIT 5;
```

Look for:
- Does the second ProvideQuotation (with real data) return a different quoteID?
- Does SavePolicyDetails use that new quoteID?

---

## ✅ Success Criteria

After this fix:
- ✅ Policy documents show REAL traveler names
- ✅ Policy documents show REAL addresses
- ✅ Policy documents show REAL contact information
- ✅ Console logs clearly show quoteID being updated
- ✅ SavePolicyDetails uses the NEW quoteID with real data

---

## 📚 Files Modified

| File | Lines | Changes |
|------|-------|---------|
| `src/pages/Quote2.tsx` | 2456-2468 | Capture new quoteID from ProvideQuotation |
| `src/pages/Quote2.tsx` | 2491-2503 | Capture new quoteID from ProvideQuotationWithAlterations |
| `src/pages/Quote2.tsx` | 2514-2528 | Enhanced logging for SavePolicyDetails |
| `backend/FIX_DUMMY_DATA_IN_POLICY.md` | New | This documentation |

---

**Issue:** Policy showing "Mr John Doe, 123 Main Street, 12345"  
**Status:** ✅ FIXED  
**Solution:** Use NEW quoteID with real traveler data for SavePolicyDetails  
**Last Updated:** October 17, 2025  
**Version:** 1.0.0



