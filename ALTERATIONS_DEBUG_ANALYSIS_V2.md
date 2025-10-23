# ProvideQuotationWithAlterations Debug Analysis - Updated

## Key Issues Identified from Official Documentation

### 1. **Incorrect Request Structure** ✅ FIXED
**Problem**: Your original request used the wrong structure
- Used `QuoteID` instead of `quoteID` (case sensitive)
- Used `quoteDetails` instead of `specificQuoteDetails`
- Missing proper nesting structure

**Solution**: Updated to match official documentation structure:
```typescript
{
  userID: string;
  userCode: string;
  quoteID: string; // lowercase 'q'
  specificQuoteDetails: {
    AlterationID: string;
    Travellers: TerracottaTraveler[];
    ContactDetails: TerracottaContactDetails;
    // Optional fields...
  }
}
```

### 2. **Missing Method Implementation** ✅ FIXED
**Problem**: `ProvideQuotationWithAlterations` was not implemented
**Solution**: Added complete implementation with proper SOAP structure

### 3. **QuoteID Dependency** ⚠️ CRITICAL
**Problem**: The method can ONLY be called AFTER obtaining a quote reference from `ProvideQuotation`
**Solution**: Must first call `ProvideQuotation` to get a valid `quoteID`

## Corrected SOAP Request Structure

### Your Original (Incorrect):
```xml
<ProvideQuotationWithAlterations xmlns="WS-IntegratedQuote">
  <userID>4072</userID>
  <userCode>111427</userCode>
  <QuoteID>8547466</QuoteID>
  <AlterationID>39855,39794</AlterationID>
  <quoteDetails>
    <!-- Full quote details -->
  </quoteDetails>
</ProvideQuotationWithAlterations>
```

### Corrected (Based on Documentation):
```xml
<ProvideQuotationWithAlterations xmlns="WS-IntegratedQuote">
  <userID>4072</userID>
  <userCode>111427</userCode>
  <quoteID>8547466</quoteID>
  <specificQuoteDetails>
    <AlterationID>39855,39794</AlterationID>
    <Travellers>
      <!-- Only traveler details -->
    </Travellers>
    <ContactDetails>
      <!-- Only contact details -->
    </ContactDetails>
  </specificQuoteDetails>
</ProvideQuotationWithAlterations>
```

## Key Differences from ProvideQuotation

1. **Structure**: Uses `specificQuoteDetails` instead of `quoteDetails`
2. **Content**: Only includes `Travellers`, `ContactDetails`, and optional fields
3. **Dependencies**: Requires a valid `quoteID` from previous `ProvideQuotation` call
4. **Purpose**: Updates existing quote, doesn't create new one

## Implementation Added

### New Interfaces:
```typescript
export interface TerracottaQuoteWithAlterationsRequest {
  userID: string;
  userCode: string;
  quoteID: string; // lowercase 'q'
  specificQuoteDetails: {
    AlterationID: string;
    Travellers: TerracottaTraveler[];
    ContactDetails: TerracottaContactDetails;
    DynamicDetails?: TerracottaDynamicDetail[];
    screeningQuestionAnswers?: TerracottaScreeningQuestionAnswer[];
    EligibilityQuestionAnswers?: TerracottaEligibilityQuestionAnswer[];
  };
}
```

### New SOAP Builder Methods:
- `buildSpecificQuoteDetailsXML()` - Builds the specificQuoteDetails structure
- `buildDynamicDetailsXML()` - Handles DynamicDetails
- `buildEligibilityAnswersXML()` - Handles eligibility questions

## Testing Strategy

### Step 1: Get Valid QuoteID
```javascript
// First, get a valid quoteID
const regularRequest = {
  userID: '4072',
  userCode: '111427',
  quoteDetails: { /* full quote details */ }
};
const response = await service.provideQuotation(regularRequest);
const validQuoteID = response.quoteResults[0].QuoteID;
```

### Step 2: Use QuoteID for Alterations
```javascript
const alterationRequest = {
  userID: '4072',
  userCode: '111427',
  quoteID: validQuoteID, // Use the valid quoteID
  specificQuoteDetails: {
    AlterationID: '39855,39794',
    Travellers: [/* traveler details */],
    ContactDetails: {/* contact details */}
  }
};
const response = await service.provideQuotationWithAlterations(alterationRequest);
```

## Files Updated

1. **`src/services/terracottaService.ts`** - Added complete implementation
2. **`test-corrected-alterations-v2.xml`** - Corrected SOAP request
3. **`test-alterations-debug.js`** - Updated debug script
4. **`ALTERATIONS_DEBUG_ANALYSIS_V2.md`** - This analysis

## Most Likely Cause of "No Quotes Found"

The issue is probably that you're using an invalid or expired `quoteID`. The `ProvideQuotationWithAlterations` method requires a **fresh, valid quoteID** obtained from a recent `ProvideQuotation` call.

## Next Steps

1. **Get a fresh quoteID** using `ProvideQuotation` first
2. **Use the corrected structure** with `specificQuoteDetails`
3. **Test with the debug script** to verify the fix
4. **Check SOAP audit logs** for detailed error information

## Expected Result

Once you use a valid `quoteID` from `ProvideQuotation` and the correct structure, you should get quotes with the additional covers (AlterationIDs 39855, 39794) included.








