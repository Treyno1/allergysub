/*
  # Import initial ingredient and substitute data
  
  1. Data Import
    - Imports core ingredients with proper UUID handling
    - Imports substitutes with complete data
    - Uses gen_random_uuid() for ID generation
  
  2. Data Structure
    - Maintains referential integrity
    - Uses proper data types for all fields
*/

-- Insert ingredients with generated UUIDs
WITH ingredient_inserts AS (
  INSERT INTO ingredients (id, name, category)
  VALUES 
    (gen_random_uuid(), 'Milk', 'dairy'),
    (gen_random_uuid(), 'Cheese', 'dairy'),
    (gen_random_uuid(), 'Eggs', 'proteins'),
    (gen_random_uuid(), 'Wheat Flour', 'grains'),
    (gen_random_uuid(), 'Peanut Butter', 'nuts-seeds')
  RETURNING id, name
)
-- Insert substitutes using the returned ingredient IDs
INSERT INTO substitutes (id, ingredient_id, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
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
FROM ingredient_inserts i
CROSS JOIN (
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
    )
) AS s(ingredient_name, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
WHERE i.name = s.ingredient_name;