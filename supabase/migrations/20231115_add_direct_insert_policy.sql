-- Drop any existing insert policies for anon on recipes table to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous recipe submissions" ON recipes;
DROP POLICY IF EXISTS "Allow direct recipe insertion" ON recipes;

-- Create a permissive policy for recipe insertion
CREATE POLICY "Allow direct recipe insertion" 
ON recipes 
FOR INSERT 
TO public -- This includes anon, authenticated, and service_role
WITH CHECK (true);

-- Make sure RLS is enabled
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Verify the policy was created
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'recipes' AND cmd = 'INSERT';

-- Also add a select policy for anon so they can see what they submitted
DROP POLICY IF EXISTS "Allow users to view recipes" ON recipes;
CREATE POLICY "Allow users to view recipes" 
ON recipes 
FOR SELECT 
TO public
USING (true); 