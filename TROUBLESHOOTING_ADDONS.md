# Troubleshooting Add-ons Not Showing

## Quick Diagnostic Steps

### Step 1: Check Browser Console

1. **Open Developer Tools** (F12 or Right-click → Inspect)
2. **Go to Console tab**
3. **Select a quote in Step 2** and look for these logs:

```
🔍 DEBUG - Selected Quote: {object with all quote fields}
🔍 DEBUG - Policy type field values: {
  policyTypeName: "...",
  policytypeName: "...", 
  typePolicyName: "...",
  rawPolicyTypeName: "..."
}
```

**What to look for:**
- ✅ If you see a policy type name → Good, continue to Step 2
- ❌ If all values are `undefined` → The SOAP response doesn't have policy type fields

### Step 2: Check Normalization

Look for this log:
```
✅ Normalized policy type: "Silver Annual Multi Trip" -> "Silver Annual Multi-Trip"
```

Or if extracting from name:
```
⚠️ No policy type field found, attempting to extract from quote name: "SchemaName - PolicyType"
🔍 Extracted policy type from name: "PolicyType"
```

**What to look for:**
- ✅ Shows normalization → Good, the mapping is working
- ⚠️ Shows "No mapping found" → The policy type isn't in our mappings
- ❌ No normalization log → No policy type found at all

### Step 3: Check API Call

Look for:
```
📋 Fetching addons for policy type: Silver Annual Multi-Trip (raw: Silver Annual Multi Trip)
```

Then check the response:
```
✅ Loaded 18 addons for Silver Annual Multi-Trip
```

Or:
```
⚠️ No addons found for policy type: ...
```

**What to look for:**
- ✅ "Loaded X addons" → Database returned results
- ❌ "No addons found" → Database query returned 0 results

### Step 4: Check Backend Console

If backend is running in terminal, check for:
```
📋 Fetching addons for policy type: Silver Annual Multi-Trip
✅ Found 18 addons for Silver Annual Multi-Trip
```

Or:
```
⚠️ No exact match, trying case-insensitive search for: ...
```

## Common Issues & Solutions

### Issue 1: All policy type fields are undefined

**Symptom:** Console shows:
```
🔍 DEBUG - Policy type field values: {
  policyTypeName: undefined,
  policytypeName: undefined, 
  typePolicyName: undefined,
  rawPolicyTypeName: undefined
}
```

**Solution A - Extract from quote name:**
The code should automatically try this. Check if you see:
```
⚠️ No policy type field found, attempting to extract from quote name: "..."
```

If the quote name format is `"SchemaName - PolicyTypeName"`, it will extract the policy type.

**Solution B - Check SOAP response structure:**
The SOAP response might use different field names. Look at the full quote object in console to find where the policy type is stored.

### Issue 2: Policy type not in mappings

**Symptom:** Console shows:
```
⚠️ No mapping found for policy type: "Some Unknown Type"
```

**Solution:** Add the policy type to the normalization mappings in `Quote2.tsx`:

```javascript
const mappings: { [key: string]: string } = {
  // Add your new mapping here
  'Some Unknown Type': 'Correct Database Name',
};
```

### Issue 3: Database table doesn't exist

**Symptom:** Backend error or no results

**Solution:** Run the setup script:
```bash
cd backend
node setup-addons-cover.js
```

### Issue 4: Database table is empty

**Symptom:** Backend returns 0 results for all queries

**Solution:** The setup script failed. Check:
1. PostgreSQL is running
2. Database credentials are correct in `.env`
3. Re-run setup: `node backend/setup-addons-cover.js`

### Issue 5: Policy type name mismatch

**Symptom:** Normalization works but backend finds 0 results

**Solution:** Check exact policy type names in database:
```bash
cd backend
node test-addons.js
```

This will show all available policy types in the database.

## Testing Tools

### Tool 1: Test Database Connection
```bash
cd backend
node test-addons.js
```

**Expected output:**
```
✅ Table addons_cover exists

📋 Available Policy Types in Database:
  ✓ "Silver Annual Multi-Trip" (18 add-ons)
  ✓ "Silver Single Trip" (23 add-ons)
  ✓ "Gold Annual Multi-Trip" (16 add-ons)
  ...
```

### Tool 2: Test API Endpoint
```bash
# Test exact match
curl http://localhost:5002/api/addons/Silver%20Annual%20Multi-Trip

# Test case variation  
curl http://localhost:5002/api/addons/silver%20annual%20multi%20trip
```

**Expected response:**
```json
{
  "status": "success",
  "policyType": "Silver Annual Multi-Trip",
  "addons": [...],
  "count": 18
}
```

### Tool 3: Check Database Directly
```sql
-- Connect to PostgreSQL
psql -U postgres -d travel_insurance

-- Check table exists
SELECT COUNT(*) FROM addons_cover;

-- See all policy types
SELECT DISTINCT policy_type_name FROM addons_cover;

-- Test specific policy type
SELECT * FROM addons_cover WHERE policy_type_name = 'Silver Annual Multi-Trip';
```

## Manual Fix Steps

### Fix 1: If no policy type fields exist in SOAP response

Update `Quote2.tsx` to always extract from name:

```typescript
// In the SOAP response mapping (around line 968)
policytypeName: result.policytypeName,
policyTypeName: result.typePolicyName || result.policytypeName || nameParts[1], // Add fallback
```

### Fix 2: If policy type name has different format

Add to normalization mappings:

```javascript
// In Quote2.tsx normalizePolicyTypeName function
const mappings: { [key: string]: string } = {
  // Existing mappings...
  'Your SOAP Format': 'Database Format',
  'Another Variation': 'Database Format',
};
```

### Fix 3: If database has different names

**Option A:** Update database to match SOAP:
```sql
UPDATE addons_cover 
SET policy_type_name = 'New Format' 
WHERE policy_type_name = 'Old Format';
```

**Option B:** Update frontend mappings to match database (preferred)

## Step-by-Step Debugging

1. **Open browser console** (F12)
2. **Navigate to Quote wizard**
3. **Fill Step 1** with trip details
4. **In Step 2**, select any quote
5. **Check console for:**
   - `🔍 DEBUG - Selected Quote:` - Shows the full quote object
   - `🔍 DEBUG - Policy type field values:` - Shows what policy type fields exist
   - `✅ Normalized policy type:` OR `⚠️ No mapping found` - Shows normalization result
   - `📋 Fetching addons for policy type:` - Shows what's being queried
   - `✅ Loaded X addons` OR `⚠️ No addons found` - Shows query result

6. **Click "Next" to Step 3**
7. **Expected:** Add-ons should display
8. **If not:** Check console for errors

## Contact Points

If issue persists, provide this information:

1. **Full console output** from Step 2 → Step 3
2. **Selected quote object** (from `🔍 DEBUG - Selected Quote:`)
3. **Backend console output** (if accessible)
4. **Database policy types** (from `node backend/test-addons.js`)

## Quick Fixes Checklist

- [ ] Database setup completed: `node backend/setup-addons-cover.js`
- [ ] Backend server running: `node backend/server.js`
- [ ] PostgreSQL running
- [ ] Browser console open (F12)
- [ ] Test database: `node backend/test-addons.js`
- [ ] Check console logs when selecting quote
- [ ] Verify policy type field exists in selected quote
- [ ] Check normalization logs
- [ ] Verify API call logs
- [ ] Test API endpoint: `curl http://localhost:5002/api/addons/Silver%20Annual%20Multi-Trip`

## Most Common Solution

**90% of the time**, the issue is that the SOAP response uses a different field name for policy type. 

**Quick Fix:**
1. Open console
2. Select a quote in Step 2
3. Find the `🔍 DEBUG - Selected Quote:` log
4. Look for ANY field that contains the policy type name
5. If found, update the code to use that field name
6. If not found, the policy type must be extracted from the `name` field (which should work automatically)

**Example:**
If you see in the quote object:
```javascript
{
  name: "TravelSafe - Silver Annual Multi-Trip",
  policyType: "Silver Annual Multi-Trip",  // <-- New field name!
  // ... other fields
}
```

Update `Quote2.tsx` line 826:
```typescript
const rawPolicyTypeName = 
  formData.selectedQuote?.policyType ||  // <-- Add this new field
  formData.selectedQuote?.policyTypeName || 
  formData.selectedQuote?.policytypeName || 
  formData.selectedQuote?.typePolicyName;
```









