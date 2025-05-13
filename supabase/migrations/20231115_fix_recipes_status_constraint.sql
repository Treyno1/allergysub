-- Step 1: Check the current constraint on the recipes table
SELECT
    tc.constraint_name,
    tc.table_name,
    pgc.check_clause
FROM
    information_schema.table_constraints tc
    JOIN pg_constraint pgc ON pgc.conname = tc.constraint_name
WHERE
    tc.constraint_type = 'CHECK'
    AND tc.table_name = 'recipes'
    AND pgc.contype = 'c';

-- Step 2: Get the constraint name specifically for the status column
SELECT
    tc.constraint_name,
    pgc.check_clause,
    ccu.column_name
FROM
    information_schema.table_constraints tc
    JOIN pg_constraint pgc ON pgc.conname = tc.constraint_name
    JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE
    tc.constraint_type = 'CHECK'
    AND tc.table_name = 'recipes'
    AND ccu.column_name = 'status';

-- Step 3: Drop the existing constraint (modify 'recipes_status_check' if that's not the exact name)
-- We'll first try to drop the constraint by its likely name
ALTER TABLE recipes DROP CONSTRAINT IF EXISTS recipes_status_check;

-- Step 4: Add the new constraint with 'approved' status included
ALTER TABLE recipes
ADD CONSTRAINT recipes_status_check
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Step 5: Verify the updated constraint
SELECT
    tc.constraint_name,
    tc.table_name,
    pgc.check_clause
FROM
    information_schema.table_constraints tc
    JOIN pg_constraint pgc ON pgc.conname = tc.constraint_name
WHERE
    tc.constraint_type = 'CHECK'
    AND tc.table_name = 'recipes'
    AND pgc.contype = 'c';

-- Additional check: Make sure the status column exists and check its data type
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'recipes' AND column_name = 'status';
