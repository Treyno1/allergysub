-- Add image_url column to substitutes table
ALTER TABLE substitutes
ADD COLUMN IF NOT EXISTS image_url text;

-- Add alt_text column to substitutes table
ALTER TABLE substitutes
ADD COLUMN IF NOT EXISTS alt_text text;

-- Log the migration
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'add_image_columns',
    'timestamp', CURRENT_TIMESTAMP,
    'columns_added', array['image_url', 'alt_text']
  )
); 