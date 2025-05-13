-- This script checks if an INSERT policy exists for the anon role on the recipes table
-- and creates one if it doesn't exist

-- First, let's list all policies on the recipes table for reference
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'recipes';

-- Check if an INSERT policy for anon role exists
DO $$
DECLARE
    policy_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'recipes' 
        AND cmd = 'INSERT' 
        AND 'anon' = ANY(roles)
    ) INTO policy_exists;

    IF NOT policy_exists THEN
        RAISE NOTICE 'No INSERT policy found for anon role on recipes table. Creating policy...';
        
        -- Create the policy for the anon role
        EXECUTE 'CREATE POLICY "Allow anonymous recipe submissions" ON recipes 
                FOR INSERT TO anon 
                WITH CHECK (true)';
                
        RAISE NOTICE 'Policy created successfully!';
    ELSE
        RAISE NOTICE 'An INSERT policy for anon role already exists on the recipes table.';
    END IF;
END $$;

-- List all policies again to confirm the new policy was added
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'recipes';

-- Additional check: Make sure RLS is enabled on the recipes table
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'recipes';

-- If RLS is not enabled, this will enable it:
ALTER TABLE IF EXISTS recipes ENABLE ROW LEVEL SECURITY;
