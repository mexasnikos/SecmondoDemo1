-- Add traveller_number column to travelers table
-- This field stores the TravellerNumber from Terracotta SOAP responses
-- (ProvideQuotation and ProvideQuotationWithAlterations)

ALTER TABLE travelers ADD COLUMN IF NOT EXISTS traveller_number VARCHAR(100);

-- Add comment to document the column
COMMENT ON COLUMN travelers.traveller_number IS 'TravellerNumber from Terracotta API (ProvideQuotation/ProvideQuotationWithAlterations responses)';

-- Create index for faster lookups by TravellerNumber
CREATE INDEX IF NOT EXISTS idx_travelers_traveller_number ON travelers(traveller_number);

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'travelers' AND column_name = 'traveller_number';

-- Sample query to view travelers with their Terracotta TravellerNumber
-- SELECT id, quote_id, first_name, last_name, traveller_number, created_at 
-- FROM travelers 
-- WHERE traveller_number IS NOT NULL
-- ORDER BY created_at DESC;



