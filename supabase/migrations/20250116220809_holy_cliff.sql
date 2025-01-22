/*
  # Add Remaining Substitutes - Batch 9

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
    -- Eggs substitutes
    ('Eggs', 'Silken Tofu',
      ARRAY['Baking', 'Cooking'],
      'Good for texture, mild taste',
      ARRAY['Egg-Free', 'Dairy-Free', 'Gluten-Free', 'Vegan'],
      ARRAY['Scrambles', 'Quiches', 'Dense baked goods'],
      ARRAY['Meringues', 'Angel food cake'],
      ARRAY['Drain and pat dry', 'Blend until smooth', 'Use 1/4 cup per egg']
    ),
    -- Wheat Flour substitutes
    ('Wheat Flour', 'Buckwheat Flour',
      ARRAY['Baking', 'Pancakes'],
      'Earthy flavor, good protein content',
      ARRAY['Gluten-Free', 'Vegan', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Pancakes', 'Crepes', 'Quick breads'],
      ARRAY['Light cakes', 'Pastries'],
      ARRAY['Mix with other flours', 'Let batter rest', 'Store in airtight container']
    ),
    -- Modified Food Starch substitutes
    ('Modified Food Starch', 'Tapioca Starch',
      ARRAY['Thickening', 'Baking'],
      'Clear thickener, slightly sweet',
      ARRAY['Corn-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Fruit pies', 'Clear sauces', 'Bubble tea'],
      ARRAY['Prolonged heating', 'Acidic sauces'],
      ARRAY['Mix with cold liquid', 'Add gradually', 'Cook until clear']
    ),
    -- Gelatin substitutes
    ('Gelatin', 'Agar Agar',
      ARRAY['Jellies', 'Desserts'],
      'Plant-based gelatin alternative',
      ARRAY['Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Firm jellies', 'Desserts', 'Aspics'],
      ARRAY['Creamy desserts', 'Mousses'],
      ARRAY['Dissolve in liquid', 'Boil to activate', 'Set at room temperature']
    ),
    -- Black Tea substitutes
    ('Black Tea', 'Yerba Mate',
      ARRAY['Hot beverages', 'Energy drinks'],
      'Natural energy boost, earthy flavor',
      ARRAY['Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Morning beverage', 'Pre-workout drink', 'Iced tea'],
      ARRAY['Evening drinks', 'Dessert recipes'],
      ARRAY['Steep at 170°F', 'Do not oversteep', 'Can be resteeped']
    )
) AS s(ingredient_name, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
JOIN ingredient_refs i ON i.name = s.ingredient_name;

-- Log the sync operation
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'sync_missing_substitutes_batch_9',
    'timestamp', CURRENT_TIMESTAMP,
    'records_added', 5
  )
);