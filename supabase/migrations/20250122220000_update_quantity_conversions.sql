-- Update quantity conversions for key ingredients
UPDATE substitutes
SET quantity_conversion = CASE
  -- Dairy Alternatives
  WHEN name = 'Almond Milk' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Milk')
    THEN '1 cup almond milk = 1 cup milk (240ml)'
  WHEN name = 'Oat Milk' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Milk')
    THEN '1 cup oat milk = 1 cup milk (240ml)'
  WHEN name = 'Coconut Milk' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Milk')
    THEN '1 cup coconut milk = 1 cup milk (240ml). For heavy cream replacement, use full-fat coconut milk'
  WHEN name = 'Greek Yogurt' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Sour Cream')
    THEN '1 cup Greek yogurt = 1 cup sour cream (240ml)'
    
  -- Flour Alternatives
  WHEN name = 'Rice Flour' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Wheat Flour')
    THEN '75g rice flour + 25g cornstarch = 100g wheat flour'
  WHEN name = 'Almond Flour' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Wheat Flour')
    THEN '120g almond flour = 100g wheat flour. Reduce liquid in recipe by 10%'
  WHEN name = 'Oat Flour' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Wheat Flour')
    THEN '100g oat flour = 100g wheat flour. Add 1/2 tsp xanthan gum per cup for better binding'
    
  -- Egg Substitutes (with precise measurements)
  WHEN name = 'Flax Egg' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Eggs')
    THEN '1 egg = 1 tbsp (7g) ground flaxseed + 3 tbsp (45ml) water'
  WHEN name = 'Chia Egg' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Eggs')
    THEN '1 egg = 1 tbsp (12g) chia seeds + 3 tbsp (45ml) water'
  WHEN name = 'Mashed Banana' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Eggs')
    THEN '1 egg = 1/4 cup (60g) mashed ripe banana'
  WHEN name = 'Silken Tofu' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Eggs')
    THEN '1 egg = 1/4 cup (60g) blended silken tofu'
    
  -- Butter Alternatives
  WHEN name = 'Coconut Oil' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Butter')
    THEN '1 cup butter = 1 cup coconut oil (225g). Use solid coconut oil for baking'
  WHEN name = 'Applesauce' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Butter')
    THEN '1 cup butter = 3/4 cup (180ml) unsweetened applesauce. Best for moist baked goods'
    
  -- Sweetener Alternatives
  WHEN name = 'Honey' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Sugar')
    THEN '1 cup sugar = 3/4 cup (180ml) honey. Reduce liquid in recipe by 1/4 cup per cup of honey'
  WHEN name = 'Maple Syrup' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Sugar')
    THEN '1 cup sugar = 3/4 cup (180ml) maple syrup. Reduce liquid in recipe by 3 tbsp per cup'
    
  -- Condiment Substitutes
  WHEN name = 'Greek Yogurt' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Mayonnaise')
    THEN '1 cup mayonnaise = 1 cup Greek yogurt (240ml). Best for dips and dressings'
  WHEN name = 'Coconut Aminos' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Soy Sauce')
    THEN '1 tbsp soy sauce = 1 tbsp coconut aminos (15ml). Slightly sweeter than soy sauce'
  WHEN name = 'Nutritional Yeast' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Parmesan')
    THEN '1 cup grated parmesan = 3/4 cup (45g) nutritional yeast'

  ELSE quantity_conversion
END
WHERE quantity_conversion IS NULL OR quantity_conversion LIKE '1:1 ratio%';

-- Log the update
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'update_quantity_conversions',
    'timestamp', CURRENT_TIMESTAMP,
    'details', 'Updated quantity conversions with specific measurements'
  )
); 