import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { CSVRow } from '../src/types';

interface CSVData {
  'Ingredient Name': string;
  'Substitute Name': string;
  'Substitute Usage': string;
}

// Read and parse CSV data
const csvContent = readFileSync(join(__dirname, '../data/substitutes.csv'), 'utf-8');
const csvRows = csvContent
  .split('\n')
  .slice(1) // Skip header row
  .map(row => {
    const columns = row.split(',');
    return {
      'Ingredient Name': columns[2],
      'Substitute Name': columns[4],
      'Substitute Usage': columns[5]
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
  const filePath = join(__dirname, '../src/data/ingredients', filename);
  let content = readFileSync(filePath, 'utf-8');

  // Find all substitute usage patterns in the file
  const substituteUsagePattern = /'Substitute Usage': ''/g;
  
  // Replace each empty substitute usage with data from CSV
  content = content.replace(substituteUsagePattern, (match, offset) => {
    // Find the surrounding ingredient and substitute name
    const beforeMatch = content.slice(0, offset);
    const ingredientMatch = beforeMatch.match(/'Ingredient Name': '([^']+)'/);
    const substituteMatch = beforeMatch.match(/'Substitute Name': '([^']+)'/);

    if (!ingredientMatch || !substituteMatch) return match;

    const ingredientName = ingredientMatch[1];
    const substituteName = substituteMatch[1];

    // Find matching CSV row
    const csvRow = csvRows.find(row => 
      row['Ingredient Name'] === ingredientName && 
      row['Substitute Name'] === substituteName
    );

    if (!csvRow) return match;

    return `'Substitute Usage': '${csvRow['Substitute Usage']}'`;
  });

  // Write updated content back to file
  writeFileSync(filePath, content, 'utf-8');
});

console.log('Substitute Usage data has been restored to all ingredient files.');