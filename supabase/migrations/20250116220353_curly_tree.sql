/*
  # Add Remaining Substitutes - Batch 4

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
    -- Black Tea substitutes
    ('Black Tea', 'Rooibos Tea',
      ARRAY['Hot/cold beverages'],
      'Naturally sweet, red color',
      ARRAY['Caffeine-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Hot tea', 'Iced tea', 'Tea lattes'],
      ARRAY['Strong caffeinated beverages', 'Baking'],
      ARRAY['Steep 5-7 minutes', 'Use boiling water', 'Can be steeped longer without bitterness']
    ),
    ('Black Tea', 'Honeybush Tea',
      ARRAY['Hot/cold beverages'],
      'Sweet, honey-like flavor',
      ARRAY['Caffeine-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Hot beverages', 'Iced tea', 'Blending with other teas'],
      ARRAY['Strong caffeinated drinks', 'Baking'],
      ARRAY['Steep 5-7 minutes', 'Use boiling water', 'Can be steeped longer for stronger flavor']
    ),
    -- Guar Gum substitutes
    ('Guar Gum', 'Locust Bean Gum',
      ARRAY['Ice cream', 'Sauces', 'Dressings'],
      'Natural thickener, prevents ice crystals',
      ARRAY['Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Corn-Free'],
      ARRAY['Frozen desserts', 'Sauces', 'Dressings'],
      ARRAY['High-acid foods', 'Clear liquids'],
      ARRAY['Blend with dry ingredients first', 'Use sparingly', 'Hydrate fully']
    ),
    -- Gelatin substitutes
    ('Gelatin', 'Irish Moss',
      ARRAY['Desserts', 'Smoothies', 'Puddings'],
      'Seaweed-based, rich in minerals',
      ARRAY['Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Corn-Free'],
      ARRAY['Puddings', 'Jellies', 'Mousses'],
      ARRAY['Quick-set applications', 'Clear jellies'],
      ARRAY['Soak in cold water', 'Blend until smooth', 'Strain before use']
    ),
    -- Cornstarch substitutes
    ('Cornstarch', 'Sweet Rice Flour',
      ARRAY['Asian dishes', 'Sauces', 'Coating'],
      'Very starchy, excellent thickening power',
      ARRAY['Corn-Free', 'Vegan', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Asian sauces', 'Gravies', 'Coating'],
      ARRAY['Pie fillings', 'Puddings'],
      ARRAY['Mix with cold liquid first', 'Cook until thickened', 'Use slightly more than cornstarch']
    )
) AS s(ingredient_name, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
JOIN ingredient_refs i ON i.name = s.ingredient_name;

-- Log the sync operation
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'sync_missing_substitutes_batch_4',
    'timestamp', CURRENT_TIMESTAMP,
    'records_added', 5
  )
);