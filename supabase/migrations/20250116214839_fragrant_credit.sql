/*
  # Data Synchronization Improvements

  1. Changes
    - Add indexes for better query performance
    - Add constraints to ensure data integrity
    - Add helper functions for data validation

  2. Security
    - Maintain existing RLS policies
    - Add data validation checks
*/

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ingredients_name 
  ON ingredients(name);

CREATE INDEX IF NOT EXISTS idx_substitutes_name 
  ON substitutes(name);

CREATE INDEX IF NOT EXISTS idx_substitutes_ingredient_id 
  ON substitutes(ingredient_id);

-- Add composite index for substitute lookups
CREATE INDEX IF NOT EXISTS idx_substitutes_lookup 
  ON substitutes(ingredient_id, name);

-- Create function to validate substitute data
CREATE OR REPLACE FUNCTION validate_substitute_data()
RETURNS trigger AS $$
BEGIN
  -- Ensure arrays are not null
  NEW.usage := COALESCE(NEW.usage, '{}');
  NEW.safe_for := COALESCE(NEW.safe_for, '{}');
  NEW.best_for := COALESCE(NEW.best_for, '{}');
  NEW.not_recommended_for := COALESCE(NEW.not_recommended_for, '{}');
  NEW.preparation_steps := COALESCE(NEW.preparation_steps, '{}');
  
  -- Ensure ingredient_id exists
  IF NOT EXISTS (SELECT 1 FROM ingredients WHERE id = NEW.ingredient_id) THEN
    RAISE EXCEPTION 'Invalid ingredient_id';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for data validation
DROP TRIGGER IF EXISTS validate_substitute_trigger ON substitutes;
CREATE TRIGGER validate_substitute_trigger
  BEFORE INSERT OR UPDATE ON substitutes
  FOR EACH ROW
  EXECUTE FUNCTION validate_substitute_data();

-- Add function to check data consistency
CREATE OR REPLACE FUNCTION check_data_consistency()
RETURNS TABLE (
  missing_substitutes bigint,
  inconsistent_records bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*)::bigint 
     FROM ingredients i
     LEFT JOIN substitutes s ON i.id = s.ingredient_id
     WHERE s.id IS NULL) as missing_substitutes,
    (SELECT COUNT(*)::bigint 
     FROM substitutes
     WHERE usage IS NULL 
        OR safe_for IS NULL 
        OR best_for IS NULL 
        OR not_recommended_for IS NULL 
        OR preparation_steps IS NULL) as inconsistent_records;
END;
$$ LANGUAGE plpgsql;