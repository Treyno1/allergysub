/*
  # Complete Data Import
  
  1. Initial Data Import
    - Core ingredients across all categories
    - Complete substitute data with all fields
  
  2. Data Structure
    - Uses proper data types and constraints
    - Maintains referential integrity
*/

-- First, import all ingredients
INSERT INTO ingredients (name, category) VALUES
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
('Cornstarch', 'thickeners');

-- Then import all substitutes with complete data
WITH ingredient_ids AS (
  SELECT id, name FROM ingredients
)
INSERT INTO substitutes (ingredient_id, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
SELECT 
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
    ('Milk', 'Almond Milk', 
      ARRAY['Baking', 'Cooking'],
      'Nutty flavour, creamy texture',
      ARRAY['Dairy-Free', 'Gluten-Free'],
      ARRAY['Coffee and lattes', 'Baking breads', 'Cream-based soups'],
      ARRAY['Recipes requiring high heat reduction', 'Instant pudding mixes'],
      ARRAY['Shake well before use', 'Heat gradually when using in hot drinks']
    ),
    ('Milk', 'Oat Milk',
      ARRAY['Baking', 'Cooking'],
      'Mild flavour, works well in coffee',
      ARRAY['Dairy-Free', 'Nut-Free'],
      ARRAY['Coffee and lattes', 'Baking breads', 'Cream-based soups'],
      ARRAY['High-heat reduction', 'Sugar-free recipes'],
      ARRAY['Shake well before use', 'Heat gradually for hot drinks']
    ),
    ('Milk', 'Coconut Milk',
      ARRAY['Soups', 'Sauces'],
      'Adds creaminess, slight coconut taste',
      ARRAY['Dairy-Free', 'Nut-Free'],
      ARRAY['Curries', 'Creamy soups', 'Baking'],
      ARRAY['Low-fat recipes', 'Recipes where coconut flavor is unwanted'],
      ARRAY['Shake well before use', 'Store unused portion in airtight container']
    ),
    ('Eggs', 'Ground Flaxseed',
      ARRAY['Baking (binding)'],
      'Mix with water, mild taste',
      ARRAY['Egg-Free', 'Dairy-Free', 'Gluten-Free', 'Vegan'],
      ARRAY['Cookies', 'Muffins', 'Quick breads'],
      ARRAY['Recipes requiring more than 3 eggs', 'Meringues'],
      ARRAY['Mix 1 tbsp ground flax with 3 tbsp water', 'Let sit for 5-10 minutes until gelled']
    ),
    ('Eggs', 'Chia Seeds',
      ARRAY['Baking (binding)'],
      'Gel-like when mixed with water',
      ARRAY['Egg-Free', 'Dairy-Free', 'Gluten-Free', 'Vegan'],
      ARRAY['Muffins', 'Quick breads', 'Pancakes'],
      ARRAY['Recipes requiring more than 3 eggs', 'Light and fluffy cakes'],
      ARRAY['Mix 1 tbsp chia seeds with 3 tbsp water', 'Let sit for 5-10 minutes until gelled']
    )
) AS s(ingredient_name, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
JOIN ingredient_ids i ON i.name = s.ingredient_name;