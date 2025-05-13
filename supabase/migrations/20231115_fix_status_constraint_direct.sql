-- Direct solution to fix the status constraint issue

-- First, check the current schema of the recipes table
\d recipes;

-- Approach 1: Drop all check constraints and recreate the correct one
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Get all check constraints for the recipes table
    FOR r IN (
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'recipes' 
        AND constraint_type = 'CHECK'
    ) LOOP
        -- Drop each constraint
        EXECUTE 'ALTER TABLE recipes DROP CONSTRAINT IF EXISTS ' || quote_ident(r.constraint_name);
    END LOOP;
    
    -- Add the correct constraint for status
    EXECUTE 'ALTER TABLE recipes ADD CONSTRAINT recipes_status_check CHECK (status IN (''pending'', ''approved'', ''rejected''))';
    
    RAISE NOTICE 'All check constraints on recipes table have been updated.';
END $$;

-- Approach 2: Alternative if the constraint name is unknown
-- First, add a temporary column
ALTER TABLE recipes ADD COLUMN status_new TEXT;

-- Copy data from status to status_new
UPDATE recipes SET status_new = status;

-- Drop the original status column (this will drop its constraints)
ALTER TABLE recipes DROP COLUMN status;

-- Rename status_new to status
ALTER TABLE recipes RENAME COLUMN status_new TO status;

-- Add the constraint with all three values
ALTER TABLE recipes ADD CONSTRAINT recipes_status_check CHECK (status IN ('pending', 'approved', 'rejected'));

-- Set a default value
ALTER TABLE recipes ALTER COLUMN status SET DEFAULT 'pending';

-- Approach 3: Direct constraint modification using pg_constraint
-- This is more advanced and should be used with caution
DO $$
DECLARE
    constraint_id OID;
BEGIN
    -- Find the constraint ID
    SELECT c.oid INTO constraint_id
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'recipes'
    AND c.conname LIKE '%status%check%';
    
    IF FOUND THEN
        -- Update the constraint definition in pg_constraint
        EXECUTE 'ALTER TABLE recipes DROP CONSTRAINT ' || 
                (SELECT conname FROM pg_constraint WHERE oid = constraint_id);
        
        EXECUTE 'ALTER TABLE recipes ADD CONSTRAINT recipes_status_check 
                CHECK (status IN (''pending'', ''approved'', ''rejected''))';
        
        RAISE NOTICE 'Status constraint updated successfully.';
    ELSE
        RAISE NOTICE 'No status constraint found. Adding new constraint.';
        EXECUTE 'ALTER TABLE recipes ADD CONSTRAINT recipes_status_check 
                CHECK (status IN (''pending'', ''approved'', ''rejected''))';
    END IF;
END $$; 