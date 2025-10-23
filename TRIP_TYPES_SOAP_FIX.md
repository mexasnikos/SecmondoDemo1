# Trip Types SOAP Integration Fix

## Problem Identified

You were correct! The trip types were **not using SOAP data** properly. Here's what was happening:

### ❌ **Before (Incorrect):**
1. **UI correctly used SOAP** to get policy types via `getUserProductTypePolicy()`
2. **But conversion function** `getTypePolicyID()` used hardcoded mappings
3. **Result**: SOAP data was fetched but ignored during quote generation

### ✅ **After (Fixed):**
1. **UI uses SOAP** to get policy types
2. **Conversion function** now uses the actual SOAP data
3. **Result**: Trip types properly map to real Terracotta TypePolicyIDs

## Changes Made

### 1. **Updated `getTypePolicyID()` Function**
```typescript
// Before: Hardcoded mappings
function getTypePolicyID(tripType: string): string {
  const policyMap = {
    'single': '2',
    'annual': '23',
    // ...
  };
  return policyMap[tripType] || '2';
}

// After: Uses SOAP data
function getTypePolicyID(tripType: string, availablePolicyTypes?: TerracottaPolicyType[]): string {
  if (availablePolicyTypes && availablePolicyTypes.length > 0) {
    const policyType = availablePolicyTypes.find(pt => {
      const name = pt.TypePolicyName.toLowerCase();
      switch (tripType) {
        case 'single':
          return name.includes('single') && !name.includes('annual');
        case 'annual':
          return name.includes('annual') || name.includes('multi-trip');
        // ...
      }
    });
    
    if (policyType) {
      return policyType.TypePolicyID; // Use actual SOAP data!
    }
  }
  
  // Fallback to hardcoded if SOAP data not available
  return fallbackMapping[tripType] || '2';
}
```

### 2. **Updated `convertToTerracottaFormat()` Function**
```typescript
// Before: No SOAP data passed
static convertToTerracottaFormat(formData: any): TerracottaQuoteRequest

// After: SOAP data passed through
static convertToTerracottaFormat(formData: any, availablePolicyTypes?: TerracottaPolicyType[]): TerracottaQuoteRequest
```

### 3. **Updated Quote2.tsx**
```typescript
// Before: No policy types passed
const terracottaRequest = TerracottaService.convertToTerracottaFormat(formData);

// After: Policy types passed from SOAP
const terracottaRequest = TerracottaService.convertToTerracottaFormat(formData, availablePolicyTypes);
```

## How It Works Now

### **Step 1: Load Policy Types via SOAP**
```typescript
const policyTypeResponse = await terracottaService.getUserProductTypePolicy('717');
// Returns: [{ TypePolicyID: "2", TypePolicyName: "Silver Single Trip" }, ...]
```

### **Step 2: UI Maps Policy Names to Trip Types**
```typescript
{availablePolicyTypes.map((policyType) => {
  let tripTypeValue = 'single';
  const name = policyType.TypePolicyName.toLowerCase();
  if (name.includes('annual')) {
    tripTypeValue = 'annual';
  }
  // ...
  return (
    <option key={policyType.TypePolicyID} value={tripTypeValue}>
      {policyType.TypePolicyName}
    </option>
  );
})}
```

### **Step 3: Conversion Uses SOAP Data**
```typescript
// When user selects trip type 'single', it finds the matching policy type:
const policyType = availablePolicyTypes.find(pt => 
  pt.TypePolicyName.toLowerCase().includes('single') && 
  !pt.TypePolicyName.toLowerCase().includes('annual')
);
// Returns: { TypePolicyID: "2", TypePolicyName: "Silver Single Trip" }
```

## Benefits

1. **✅ Dynamic Policy Types**: No more hardcoded mappings
2. **✅ Real Terracotta Data**: Uses actual TypePolicyIDs from your account
3. **✅ Future-Proof**: New policy types automatically work
4. **✅ Accurate Mapping**: Policy names properly map to trip types
5. **✅ Fallback Support**: Still works if SOAP data unavailable

## Testing

Run the test to verify the fix:
```bash
node test-trip-types-soap.js
```

This will show:
- Available policy types from SOAP
- How each trip type maps to TypePolicyID
- Comparison with/without SOAP data

## Result

**Trip types now properly use SOAP data throughout the entire flow!** 🎉

The system now:
1. Fetches real policy types via SOAP
2. Maps them correctly in the UI
3. Uses the actual TypePolicyIDs in quote requests
4. Maintains fallback for reliability








