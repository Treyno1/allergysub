-- Add image_url column to recipes table
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create storage bucket for recipe images if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('recipe_images', 'recipe_images')
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Allow public viewing of recipe images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'recipe_images');

CREATE POLICY "Allow authenticated users to upload recipe images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'recipe_images');

CREATE POLICY "Allow users to update their own recipe images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'recipe_images' AND owner = auth.uid());

CREATE POLICY "Allow users to delete their own recipe images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'recipe_images' AND owner = auth.uid());

-- Log the migration
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'add_recipe_image',
    'timestamp', CURRENT_TIMESTAMP,
    'details', 'Added image_url column and storage policies for recipe images'
  )
); 