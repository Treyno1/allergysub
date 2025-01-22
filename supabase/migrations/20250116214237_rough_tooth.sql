/*
  # Fix data import for ingredient substitutes with proper UUIDs

  1. Clear existing data
    - Safely remove existing data to prevent duplicates
  2. Import ingredients
    - Import all ingredients with proper UUID format
  3. Import substitutes
    - Import all substitutes with complete data structure and UUID references
*/

-- First clear existing data (in reverse order of dependencies)
DELETE FROM substitutes;
DELETE FROM ingredients;

-- Create ingredients with UUIDs
WITH ingredient_data (name, category) AS (
  VALUES
    ('Milk', 'dairy'),
    ('Cheese', 'dairy'),
    ('Butter', 'dairy'),
    ('Yogurt', 'dairy'),
    ('Eggs', 'proteins'),
    ('Wheat Flour', 'grains'),
    ('Breadcrumbs', 'grains'),
    ('Peanut Butter', 'nuts-seeds'),
    ('Pine Nuts', 'nuts-seeds'),
    ('Ground Beef', 'proteins'),
    ('Chicken', 'proteins'),
    ('Tuna', 'proteins'),
    ('Fish Sauce', 'proteins'),
    ('Fresh Basil', 'produce'),
    ('Fresh Cilantro', 'produce'),
    ('Tomatoes', 'produce'),
    ('Potatoes', 'produce'),
    ('Bell Peppers', 'produce'),
    ('Eggplant', 'produce'),
    ('Citrus Fruits', 'produce'),
    ('Dates', 'produce'),
    ('Bananas', 'produce'),
    ('Brown Sugar', 'sweeteners'),
    ('Coffee', 'beverages'),
    ('Black Tea', 'beverages'),
    ('Guar Gum', 'thickeners'),
    ('Modified Food Starch', 'thickeners'),
    ('Eggs (as thickener)', 'thickeners'),
    ('Gelatin', 'thickeners'),
    ('Cornstarch', 'thickeners')
)
INSERT INTO ingredients (id, name, category)
SELECT 
  gen_random_uuid(),
  name,
  category
FROM ingredient_data
RETURNING id, name;

-- Import substitutes with complete data
WITH ingredient_refs AS (
  SELECT id, name FROM ingredients
),
milk_id AS (
  SELECT id FROM ingredient_refs WHERE name = 'Milk'
),
eggs_id AS (
  SELECT id FROM ingredient_refs WHERE name = 'Eggs'
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
VALUES
-- Milk substitutes
(
  gen_random_uuid(),
  (SELECT id FROM milk_id),
  'Almond Milk',
  ARRAY['Baking', 'Cooking'],
  'Nutty flavour, creamy texture',
  ARRAY['Dairy-Free', 'Gluten-Free'],
  ARRAY['Coffee and lattes', 'Baking breads', 'Cream-based soups'],
  ARRAY['Recipes requiring high heat reduction', 'Instant pudding mixes'],
  ARRAY['Shake well before use', 'Heat gradually when using in hot drinks']
),
(
  gen_random_uuid(),
  (SELECT id FROM milk_id),
  'Oat Milk',
  ARRAY['Baking', 'Cooking'],
  'Mild flavour, works well in coffee',
  ARRAY['Dairy-Free', 'Nut-Free'],
  ARRAY['Coffee and lattes', 'Baking breads', 'Cream-based soups'],
  ARRAY['High-heat reduction', 'Sugar-free recipes'],
  ARRAY['Shake well before use', 'Heat gradually for hot drinks']
),
(
  gen_random_uuid(),
  (SELECT id FROM milk_id),
  'Coconut Milk',
  ARRAY['Soups', 'Sauces'],
  'Adds creaminess, slight coconut taste',
  ARRAY['Dairy-Free', 'Nut-Free'],
  ARRAY['Curries', 'Creamy soups', 'Baking'],
  ARRAY['Low-fat recipes', 'Recipes where coconut flavor is unwanted'],
  ARRAY['Shake well before use', 'Store unused portion in airtight container']
),

-- Egg substitutes
(
  gen_random_uuid(),
  (SELECT id FROM eggs_id),
  'Ground Flaxseed',
  ARRAY['Baking (binding)'],
  'Mix with water, mild taste',
  ARRAY['Egg-Free', 'Dairy-Free', 'Gluten-Free', 'Vegan'],
  ARRAY['Cookies', 'Muffins', 'Quick breads'],
  ARRAY['Recipes requiring more than 3 eggs', 'Meringues'],
  ARRAY['Mix 1 tbsp ground flax with 3 tbsp water', 'Let sit for 5-10 minutes until gelled']
),
(
  gen_random_uuid(),
  (SELECT id FROM eggs_id),
  'Chia Seeds',
  ARRAY['Baking (binding)'],
  'Gel-like when mixed with water',
  ARRAY['Egg-Free', 'Dairy-Free', 'Gluten-Free', 'Vegan'],
  ARRAY['Muffins', 'Quick breads', 'Pancakes'],
  ARRAY['Recipes requiring more than 3 eggs', 'Light and fluffy cakes'],
  ARRAY['Mix 1 tbsp chia seeds with 3 tbsp water', 'Let sit for 5-10 minutes until gelled']
);