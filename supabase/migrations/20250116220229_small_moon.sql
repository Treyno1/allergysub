/*
  # Add Remaining Substitutes - Batch 3

  1. New Data
    - Adds remaining substitute records for existing ingredients
    - Split into smaller batches to prevent timeout
    - Focuses on remaining categories
  
  2. Data Integrity
    - References existing ingredients
    - Maintains consistent data structure
    - Includes all required fields
*/

-- Add remaining substitutes in a smaller batch
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
    -- Coffee substitutes
    ('Coffee', 'Roasted Carob',
      ARRAY['Hot beverages', 'Baking'],
      'Natural sweetness, chocolate-like flavor',
      ARRAY['Caffeine-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Hot drinks', 'Baking', 'Smoothies'],
      ARRAY['Espresso recipes', 'Coffee-specific drinks'],
      ARRAY['Use 1-2 teaspoons per cup', 'Mix with hot water', 'Add milk if desired']
    ),
    ('Coffee', 'Chicory Root Coffee',
      ARRAY['Hot beverages'],
      'Coffee-like flavor, caffeine-free',
      ARRAY['Caffeine-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Morning beverage', 'Coffee alternative', 'Blending'],
      ARRAY['Espresso drinks', 'Cold brew'],
      ARRAY['Brew like regular coffee', 'Adjust strength to taste', 'Can be mixed with coffee']
    ),
    -- Citrus Fruits substitutes
    ('Citrus Fruits', 'Sumac',
      ARRAY['Seasoning', 'Garnish'],
      'Middle Eastern spice with tart, lemony flavor',
      ARRAY['Citrus-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Seasoning', 'Marinades', 'Finishing spice'],
      ARRAY['Baking', 'Sweet dishes'],
      ARRAY['Sprinkle as finishing spice', 'Add to marinades', 'Store in airtight container']
    ),
    ('Citrus Fruits', 'Verjus',
      ARRAY['Cooking', 'Dressings'],
      'Made from unripe grapes, adds bright acidity',
      ARRAY['Citrus-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Dressings', 'Marinades', 'Deglazing'],
      ARRAY['Sweet applications', 'Carbonated drinks'],
      ARRAY['Use less than citrus juice', 'Store in refrigerator', 'Shake before use']
    ),
    -- Modified Food Starch substitutes
    ('Modified Food Starch', 'Arrowroot Powder',
      ARRAY['Thickening', 'Sauces', 'Puddings'],
      'Clear thickener, works well in acidic dishes',
      ARRAY['Corn-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Clear sauces', 'Fruit pies', 'Puddings'],
      ARRAY['High-heat cooking', 'Dairy-based sauces'],
      ARRAY['Mix with cold liquid first', 'Add at end of cooking', 'Use half amount of cornstarch']
    )
) AS s(ingredient_name, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
JOIN ingredient_refs i ON i.name = s.ingredient_name;

-- Log the sync operation
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'sync_missing_substitutes_batch_3',
    'timestamp', CURRENT_TIMESTAMP,
    'records_added', 5
  )
);