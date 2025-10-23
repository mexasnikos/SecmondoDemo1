-- Simple ALTER TABLE command to add country_of_residence column
ALTER TABLE quotes ADD COLUMN country_of_residence VARCHAR(255) NOT NULL DEFAULT 'Unknown';

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'quotes' AND column_name = 'country_of_residence';
