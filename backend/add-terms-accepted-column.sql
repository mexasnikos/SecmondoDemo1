-- Add terms_accepted column to quotes table
-- This column will track whether the user accepted the Privacy Policy, Terms and Conditions, and General conditions

-- Add the terms_accepted column to the quotes table
ALTER TABLE quotes ADD COLUMN terms_accepted BOOLEAN DEFAULT FALSE;

-- Update existing records to have terms_accepted as FALSE (since they were created before this feature)
UPDATE quotes SET terms_accepted = FALSE WHERE terms_accepted IS NULL;

-- Make the column NOT NULL with a default value
ALTER TABLE quotes ALTER COLUMN terms_accepted SET NOT NULL;
ALTER TABLE quotes ALTER COLUMN terms_accepted SET DEFAULT FALSE;

-- Add a comment to document the column purpose
COMMENT ON COLUMN quotes.terms_accepted IS 'Tracks whether user accepted Privacy Policy, Terms and Conditions, and General conditions during payment';

-- Verify the column was added successfully
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'quotes' AND column_name = 'terms_accepted';

-- Show the updated table structure
\d quotes;

-- Print success message
SELECT 'Column terms_accepted added successfully to quotes table!' as status;
