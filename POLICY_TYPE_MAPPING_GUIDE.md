# Policy Type Name Mapping Guide

## Overview
This document explains how policy type names from the SOAP response are mapped to the database `addons_cover` table to ensure correct add-ons are displayed.

## The Problem
The SOAP response may return policy type names in various formats (e.g., `policytypeName`, `typePolicyName`, `policyTypeName`) and with slight variations in naming (e.g., "Multi Trip" vs "Multi-Trip"). The database has exact policy type names that must match precisely.

## Database Policy Type Names

The `addons_cover` table contains these exact policy type names:

1. **Silver Annual Multi-Trip** (18 add-ons)
2. **Silver Single Trip** (23 add-ons)
3. **Gold Annual Multi-Trip** (16 add-ons)
4. **Gold Single Trip** (27 add-ons)
5. **Essential Annual Multi-Trip** (1 add-on)
6. **Essential Single Trip** (1 add-on)
7. **Value Single Trip** (1 add-on)
8. **Long Stay Standard** (8 add-ons)
9. **Long Stay Study Abroad** (2 add-ons)

## Solution: Two-Layer Matching

### Layer 1: Frontend Normalization (Quote2.tsx)

A `normalizePolicyTypeName()` function in the frontend handles:

#### 1. Exact Mappings (Case-Insensitive)
```javascript
'Silver Annual Multi-Trip' → 'Silver Annual Multi-Trip'
'Silver Annual Multi Trip' → 'Silver Annual Multi-Trip'  // Handles hyphen variations
'Gold Annual Multi Trip' → 'Gold Annual Multi-Trip'
'Longstay Standard' → 'Long Stay Standard'  // Handles spacing
```

#### 2. Pattern Matching
If exact match fails, uses keyword detection:
- Contains "silver" + "annual" → "Silver Annual Multi-Trip"
- Contains "gold" + "single" → "Gold Single Trip"
- Contains "long" + "stay" + "study" → "Long Stay Study Abroad"
- Contains "essential" + "annual" → "Essential Annual Multi-Trip"
- etc.

### Layer 2: Backend Fallback (server.js)

The API endpoint tries three matching strategies in order:

#### 1. Exact Match
```sql
WHERE policy_type_name = 'Silver Annual Multi-Trip'
```

#### 2. Case-Insensitive Match
```sql
WHERE LOWER(policy_type_name) = LOWER('silver annual multi-trip')
```

#### 3. Pattern Match (ILIKE)
```sql
WHERE policy_type_name ILIKE '%Silver%Annual%'
```

## SOAP Response Fields

The system checks multiple SOAP response fields in order:
1. `policyTypeName` (normalized in newer responses)
2. `policytypeName` (raw field from SOAP)
3. `typePolicyName` (alternative field name)

Example SOAP response handling:
```typescript
const rawPolicyTypeName = 
  formData.selectedQuote?.policyTypeName || 
  formData.selectedQuote?.policytypeName || 
  formData.selectedQuote?.typePolicyName;

const normalizedName = normalizePolicyTypeName(rawPolicyTypeName);
```

## Common Mapping Examples

### Example 1: Silver Annual Multi-Trip
**SOAP Returns:** `"Silver Annual Multi Trip"` (no hyphen)
**Frontend Normalizes To:** `"Silver Annual Multi-Trip"` (with hyphen)
**Database Matches:** ✅ Exact match
**Result:** 18 add-ons returned

### Example 2: Gold Single Trip
**SOAP Returns:** `"gold single trip"` (lowercase)
**Frontend Normalizes To:** `"Gold Single Trip"` (proper case)
**Backend Matches:** ✅ Case-insensitive match
**Result:** 27 add-ons returned

### Example 3: Long Stay Standard
**SOAP Returns:** `"Longstay Standard"` (no space)
**Frontend Normalizes To:** `"Long Stay Standard"` (with space)
**Database Matches:** ✅ Exact match after normalization
**Result:** 8 add-ons returned

### Example 4: Unknown Type (Fallback)
**SOAP Returns:** `"Platinum Single Trip"` (not in database)
**Frontend Normalizes To:** `"Platinum Single Trip"` (no match found)
**Backend Tries:**
1. Exact match ❌
2. Case-insensitive ❌
3. Pattern match ❌
**Result:** 0 add-ons, shows "No add-ons available" message

## Debugging

### Frontend Console Logs
```
✅ Normalized policy type: "Silver Annual Multi Trip" -> "Silver Annual Multi-Trip"
📋 Fetching addons for policy type: Silver Annual Multi-Trip (raw: Silver Annual Multi Trip)
✅ Loaded 18 addons for Silver Annual Multi-Trip
```

### Backend Console Logs
```
📋 Fetching addons for policy type: Silver Annual Multi-Trip
✅ Found 18 addons for Silver Annual Multi-Trip
```

If no exact match:
```
📋 Fetching addons for policy type: silver annual multi trip
⚠️ No exact match, trying case-insensitive search for: silver annual multi trip
✅ Found 18 addons for silver annual multi trip
```

### Warning Logs
When no mapping is found:
```
⚠️ No mapping found for policy type: "Platinum Single Trip"
```

## Adding New Policy Types

### Step 1: Add to Database
```sql
INSERT INTO addons_cover (policy_type_name, additional_cover_name, additional_cover_detail, alteration_id) 
VALUES ('New Policy Type', 'Add-on Name', 'Details', '12345');
```

### Step 2: Add to Frontend Mapping
Edit `Quote2.tsx`, add to mappings object:
```javascript
const mappings: { [key: string]: string } = {
  // ... existing mappings ...
  'New Policy Type': 'New Policy Type',
  'new policy type': 'New Policy Type',  // Handle lowercase
  'NewPolicyType': 'New Policy Type',    // Handle no spaces
};
```

### Step 3: Add Pattern Matching (Optional)
If the policy type follows a pattern:
```javascript
if (lowerNormalized.includes('new') && lowerNormalized.includes('policy')) {
  return 'New Policy Type';
}
```

## Testing the Mapping

### Test in Browser Console
1. Open browser DevTools
2. Navigate to Step 2 (select a quote)
3. Check console for normalization logs
4. Move to Step 3
5. Check if correct add-ons load

### Test API Directly
```bash
# Test exact match
curl http://localhost:5002/api/addons/Silver%20Annual%20Multi-Trip

# Test case variation
curl http://localhost:5002/api/addons/silver%20annual%20multi%20trip

# Test spacing variation
curl http://localhost:5002/api/addons/Silver%20Annual%20Multi%20Trip
```

### Expected Response
```json
{
  "status": "success",
  "policyType": "Silver Annual Multi-Trip",
  "addons": [
    {
      "id": 1,
      "policy_type_name": "Silver Annual Multi-Trip",
      "additional_cover_name": "Business Cover",
      "additional_cover_detail": null,
      "alteration_id": "39784"
    }
    // ... more addons
  ],
  "count": 18
}
```

## Troubleshooting

### Issue: No add-ons showing
**Check:**
1. Browser console for policy type normalization logs
2. Backend console for SQL queries
3. Database for exact policy type name
4. SOAP response for actual field values

**Solution:**
- Add the SOAP value to the mappings object
- Or adjust the database policy type name to match

### Issue: Wrong add-ons showing
**Check:**
- The normalized policy type in console logs
- Database for policy type names

**Solution:**
- Verify the mapping is correct
- Check for typos in database or mappings

### Issue: Pattern matching too broad
**Example:** "Gold Annual" matches both "Gold Annual Multi-Trip" and "Gold Annual Single-Trip"

**Solution:**
- Make pattern matching more specific
- Use exact mappings instead of patterns
- Add order of precedence (check "Gold Annual Single" before "Gold Annual")

## Best Practices

1. **Always use normalization function** - Don't query database with raw SOAP values
2. **Log all mappings** - Console logs help debug mismatches
3. **Prefer exact mappings** - Pattern matching is fallback only
4. **Test all policy types** - Verify each type loads correct add-ons
5. **Keep database names consistent** - Use standardized format (e.g., always use hyphens)

## Files Modified

- **Frontend:** `src/pages/Quote2.tsx` - Added `normalizePolicyTypeName()` function
- **Backend:** `backend/server.js` - Added multi-strategy matching in `/api/addons/:policyType`

## Summary

The mapping system provides robust matching between SOAP response policy type names and database policy type names through:
1. ✅ Frontend normalization with exact and pattern matching
2. ✅ Backend fallback with case-insensitive and fuzzy matching
3. ✅ Comprehensive logging for debugging
4. ✅ Graceful handling of unknown policy types

This ensures add-ons are correctly displayed regardless of minor variations in SOAP response formatting.









