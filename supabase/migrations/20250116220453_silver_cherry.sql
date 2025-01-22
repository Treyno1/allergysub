/*
  # Add Remaining Substitutes - Batch 5

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
    -- Peanut Butter substitutes
    ('Peanut Butter', 'Sunflower Seed Butter',
      ARRAY['Spreading', 'Baking'],
      'Similar consistency to peanut butter',
      ARRAY['Nut-Free', 'Gluten-Free', 'Dairy-Free', 'Vegan'],
      ARRAY['Sandwiches', 'Baking', 'Sauces'],
      ARRAY['High-heat cooking'],
      ARRAY['Stir well before use', 'Store at room temperature', 'Refrigerate after opening']
    ),
    ('Peanut Butter', 'Pumpkin Seed Butter',
      ARRAY['Spreading', 'Baking'],
      'Rich in nutrients, slightly green color',
      ARRAY['Nut-Free', 'Gluten-Free', 'Dairy-Free', 'Vegan'],
      ARRAY['Spreads', 'Dips', 'Baking'],
      ARRAY['Sweet desserts'],
      ARRAY['Stir before use', 'Store in cool place', 'Refrigerate after opening']
    ),
    -- Tuna substitutes
    ('Tuna', 'Mashed Chickpeas',
      ARRAY['Sandwiches', 'Salads', 'Wraps'],
      'Similar texture when mashed, great with mayo',
      ARRAY['Fish-Free', 'Vegan', 'Dairy-Free', 'Gluten-Free', 'Nut-Free'],
      ARRAY['Sandwiches', 'Salads', 'Dips'],
      ARRAY['Raw applications', 'Sushi'],
      ARRAY['Drain and rinse chickpeas', 'Mash with fork', 'Season well']
    ),
    -- Salmon substitutes
    ('Tuna', 'Marinated Carrots',
      ARRAY['Sushi rolls', 'Cold preparations'],
      'Can mimic smoked salmon texture and color',
      ARRAY['Fish-Free', 'Vegan', 'Dairy-Free', 'Gluten-Free', 'Nut-Free'],
      ARRAY['Sushi', 'Appetizers', 'Salads'],
      ARRAY['Hot dishes', 'Main courses'],
      ARRAY['Slice carrots thinly', 'Marinate overnight', 'Pat dry before using']
    ),
    -- Brown Sugar substitutes
    ('Brown Sugar', 'Coconut Sugar',
      ARRAY['Baking', 'Cooking'],
      'Rich, caramel-like flavor',
      ARRAY['Refined-Sugar-Free', 'Gluten-Free', 'Dairy-Free', 'Vegan'],
      ARRAY['Baking', 'Hot beverages', 'Sauces'],
      ARRAY['Light colored baked goods', 'Candy making'],
      ARRAY['Use 1:1 ratio', 'Store in airtight container', 'Check moisture content of recipe']
    )
) AS s(ingredient_name, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
JOIN ingredient_refs i ON i.name = s.ingredient_name;

-- Log the sync operation
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'sync_missing_substitutes_batch_5',
    'timestamp', CURRENT_TIMESTAMP,
    'records_added', 5
  )
);