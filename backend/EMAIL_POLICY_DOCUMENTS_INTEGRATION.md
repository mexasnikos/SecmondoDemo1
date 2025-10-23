# EmailPolicyDocuments Integration Guide

## Overview

The `EmailPolicyDocuments` SOAP action has been integrated into the payment flow. After successfully saving a policy using `SavePolicyDetails`, the system automatically emails all policy documents to the policy holder (Traveler 1).

---

## 🔄 Complete Flow

```
User Clicks "Pay" Button
    ↓
SavePolicyDetails SOAP Action
    ↓ (Success)
Policy ID Received
    ↓
EmailPolicyDocuments SOAP Action  ← NEW!
    ↓
Email Sent to Policy Holder
    ↓
Payment Process Continues
```

---

## 📋 Implementation Details

### 1. **SOAP Request Structure**

```xml
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <EmailPolicyDocuments xmlns="WS-IntegratedQuote">
      <userID>4072</userID>
      <userCode>111427</userCode>
      <policyID>POL-12345</policyID>
      <emailAddress>john.doe@example.com</emailAddress>
    </EmailPolicyDocuments>
  </soap:Body>
</soap:Envelope>
```

**Field Sources:**
- `userID`: Fixed value `4072`
- `userCode`: Fixed value `111427`
- `policyID`: Extracted from `SavePolicyDetails` response
- `emailAddress`: From Traveler 1 (Policy Holder) email field

---

### 2. **TypeScript Interfaces**

#### Request Interface
```typescript
export interface TerracottaEmailPolicyDocumentsRequest {
  userID: string;
  userCode: string;
  policyID: string;
  emailAddress: string;
}
```

#### Response Interface
```typescript
export interface TerracottaEmailPolicyDocumentsResponse {
  emailSent: boolean;
  message?: string;
}
```

**File:** `src/services/terracottaService.ts` (lines 217-227)

---

### 3. **Service Method**

The `TerracottaService` class now includes the `emailPolicyDocuments` method:

```typescript
async emailPolicyDocuments(
  request: TerracottaEmailPolicyDocumentsRequest
): Promise<TerracottaEmailPolicyDocumentsResponse> {
  // Builds SOAP request
  // Sends to proxy server
  // Parses response
  // Returns success/failure status
}
```

**File:** `src/services/terracottaService.ts` (lines 1143-1172)

**Features:**
- ✅ Automatic SOAP envelope creation
- ✅ Request validation
- ✅ Comprehensive logging
- ✅ Error handling with detailed messages

---

### 4. **Response Parser**

```typescript
static parseEmailPolicyDocumentsResponse(
  xmlText: string
): TerracottaEmailPolicyDocumentsResponse {
  // Parses XML response
  // Checks for success indicators
  // Returns structured response
}
```

**File:** `src/services/terracottaService.ts` (lines 605-642)

**Success Detection:**
The parser checks multiple indicators:
- `<emailSent>true</emailSent>`
- `<EmailSent>Yes</EmailSent>`
- `<Message>Success</Message>`
- `<Message>Email sent</Message>`

---

### 5. **Integration in Payment Flow**

#### Quote2.tsx Implementation

After `SavePolicyDetails` succeeds:

```typescript
// 1. Policy saved successfully
console.log('✅ Policy saved successfully! Policy ID:', savePolicyResponse.policyID);

// 2. Extract policy holder email (Traveler 1)
const policyHolderEmail = formData.travelers[0]?.email;

// 3. Call EmailPolicyDocuments
const emailResponse = await terracottaService.emailPolicyDocuments({
  userID: '4072',
  userCode: '111427',
  policyID: savePolicyResponse.policyID,
  emailAddress: policyHolderEmail
});

// 4. Handle response
if (emailResponse.emailSent) {
  alert(`Policy documents have been sent to ${policyHolderEmail}`);
}
```

**File:** `src/pages/Quote2.tsx` (lines 2510-2544)

---

## 🛡️ Error Handling

### 1. **Missing Email Address**
```typescript
if (!policyHolderEmail) {
  console.error('⚠️ No email address found for policy holder (Traveler 1)');
  throw new Error('Policy holder email address is required');
}
```

### 2. **Email Sending Failure**
```typescript
if (!emailResponse.emailSent) {
  console.warn('⚠️ Email may not have been sent:', emailResponse.message);
  alert('Note: There may have been an issue sending the policy documents email...');
}
```

### 3. **Catch Block - Non-Blocking**
```typescript
catch (emailError) {
  console.error('❌ Error sending policy documents email:', emailError);
  console.error('⚠️ Continuing with payment process despite email error');
  // Don't throw - allow payment process to continue even if email fails
  alert('Note: There was an issue sending the policy documents email, but your policy has been saved...');
}
```

**Key Feature:** Email errors don't block the payment process. The policy is still saved, and the user is notified.

---

## 📊 Logging & Debugging

### Console Logs During Execution

#### 1. **Request Building**
```
🚀 Building SOAP request for EmailPolicyDocuments...
📦 Request object: {userID: '4072', userCode: '111427', policyID: 'POL-12345', emailAddress: 'john@example.com'}
📤 Complete SOAP Body for EmailPolicyDocuments: <EmailPolicyDocuments...>
📧 Sending policy documents to: john@example.com
🌐 Sending SOAP request to: http://localhost:3001/api/terracotta/EmailPolicyDocuments
```

#### 2. **Response Parsing**
```
📥 Raw SOAP Response from EmailPolicyDocuments: <?xml version="1.0"...>
🔍 Full EmailPolicyDocuments XML Response: <soap:Envelope...>
📧 Email sent status: true
📧 Response message: Email sent successfully
✅ Parsed EmailPolicyDocuments response: {emailSent: true, message: 'Email sent successfully'}
```

#### 3. **Success in Quote2.tsx**
```
📧 Attempting to email policy documents...
📧 Policy Holder Email: john@example.com
📋 Policy ID: POL-12345
✅ EmailPolicyDocuments response: {emailSent: true, message: 'Email sent successfully'}
✅ Policy documents successfully emailed to: john@example.com
```

#### 4. **Error Scenario**
```
❌ Error sending policy documents email: Error: Failed to email policy documents: Network error
⚠️ Continuing with payment process despite email error
```

---

## 🧪 Testing

### 1. **Manual Test Flow**

1. Navigate to `/quote2`
2. Complete all wizard steps
3. Fill in traveler information with a valid email address
4. **Important:** Make sure Traveler 1 has a valid email
5. Click "Pay" button
6. Monitor browser console for logs
7. Check for alert message confirming email sent

### 2. **Check SOAP Audit Log**

```sql
SELECT 
  id,
  soap_operation,
  status,
  request_body,
  response_body,
  created_at
FROM soap_audit_log
WHERE soap_operation = 'EmailPolicyDocuments'
ORDER BY created_at DESC
LIMIT 10;
```

### 3. **Verify Email Address Used**

```sql
-- Check which email was used for policy documents
SELECT 
  sal.soap_operation,
  sal.request_body,
  t.email as traveler_email,
  q.id as quote_id,
  sal.created_at
FROM soap_audit_log sal
JOIN quotes q ON sal.quote_id = q.id
JOIN travelers t ON q.id = t.quote_id AND t.traveller_number = '1'
WHERE sal.soap_operation = 'EmailPolicyDocuments'
ORDER BY sal.created_at DESC;
```

---

## 🎯 User Experience

### Success Flow
1. User clicks "Pay"
2. Policy is saved (SavePolicyDetails)
3. Email is sent automatically (EmailPolicyDocuments)
4. User sees alert: "Policy documents have been sent to john@example.com"
5. Payment completes
6. Success page shows policy number

### Failure Flow (Email Only)
1. User clicks "Pay"
2. Policy is saved (SavePolicyDetails) ✅
3. Email sending fails ❌
4. User sees alert: "Note: There was an issue sending the policy documents email, but your policy has been saved. Please contact support to receive your documents."
5. Payment continues normally ✅
6. Success page shows policy number

**Key Point:** Email failure does not prevent policy creation or payment completion.

---

## 📁 Files Modified

| File | Changes |
|------|---------|
| `src/services/terracottaService.ts` | ✅ Added `TerracottaEmailPolicyDocumentsRequest` interface |
| | ✅ Added `TerracottaEmailPolicyDocumentsResponse` interface |
| | ✅ Added `parseEmailPolicyDocumentsResponse()` method |
| | ✅ Added `emailPolicyDocuments()` method |
| `src/pages/Quote2.tsx` | ✅ Added EmailPolicyDocuments call after SavePolicyDetails |
| | ✅ Added email address extraction from Traveler 1 |
| | ✅ Added success/error handling |
| | ✅ Added user notifications |
| `server/proxy-server.js` | ✅ Already supports all SOAP operations (no changes needed) |
| `backend/EMAIL_POLICY_DOCUMENTS_INTEGRATION.md` | ✅ This documentation file |

---

## 🔍 Troubleshooting

### Issue: No email sent alert appears
**Check:**
1. Browser console for error messages
2. Traveler 1 has a valid email address
3. SavePolicyDetails succeeded first
4. Network tab shows EmailPolicyDocuments request

### Issue: Email sent but not received
**Possible Causes:**
1. Terracotta API email sending issue (check SOAP response)
2. Spam folder
3. Invalid email address format
4. Email server configuration on Terracotta side

**Debug Query:**
```sql
-- Check the actual SOAP request and response
SELECT 
  request_body,
  response_body,
  status,
  error_message
FROM soap_audit_log
WHERE soap_operation = 'EmailPolicyDocuments'
ORDER BY created_at DESC
LIMIT 1;
```

### Issue: Payment blocked due to email error
**This shouldn't happen!** The implementation uses try-catch to prevent email errors from blocking payment.

**If it does happen:**
- Check console logs
- Verify the catch block is working
- Check if there's a different error being thrown

---

## ✅ Benefits

1. **Automatic Email Delivery** - Policy holders receive documents immediately
2. **No Manual Intervention** - Fully automated process
3. **User Notification** - Clear alerts inform users about email status
4. **Resilient** - Email failures don't prevent policy creation
5. **Auditable** - All email attempts logged in SOAP audit log
6. **Configurable** - Easy to modify email address source if needed

---

## 🚀 Future Enhancements

### Possible Improvements:
1. ✨ Send email to all travelers (not just policy holder)
2. ✨ Retry mechanism for failed emails
3. ✨ Custom email templates
4. ✨ CC/BCC additional email addresses
5. ✨ Email confirmation page in wizard
6. ✨ Resend email option from admin panel

---

## 📧 Request Parameters Details

| Parameter | Source | Example | Required |
|-----------|--------|---------|----------|
| `userID` | Fixed | `4072` | ✅ Yes |
| `userCode` | Fixed | `111427` | ✅ Yes |
| `policyID` | SavePolicyDetails response | `POL-12345` | ✅ Yes |
| `emailAddress` | Traveler 1 email | `john@example.com` | ✅ Yes |

---

## 🎓 Usage Example

```typescript
// After SavePolicyDetails succeeds:
const emailResponse = await terracottaService.emailPolicyDocuments({
  userID: '4072',
  userCode: '111427',
  policyID: 'POL-789456123',
  emailAddress: 'policyholder@example.com'
});

if (emailResponse.emailSent) {
  console.log('✅ Email sent successfully!');
} else {
  console.warn('⚠️ Email not sent:', emailResponse.message);
}
```

---

**Last Updated:** October 17, 2025  
**Status:** ✅ Complete & Tested  
**Version:** 1.0.0



