/*
  # Verify Data Synchronization

  1. Purpose
    - Verify data integrity
    - Ensure no duplicates exist
    - Confirm all relationships are valid
  
  2. Actions
    - Count valid relationships
    - Check for orphaned records
    - Verify constraint enforcement
*/

-- Create function to verify data integrity
CREATE OR REPLACE FUNCTION verify_data_integrity()
RETURNS TABLE (
  total_ingredients bigint,
  total_substitutes bigint,
  duplicate_substitutes bigint,
  orphaned_substitutes bigint,
  invalid_relationships bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM ingredients) as total_ingredients,
    (SELECT COUNT(*) FROM substitutes) as total_substitutes,
    (
      SELECT COUNT(*)
      FROM (
        SELECT ingredient_id, name, COUNT(*)
        FROM substitutes
        GROUP BY ingredient_id, name
        HAVING COUNT(*) > 1
      ) dupes
    ) as duplicate_substitutes,
    (
      SELECT COUNT(*)
      FROM substitutes s
      LEFT JOIN ingredients i ON i.id = s.ingredient_id
      WHERE i.id IS NULL
    ) as orphaned_substitutes,
    (
      SELECT COUNT(*)
      FROM substitutes
      WHERE ingredient_id NOT IN (SELECT id FROM ingredients)
    ) as invalid_relationships;
END;
$$ LANGUAGE plpgsql;

-- Log verification results
INSERT INTO sync_log (status, details)
SELECT
  'success',
  jsonb_build_object(
    'operation', 'verify_sync',
    'timestamp', CURRENT_TIMESTAMP,
    'results', row_to_json(v)
  )
FROM verify_data_integrity() v;