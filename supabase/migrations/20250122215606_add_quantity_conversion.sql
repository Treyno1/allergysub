-- Add quantity conversion data to existing substitutes
UPDATE substitutes
SET quantity_conversion = CASE
  -- Eggs
  WHEN name = 'Flax Egg' THEN '1 egg = 1 tablespoon ground flaxseed + 3 tablespoons water'
  WHEN name = 'Chia Egg' THEN '1 egg = 1 tablespoon chia seeds + 3 tablespoons water'
  WHEN name = 'Commercial Egg Replacer' THEN 'Follow package instructions (typically 1.5 teaspoons + 2-3 tablespoons water = 1 egg)'
  WHEN name = 'Mashed Banana' THEN '1 egg = 1/4 cup mashed banana'
  WHEN name = 'Silken Tofu' THEN '1 egg = 1/4 cup blended silken tofu'
  
  -- Dairy
  WHEN name = 'Almond Milk' THEN '1:1 ratio - Use equal amounts'
  WHEN name = 'Soy Milk' THEN '1:1 ratio - Use equal amounts'
  WHEN name = 'Oat Milk' THEN '1:1 ratio - Use equal amounts'
  WHEN name = 'Coconut Milk' THEN '1:1 ratio - Use equal amounts'
  WHEN name = 'Cashew Milk' THEN '1:1 ratio - Use equal amounts'
  
  -- Condiments
  WHEN name = 'Greek Yogurt' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Mayonnaise') 
    THEN '1:1 ratio - Use equal amounts'
  WHEN name = 'Mashed Avocado' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Mayonnaise')
    THEN '1:1 ratio - Use equal amounts'
  WHEN name = 'Hummus' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Mayonnaise')
    THEN '1:1 ratio - Use equal amounts'
  WHEN name = 'Coconut Aminos' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Soy Sauce')
    THEN '1:1 ratio - Use equal amounts'
  WHEN name = 'Tamari' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Soy Sauce')
    THEN '1:1 ratio - Use equal amounts'
  WHEN name = 'Coconut Aminos' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Fish Sauce')
    THEN '1:1 ratio - Use equal amounts'
  WHEN name = 'Mushroom Sauce' AND ingredient_id IN (SELECT id FROM ingredients WHERE name = 'Fish Sauce')
    THEN '1:1 ratio - Use equal amounts'
  
  ELSE '1:1 ratio - Use the same amount as the original ingredient'
END
WHERE quantity_conversion IS NULL; 