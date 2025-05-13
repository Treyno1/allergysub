-- First, check and print the current status values
SELECT status, COUNT(*) 
FROM recipes 
GROUP BY status;

-- Create a temporary function to help us standardize status values
CREATE OR REPLACE FUNCTION fix_recipe_status() RETURNS void AS $$
DECLARE
    updated_count INTEGER := 0;
BEGIN
    -- Fix 'approve' → 'approved'
    UPDATE recipes SET status = 'approved' 
    WHERE status = 'approve';
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Fixed % recipes with status "approve" to "approved"', updated_count;
    
    -- Fix 'reject' → 'rejected'
    UPDATE recipes SET status = 'rejected' 
    WHERE status = 'reject';
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Fixed % recipes with status "reject" to "rejected"', updated_count;
    
    -- Fix any uppercase variants
    UPDATE recipes SET status = 'approved' 
    WHERE status ILIKE 'approved' AND status != 'approved';
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Fixed % recipes with case-sensitive variants of "approved"', updated_count;
    
    UPDATE recipes SET status = 'rejected' 
    WHERE status ILIKE 'rejected' AND status != 'rejected';
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Fixed % recipes with case-sensitive variants of "rejected"', updated_count;
    
    UPDATE recipes SET status = 'pending' 
    WHERE status ILIKE 'pending' AND status != 'pending';
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Fixed % recipes with case-sensitive variants of "pending"', updated_count;
    
    -- Fix NULL status
    UPDATE recipes SET status = 'pending' 
    WHERE status IS NULL;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Fixed % recipes with NULL status to "pending"', updated_count;
END;
$$ LANGUAGE plpgsql;

-- Run the function
SELECT fix_recipe_status();

-- Check the status values after the fix
SELECT status, COUNT(*) 
FROM recipes 
GROUP BY status;

-- Drop the temporary function
DROP FUNCTION fix_recipe_status(); 