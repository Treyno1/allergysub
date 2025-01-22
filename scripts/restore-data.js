import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read the CSV data from the provided content
const csvData = `ID,Category,Ingredient Name,Allergen/Diet Restriction,Substitute Name,Substitute Usage,Notes,Safe For
1,Dairy,Milk,Dairy,Almond Milk,"Baking, cooking","Nutty flavour, creamy texture","Dairy-Free, Gluten-Free"
2,Dairy,Milk,Dairy,Oat Milk,"Baking, cooking","Mild flavour, works well in coffee","Dairy-Free, Nut-Free"
3,Dairy,Milk,Dairy,Coconut Milk,"Soups, sauces","Adds creaminess, slight coconut taste","Dairy-Free, Nut-Free"
4,Dairy,Cheese,Dairy,Nutritional Yeast,"Cooking, toppings","Cheesy flavour, vegan option","Dairy-Free, Gluten-Free, Vegan"`;

// Parse CSV into structured data
const rows = csvData.split('\n')
  .slice(1) // Skip header
  .map(line => {
    const columns = line.split(',').map(col => col.trim().replace(/^"|"$/g, ''));
    return {
      id: columns[0],
      category: columns[1],
      ingredientName: columns[2],
      allergen: columns[3],
      substituteName: columns[4],
      substituteUsage: columns[5],
      notes: columns[6],
      safeFor: columns[7]
    };
  });

// Update each ingredient file
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
    
    rows.forEach(row => {
      // Create pattern to match the ingredient and substitute combination
      const pattern = new RegExp(
        `('Ingredient Name': '${row.ingredientName}'[\\s\\S]*?'Substitute Name': '${row.substituteName}'[\\s\\S]*?)'Substitute Usage': ['"].*?['"]`,
        'g'
      );
      
      // Replace Substitute Usage while preserving other fields
      content = content.replace(
        pattern,
        `$1'Substitute Usage': '${row.substituteUsage}'`
      );
    });
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filename}`);
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
  }
});

console.log('Finished updating all ingredient files.');