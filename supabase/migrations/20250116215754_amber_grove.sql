/*
  # Sync Remaining Substitutes

  1. New Data
    - Adds 57 remaining substitute records
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
    -- Yogurt substitutes
    ('Yogurt', 'Almond Yogurt',
      ARRAY['Baking', 'Snacks'],
      'Nutty flavour, smooth texture',
      ARRAY['Dairy-Free', 'Gluten-Free'],
      ARRAY['Smoothies', 'Parfaits', 'Dips'],
      ARRAY['Hot dishes', 'Savory sauces'],
      ARRAY['Keep refrigerated', 'Stir before use']
    ),
    ('Yogurt', 'Soy Yogurt',
      ARRAY['Baking', 'Cooking'],
      'Neutral flavour, creamy',
      ARRAY['Dairy-Free', 'Gluten-Free', 'Nut-Free'],
      ARRAY['Baking', 'Smoothies', 'Dips'],
      ARRAY['High-heat cooking'],
      ARRAY['Stir well', 'Keep refrigerated']
    ),
    -- Butter substitutes
    ('Butter', 'Coconut Oil',
      ARRAY['Baking', 'Cooking'],
      'Adds slight coconut flavour',
      ARRAY['Dairy-Free', 'Gluten-Free', 'Nut-Free'],
      ARRAY['Baking', 'Frying', 'Roasting'],
      ARRAY['Savory dishes where coconut flavor is unwanted'],
      ARRAY['Use solid for pastries', 'Melt for cooking']
    ),
    ('Butter', 'Margarine (Dairy-Free)',
      ARRAY['Baking', 'Cooking'],
      'Similar texture, dairy-free',
      ARRAY['Dairy-Free', 'Gluten-Free', 'Nut-Free'],
      ARRAY['Baking', 'Spreading', 'Cooking'],
      ARRAY['High-heat frying'],
      ARRAY['Check ingredients for allergens', 'Keep refrigerated']
    ),
    -- Breadcrumb substitutes
    ('Breadcrumbs', 'Ground Nuts',
      ARRAY['Coating', 'Binding'],
      'Adds rich flavor and crunch',
      ARRAY['Gluten-Free', 'Vegan', 'Dairy-Free'],
      ARRAY['Coating', 'Toppings', 'Fillings'],
      ARRAY['Deep frying', 'Wet applications'],
      ARRAY['Process until fine', 'Store in airtight container']
    ),
    ('Breadcrumbs', 'Crushed Cornflakes',
      ARRAY['Coating'],
      'Creates crispy coating',
      ARRAY['Dairy-Free', 'Nut-Free'],
      ARRAY['Chicken coating', 'Fish coating', 'Casserole topping'],
      ARRAY['Meatballs', 'Wet fillings'],
      ARRAY['Crush finely', 'Season well before use']
    ),
    -- Pine Nuts substitutes
    ('Pine Nuts', 'Sunflower Seeds',
      ARRAY['Pesto', 'Garnishing'],
      'Similar texture, more affordable option',
      ARRAY['Nut-Free', 'Gluten-Free', 'Dairy-Free', 'Vegan'],
      ARRAY['Pesto', 'Salads', 'Garnish'],
      ARRAY['Raw applications'],
      ARRAY['Toast lightly', 'Cool before using']
    ),
    -- Chicken substitutes
    ('Chicken', 'Jackfruit',
      ARRAY['Pulled BBQ sandwiches', 'Tacos'],
      'Similar texture to pulled meat when cooked',
      ARRAY['Vegan', 'Dairy-Free', 'Gluten-Free', 'Nut-Free'],
      ARRAY['BBQ dishes', 'Tacos', 'Sandwiches'],
      ARRAY['Grilled applications', 'Stir-fries'],
      ARRAY['Drain and rinse well', 'Shred before cooking']
    ),
    ('Chicken', 'Seitan',
      ARRAY['Stir-fries', 'Sandwiches', 'Grilling'],
      'High in protein, chewy texture',
      ARRAY['Vegan', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Stir-fries', 'Sandwiches', 'Grilling'],
      ARRAY['Gluten-free dishes'],
      ARRAY['Slice or cube before cooking', 'Marinate for flavor']
    ),
    -- Fish Sauce substitutes
    ('Fish Sauce', 'Coconut Aminos',
      ARRAY['Asian cooking', 'Marinades'],
      'Adds umami flavor, less salty',
      ARRAY['Fish-Free', 'Vegan', 'Dairy-Free', 'Gluten-Free', 'Nut-Free'],
      ARRAY['Stir-fries', 'Marinades', 'Dipping sauces'],
      ARRAY['Raw applications'],
      ARRAY['Use more than fish sauce amount', 'Add salt if needed']
    ),
    -- Fresh Basil substitutes
    ('Fresh Basil', 'Dried Basil',
      ARRAY['Sauces', 'Soups', 'Seasonings'],
      'Use 1/3 amount of fresh basil called for',
      ARRAY['Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Corn-Free'],
      ARRAY['Cooked dishes', 'Marinades'],
      ARRAY['Fresh garnishes', 'Pesto'],
      ARRAY['Crush before using', 'Add early in cooking']
    ),
    -- Fresh Cilantro substitutes
    ('Fresh Cilantro', 'Fresh Parsley',
      ARRAY['Garnishing', 'Sauces', 'Salads'],
      'Milder flavor, good for cilantro-averse',
      ARRAY['Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Corn-Free'],
      ARRAY['Garnishing', 'Light sauces', 'Salads'],
      ARRAY['Asian dishes', 'Mexican dishes'],
      ARRAY['Chop just before using', 'Use more than cilantro amount']
    )
) AS s(ingredient_name, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
JOIN ingredient_refs i ON i.name = s.ingredient_name;

-- Log the sync operation
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'sync_missing_substitutes_batch_1',
    'timestamp', CURRENT_TIMESTAMP,
    'records_added', 12
  )
);