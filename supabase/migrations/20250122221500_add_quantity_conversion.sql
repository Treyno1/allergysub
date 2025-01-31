-- Add the quantity_conversion column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'substitutes'
        AND column_name = 'quantity_conversion'
    ) THEN
        ALTER TABLE substitutes ADD COLUMN quantity_conversion TEXT;
    END IF;
END $$;

-- Add comment to the column
COMMENT ON COLUMN substitutes.quantity_conversion IS 'Precise measurements for substituting ingredients (e.g., "1 cup = 240ml")';

-- Populate with initial conversion data
UPDATE substitutes s
SET quantity_conversion = CASE 
    -- Dairy Alternatives
    WHEN s.name = 'Almond Milk' THEN '1 cup almond milk = 1 cup milk (240ml)'
    WHEN s.name = 'Oat Milk' THEN '1 cup oat milk = 1 cup milk (240ml)'
    WHEN s.name = 'Coconut Milk' THEN '1 cup coconut milk = 1 cup milk (240ml). For heavy cream replacement, use full-fat coconut milk'
    WHEN s.name = 'Greek Yogurt' AND EXISTS (SELECT 1 FROM ingredients i WHERE i.id = s.ingredient_id AND i.name = 'Sour Cream') 
        THEN '1 cup Greek yogurt = 1 cup sour cream (240ml)'
    
    -- Flour Alternatives
    WHEN s.name = 'Rice Flour' THEN '75g rice flour + 25g cornstarch = 100g wheat flour'
    WHEN s.name = 'Almond Flour' THEN '120g almond flour = 100g wheat flour. Reduce liquid in recipe by 10%'
    WHEN s.name = 'Oat Flour' THEN '100g oat flour = 100g wheat flour. Add 1/2 tsp xanthan gum per cup for better binding'
    
    -- Egg Substitutes
    WHEN s.name = 'Flax Egg' THEN '1 egg = 1 tbsp (7g) ground flaxseed + 3 tbsp (45ml) water'
    WHEN s.name = 'Chia Egg' THEN '1 egg = 1 tbsp (12g) chia seeds + 3 tbsp (45ml) water'
    WHEN s.name = 'Mashed Banana' THEN '1 egg = 1/4 cup (60g) mashed ripe banana'
    WHEN s.name = 'Silken Tofu' THEN '1 egg = 1/4 cup (60g) blended silken tofu'
    
    -- Butter Alternatives
    WHEN s.name = 'Coconut Oil' THEN '1 cup butter = 1 cup coconut oil (225g). Use solid coconut oil for baking'
    WHEN s.name = 'Applesauce' THEN '1 cup butter = 3/4 cup (180ml) unsweetened applesauce. Best for moist baked goods'
    
    -- Sweetener Alternatives
    WHEN s.name = 'Honey' THEN '1 cup sugar = 3/4 cup (180ml) honey. Reduce liquid in recipe by 1/4 cup per cup of honey'
    WHEN s.name = 'Maple Syrup' THEN '1 cup sugar = 3/4 cup (180ml) maple syrup. Reduce liquid in recipe by 3 tbsp per cup'
    
    -- Condiment Substitutes
    WHEN s.name = 'Greek Yogurt' AND EXISTS (SELECT 1 FROM ingredients i WHERE i.id = s.ingredient_id AND i.name = 'Mayonnaise')
        THEN '1 cup mayonnaise = 1 cup Greek yogurt (240ml). Best for dips and dressings'
    WHEN s.name = 'Coconut Aminos' THEN '1 tbsp soy sauce = 1 tbsp coconut aminos (15ml). Slightly sweeter than soy sauce'
    WHEN s.name = 'Nutritional Yeast' THEN '1 cup grated parmesan = 3/4 cup (45g) nutritional yeast'
    
    -- Default case
    ELSE '1:1 ratio - Use the same amount as the original ingredient'
END
WHERE quantity_conversion IS NULL;

-- Log the migration
INSERT INTO sync_log (status, details)
VALUES (
    'success',
    jsonb_build_object(
        'operation', 'add_and_populate_quantity_conversion',
        'timestamp', CURRENT_TIMESTAMP,
        'details', 'Added quantity_conversion column and populated initial data'
    )
); 