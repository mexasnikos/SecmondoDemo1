# Terms Acceptance Implementation

## Overview

This implementation adds a new column `terms_accepted` to the `quotes` table to track whether users have accepted the Privacy Policy, Terms and Conditions, and General conditions during the payment step.

## Changes Made

### 1. Database Schema Changes

#### New Column Added
- **Table**: `quotes`
- **Column**: `terms_accepted`
- **Type**: `BOOLEAN`
- **Default**: `FALSE`
- **NOT NULL**: `true`
- **Purpose**: Tracks whether user accepted Privacy Policy, Terms and Conditions, and General conditions

#### Files Modified
- `backend/schema.sql` - Updated table definition
- `backend/add-terms-accepted-column.sql` - Migration script

### 2. Backend API Changes

#### Payment API Updates
The payment processing endpoints now accept and store the `termsAccepted` value:

**Files Modified:**
- `backend/server.js` - Main server payment endpoint
- `backend/server-optimized.js` - Optimized server payment endpoint

**Changes:**
- Added `termsAccepted` parameter to payment request body
- Updated SQL queries to include `terms_accepted` field
- Set default value to `false` if not provided

### 3. Frontend Changes

#### Payment Data Updates
The frontend now sends the `termsAccepted` value when processing payments:

**File Modified:**
- `src/pages/Quote2.tsx` - Main quote component

**Changes:**
- Added `termsAccepted: termsAccepted` to both payment data objects
- This value is automatically captured from the existing `termsAccepted` state variable

## Implementation Details

### Database Migration

To add the new column to an existing database, run:

```bash
# Option 1: Run the SQL script directly
psql -d travel_insurance -f backend/add-terms-accepted-column.sql

# Option 2: Use the Node.js migration script
node backend/run-terms-migration.js
```

### Testing

To test the implementation:

```bash
# Run the test script
node backend/test-terms-acceptance.js
```

### Usage in Queries

You can now query quotes based on terms acceptance:

```sql
-- Find all quotes where terms were accepted
SELECT * FROM quotes WHERE terms_accepted = true;

-- Find quotes where terms were not accepted
SELECT * FROM quotes WHERE terms_accepted = false;

-- Count accepted vs non-accepted quotes
SELECT 
  terms_accepted,
  COUNT(*) as count
FROM quotes 
GROUP BY terms_accepted;
```

## Flow Description

1. **User Journey**: User reaches payment step and sees the checkbox "I have read and accept the Privacy Policy, Terms and Conditions and General conditions"

2. **Frontend**: When user checks the checkbox, `termsAccepted` state is set to `true`

3. **Payment Processing**: When `processPayment()` is called:
   - Frontend validates that `termsAccepted` is `true`
   - Payment data includes `termsAccepted: termsAccepted`
   - Backend receives and stores the value in the database

4. **Database Storage**: The `terms_accepted` column in the `quotes` table is updated with the user's acceptance status

## Benefits

- **Compliance**: Track which users have accepted terms and conditions
- **Audit Trail**: Maintain records of terms acceptance for legal purposes
- **Analytics**: Analyze user behavior regarding terms acceptance
- **Reporting**: Generate reports on terms acceptance rates

## Security Considerations

- The `termsAccepted` value is validated on the frontend before payment processing
- Backend defaults to `false` if the value is not provided
- All existing quotes will have `terms_accepted = false` by default
- New quotes will require explicit terms acceptance

## Files Created/Modified

### New Files
- `backend/add-terms-accepted-column.sql` - Database migration script
- `backend/run-terms-migration.js` - Node.js migration runner
- `backend/test-terms-acceptance.js` - Test script
- `TERMS_ACCEPTANCE_IMPLEMENTATION.md` - This documentation

### Modified Files
- `backend/schema.sql` - Updated table definition
- `backend/server.js` - Updated payment endpoint
- `backend/server-optimized.js` - Updated payment endpoint
- `src/pages/Quote2.tsx` - Updated payment data

## Next Steps

1. Run the database migration on your production database
2. Test the complete flow with a real quote
3. Verify that terms acceptance is properly tracked
4. Consider adding terms acceptance to admin dashboards
5. Implement reporting features for terms acceptance analytics
