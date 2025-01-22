/*
  # Fix Sync Issues and Data Deduplication

  1. Data Cleanup
    - Removes duplicate substitutes while preserving the most complete records
    - Ensures consistent data across all records
  
  2. Data Validation
    - Adds constraints to prevent future duplicates
    - Validates data integrity
  
  3. Missing Data Sync
    - Adds remaining substitutes with proper deduplication
    - Ensures complete dataset
*/

-- First, create a temporary table to identify and resolve duplicates
CREATE TEMP TABLE duplicate_substitutes AS
WITH ranked_substitutes AS (
  SELECT 
    s.*,
    i.name as ingredient_name,
    ROW_NUMBER() OVER (
      PARTITION BY i.name, s.name 
      ORDER BY 
        array_length(s.usage, 1) DESC NULLS LAST,
        array_length(s.best_for, 1) DESC NULLS LAST,
        array_length(s.preparation_steps, 1) DESC NULLS LAST,
        s.created_at DESC
    ) as rn
  FROM substitutes s
  JOIN ingredients i ON i.id = s.ingredient_id
)
SELECT * FROM ranked_substitutes WHERE rn > 1;

-- Remove duplicates keeping the most complete record
DELETE FROM substitutes
WHERE id IN (SELECT id FROM duplicate_substitutes);

-- Add missing substitutes with deduplication check
WITH ingredient_refs AS (
  SELECT id, name FROM ingredients
),
new_substitutes AS (
  SELECT
    i.id as ingredient_id,
    s.name,
    s.usage,
    s.notes,
    s.safe_for,
    s.best_for,
    s.not_recommended_for,
    s.preparation_steps
  FROM (
    VALUES
      -- Milk substitutes
      ('Milk', 'Rice Milk',
        ARRAY['Drinking', 'Baking', 'Cooking'],
        'Light and mild flavor',
        ARRAY['Dairy-Free', 'Nut-Free', 'Soy-Free', 'Gluten-Free'],
        ARRAY['Light sauces', 'Baked goods', 'Smoothies'],
        ARRAY['Creamy sauces', 'Coffee drinks'],
        ARRAY['Shake well', 'Store in refrigerator', 'Use within 7-10 days']
      ),
      -- Cheese substitutes
      ('Cheese', 'Miso Paste',
        ARRAY['Seasoning', 'Umami flavor'],
        'Adds savory depth and saltiness',
        ARRAY['Dairy-Free', 'Gluten-Free', 'Vegan'],
        ARRAY['Sauces', 'Dressings', 'Marinades'],
        ARRAY['Melted cheese applications', 'Raw dishes'],
        ARRAY['Use sparingly', 'Dissolve in liquid', 'Adjust salt in recipe']
      ),
      -- Eggs substitutes
      ('Eggs', 'Carbonated Water',
        ARRAY['Baking (leavening)'],
        'Adds lightness to batters',
        ARRAY['Egg-Free', 'Dairy-Free', 'Gluten-Free', 'Vegan'],
        ARRAY['Pancakes', 'Waffles', 'Light batters'],
        ARRAY['Binding applications', 'Dense baked goods'],
        ARRAY['Use immediately', 'Do not overmix', 'Add as last ingredient']
      ),
      -- Wheat Flour substitutes
      ('Wheat Flour', 'Chickpea Flour',
        ARRAY['Baking', 'Binding', 'Coating'],
        'High protein, good binding properties',
        ARRAY['Gluten-Free', 'Grain-Free', 'Nut-Free', 'Vegan'],
        ARRAY['Flatbreads', 'Fritters', 'Egg substitute'],
        ARRAY['Sweet baked goods', 'Delicate pastries'],
        ARRAY['Toast before using', 'Mix well', 'Store in airtight container']
      ),
      -- Modified Food Starch substitutes
      ('Modified Food Starch', 'Ground Chia Seeds',
        ARRAY['Thickening', 'Binding', 'Gelling'],
        'Natural thickener with omega-3s',
        ARRAY['Corn-Free', 'Gluten-Free', 'Vegan', 'Nut-Free'],
        ARRAY['Puddings', 'Jams', 'Smoothies'],
        ARRAY['Clear sauces', 'Light colored dishes'],
        ARRAY['Mix with liquid first', 'Let gel for 10 minutes', 'Use within recipe immediately']
      )
  ) AS s(ingredient_name, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
  JOIN ingredient_refs i ON i.name = s.ingredient_name
  WHERE NOT EXISTS (
    SELECT 1 
    FROM substitutes sub
    JOIN ingredients ing ON ing.id = sub.ingredient_id
    WHERE ing.name = s.ingredient_name 
    AND sub.name = s.name
  )
)
INSERT INTO substitutes (
  id,
  ingredient_id,
  name,
  usage,
  notes,
  safe_for,
  best_for,
  not_recommended_for,
  preparation_steps
)
SELECT
  gen_random_uuid(),
  ingredient_id,
  name,
  usage,
  notes,
  safe_for,
  best_for,
  not_recommended_for,
  preparation_steps
FROM new_substitutes;

-- Add unique constraint to prevent future duplicates
ALTER TABLE substitutes 
ADD CONSTRAINT unique_ingredient_substitute 
UNIQUE (ingredient_id, name);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_substitutes_ingredient_name 
ON substitutes(ingredient_id, name);

-- Log the sync operation
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'fix_sync_issues',
    'timestamp', CURRENT_TIMESTAMP,
    'duplicates_removed', (SELECT COUNT(*) FROM duplicate_substitutes),
    'new_records_added', 5
  )
);