# VAT ID Validation for Greece - Implementation Guide

## Overview

A VAT ID field has been added to the payment step with conditional validation based on the Country of Residence:
- **If Country of Residence = Greece** → VAT ID is **MANDATORY** ✅
- **If Country of Residence ≠ Greece** → VAT ID is **OPTIONAL** ⚪

---

## 📋 Implementation Details

### 1. **Interface Update**

Added `vatId` to the `billingAddress` interface:

```typescript
interface QuoteFormData {
  // ... other fields
  billingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    vatId: string;  // ← NEW FIELD
  };
}
```

**File:** `src/pages/Quote2.tsx` (lines 415-421)

---

### 2. **State Initialization**

Added `vatId` to the initial state:

```typescript
billingAddress: {
  street: '',
  city: '',
  postalCode: '',
  country: '',
  vatId: ''  // ← INITIALIZED
}
```

**File:** `src/pages/Quote2.tsx` (lines 466-472)

---

### 3. **Form Field - Payment Step**

Added VAT ID field in the billing address section with conditional labeling:

```typescript
<div className="form-row">
  <div className="form-group">
    <label htmlFor="vatId">
      VAT ID {formData.countryOfResidence === 'Greece' && <span style={{color: 'red'}}>*</span>}
      {formData.countryOfResidence === 'Greece' && <span style={{fontSize: '12px', color: '#666'}}> (Required for Greece)</span>}
    </label>
    <input
      type="text"
      id="vatId"
      value={formData.billingAddress.vatId}
      onChange={(e) => handleBillingAddressChange('vatId', e.target.value)}
      placeholder={formData.countryOfResidence === 'Greece' ? 'Enter VAT ID (Required)' : 'Enter VAT ID (Optional)'}
      title={formData.countryOfResidence === 'Greece' ? 'VAT ID is required for Greece' : 'VAT ID (optional)'}
      required={formData.countryOfResidence === 'Greece'}
    />
  </div>
</div>
```

**File:** `src/pages/Quote2.tsx` (lines 3829-3846)

**Features:**
- ✅ Red asterisk (*) appears only for Greece
- ✅ "(Required for Greece)" text appears only for Greece
- ✅ Placeholder text changes based on country
- ✅ HTML5 `required` attribute added conditionally

---

### 4. **Validation Logic**

Added validation in the `processPayment` function:

```typescript
// Validate VAT ID for Greece
if (formData.countryOfResidence === 'Greece') {
  const vatId = formData.billingAddress.vatId;
  
  if (!vatId || vatId.trim() === '') {
    alert('❌ VAT ID Required\n\nFor residents of Greece, VAT ID is mandatory.\n\nPlease enter your VAT ID in the billing address section before proceeding with payment.');
    return;
  }
  
  console.log('✅ VAT ID validation passed for Greece:', vatId);
} else {
  console.log('✅ VAT ID validation skipped (not Greece)');
}
```

**File:** `src/pages/Quote2.tsx` (lines 2343-2355)

**Validation Checks:**
- ❌ VAT ID is null
- ❌ VAT ID is empty string
- ❌ VAT ID is whitespace only
- ✅ VAT ID has valid content

---

## 🎨 User Experience

### For Greece Residents

**Label:**
```
VAT ID * (Required for Greece)
```

**Placeholder:**
```
Enter VAT ID (Required)
```

**If Empty and Click "Pay":**
```
❌ VAT ID Required

For residents of Greece, VAT ID is mandatory.

Please enter your VAT ID in the billing address section before proceeding with payment.
```

---

### For Non-Greece Residents

**Label:**
```
VAT ID
```

**Placeholder:**
```
Enter VAT ID (Optional)
```

**If Empty:**
- ✅ Payment proceeds normally
- ✅ No validation error

---

## 🔄 Complete Validation Flow

```
User Clicks "Pay"
    ↓
Check Terms Accepted ✅
    ↓
Check Policy Holder Email ✅
    ↓
Check All Traveler Emails ✅
    ↓
Check Country of Residence
    ├─ Greece?
    │   ├─ YES → Check VAT ID
    │   │   ├─ Empty? → Show Alert, Stop ❌
    │   │   └─ Valid? → Continue ✅
    │   └─ NO → Skip VAT ID Check ✅
    ↓
Proceed with Payment ✅
```

---

## 🧪 Test Scenarios

### Scenario 1: Greece with VAT ID

**Setup:**
- Country of Residence: `Greece`
- VAT ID: `EL123456789`

**Expected:**
- ✅ Field shows red asterisk (*)
- ✅ Field shows "(Required for Greece)"
- ✅ Placeholder: "Enter VAT ID (Required)"
- ✅ Validation passes
- ✅ Payment proceeds

**Test:**
1. Select Greece as Country of Residence
2. Enter VAT ID
3. Click "Pay"
4. Verify no validation error
5. Verify console log: "✅ VAT ID validation passed for Greece: EL123456789"

---

### Scenario 2: Greece without VAT ID

**Setup:**
- Country of Residence: `Greece`
- VAT ID: `` (empty)

**Expected:**
- ❌ Field shows red asterisk (*)
- ❌ Validation fails
- ❌ Alert shown: "VAT ID Required"
- ❌ Payment does NOT proceed

**Test:**
1. Select Greece as Country of Residence
2. Leave VAT ID empty
3. Click "Pay"
4. Verify alert appears: "For residents of Greece, VAT ID is mandatory"
5. Verify payment doesn't start
6. Verify console log: (none, stopped before)

---

### Scenario 3: Non-Greece Country

**Setup:**
- Country of Residence: `Republic of Ireland`
- VAT ID: `` (empty)

**Expected:**
- ✅ Field shows no asterisk
- ✅ Field shows no "(Required)" text
- ✅ Placeholder: "Enter VAT ID (Optional)"
- ✅ Validation passes (VAT ID is optional)
- ✅ Payment proceeds

**Test:**
1. Select Ireland as Country of Residence
2. Leave VAT ID empty
3. Click "Pay"
4. Verify no validation error
5. Verify payment proceeds
6. Verify console log: "✅ VAT ID validation skipped (not Greece)"

---

### Scenario 4: Non-Greece with VAT ID

**Setup:**
- Country of Residence: `France`
- VAT ID: `FR12345678901`

**Expected:**
- ✅ VAT ID accepted (optional field can be filled)
- ✅ Validation passes
- ✅ Payment proceeds
- ✅ VAT ID stored in database

**Test:**
1. Select France as Country of Residence
2. Enter VAT ID (optional)
3. Click "Pay"
4. Verify payment proceeds
5. Verify VAT ID is saved

---

## 📊 Console Logs

### For Greece with VAT ID
```
✅ Email validation passed for all travelers
✅ VAT ID validation passed for Greece: EL123456789
```

### For Greece without VAT ID
```
✅ Email validation passed for all travelers
(Payment stopped - alert shown)
```

### For Non-Greece Countries
```
✅ Email validation passed for all travelers
✅ VAT ID validation skipped (not Greece)
```

---

## 🌍 Country Matching

The validation checks for exact string match:

```typescript
if (formData.countryOfResidence === 'Greece') {
  // VAT ID is required
}
```

**Important:** The country name must match exactly:
- ✅ `'Greece'` → VAT ID required
- ❌ `'greece'` → VAT ID not required (case-sensitive)
- ❌ `'GREECE'` → VAT ID not required (case-sensitive)

**Note:** Check your countries list to confirm the exact string used for Greece. Common variations:
- `Greece`
- `Republic of Greece`
- `Hellenic Republic`

---

## 💡 Future Enhancements

### Option 1: Case-Insensitive Matching
```typescript
if (formData.countryOfResidence.toLowerCase() === 'greece') {
  // VAT ID is required
}
```

### Option 2: Multiple Country Checks
```typescript
const countriesRequiringVAT = ['Greece', 'Cyprus', 'Malta'];
if (countriesRequiringVAT.includes(formData.countryOfResidence)) {
  // VAT ID is required
}
```

### Option 3: VAT ID Format Validation
```typescript
// Greek VAT IDs start with "EL" and have 9 digits
const greekVATRegex = /^EL\d{9}$/;
if (formData.countryOfResidence === 'Greece') {
  if (!greekVATRegex.test(vatId)) {
    alert('Invalid Greek VAT ID format. Should be: EL followed by 9 digits (e.g., EL123456789)');
    return;
  }
}
```

### Option 4: EU VAT Validation
```typescript
// Validate format for all EU countries
const euVATFormats = {
  'Greece': /^EL\d{9}$/,
  'France': /^FR[A-Z0-9]{2}\d{9}$/,
  'Germany': /^DE\d{9}$/,
  // ... more countries
};
```

---

## 🔍 Troubleshooting

### Issue: VAT ID not required even for Greece

**Possible Causes:**
1. Country name doesn't match exactly
2. Case sensitivity issue
3. Extra spaces in country name

**Debug:**
```javascript
console.log('Country of Residence:', JSON.stringify(formData.countryOfResidence));
console.log('Matches Greece?', formData.countryOfResidence === 'Greece');
```

---

### Issue: VAT ID always required

**Possible Causes:**
1. Condition logic error
2. All countries being treated as Greece

**Debug:**
```javascript
console.log('Country:', formData.countryOfResidence);
console.log('Is Greece?', formData.countryOfResidence === 'Greece');
```

---

### Issue: Field not showing

**Check:**
1. Form is rendered in payment step (phase 7)
2. Billing address section exists
3. handleBillingAddressChange function exists

---

## ✅ Validation Checklist

Payment will only proceed if:
- [ ] Terms and conditions accepted
- [ ] Policy holder email exists and valid
- [ ] All traveler emails (if provided) are valid
- [ ] **If Greece:** VAT ID is filled in
- [ ] **If Not Greece:** Proceed (VAT ID optional)

---

## 📚 Files Modified

| File | Lines | Changes |
|------|-------|---------|
| `src/pages/Quote2.tsx` | 415-421 | Added `vatId` to interface |
| `src/pages/Quote2.tsx` | 466-472 | Initialized `vatId` in state |
| `src/pages/Quote2.tsx` | 3829-3846 | Added VAT ID form field |
| `src/pages/Quote2.tsx` | 2343-2355 | Added VAT ID validation |
| `backend/VAT_ID_VALIDATION_GREECE.md` | New | This documentation |

---

## 🎯 Summary

**Feature:** Conditional VAT ID validation based on Country of Residence  
**Rule:** VAT ID is **mandatory** for Greece, **optional** for all other countries  
**UI:** Dynamic labels, placeholders, and required attribute  
**Validation:** Pre-payment check prevents submission without VAT ID for Greece  
**UX:** Clear error messages guide users to complete the field  

---

**Last Updated:** October 17, 2025  
**Status:** ✅ Implemented & Ready to Test  
**Version:** 1.0.0



