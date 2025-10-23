-- Add policy_id column to soap_audit_log table
-- This column will map to the local policy_number from the quotes table
-- to track which SOAP action corresponds to which policy ID

-- Add the policy_id column to the soap_audit_log table
ALTER TABLE soap_audit_log ADD COLUMN policy_id VARCHAR(100);

-- Add a comment to document the column purpose
COMMENT ON COLUMN soap_audit_log.policy_id IS 'Local policy number from quotes table - maps to which policy the SOAP action corresponds to';

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_soap_audit_policy_id ON soap_audit_log(policy_id);

-- Verify the column was added successfully
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'soap_audit_log' AND column_name = 'policy_id';

-- Show the updated table structure
\d soap_audit_log;

-- Print success message
SELECT 'Column policy_id added successfully to soap_audit_log table!' as status;
