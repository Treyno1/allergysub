/*
  # Add Remaining Substitutes - Batch 6

  1. New Data
    - Adds remaining substitute records for existing ingredients
    - Small batch size to prevent timeout
    - Focuses on remaining categories
  
  2. Data Integrity
    - References existing ingredients
    - Maintains consistent data structure
    - Includes all required fields
*/

-- Add remaining substitutes for existing ingredients
WITH ingredient_refs AS (
  SELECT id, name FROM ingredients
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
  i.id,
  s.name,
  s.usage,
  s.notes,
  s.safe_for,
  s.best_for,
  s.not_recommended_for,
  s.preparation_steps
FROM (
  VALUES
    -- Eggs (as thickener) substitutes
    ('Eggs (as thickener)', 'Aquafaba',
      ARRAY['Meringues', 'Mousses', 'Binding'],
      'Chickpea liquid, whips like egg whites',
      ARRAY['Egg-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Meringues', 'Mousses', 'Macarons'],
      ARRAY['Scrambled egg substitute', 'Quiche'],
      ARRAY['Reduce liquid to thicken', 'Whip until stiff peaks', 'Use 3 tbsp per egg white']
    ),
    -- Wheat Flour substitutes
    ('Wheat Flour', 'Coconut Flour',
      ARRAY['Baking'],
      'Very absorbent, use 1/4 amount of regular flour',
      ARRAY['Gluten-Free', 'Vegan', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Quick breads', 'Cookies', 'Muffins'],
      ARRAY['Yeast breads', 'Pizza dough'],
      ARRAY['Use extra eggs or liquid', 'Let batter rest', 'Store in airtight container']
    ),
    ('Wheat Flour', 'Rice Flour',
      ARRAY['Baking', 'Thickening'],
      'Light texture, good for crispy batters',
      ARRAY['Gluten-Free', 'Vegan', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Crispy coatings', 'Thickening', 'Asian recipes'],
      ARRAY['Bread making alone', 'High-gluten recipes'],
      ARRAY['Mix with other flours', 'Add xanthan gum if needed', 'Store in airtight container']
    ),
    -- Ground Beef substitutes
    ('Ground Beef', 'Lentils',
      ARRAY['Tacos', 'Sloppy joes', 'Pasta sauce'],
      'High in protein and fiber, hearty texture',
      ARRAY['Vegan', 'Dairy-Free', 'Gluten-Free', 'Nut-Free'],
      ARRAY['Tacos', 'Sloppy joes', 'Meat sauce'],
      ARRAY['Burgers', 'Meatballs'],
      ARRAY['Rinse and sort lentils', 'Cook until tender', 'Season well']
    ),
    -- Modified Food Starch substitutes
    ('Modified Food Starch', 'Kudzu Root Starch',
      ARRAY['Sauces', 'Gravies', 'Soups'],
      'Traditional Asian thickener, very pure',
      ARRAY['Corn-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Clear sauces', 'Asian dishes', 'Gravies'],
      ARRAY['Baked goods', 'Dry mixes'],
      ARRAY['Dissolve in cold liquid first', 'Add gradually while stirring', 'Cook until clear']
    )
) AS s(ingredient_name, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
JOIN ingredient_refs i ON i.name = s.ingredient_name;

-- Log the sync operation
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'sync_missing_substitutes_batch_6',
    'timestamp', CURRENT_TIMESTAMP,
    'records_added', 5
  )
);