/*
  # Add Remaining Substitutes - Batch 11

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
    ('Milk', 'Macadamia Milk',
      ARRAY['Drinking', 'Coffee', 'Smoothies'],
      'Creamy texture, subtle nutty flavor',
      ARRAY['Dairy-Free', 'Gluten-Free', 'Soy-Free'],
      ARRAY['Coffee drinks', 'Smoothies', 'Cereals'],
      ARRAY['High-heat cooking', 'Baking'],
      ARRAY['Shake well', 'Keep refrigerated', 'Use within 7 days']
    ),
    -- Cheese substitutes
    ('Cheese', 'Coconut Cheese',
      ARRAY['Spreading', 'Melting', 'Toppings'],
      'Melts well, mild coconut flavor',
      ARRAY['Dairy-Free', 'Soy-Free', 'Gluten-Free', 'Vegan'],
      ARRAY['Pizza', 'Grilled sandwiches', 'Nachos'],
      ARRAY['Strong-flavored dishes', 'Wine pairings'],
      ARRAY['Shred when cold', 'Store in airtight container', 'Use within 2 weeks']
    ),
    -- Eggs substitutes
    ('Eggs', 'Commercial Egg Replacer',
      ARRAY['Baking', 'Binding'],
      'Consistent results, allergen-free',
      ARRAY['Egg-Free', 'Dairy-Free', 'Nut-Free', 'Soy-Free', 'Vegan'],
      ARRAY['Cakes', 'Cookies', 'Quick breads'],
      ARRAY['Meringues', 'Custards', 'Soufflés'],
      ARRAY['Follow package instructions', 'Mix with liquid first', 'Use immediately']
    ),
    -- Wheat Flour substitutes
    ('Wheat Flour', 'Cassava Flour',
      ARRAY['Baking', 'Thickening', 'Coating'],
      'Similar texture to wheat flour, neutral taste',
      ARRAY['Gluten-Free', 'Grain-Free', 'Nut-Free', 'Vegan'],
      ARRAY['Tortillas', 'Bread', 'Cookies'],
      ARRAY['Yeast breads', 'Delicate pastries'],
      ARRAY['Use 1:1 ratio', 'Store in airtight container', 'Add gradually to liquids']
    ),
    -- Modified Food Starch substitutes
    ('Modified Food Starch', 'Psyllium Husk',
      ARRAY['Binding', 'Thickening', 'Baking'],
      'Natural fiber, excellent binding properties',
      ARRAY['Gluten-Free', 'Grain-Free', 'Vegan', 'Nut-Free'],
      ARRAY['Gluten-free baking', 'Smoothies', 'Binding'],
      ARRAY['Clear sauces', 'Delicate textures'],
      ARRAY['Mix with liquid first', 'Let gel before using', 'Use sparingly']
    )
) AS s(ingredient_name, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
JOIN ingredient_refs i ON i.name = s.ingredient_name;

-- Log the sync operation
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'sync_missing_substitutes_batch_11',
    'timestamp', CURRENT_TIMESTAMP,
    'records_added', 5
  )
);