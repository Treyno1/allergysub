/*
  # Add Remaining Substitutes - Batch 7

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
    -- Brown Sugar substitutes
    ('Brown Sugar', 'Date Sugar',
      ARRAY['Baking', 'Sprinkling', 'Oatmeal topping'],
      'Made from ground dates, natural alternative',
      ARRAY['Refined-Sugar-Free', 'Gluten-Free', 'Dairy-Free', 'Vegan'],
      ARRAY['Baking', 'Toppings', 'Hot cereals'],
      ARRAY['Dissolving in liquids', 'Caramelizing'],
      ARRAY['Use 2/3 cup for 1 cup brown sugar', 'Store in cool, dry place']
    ),
    -- Eggs substitutes
    ('Eggs', 'Applesauce',
      ARRAY['Baking (moisture)'],
      'Good for moisture, mild taste',
      ARRAY['Egg-Free', 'Dairy-Free', 'Gluten-Free', 'Vegan'],
      ARRAY['Quick breads', 'Muffins', 'Cakes'],
      ARRAY['Meringues', 'Custards'],
      ARRAY['Use unsweetened variety', 'Reduce liquid slightly', 'Add 1/2 tsp baking powder']
    ),
    -- Cheese substitutes
    ('Cheese', 'Tofu (Silken)',
      ARRAY['Sauces', 'Creamy dishes'],
      'Mild flavour, creamy texture',
      ARRAY['Dairy-Free', 'Gluten-Free', 'Nut-Free', 'Vegan'],
      ARRAY['Cream sauces', 'Dips', 'Smoothies'],
      ARRAY['Melted cheese applications', 'Gratins'],
      ARRAY['Drain and pat dry', 'Blend until smooth', 'Season well']
    ),
    -- Butter substitutes
    ('Butter', 'Ghee (Lactose-Free)',
      ARRAY['Cooking', 'Baking'],
      'Rich flavour, used for frying',
      ARRAY['Lactose-Free', 'Gluten-Free'],
      ARRAY['High-heat cooking', 'Indian dishes', 'Baking'],
      ARRAY['Vegan recipes', 'Dairy-free needs'],
      ARRAY['Use 1:1 ratio', 'Store in airtight container', 'Keep at room temperature']
    ),
    -- Sour Cream substitutes
    ('Yogurt', 'Cashew Cream',
      ARRAY['Baking', 'Cooking'],
      'Creamy texture, neutral taste',
      ARRAY['Dairy-Free', 'Gluten-Free'],
      ARRAY['Creamy sauces', 'Dips', 'Baked goods'],
      ARRAY['High-heat applications', 'Clear sauces'],
      ARRAY['Soak cashews overnight', 'Blend until very smooth', 'Add lemon for tang']
    )
) AS s(ingredient_name, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
JOIN ingredient_refs i ON i.name = s.ingredient_name;

-- Log the sync operation
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'sync_missing_substitutes_batch_7',
    'timestamp', CURRENT_TIMESTAMP,
    'records_added', 5
  )
);