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
    -- Additional Milk substitutes
    ('Milk', 'Pea Milk',
      ARRAY['Drinking', 'Cooking', 'Baking'],
      'High protein, neutral taste',
      ARRAY['Dairy-Free', 'Nut-Free', 'Soy-Free', 'Gluten-Free'],
      ARRAY['High-protein recipes', 'Smoothies', 'Baking'],
      ARRAY['Delicate desserts', 'Clear beverages'],
      ARRAY['Shake well', 'Refrigerate after opening', 'Use within 7-10 days']
    ),
    -- Additional Cheese substitutes
    ('Cheese', 'Hemp Seed Cheese',
      ARRAY['Spreading', 'Sauces', 'Dips'],
      'High in omega-3s, creamy texture',
      ARRAY['Dairy-Free', 'Soy-Free', 'Gluten-Free', 'Vegan'],
      ARRAY['Raw dishes', 'Spreads', 'Dips'],
      ARRAY['Melting applications', 'Baked dishes'],
      ARRAY['Store in airtight container', 'Keep refrigerated', 'Use within 5-7 days']
    ),
    -- Additional Butter substitutes
    ('Butter', 'Mashed Sweet Potato',
      ARRAY['Baking', 'Moisture'],
      'Natural sweetness, adds moisture',
      ARRAY['Dairy-Free', 'Nut-Free', 'Soy-Free', 'Vegan'],
      ARRAY['Quick breads', 'Muffins', 'Brownies'],
      ARRAY['Crispy applications', 'Pastry'],
      ARRAY['Steam or bake until soft', 'Mash until smooth', 'Cool before using']
    ),
    -- Additional Egg substitutes
    ('Eggs', 'Psyllium Egg',
      ARRAY['Baking', 'Binding'],
      'Excellent binding properties',
      ARRAY['Egg-Free', 'Dairy-Free', 'Nut-Free', 'Vegan'],
      ARRAY['Bread', 'Muffins', 'Cookies'],
      ARRAY['Meringues', 'Light cakes'],
      ARRAY['Mix with water first', 'Let gel for 5 minutes', 'Use immediately']
    ),
    -- Additional Wheat Flour substitutes
    ('Wheat Flour', 'Sorghum Flour',
      ARRAY['Baking', 'General purpose'],
      'Mild flavor, similar to wheat',
      ARRAY['Gluten-Free', 'Nut-Free', 'Soy-Free', 'Vegan'],
      ARRAY['Quick breads', 'Cookies', 'Cakes'],
      ARRAY['Yeast breads alone', 'Pastries'],
      ARRAY['Mix with other flours', 'Add xanthan gum if needed', 'Store in airtight container']
    ),
    -- Additional Cornstarch substitutes
    ('Cornstarch', 'Arrowroot Powder',
      ARRAY['Thickening', 'Sauces', 'Puddings'],
      'Clear thickener, works in acidic dishes',
      ARRAY['Corn-Free', 'Gluten-Free', 'Vegan', 'Nut-Free'],
      ARRAY['Fruit pies', 'Clear sauces', 'Puddings'],
      ARRAY['Dairy-based sauces', 'High-heat cooking'],
      ARRAY['Mix with cold liquid', 'Add at end of cooking', 'Use immediately']
    ),
    -- Additional Gelatin substitutes
    ('Gelatin', 'Carrageenan',
      ARRAY['Gelling', 'Thickening', 'Stabilizing'],
      'Seaweed-based gelling agent',
      ARRAY['Vegan', 'Gluten-Free', 'Nut-Free', 'Soy-Free'],
      ARRAY['Dairy alternatives', 'Jellies', 'Ice cream'],
      ARRAY['Hot oil applications', 'Acidic conditions'],
      ARRAY['Dissolve in hot liquid', 'Cool to set', 'Follow recipe amounts carefully']
    ),
    -- Additional Modified Food Starch substitutes
    ('Modified Food Starch', 'Konjac Powder',
      ARRAY['Thickening', 'Gelling', 'Binding'],
      'Zero calorie thickener',
      ARRAY['Gluten-Free', 'Vegan', 'Nut-Free', 'Soy-Free'],
      ARRAY['Low-calorie dishes', 'Jellies', 'Noodles'],
      ARRAY['Baked goods', 'Crispy applications'],
      ARRAY['Use very small amounts', 'Mix with liquid gradually', 'Allow time to hydrate']
    ),
    -- Additional Breadcrumbs substitutes
    ('Breadcrumbs', 'Pork Rinds',
      ARRAY['Coating', 'Binding', 'Topping'],
      'Crispy, low-carb option',
      ARRAY['Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Low-carb breading', 'Meatballs', 'Toppings'],
      ARRAY['Vegan dishes', 'Sweet applications'],
      ARRAY['Crush finely', 'Season well', 'Store in airtight container']
    ),
    -- Additional Fish Sauce substitutes
    ('Fish Sauce', 'Mushroom Sauce',
      ARRAY['Seasoning', 'Umami flavor'],
      'Rich umami flavor, vegan option',
      ARRAY['Fish-Free', 'Vegan', 'Gluten-Free', 'Nut-Free'],
      ARRAY['Stir-fries', 'Marinades', 'Sauces'],
      ARRAY['Sweet dishes', 'Light dressings'],
      ARRAY['Use sparingly', 'Store in refrigerator', 'Shake before use']
    ),
    -- Additional Fresh Basil substitutes
    ('Fresh Basil', 'Thai Basil',
      ARRAY['Seasoning', 'Garnish'],
      'Anise-like flavor, works in Asian dishes',
      ARRAY['Vegan', 'Gluten-Free', 'Nut-Free', 'Soy-Free'],
      ARRAY['Asian dishes', 'Stir-fries', 'Soups'],
      ARRAY['Italian dishes', 'Pesto'],
      ARRAY['Add at end of cooking', 'Chop just before use', 'Store with stems in water']
    )
) AS s(ingredient_name, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
JOIN ingredient_refs i ON i.name = s.ingredient_name
WHERE NOT EXISTS (
  SELECT 1 
  FROM substitutes sub
  JOIN ingredients ing ON ing.id = sub.ingredient_id
  WHERE ing.name = s.ingredient_name 
  AND sub.name = s.name
);

-- Log the sync operation
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'add_missing_substitutes',
    'timestamp', CURRENT_TIMESTAMP,
    'records_added', 11
  )
);