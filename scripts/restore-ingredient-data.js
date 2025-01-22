import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read the CSV data
const csvContent = fs.readFileSync(path.join(__dirname, '../data/substitutes.csv'), 'utf-8');

// Parse CSV data
const rows = csvContent.split('\n')
  .slice(1) // Skip header
  .map(line => {
    const [
      id, category, ingredientName, allergen, substituteName, 
      substituteUsage, notes, safeFor, bestFor, notRecommendedFor, 
      preparationSteps
    ] = line.split(',').map(field => field.trim().replace(/^"|"$/g, ''));

    return {
      id,
      category,
      ingredientName,
      allergen,
      substituteName,
      substituteUsage: substituteUsage || '',
      notes: notes || '',
      safeFor: safeFor || '',
      bestFor: bestFor ? bestFor.split(';').map(item => item.trim()) : [],
      notRecommendedFor: notRecommendedFor ? notRecommendedFor.split(';').map(item => item.trim()) : [],
      preparationSteps: preparationSteps ? preparationSteps.split(';').map(item => item.trim()) : []
    };
  })
  .filter(row => row.ingredientName && row.substituteName);

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
    
    // Update each ingredient's data
    rows.forEach(row => {
      const pattern = new RegExp(
        `{[^}]*'Ingredient Name': '${row.ingredientName}'[^}]*'Substitute Name': '${row.substituteName}'[^}]*}`,
        'g'
      );
      
      const replacement = `{
    ID: '${row.id}',
    Category: '${row.category}',
    'Ingredient Name': '${row.ingredientName}',
    'Allergen/Diet Restriction': '${row.allergen}',
    'Substitute Name': '${row.substituteName}',
    'Substitute Usage': '${row.substituteUsage}',
    Notes: '${row.notes}',
    'Safe For': '${row.safeFor}',
    'Best For': ${JSON.stringify(row.bestFor)},
    'Not Recommended For': ${JSON.stringify(row.notRecommendedFor)},
    'Preparation Steps': ${JSON.stringify(row.preparationSteps)}
  }`;

      const newContent = content.replace(pattern, replacement);
      
      if (newContent !== content) {
        content = newContent;
        modified = true;
        console.log(`Updated data for ${row.ingredientName} -> ${row.substituteName}`);
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