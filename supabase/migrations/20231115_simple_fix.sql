-- Simple solution to fix the status constraint issue

-- First, show the existing constraint (for information only)
SELECT
    tc.constraint_name,
    pgc.check_clause
FROM
    information_schema.table_constraints tc
    JOIN pg_constraint pgc ON pgc.conname = tc.constraint_name
    JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE
    tc.constraint_type = 'CHECK'
    AND tc.table_name = 'recipes'
    AND ccu.column_name = 'status';

-- Option 1: Drop the constraint by name
ALTER TABLE recipes DROP CONSTRAINT IF EXISTS recipes_status_check;

-- Option 2: If the name is different, try the following
DO $$
DECLARE
    constraint_name text;
BEGIN
    SELECT tc.constraint_name INTO constraint_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'CHECK'
    AND tc.table_name = 'recipes'
    AND ccu.column_name = 'status';
    
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE recipes DROP CONSTRAINT ' || quote_ident(constraint_name);
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    ELSE
        RAISE NOTICE 'No status constraint found.';
    END IF;
END
$$;

-- Finally, add the constraint with all three values
ALTER TABLE recipes 
ADD CONSTRAINT recipes_status_check 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Verify the constraint has been updated
SELECT
    tc.constraint_name,
    pgc.check_clause
FROM
    information_schema.table_constraints tc
    JOIN pg_constraint pgc ON pgc.conname = tc.constraint_name
WHERE
    tc.constraint_type = 'CHECK'
    AND tc.table_name = 'recipes'
    AND pgc.contype = 'c'; 