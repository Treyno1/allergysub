-- Add status field to recipes table
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add admin review fields
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS review_notes TEXT;

-- Create index for status queries
CREATE INDEX IF NOT EXISTS idx_recipes_status ON recipes(status);

-- Update RLS policies for recipes
DROP POLICY IF EXISTS "Enable read access for all users" ON recipes;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON recipes;

-- New policies
CREATE POLICY "Users can view approved recipes"
ON recipes FOR SELECT
TO public
USING (status = 'approved');

CREATE POLICY "Admins can view all recipes"
ON recipes FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (
    'admin@example.com'  -- Replace with actual admin email
  )
);

CREATE POLICY "Users can insert recipes"
ON recipes FOR INSERT
TO authenticated
WITH CHECK (
  status = 'pending'
);

CREATE POLICY "Admins can update recipe status"
ON recipes FOR UPDATE
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (
    'admin@example.com'  -- Replace with actual admin email
  )
)
WITH CHECK (
  auth.jwt() ->> 'email' IN (
    'admin@example.com'  -- Replace with actual admin email
  )
);

-- Log the migration
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'add_recipe_status',
    'timestamp', CURRENT_TIMESTAMP,
    'details', 'Added recipe status and admin review fields'
  )
); 