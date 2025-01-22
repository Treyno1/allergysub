import fs from 'fs';
import path from 'path';

// CSV data structure
interface CSVRow {
  ID: string;
  Category: string;
  'Ingredient Name': string;
  'Allergen/Diet Restriction': string;
  'Substitute Name': string;
  'Substitute Usage': string;
  Notes: string;
  'Safe For': string;
}

// Read CSV content
const csvContent = `ID,Category,Ingredient Name,Allergen/Diet Restriction,Substitute Name,Substitute Usage,Notes,Safe For
1,Dairy,Milk,Dairy,Almond Milk,"Baking, cooking","Nutty flavour, creamy texture","Dairy-Free, Gluten-Free"
2,Dairy,Milk,Dairy,Oat Milk,"Baking, cooking","Mild flavour, works well in coffee","Dairy-Free, Nut-Free"
3,Dairy,Milk,Dairy,Coconut Milk,"Soups, sauces","Adds creaminess, slight coconut taste","Dairy-Free, Nut-Free"`;

// Parse CSV data
const csvRows: CSVRow[] = csvContent
  .split('\n')
  .slice(1) // Skip header
  .map(row => {
    const [ID, Category, IngredientName, AllergenRestriction, SubstituteName, SubstituteUsage, Notes, SafeFor] = row.split(',').map(field => field.trim());
    return {
      ID,
      Category,
      'Ingredient Name': IngredientName,
      'Allergen/Diet Restriction': AllergenRestriction,
      'Substitute Name': SubstituteName,
      'Substitute Usage': SubstituteUsage.replace(/^"|"$/g, ''), // Remove quotes
      Notes: Notes.replace(/^"|"$/g, ''),
      'Safe For': SafeFor
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
    
    csvRows.forEach(csvRow => {
      const searchIngredient = csvRow['Ingredient Name'];
      const searchSubstitute = csvRow['Substitute Name'];
      
      // Create regex pattern to find the specific ingredient and substitute combination
      const pattern = new RegExp(
        `('Ingredient Name': '${searchIngredient}'[\\s\\S]*?'Substitute Name': '${searchSubstitute}'[\\s\\S]*?)'Substitute Usage': ''`,
        'g'
      );
      
      // Replace empty Substitute Usage with CSV data
      content = content.replace(pattern, `$1'Substitute Usage': '${csvRow['Substitute Usage']}'`);
    });
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filename}`);
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
  }
});

console.log('Finished updating all ingredient files.');