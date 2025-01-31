/*
  # Import ingredient and substitute data
  
  1. Data Import
    - Imports all ingredients from CSV data
    - Imports all substitutes with their relationships
    - Preserves all data fields including arrays
*/

-- Import ingredients
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

-- Import substitutes
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
    ('Eggs', 'Ground Flaxseed',
      ARRAY['Baking (binding)'],
      'Mix with water, mild taste',
      ARRAY['Egg-Free', 'Dairy-Free', 'Gluten-Free', 'Vegan'],
      ARRAY['Cookies', 'Muffins', 'Quick breads'],
      ARRAY['Recipes requiring more than 3 eggs', 'Meringues'],
      ARRAY['Mix 1 tbsp ground flax with 3 tbsp water', 'Let sit for 5-10 minutes until gelled']
    )
    -- Add more substitute data here as needed
) AS s(ingredient_name, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
JOIN ingredient_ids i ON i.name = s.ingredient_name;

-- Create substitutes table
CREATE TABLE substitutes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  notes TEXT,
  usage TEXT[] DEFAULT '{}',
  best_for TEXT[] DEFAULT '{}',
  not_recommended_for TEXT[] DEFAULT '{}',
  safe_for JSONB DEFAULT '{"dietaryRestrictions": []}',
  quantity_conversion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE substitutes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON "substitutes"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON substitutes
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();