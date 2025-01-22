import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Complete dataset with all Substitute Usage fields filled
const csvData = `ID,Category,Ingredient Name,Allergen/Diet Restriction,Substitute Name,Substitute Usage,Notes,Safe For
1,Dairy,Milk,Dairy,Almond Milk,"Baking, cooking","Nutty flavour, creamy texture","Dairy-Free, Gluten-Free"
2,Dairy,Milk,Dairy,Oat Milk,"Baking, cooking","Mild flavour, works well in coffee","Dairy-Free, Nut-Free"
3,Dairy,Milk,Dairy,Coconut Milk,"Soups, sauces","Adds creaminess, slight coconut taste","Dairy-Free, Nut-Free"
4,Dairy,Cheese,Dairy,Nutritional Yeast,"Cooking, toppings","Cheesy flavour, vegan option","Dairy-Free, Gluten-Free, Vegan"
5,Dairy,Cheese,Dairy,Cashew Cheese,"Spreads, sauces","Creamy, mild cheese flavour","Dairy-Free, Gluten-Free"
6,Dairy,Cheese,Dairy,Tofu (Silken),"Sauces, creamy dishes","Mild flavour, creamy texture","Dairy-Free, Gluten-Free, Nut-Free, Vegan"
7,Dairy,Butter,Dairy,Olive Oil,"Baking, cooking","Works for frying, different texture","Dairy-Free, Gluten-Free, Nut-Free, Vegan"
8,Egg,Eggs,Egg,Ground Flaxseed,"Baking (binding)","Mix with water, mild taste","Egg-Free, Dairy-Free, Gluten-Free, Vegan"
9,Egg,Eggs,Egg,Chia Seeds,"Baking (binding)","Gel-like when mixed with water","Egg-Free, Dairy-Free, Gluten-Free, Vegan"
10,Egg,Eggs,Egg,Mashed Banana,"Baking (moisture)","Adds moisture, mild sweetness","Egg-Free, Dairy-Free, Gluten-Free, Vegan"
11,Egg,Eggs,Egg,Applesauce,"Baking (moisture)","Good for moisture, mild taste","Egg-Free, Dairy-Free, Gluten-Free, Vegan"
12,Egg,Eggs,Egg,Silken Tofu,"Baking, cooking","Good for texture, mild taste","Egg-Free, Dairy-Free, Gluten-Free, Vegan"
13,Grains-Gluten,Wheat Flour,Gluten,Almond Flour,"Baking, coating","Rich in protein, great for cookies and cakes","Gluten-Free, Vegan, Dairy-Free"
14,Grains-Gluten,Wheat Flour,Gluten,Coconut Flour,"Baking","Very absorbent, use 1/4 amount of regular flour","Gluten-Free, Vegan, Dairy-Free, Nut-Free"
15,Grains-Gluten,Wheat Flour,Gluten,Rice Flour,"Baking, thickening","Light texture, good for crispy batters","Gluten-Free, Vegan, Dairy-Free, Nut-Free"
16,Grains-Gluten,Breadcrumbs,Gluten,Ground Nuts,"Coating, binding","Adds rich flavor and crunch","Gluten-Free, Vegan, Dairy-Free"
17,Grains-Gluten,Breadcrumbs,Gluten,Crushed Cornflakes,"Coating","Creates crispy coating","Dairy-Free, Nut-Free"
18,Nuts-Seeds,Peanut Butter,Nuts,Sunflower Seed Butter,"Spreading, baking","Similar consistency to peanut butter","Nut-Free, Gluten-Free, Dairy-Free, Vegan"
19,Nuts-Seeds,Peanut Butter,Nuts,Pumpkin Seed Butter,"Spreading, baking","Rich in nutrients, slightly green color","Nut-Free, Gluten-Free, Dairy-Free, Vegan"
20,Nuts-Seeds,Pine Nuts,Nuts,Sunflower Seeds,"Pesto, garnishing","Similar texture, more affordable option","Nut-Free, Gluten-Free, Dairy-Free, Vegan"
21,Meat,Ground Beef,Meat,Textured Vegetable Protein (TVP),"Tacos, burgers, casseroles","Rehydrate before using, absorbs flavors well","Vegan, Dairy-Free, Gluten-Free, Nut-Free"
22,Meat,Ground Beef,Meat,Lentils,"Tacos, sloppy joes, pasta sauce","High in protein and fiber, hearty texture","Vegan, Dairy-Free, Gluten-Free, Nut-Free"
23,Meat,Chicken,Meat,Jackfruit,"Pulled BBQ sandwiches, tacos","Similar texture to pulled meat when cooked","Vegan, Dairy-Free, Gluten-Free, Nut-Free"
24,Meat,Chicken,Meat,Seitan,"Stir-fries, sandwiches, grilling","High in protein, chewy texture","Vegan, Dairy-Free, Nut-Free"
25,Fish-Seafood,Tuna,Fish,Mashed Chickpeas,"Sandwiches, salads, wraps","Similar texture when mashed, great with mayo","Fish-Free, Vegan, Dairy-Free, Gluten-Free, Nut-Free"
26,Fish-Seafood,Fish Sauce,Fish,Coconut Aminos,"Asian cooking, marinades","Adds umami flavor, less salty","Fish-Free, Vegan, Dairy-Free, Gluten-Free, Nut-Free"
27,Fish-Seafood,Salmon,Fish,Marinated Carrots,"Sushi rolls, cold preparations","Can mimic smoked salmon texture and color","Fish-Free, Vegan, Dairy-Free, Gluten-Free, Nut-Free"
34,Herbs-Spices,Fresh Basil,None,Dried Basil,"Sauces, soups, seasonings","Use 1/3 amount of fresh basil called for","Vegan, Gluten-Free, Dairy-Free, Nut-Free, Corn-Free"
35,Herbs-Spices,Fresh Cilantro,None,Fresh Parsley,"Garnishing, sauces, salads","Milder flavor, good for cilantro-averse","Vegan, Gluten-Free, Dairy-Free, Nut-Free, Corn-Free"
36,Vegetables,Tomatoes,Nightshade,Pumpkin Puree,"Sauces, soups","Good base for nightshade-free pasta sauce","Nightshade-Free, Vegan, Gluten-Free, Dairy-Free, Nut-Free"
37,Vegetables,Tomatoes,Nightshade,Beet Puree,"Sauces, soups, color","Adds natural red color and sweetness","Nightshade-Free, Vegan, Gluten-Free, Dairy-Free, Nut-Free"
38,Vegetables,Potatoes,Nightshade,Cauliflower,"Mashing, roasting, gratins","Great low-carb option, similar texture when mashed","Nightshade-Free, Vegan, Gluten-Free, Dairy-Free, Nut-Free"
39,Vegetables,Potatoes,Nightshade,Celery Root,"Mashing, roasting, soups","Subtle celery flavor, creamy when cooked","Nightshade-Free, Vegan, Gluten-Free, Dairy-Free, Nut-Free"
40,Vegetables,Bell Peppers,Nightshade,Celery,"Stir-fries, salads, crudités","Adds crunch and fresh flavor","Nightshade-Free, Vegan, Gluten-Free, Dairy-Free, Nut-Free"
41,Vegetables,Bell Peppers,Nightshade,Radishes,"Salads, stir-fries, raw snacks","Adds spicy crunch and color","Nightshade-Free, Vegan, Gluten-Free, Dairy-Free, Nut-Free"
42,Vegetables,Eggplant,Nightshade,Mushrooms,"Grilling, roasting, stews","Meaty texture, great for vegetarian dishes","Nightshade-Free, Vegan, Gluten-Free, Dairy-Free, Nut-Free"
43,Vegetables,Eggplant,Nightshade,Zucchini,"Grilling, baking, pasta dishes","Mild flavor, works well in layered dishes","Nightshade-Free, Vegan, Gluten-Free, Dairy-Free, Nut-Free"
44,Fruit,Citrus Fruits,Citrus,Apple Cider Vinegar,"Dressings, marinades, flavor enhancer","Adds acidity and brightness to dishes","Citrus-Free, Vegan, Gluten-Free, Dairy-Free, Nut-Free"
45,Fruit,Citrus Fruits,Citrus,Sumac,"Seasoning, garnish","Middle Eastern spice with tart, lemony flavor","Citrus-Free, Vegan, Gluten-Free, Dairy-Free, Nut-Free"
46,Fruit,Citrus Fruits,Citrus,Verjus,"Cooking, dressings","Made from unripe grapes, adds bright acidity","Citrus-Free, Vegan, Gluten-Free, Dairy-Free, Nut-Free"
47,Fruit,Dates,None,Dried Figs,"Baking, natural sweetener","Similar sweetness and texture","Vegan, Gluten-Free, Dairy-Free, Nut-Free"
48,Fruit,Dates,None,Prunes,"Baking, smoothies","Good binding properties, natural sweetness","Vegan, Gluten-Free, Dairy-Free, Nut-Free"
49,Fruit,Bananas,None,Applesauce,"Baking, binding","Good moisture addition in baking","Vegan, Gluten-Free, Dairy-Free, Nut-Free"
50,Fruit,Bananas,None,Pumpkin Puree,"Baking, smoothies","Adds moisture and nutrients","Vegan, Gluten-Free, Dairy-Free, Nut-Free"
51,Sweeteners,Brown Sugar,Refined Sugar,Coconut Sugar,"Baking, cooking","Rich, caramel-like flavor","Refined-Sugar-Free, Gluten-Free, Dairy-Free, Vegan"
52,Sweeteners,Brown Sugar,Refined Sugar,Date Sugar,"Baking, sprinkling, oatmeal topping","Made from ground dates, natural alternative","Refined-Sugar-Free, Gluten-Free, Dairy-Free, Vegan"
61,Caffeine,Coffee,Caffeine,Dandelion Root Tea,"Hot beverages","Rich, roasted flavor similar to coffee","Caffeine-Free, Vegan, Gluten-Free, Dairy-Free, Nut-Free"
62,Caffeine,Coffee,Caffeine,Roasted Carob,"Hot beverages, baking","Natural sweetness, chocolate-like flavor","Caffeine-Free, Vegan, Gluten-Free, Dairy-Free, Nut-Free"
63,Caffeine,Black Tea,Caffeine,Rooibos Tea,"Hot/cold beverages","Naturally sweet, red color","Caffeine-Free, Vegan, Gluten-Free, Dairy-Free, Nut-Free"
64,Caffeine,Black Tea,Caffeine,Honeybush Tea,"Hot/cold beverages","Sweet, honey-like flavor","Caffeine-Free, Vegan, Gluten-Free, Dairy-Free, Nut-Free"
65,Caffeine,Coffee,Caffeine,Chicory Root Coffee,"Hot beverages","Coffee-like flavor, caffeine-free","Caffeine-Free, Vegan, Gluten-Free, Dairy-Free, Nut-Free"
71,Thickeners,Guar Gum,None,Locust Bean Gum,"Ice cream, sauces, dressings","Natural thickener, prevents ice crystals","Vegan, Gluten-Free, Dairy-Free, Nut-Free, Corn-Free"
72,Thickeners,Modified Food Starch,Corn,Kudzu Root Starch,"Sauces, gravies, soups","Traditional Asian thickener, very pure","Corn-Free, Vegan, Gluten-Free, Dairy-Free, Nut-Free"
73,Thickeners,Eggs (as thickener),Eggs,Aquafaba,"Meringues, mousses, binding","Chickpea liquid, whips like egg whites","Egg-Free, Vegan, Gluten-Free, Dairy-Free, Nut-Free"
74,Thickeners,Gelatin,Animal Product,Irish Moss,"Desserts, smoothies, puddings","Seaweed-based, rich in minerals","Vegan, Gluten-Free, Dairy-Free, Nut-Free, Corn-Free"
75,Thickeners,Cornstarch,Corn,Sweet Rice Flour,"Asian dishes, sauces, coating","Very starchy, excellent thickening power","Corn-Free, Vegan, Dairy-Free, Nut-Free"`;

// Parse CSV data
const rows = csvData.split('\n')
  .slice(1) // Skip header
  .map(line => {
    const [id, category, ingredientName, allergen, substituteName, substituteUsage, notes, safeFor] = line.split(',').map(col => col.trim().replace(/^"|"$/g, ''));
    return {
      id,
      category,
      ingredientName,
      allergen,
      substituteName,
      substituteUsage,
      notes,
      safeFor
    };
  });

// Process each ingredient file
const ingredientFiles = [
  'dairy.ts',
  'eggs.ts',
  'fish.ts',
  'meat.ts',
  'nuts.ts',
  'grains.ts',
  'fruit.ts',
  'herbs.ts',
  'caffeine.ts',
  'sweeteners.ts',
  'thickeners.ts',
  'vegetables.ts'
];

ingredientFiles.forEach(filename => {
  const filePath = path.join(__dirname, '../src/data/ingredients', filename);
  
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    
    rows.forEach(row => {
      const pattern = new RegExp(
        `('Ingredient Name': '${row.ingredientName}'[\\s\\S]*?'Substitute Name': '${row.substituteName}'[\\s\\S]*?)'Substitute Usage': ['"].*?['"]`,
        'g'
      );
      
      const newContent = content.replace(pattern, (match, prefix) => {
        modified = true;
        return `${prefix}'Substitute Usage': '${row.substituteUsage}'`;
      });

      if (newContent !== content) {
        content = newContent;
        console.log(`Updated ${row.ingredientName} -> ${row.substituteName} with usage: ${row.substituteUsage}`);
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated ${filename}`);
    }
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
  }
});

console.log('Finished updating all ingredient files.');