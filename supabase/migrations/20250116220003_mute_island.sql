/*
  # Add More Missing Substitutes

  1. New Data
    - Adds more substitute records for existing ingredients
    - Includes complete data for each substitute:
      - Usage instructions
      - Safety information
      - Best practices
      - Preparation steps
  
  2. Data Integrity
    - References existing ingredients
    - Maintains consistent data structure
    - Includes all required fields
*/

-- Add more substitutes for existing ingredients
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
    -- Tomatoes substitutes
    ('Tomatoes', 'Beet Puree',
      ARRAY['Sauces', 'Soups', 'Color'],
      'Adds natural red color and sweetness',
      ARRAY['Nightshade-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Color enhancement', 'Natural sweetness', 'Moisture'],
      ARRAY['Raw applications', 'Dishes where sweetness is unwanted'],
      ARRAY['Steam or roast beets until tender', 'Puree until smooth', 'Strain if needed']
    ),
    -- Potatoes substitutes
    ('Potatoes', 'Cauliflower',
      ARRAY['Mashing', 'Roasting', 'Gratins'],
      'Great low-carb option, similar texture when mashed',
      ARRAY['Nightshade-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Mashed potato substitute', 'Low-carb dishes', 'Creamy soups'],
      ARRAY['Crispy applications', 'French fries'],
      ARRAY['Steam until very tender', 'Drain well', 'Season generously']
    ),
    ('Potatoes', 'Celery Root',
      ARRAY['Mashing', 'Roasting', 'Soups'],
      'Subtle celery flavor, creamy when cooked',
      ARRAY['Nightshade-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Mashed dishes', 'Roasted vegetables', 'Soups'],
      ARRAY['Crispy applications', 'Sweet dishes'],
      ARRAY['Peel thoroughly', 'Cut into even pieces', 'Cook until tender']
    ),
    -- Bell Peppers substitutes
    ('Bell Peppers', 'Celery',
      ARRAY['Stir-fries', 'Salads', 'Crudités'],
      'Adds crunch and fresh flavor',
      ARRAY['Nightshade-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Raw dishes', 'Stir-fries', 'Soups'],
      ARRAY['Roasted dishes', 'Color-dependent recipes'],
      ARRAY['Slice evenly', 'Remove strings if desired', 'Use fresh']
    ),
    ('Bell Peppers', 'Radishes',
      ARRAY['Salads', 'Stir-fries', 'Raw snacks'],
      'Adds spicy crunch and color',
      ARRAY['Nightshade-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Fresh salads', 'Garnishes', 'Quick pickles'],
      ARRAY['Long-cooking dishes', 'Sweet applications'],
      ARRAY['Wash well', 'Trim ends', 'Slice just before using']
    ),
    -- Eggplant substitutes
    ('Eggplant', 'Mushrooms',
      ARRAY['Grilling', 'Roasting', 'Stews'],
      'Meaty texture, great for vegetarian dishes',
      ARRAY['Nightshade-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Grilled dishes', 'Stir-fries', 'Meat substitutes'],
      ARRAY['Crispy applications', 'Sweet dishes'],
      ARRAY['Clean with damp cloth', 'Slice evenly', 'Cook until moisture releases']
    ),
    ('Eggplant', 'Zucchini',
      ARRAY['Grilling', 'Baking', 'Pasta dishes'],
      'Mild flavor, works well in layered dishes',
      ARRAY['Nightshade-Free', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Grilled vegetables', 'Pasta dishes', 'Ratatouille'],
      ARRAY['Deep frying', 'Heavy sauces'],
      ARRAY['Salt to remove excess moisture', 'Cut uniformly', 'Don''t overcook']
    ),
    -- Dates substitutes
    ('Dates', 'Dried Figs',
      ARRAY['Baking', 'Natural sweetener'],
      'Similar sweetness and texture',
      ARRAY['Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Natural sweetening', 'Baked goods', 'Energy balls'],
      ARRAY['Smooth purees', 'Light colored dishes'],
      ARRAY['Remove stems', 'Chop if needed', 'Soak if hard']
    ),
    ('Dates', 'Prunes',
      ARRAY['Baking', 'Smoothies'],
      'Good binding properties, natural sweetness',
      ARRAY['Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Baked goods', 'Natural sweetener', 'Binding'],
      ARRAY['Light colored dishes', 'Delicate flavors'],
      ARRAY['Chop if needed', 'Soak if firm', 'Puree for smooth texture']
    ),
    -- Bananas substitutes
    ('Bananas', 'Applesauce',
      ARRAY['Baking', 'Binding'],
      'Good moisture addition in baking',
      ARRAY['Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Moist baked goods', 'Fat replacement', 'Binding'],
      ARRAY['Banana bread', 'Frozen desserts'],
      ARRAY['Use unsweetened variety', 'Reduce liquid in recipe', 'Adjust sweetener']
    ),
    ('Bananas', 'Pumpkin Puree',
      ARRAY['Baking', 'Smoothies'],
      'Adds moisture and nutrients',
      ARRAY['Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
      ARRAY['Moist baked goods', 'Smoothies', 'Pancakes'],
      ARRAY['Sweet desserts', 'No-bake recipes'],
      ARRAY['Use pure pumpkin', 'Drain if watery', 'Season appropriately']
    )
) AS s(ingredient_name, name, usage, notes, safe_for, best_for, not_recommended_for, preparation_steps)
JOIN ingredient_refs i ON i.name = s.ingredient_name;

-- Log the sync operation
INSERT INTO sync_log (status, details)
VALUES (
  'success',
  jsonb_build_object(
    'operation', 'sync_missing_substitutes_batch_2',
    'timestamp', CURRENT_TIMESTAMP,
    'records_added', 11
  )
);