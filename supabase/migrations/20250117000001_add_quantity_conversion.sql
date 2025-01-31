-- Add quantity_conversion column to substitutes table
ALTER TABLE substitutes
ADD COLUMN quantity_conversion text;

-- Update existing substitutes with default conversion ratios
UPDATE substitutes
SET quantity_conversion = '1:1 ratio - Use the same amount as the original ingredient'
WHERE quantity_conversion IS NULL;

-- Log the schema update
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'add_quantity_conversion',
    'timestamp', CURRENT_TIMESTAMP,
    'changes', 'Added quantity_conversion column to substitutes table'
  )
); 