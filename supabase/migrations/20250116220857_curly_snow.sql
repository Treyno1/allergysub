/*
  # Add Remaining Substitutes - Batch 10

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
    -- Milk substitutes
    ('Milk', 'Soy Milk',
      ARRAY['Baking', 'Cooking', 'Drinking'],
      'High protein content, neutral taste',
      ARRAY['Dairy-Free', 'Nut-Free', 'Gluten-Free'],
      ARRAY['Baking', 'Smoothies', 'Coffee drinks'],
      ARRAY['Raw applications', 'High-acid recipes'],
      ARRAY['Shake well', 'Store in refrigerator', 'Use within 7-10 days of opening']
    ),
    -- Cheese substitutes
    ('Cheese', 'Vegan Mozzarella',
      ARRAY['Pizza', 'Melting', 'Sandwiches'],
      'Melts well, stretchy texture',
      ARRAY['Dairy-Free', 'Vegan', 'Nut-Free'],
      ARRAY['Pizza', 'Grilled cheese', 'Lasagna'],
      ARRAY['Cold cheese plates', 'Cheese boards'],
      ARRAY['Shred when cold', 'Melt at moderate heat', 'Store in airtight container']
    ),
    -- Eggs (as thickener) substitutes
    ('Eggs (as thickener)', 'Xanthan Gum',
      ARRAY['Thickening', 'Binding', 'Stabilizing'],
      'Very effective in small amounts',
      ARRAY['Egg-Free', 'Vegan', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Gluten-free baking', 'Sauces', 'Ice cream'],
      ARRAY['Delicate batters', 'Clear liquids'],
      ARRAY['Use very small amounts', 'Mix with dry ingredients first', 'Add gradually']
    ),
    -- Modified Food Starch substitutes
    ('Modified Food Starch', 'Potato Starch',
      ARRAY['Thickening', 'Coating', 'Baking'],
      'Light, neutral taste, good for crispy coatings',
      ARRAY['Corn-Free', 'Gluten-Free', 'Vegan', 'Nut-Free'],
      ARRAY['Crispy coatings', 'Gravies', 'Pie fillings'],
      ARRAY['High-acid sauces', 'Prolonged cooking'],
      ARRAY['Mix with cold liquid', 'Add at end of cooking', 'Store in cool, dry place']
    ),
    -- Cornstarch substitutes
    ('Cornstarch', 'Cassava Flour',
      ARRAY['Thickening', 'Baking', 'Coating'],
      'Neutral flavor, similar to wheat flour',
      ARRAY['Corn-Free', 'Gluten-Free', 'Grain-Free', 'Nut-Free'],
      ARRAY['Tortillas', 'Thickening', 'Baked goods'],
      ARRAY['Delicate pastries', 'High-protein breads'],
      ARRAY['Use 1:1 ratio', 'Store in airtight container', 'Mix well with other ingredients']
    )
) AS s(ingredient_name, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
JOIN ingredient_refs i ON i.name = s.ingredient_name;

-- Log the sync operation
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'sync_missing_substitutes_batch_10',
    'timestamp', CURRENT_TIMESTAMP,
    'records_added', 5
  )
);