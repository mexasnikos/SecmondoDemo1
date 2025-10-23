-- Add country_of_residence column to existing quotes table
-- Run this script to add the missing column to your database

-- Add the country_of_residence column to the quotes table
ALTER TABLE quotes ADD COLUMN country_of_residence VARCHAR(255);

-- Update the column to NOT NULL with a default value for existing records
-- This handles any existing records that don't have this field
UPDATE quotes SET country_of_residence = 'Unknown' WHERE country_of_residence IS NULL;

-- Now make the column NOT NULL
ALTER TABLE quotes ALTER COLUMN country_of_residence SET NOT NULL;

-- Add a default value for future inserts
ALTER TABLE quotes ALTER COLUMN country_of_residence SET DEFAULT 'Unknown';

-- Verify the column was added successfully
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'quotes' AND column_name = 'country_of_residence';

-- Show the updated table structure
\d quotes;

-- Print success message
SELECT 'Column country_of_residence added successfully to quotes table!' as status;
