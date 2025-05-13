-- First, check the existing RLS policies for the recipes table
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'recipes';

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'recipes';

-- Check existing policies specifically for update operations
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'recipes' AND cmd = 'UPDATE';

-- Create a policy to allow authenticated users to update recipe status
CREATE POLICY "Allow users to update recipe status"
ON recipes
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Alternative policy with more restrictive approach
-- Enable this instead if you want more restrictions
/*
CREATE POLICY "Allow users to update only their own recipes"
ON recipes
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
*/

-- If you have a service_role user that should be able to update all recipes
CREATE POLICY "Allow service role to update any recipe"
ON recipes
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- Enable RLS if it's not already enabled
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Verify the policies after changes
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
 