/*
  # Add Remaining Substitutes - Batch 8

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
    -- Wheat Flour substitutes
    ('Wheat Flour', 'Quinoa Flour',
      ARRAY['Baking', 'Thickening'],
      'High protein, nutty flavor',
      ARRAY['Gluten-Free', 'Vegan', 'Dairy-Free', 'Nut-Free'],
      ARRAY['High-protein baking', 'Pancakes', 'Muffins'],
      ARRAY['Delicate pastries', 'White cakes'],
      ARRAY['Store in airtight container', 'Mix with other flours', 'Use in combination for best results']
    ),
    -- Milk substitutes
    ('Milk', 'Hemp Milk',
      ARRAY['Drinking', 'Baking', 'Smoothies'],
      'Creamy texture, nutty taste, high in omega-3',
      ARRAY['Dairy-Free', 'Nut-Free', 'Soy-Free', 'Gluten-Free'],
      ARRAY['Smoothies', 'Coffee drinks', 'Cereal'],
      ARRAY['High-heat cooking', 'Puddings'],
      ARRAY['Shake well', 'Keep refrigerated', 'Use within 7-10 days of opening']
    ),
    -- Cheese substitutes
    ('Cheese', 'Almond Ricotta',
      ARRAY['Lasagna', 'Stuffed pasta', 'Dips'],
      'Creamy texture, mild flavor',
      ARRAY['Dairy-Free', 'Gluten-Free', 'Soy-Free', 'Vegan'],
      ARRAY['Italian dishes', 'Spreads', 'Dips'],
      ARRAY['Melting applications', 'Grilled cheese'],
      ARRAY['Soak almonds overnight', 'Blend until smooth', 'Season to taste']
    ),
    -- Ground Beef substitutes
    ('Ground Beef', 'Mushroom-Walnut Mix',
      ARRAY['Tacos', 'Burgers', 'Meatballs'],
      'Meaty texture and umami flavor',
      ARRAY['Vegan', 'Dairy-Free', 'Gluten-Free', 'Soy-Free'],
      ARRAY['Burgers', 'Tacos', 'Stuffed vegetables'],
      ARRAY['Stir-fries', 'Loose meat sandwiches'],
      ARRAY['Pulse in food processor', 'Cook until moisture evaporates', 'Season well']
    ),
    -- Butter substitutes
    ('Butter', 'Avocado',
      ARRAY['Spreading', 'Baking'],
      'Creamy texture, healthy fats',
      ARRAY['Dairy-Free', 'Gluten-Free', 'Nut-Free', 'Vegan'],
      ARRAY['Toast', 'Sandwiches', 'Baked goods'],
      ARRAY['High-heat cooking', 'Candy making'],
      ARRAY['Use ripe avocados', 'Mash until smooth', 'Add salt to taste']
    )
) AS s(ingredient_name, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
JOIN ingredient_refs i ON i.name = s.ingredient_name;

-- Log the sync operation
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'sync_missing_substitutes_batch_8',
    'timestamp', CURRENT_TIMESTAMP,
    'records_added', 5
  )
);