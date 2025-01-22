-- Insert ingredients
INSERT INTO ingredients (name, category) VALUES
('Milk', 'dairy'),
('Cheese', 'dairy'),
('Eggs', 'proteins'),
('Wheat Flour', 'grains'),
('Peanut Butter', 'nuts-seeds'),
('Ground Beef', 'proteins'),
('Coffee', 'beverages'),
('Citrus Fruits', 'produce'),
('Tomatoes', 'produce'),
('Guar Gum', 'thickeners');

-- Insert substitutes for Milk
WITH milk_id AS (SELECT id FROM ingredients WHERE name = 'Milk' LIMIT 1)
INSERT INTO substitutes (ingredient_id, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
VALUES
((SELECT id FROM milk_id), 'Almond Milk', 
  ARRAY['Baking', 'Cooking'],
  'Nutty flavour, creamy texture',
  ARRAY['Dairy-Free', 'Gluten-Free'],
  ARRAY['Coffee and lattes', 'Baking breads', 'Cream-based soups'],
  ARRAY['Recipes requiring high heat reduction', 'Instant pudding mixes'],
  ARRAY['Shake well before use', 'Heat gradually when using in hot drinks']),
((SELECT id FROM milk_id), 'Oat Milk',
  ARRAY['Baking', 'Cooking'],
  'Mild flavour, works well in coffee',
  ARRAY['Dairy-Free', 'Nut-Free'],
  ARRAY['Coffee and lattes', 'Baking breads', 'Cream-based soups'],
  ARRAY['High-heat reduction', 'Sugar-free recipes'],
  ARRAY['Shake well before use', 'Heat gradually for hot drinks']);

-- Insert substitutes for Eggs
WITH eggs_id AS (SELECT id FROM ingredients WHERE name = 'Eggs' LIMIT 1)
INSERT INTO substitutes (ingredient_id, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
VALUES
((SELECT id FROM eggs_id), 'Ground Flaxseed',
  ARRAY['Baking (binding)'],
  'Mix with water, mild taste',
  ARRAY['Egg-Free', 'Dairy-Free', 'Gluten-Free', 'Vegan'],
  ARRAY['Cookies', 'Muffins', 'Quick breads'],
  ARRAY['Recipes requiring more than 3 eggs', 'Meringues'],
  ARRAY['Mix 1 tbsp ground flax with 3 tbsp water', 'Let sit for 5-10 minutes until gelled']),
((SELECT id FROM eggs_id), 'Chia Seeds',
  ARRAY['Baking (binding)'],
  'Gel-like when mixed with water',
  ARRAY['Egg-Free', 'Dairy-Free', 'Gluten-Free', 'Vegan'],
  ARRAY['Muffins', 'Quick breads', 'Pancakes'],
  ARRAY['Recipes requiring more than 3 eggs', 'Light and fluffy cakes'],
  ARRAY['Mix 1 tbsp chia seeds with 3 tbsp water', 'Let sit for 5-10 minutes until gelled']);

-- Continue with more inserts as needed...