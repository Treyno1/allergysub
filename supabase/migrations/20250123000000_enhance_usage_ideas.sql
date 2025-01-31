/*
  # Enhance Usage Ideas and Recipes

  1. Update Data
    - Add detailed usage ideas and recipes for each substitute
    - Include practical applications and cooking tips
    - Provide context for best uses
  
  2. Data Structure
    - Updates existing records
    - Maintains data integrity
*/

-- Update usage ideas and recipes for substitutes
UPDATE substitutes
SET 
  usage = CASE
    -- Dairy Substitutes
    WHEN name = 'Almond Milk' THEN 
      ARRAY['Use in coffee or tea for a nutty flavor', 'Perfect for smoothies and protein shakes', 'Great in overnight oats', 'Use in pancake or waffle batter', 'Ideal for dairy-free béchamel sauce']
    WHEN name = 'Oat Milk' THEN 
      ARRAY['Best choice for coffee drinks - creates perfect foam', 'Excellent in breakfast cereals', 'Use in creamy soups', 'Perfect for baked goods like muffins and cakes', 'Great for golden milk or hot chocolate']
    WHEN name = 'Coconut Milk' THEN 
      ARRAY['Perfect for curry dishes', 'Use in tropical smoothies', 'Great for dairy-free ice cream', 'Ideal for creamy soups', 'Use in coconut-based desserts']
    WHEN name = 'Cashew Cream' THEN 
      ARRAY['Blend into creamy pasta sauces', 'Use as a base for dairy-free dips', 'Perfect for vegan cheesecakes', 'Great in cream-based soups', 'Use as a heavy cream replacement in desserts']
    
    -- Egg Substitutes
    WHEN name = 'Flax Egg' THEN 
      ARRAY['Perfect for binding in cookies and bars', 'Great in hearty muffins and quick breads', 'Use in veggie burgers as a binder', 'Works well in pancakes and waffles', 'Ideal for dense, moist baked goods']
    WHEN name = 'Chia Egg' THEN 
      ARRAY['Excellent in breakfast bars and granola', 'Perfect for muffins and quick breads', 'Use in pancake batter', 'Great for binding veggie burgers', 'Works well in dense cakes']
    WHEN name = 'Mashed Banana' THEN 
      ARRAY['Perfect for sweet breakfast breads', 'Great in chocolate baked goods', 'Use in oatmeal cookies', 'Excellent in pancakes and waffles', 'Works well in brownies']
    
    -- Flour Substitutes
    WHEN name = 'Almond Flour' THEN 
      ARRAY['Perfect for cookies and shortbread', 'Great for coating chicken or fish', 'Use in low-carb pizza crusts', 'Excellent in fruit crisps and crumbles', 'Works well in quick breads']
    WHEN name = 'Coconut Flour' THEN 
      ARRAY['Use in keto-friendly baked goods', 'Perfect for grain-free muffins', 'Great for coating shrimp or fish', 'Use in paleo pancakes', 'Works well in protein bars']
    
    -- Protein Substitutes
    WHEN name = 'Jackfruit' THEN 
      ARRAY['Perfect for pulled "pork" sandwiches', 'Use in tacos and burritos', 'Great in stir-fries', 'Works well in curry dishes', 'Use in grain bowls']
    WHEN name = 'Tempeh' THEN 
      ARRAY['Excellent marinated and grilled', 'Perfect for stir-fries', 'Use in sandwiches and wraps', 'Great crumbled in chili', 'Works well in pasta dishes']
    
    -- Condiment Substitutes
    WHEN name = 'Nutritional Yeast' THEN 
      ARRAY['Perfect for cheese-free pasta dishes', 'Use as a popcorn topping', 'Great in vegan cheese sauces', 'Excellent in scrambled tofu', 'Add to roasted vegetables']
    WHEN name = 'Coconut Aminos' THEN 
      ARRAY['Use in stir-fries and marinades', 'Perfect for dipping sauces', 'Great in salad dressings', 'Use in noodle dishes', 'Excellent in marinades']
    
    ELSE usage
  END,
  
  best_for = CASE
    -- Dairy Substitutes
    WHEN name = 'Almond Milk' THEN 
      ARRAY['Sweet breakfast recipes', 'Cold beverages', 'Baking cakes and cookies', 'Creamy sauces', 'Smoothies and shakes']
    WHEN name = 'Oat Milk' THEN 
      ARRAY['Coffee drinks and lattes', 'Creamy soups', 'Baked goods', 'Breakfast cereals', 'Savory sauces']
    
    -- Egg Substitutes
    WHEN name = 'Flax Egg' THEN 
      ARRAY['Dense baked goods', 'Hearty breads', 'Cookies and bars', 'Veggie burgers', 'Pancakes']
    WHEN name = 'Chia Egg' THEN 
      ARRAY['Breakfast baked goods', 'Quick breads', 'Granola bars', 'Dense cakes', 'Whole grain recipes']
    
    -- Flour Substitutes
    WHEN name = 'Almond Flour' THEN 
      ARRAY['Cookies and bars', 'Coating for proteins', 'Low-carb baking', 'Crumbles and crusts', 'Quick breads']
    
    -- Protein Substitutes
    WHEN name = 'Jackfruit' THEN 
      ARRAY['Pulled meat alternatives', 'Tacos and burritos', 'Asian-inspired dishes', 'Sandwiches', 'Grain bowls']
    
    ELSE best_for
  END,
  
  notes = CASE
    WHEN name = 'Almond Milk' THEN 'Light and nutty flavor, perfect for both sweet and savory recipes. Choose unsweetened for cooking.'
    WHEN name = 'Oat Milk' THEN 'Creamy and naturally sweet, makes excellent foam for coffee drinks. Best dairy-free milk for baking.'
    WHEN name = 'Flax Egg' THEN 'Adds a subtle nutty flavor and extra nutrition. Works best in recipes calling for 1-2 eggs.'
    WHEN name = 'Jackfruit' THEN 'Young jackfruit has a meat-like texture when cooked. Best when well-seasoned and simmered in sauce.'
    WHEN name = 'Nutritional Yeast' THEN 'Adds a savory, cheesy flavor. Rich in B vitamins and protein. Start with small amounts and adjust to taste.'
    ELSE notes
  END
WHERE usage IS NOT NULL; 