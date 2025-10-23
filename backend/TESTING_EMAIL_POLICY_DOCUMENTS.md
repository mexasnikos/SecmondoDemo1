# Testing EmailPolicyDocuments Feature

## Quick Test Guide

### Prerequisites
✅ Database migration for `traveller_number` applied  
✅ All servers running (proxy, backend, frontend)  
✅ Valid test email address

---

## 🧪 Test Procedure

### Step 1: Start All Servers

```bash
# Terminal 1 - Proxy Server
node server/proxy-server.js

# Terminal 2 - Backend Server
node backend/server.js

# Terminal 3 - Frontend
npm start
```

### Step 2: Navigate to Quote2 Page

Open browser: `http://localhost:3000/quote2`

### Step 3: Complete the Wizard

#### Phase 1: Trip Details
- Destination: `France`
- Start Date: Any future date
- End Date: 7 days after start
- Trip Type: `Single Trip`
- Country of Residence: `Republic of Ireland`
- Number of Travelers: `2`

#### Phase 2: Traveler Information
**IMPORTANT: Traveler 1 is the Policy Holder**
- **Traveler 1:**
  - Title: `Mr`
  - First Name: `John`
  - Last Name: `Doe`
  - Email: **`YOUR_VALID_EMAIL@example.com`** ← Use a real email!
  - Phone: `+353123456789`
  - Date of Birth: `1985-01-15`
  
- **Traveler 2:**
  - Title: `Mrs`
  - First Name: `Jane`
  - Last Name: `Doe`
  - Email: `jane@example.com`
  - Phone: `+353987654321`
  - Date of Birth: `1987-05-20`

#### Phase 3: Get Quotes
- Click "Get Quotes"
- Wait for Terracotta API response
- Select any quote option
- Click "Continue"

#### Phase 4: Add-ons (Optional)
- Select any add-ons or skip
- Click "Continue"

#### Phase 5: Screening Questions
- Answer screening questions (all "No" is fine for testing)
- Click "Continue"

#### Phase 6: Review
- Review all details
- Click "Continue to Payment"

#### Phase 7: Payment

**Critical Step for Testing EmailPolicyDocuments:**

1. Fill in billing address:
   - Street: `123 Main Street`
   - City: `Dublin`
   - Postal Code: `D02 XY45`
   - Country: `Ireland`

2. Accept all terms and conditions

3. **Open Browser Console** (F12) to monitor logs

4. Click **"Pay"** button

---

## 📊 Expected Console Output

### 1. SavePolicyDetails Logs
```
💾 Saving policy details with Terracotta...
📋 QuoteID: 8546669
✅ SavePolicyDetails response: {policySaved: "Yes", policyID: "POL-12345", ...}
📋 Policy Saved Status: Yes
📋 Policy ID: POL-12345
```

### 2. EmailPolicyDocuments Logs (NEW!)
```
📧 Attempting to email policy documents...
📧 Policy Holder Email: YOUR_VALID_EMAIL@example.com
📋 Policy ID: POL-12345
🚀 Building SOAP request for EmailPolicyDocuments...
📤 Complete SOAP Body for EmailPolicyDocuments: <EmailPolicyDocuments...>
📧 Sending policy documents to: YOUR_VALID_EMAIL@example.com
📥 Raw SOAP Response from EmailPolicyDocuments: <?xml...>
✅ Parsed EmailPolicyDocuments response: {emailSent: true, message: "..."}
✅ Policy documents successfully emailed to: YOUR_VALID_EMAIL@example.com
```

### 3. User Alert
You should see an alert popup:
```
Policy documents have been sent to YOUR_VALID_EMAIL@example.com
```

### 4. Payment Completion
```
💳 Processing payment...
✅ Payment processed successfully
✅ Policy Number: POL-12345
```

---

## 🔍 Verification Checklist

### ✅ Console Verification
- [ ] SavePolicyDetails succeeded
- [ ] Policy ID received
- [ ] EmailPolicyDocuments SOAP request logged
- [ ] Email address matches Traveler 1
- [ ] EmailPolicyDocuments response received
- [ ] "emailSent: true" in response
- [ ] User alert displayed
- [ ] No errors in console

### ✅ Database Verification

#### 1. Check SOAP Audit Log
```sql
-- Check if EmailPolicyDocuments was called
SELECT 
  id,
  soap_operation,
  status,
  created_at,
  request_body,
  response_body
FROM soap_audit_log
WHERE soap_operation = 'EmailPolicyDocuments'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected:** 1 row with status `success`

#### 2. Check Request Contains Correct Data
```sql
-- Verify the request parameters
SELECT 
  request_body
FROM soap_audit_log
WHERE soap_operation = 'EmailPolicyDocuments'
ORDER BY created_at DESC
LIMIT 1;
```

**Should contain:**
- `<userID>4072</userID>`
- `<userCode>111427</userCode>`
- `<policyID>POL-XXXXX</policyID>`
- `<emailAddress>YOUR_VALID_EMAIL@example.com</emailAddress>`

#### 3. Check Traveler Data Saved
```sql
-- Verify traveler was saved with email
SELECT 
  id,
  quote_id,
  first_name,
  last_name,
  email,
  traveller_number
FROM travelers
WHERE email = 'YOUR_VALID_EMAIL@example.com'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected:**
- `first_name`: John
- `last_name`: Doe
- `email`: YOUR_VALID_EMAIL@example.com
- `traveller_number`: 1

---

## 🎯 Success Criteria

| Criterion | Status |
|-----------|--------|
| SavePolicyDetails succeeds | ✅ |
| Policy ID received | ✅ |
| EmailPolicyDocuments called automatically | ✅ |
| Correct email address used (Traveler 1) | ✅ |
| SOAP request logged in database | ✅ |
| Response indicates success | ✅ |
| User notified via alert | ✅ |
| Payment continues normally | ✅ |
| No errors thrown | ✅ |

---

## ❌ Testing Error Scenarios

### Test 1: Missing Email Address

**Setup:** Leave Traveler 1 email blank

**Expected Result:**
```
⚠️ No email address found for policy holder (Traveler 1)
❌ Error sending policy documents email: Error: Policy holder email address is required
⚠️ Continuing with payment process despite email error
```

**Alert Message:**
```
Note: There was an issue sending the policy documents email, but your policy has been saved. 
Please contact support to receive your documents.
```

**Verification:** Payment should still complete successfully

---

### Test 2: SOAP API Returns Error

**Setup:** Use invalid policyID (manually modify if needed)

**Expected Result:**
```
❌ Error in emailPolicyDocuments: Failed to email policy documents: ...
⚠️ Continuing with payment process despite email error
```

**Alert Message:**
```
Note: There may have been an issue sending the policy documents email. 
Please check your inbox or contact support.
```

**Verification:** Payment should still complete successfully

---

### Test 3: Network Failure

**Setup:** Stop proxy server before clicking Pay

**Expected Result:**
- SavePolicyDetails will fail first
- Payment won't reach EmailPolicyDocuments stage

**Alternative:** Stop proxy after SavePolicyDetails but before EmailPolicyDocuments
- EmailPolicyDocuments will fail
- Error caught and logged
- Payment continues

---

## 📧 Email Verification (If Available)

If you have access to the actual email:

### Check Inbox
- [ ] Email received at policy holder address
- [ ] Email contains policy documents
- [ ] Policy ID matches in email
- [ ] All document links working

### Expected Email Contents (Terracotta-specific)
- Policy Certificate PDF
- Policy Wording PDF
- Summary of Cover PDF
- Key Facts Document
- IPID (Insurance Product Information Document)

---

## 🐛 Troubleshooting

### Issue: No alert appears after clicking Pay

**Possible Causes:**
1. SavePolicyDetails failed (check console)
2. JavaScript error before EmailPolicyDocuments (check console)
3. Browser blocked alert popup

**Debug:**
```javascript
// Check browser console for errors
// Look for red error messages
// Check Network tab for failed requests
```

---

### Issue: Alert says "issue sending email" but console shows success

**Possible Causes:**
1. Terracotta API returned success but email not actually sent
2. Parser incorrectly interpreting response

**Debug:**
```sql
-- Check actual SOAP response
SELECT response_body 
FROM soap_audit_log 
WHERE soap_operation = 'EmailPolicyDocuments' 
ORDER BY created_at DESC 
LIMIT 1;
```

---

### Issue: Payment fails after email attempt

**This should NOT happen!** The code uses try-catch to prevent this.

**If it does happen:**
1. Check console for unhandled errors
2. Verify catch block is working
3. Check if different error is thrown

**Report this as a bug with:**
- Console error message
- SOAP audit log entries
- Steps to reproduce

---

## 🎓 Test Scenarios Summary

| Scenario | Expected Outcome | Payment Result |
|----------|------------------|----------------|
| Happy Path | Email sent, alert shown | ✅ Success |
| No email address | Error caught, alert shown | ✅ Success |
| SOAP API error | Error caught, alert shown | ✅ Success |
| Network failure | Error caught, alert shown | ✅ Success |
| Invalid policyID | Error caught, alert shown | ✅ Success |

**Key Point:** All scenarios should result in successful payment completion!

---

## 📝 Test Report Template

```markdown
## EmailPolicyDocuments Test Report

**Date:** [Date]
**Tester:** [Name]
**Environment:** [Dev/UAT/Prod]

### Test Results

**Happy Path Test:**
- [ ] SavePolicyDetails succeeded
- [ ] EmailPolicyDocuments called
- [ ] Correct email used
- [ ] Alert displayed
- [ ] Payment completed
- **Result:** ✅ Pass / ❌ Fail
- **Notes:** 

**Error Handling Test:**
- [ ] Missing email handled
- [ ] SOAP error handled
- [ ] Payment still completes
- **Result:** ✅ Pass / ❌ Fail
- **Notes:**

**Database Verification:**
- [ ] SOAP audit log entry exists
- [ ] Request contains correct data
- [ ] Traveler saved with correct email
- **Result:** ✅ Pass / ❌ Fail
- **Notes:**

### Issues Found
1. [Issue description]
2. [Issue description]

### Recommendations
- [Recommendation 1]
- [Recommendation 2]
```

---

## 🚀 Ready to Test?

### Quick Checklist:
- [ ] All servers running
- [ ] Valid email address ready
- [ ] Browser console open (F12)
- [ ] Database client ready (for verification)
- [ ] Read through expected console output
- [ ] Ready to click "Pay"!

**Good luck testing! 🎉**

---

**Last Updated:** October 17, 2025  
**Version:** 1.0.0



