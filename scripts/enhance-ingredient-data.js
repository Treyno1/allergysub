import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read the CSV data
const csvContent = fs.readFileSync(path.join(__dirname, '../data/substitutes.csv'), 'utf-8');

// Parse CSV data and enhance with AI-generated content
const rows = csvContent.split('\n')
  .slice(1) // Skip header
  .map(line => {
    const [
      id, category, ingredientName, allergen, substituteName, 
      substituteUsage, notes
    ] = line.split(',').map(col => col.trim().replace(/^"|"$/g, ''));

    // Generate preparation steps based on usage
    const preparationSteps = generatePreparationSteps(substituteUsage, category);

    // Generate best uses based on category and usage
    const bestFor = generateBestUses(substituteUsage, category);

    // Generate not recommended uses
    const notRecommendedFor = generateNotRecommendedUses(category, substituteUsage);

    // Generate additional notes
    const enhancedNotes = generateNotes(category, substituteUsage);

    return {
      id,
      category,
      ingredientName,
      allergen,
      substituteName,
      substituteUsage,
      notes: enhancedNotes,
      preparationSteps,
      bestFor,
      notRecommendedFor
    };
  });

// Helper functions to generate content
function generatePreparationSteps(usage, category) {
  const steps = [];
  
  // Add common preparation steps based on category
  switch (category) {
    case 'Dairy':
      steps.push(
        'Shake well before use',
        'Bring to room temperature if using in baking',
        'Store in an airtight container in the refrigerator'
      );
      break;
    case 'Egg':
      if (usage.includes('binding')) {
        steps.push(
          'Mix with liquid according to package instructions',
          'Let mixture rest for 5-10 minutes to thicken',
          'Use immediately once prepared'
        );
      }
      break;
    // Add cases for other categories
  }
  
  return steps;
}

function generateBestUses(usage, category) {
  const uses = [];
  
  // Add best uses based on category and usage
  if (usage.includes('baking')) {
    uses.push(
      'Quick breads and muffins',
      'Cookies and cakes',
      'Pancakes and waffles'
    );
  }
  
  if (usage.includes('cooking')) {
    uses.push(
      'Savory sauces',
      'Creamy soups',
      'Casseroles'
    );
  }
  
  return uses;
}

function generateNotRecommendedUses(category, usage) {
  const notRecommended = [];
  
  // Add category-specific warnings
  switch (category) {
    case 'Dairy':
      notRecommended.push(
        'High-temperature cooking methods',
        'Recipes requiring exact protein content',
        'Instant pudding mixes'
      );
      break;
    case 'Egg':
      if (usage.includes('binding')) {
        notRecommended.push(
          'Recipes requiring more than 3 eggs',
          'Meringues or soufflés',
          'Angel food cake'
        );
      }
      break;
    // Add cases for other categories
  }
  
  return notRecommended;
}

function generateNotes(category, usage) {
  let notes = [];
  
  // Add category-specific notes
  switch (category) {
    case 'Dairy':
      notes.push(
        'May affect final texture slightly',
        'Consider reducing sugar if the substitute is naturally sweet',
        'Adjust liquid content in recipes as needed'
      );
      break;
    case 'Egg':
      if (usage.includes('binding')) {
        notes.push(
          'Works best in recipes calling for 1-2 eggs',
          'May make baked goods slightly denser',
          'Adds additional nutrition'
        );
      }
      break;
    // Add cases for other categories
  }
  
  return notes.join('. ');
}

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
    'Best For': ${JSON.stringify(row.bestFor)},
    'Not Recommended For': ${JSON.stringify(row.notRecommendedFor)},
    'Preparation Steps': ${JSON.stringify(row.preparationSteps)}
  }`;

      const newContent = content.replace(pattern, replacement);
      
      if (newContent !== content) {
        content = newContent;
        modified = true;
        console.log(`Enhanced data for ${row.ingredientName} -> ${row.substituteName}`);
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

console.log('Finished enhancing all ingredient files.');