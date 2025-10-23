-- Update existing records with sample country data
UPDATE quotes SET country_of_residence = 'Greece' WHERE id = 1;
UPDATE quotes SET country_of_residence = 'Germany' WHERE id = 2;
UPDATE quotes SET country_of_residence = 'United Kingdom' WHERE id = 3;

-- Or update all existing records to a default country
UPDATE quotes SET country_of_residence = 'Greece' WHERE country_of_residence = 'Unknown';

-- Verify the updates
SELECT id, destination, country_of_residence, created_at FROM quotes ORDER BY id;
