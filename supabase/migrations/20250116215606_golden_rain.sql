/*
  # Sync Missing Substitutes

  1. New Data
    - Adds remaining substitute records for existing ingredients
    - Includes complete data for each substitute:
      - Usage instructions
      - Safety information
      - Best practices
      - Preparation steps
  
  2. Data Integrity
    - References existing ingredients
    - Maintains consistent data structure
    - Validates all required fields
*/

-- Add missing substitutes for existing ingredients
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
    -- Cheese substitutes
    ('Cheese', 'Nutritional Yeast',
      ARRAY['Cooking', 'Toppings'],
      'Cheesy flavour, vegan option',
      ARRAY['Dairy-Free', 'Gluten-Free', 'Vegan'],
      ARRAY['Pasta dishes', 'Popcorn topping', 'Sauces'],
      ARRAY['Melted cheese applications', 'Cheese-based dips'],
      ARRAY['Store in airtight container', 'Sprinkle after cooking']
    ),
    ('Cheese', 'Cashew Cheese',
      ARRAY['Spreads', 'Sauces'],
      'Creamy, mild cheese flavour',
      ARRAY['Dairy-Free', 'Gluten-Free'],
      ARRAY['Sandwiches', 'Dips', 'Pasta dishes'],
      ARRAY['High-heat cooking', 'Melted cheese recipes'],
      ARRAY['Soak cashews overnight', 'Blend until completely smooth']
    ),
    -- Butter substitutes
    ('Butter', 'Olive Oil',
      ARRAY['Baking', 'Cooking'],
      'Works for frying, different texture',
      ARRAY['Dairy-Free', 'Gluten-Free', 'Nut-Free', 'Vegan'],
      ARRAY['Sautéing', 'Roasting', 'Dressings'],
      ARRAY['Delicate pastries', 'Buttercream frosting'],
      ARRAY['Use slightly less than butter amount', 'Choose light variety for baking']
    ),
    -- Yogurt substitutes
    ('Yogurt', 'Coconut Yogurt',
      ARRAY['Baking', 'Snacks'],
      'Slight coconut flavour, creamy',
      ARRAY['Dairy-Free', 'Gluten-Free', 'Nut-Free', 'Vegan'],
      ARRAY['Smoothies', 'Baked goods', 'Parfaits'],
      ARRAY['Hot dishes', 'Recipes needing tang'],
      ARRAY['Stir well before use', 'Keep refrigerated']
    ),
    -- More egg substitutes
    ('Eggs', 'Mashed Banana',
      ARRAY['Baking (moisture)'],
      'Adds moisture, mild sweetness',
      ARRAY['Egg-Free', 'Dairy-Free', 'Gluten-Free', 'Vegan'],
      ARRAY['Quick breads', 'Muffins', 'Pancakes'],
      ARRAY['Savory dishes', 'Light cakes'],
      ARRAY['Use very ripe bananas', 'Reduce sugar in recipe']
    ),
    -- Wheat flour substitutes
    ('Wheat Flour', 'Almond Flour',
      ARRAY['Baking', 'Coating'],
      'Rich in protein, great for cookies and cakes',
      ARRAY['Gluten-Free', 'Vegan', 'Dairy-Free'],
      ARRAY['Cookies', 'Quick breads', 'Crusts'],
      ARRAY['Yeast breads', 'High-gluten recipes'],
      ARRAY['Store in airtight container', 'Use 1:1 ratio']
    ),
    -- Ground beef substitutes
    ('Ground Beef', 'Textured Vegetable Protein (TVP)',
      ARRAY['Tacos', 'Burgers', 'Casseroles'],
      'Rehydrate before using, absorbs flavors well',
      ARRAY['Vegan', 'Dairy-Free', 'Gluten-Free', 'Nut-Free'],
      ARRAY['Tacos', 'Chili', 'Meat sauce'],
      ARRAY['Raw applications', 'Delicate dishes'],
      ARRAY['Rehydrate in hot water', 'Season well']
    ),
    -- Coffee substitutes
    ('Coffee', 'Dandelion Root Tea',
      ARRAY['Hot beverages'],
      'Rich, roasted flavor similar to coffee',
      ARRAY['Caffeine-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Morning beverage', 'Hot drinks'],
      ARRAY['Espresso recipes', 'Cold brew'],
      ARRAY['Steep for 5-10 minutes', 'Strain well']
    ),
    -- Citrus substitutes
    ('Citrus Fruits', 'Apple Cider Vinegar',
      ARRAY['Dressings', 'Marinades'],
      'Adds acidity and brightness to dishes',
      ARRAY['Citrus-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Dressings', 'Marinades', 'Sauces'],
      ARRAY['Sweet applications', 'Garnishes'],
      ARRAY['Dilute if needed', 'Use less than citrus amount']
    ),
    -- Tomato substitutes
    ('Tomatoes', 'Pumpkin Puree',
      ARRAY['Sauces', 'Soups'],
      'Good base for nightshade-free pasta sauce',
      ARRAY['Nightshade-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Pasta sauce', 'Soups', 'Stews'],
      ARRAY['Raw applications', 'Cold dishes'],
      ARRAY['Season well', 'Add acid for balance']
    )
) AS s(ingredient_name, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
JOIN ingredient_refs i ON i.name = s.ingredient_name;

-- Log the sync operation
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'sync_missing_substitutes',
    'timestamp', CURRENT_TIMESTAMP,
    'records_added', 10
  )
);