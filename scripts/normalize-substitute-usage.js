import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Function to normalize and split usage tags
function normalizeUsageTags(usageString) {
  if (!usageString) return [];
  
  // Split by commas and clean up each tag
  return usageString
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)
    .map(tag => {
      // Remove parentheses and their contents
      tag = tag.replace(/\([^)]*\)/g, '').trim();
      // Convert to title case
      return tag.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    });
}

// Function to get unique usage tags
function getUniqueUsageTags(csvData) {
  const usageTags = new Set();
  
  csvData.split('\n')
    .slice(1) // Skip header
    .forEach(line => {
      const columns = line.split(',');
      const usage = columns[5]?.replace(/^"|"$/g, '').trim();
      if (usage) {
        normalizeUsageTags(usage).forEach(tag => usageTags.add(tag));
      }
    });

  return Array.from(usageTags).sort();
}

// Read the CSV data
const csvData = fs.readFileSync(path.join(__dirname, '../data/substitutes.csv'), 'utf-8');

// Get unique usage tags
const uniqueUsageTags = getUniqueUsageTags(csvData);
console.log('Unique usage tags:', uniqueUsageTags);

// Parse CSV rows
const rows = csvData.split('\n')
  .slice(1) // Skip header
  .map(line => {
    const columns = line.split(',');
    return {
      ingredientName: columns[2]?.trim(),
      substituteName: columns[4]?.trim(),
      substituteUsage: columns[5]?.replace(/^"|"$/g, '').trim()
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
    
    // Update each ingredient's substitute usage
    rows.forEach(row => {
      if (!row.ingredientName || !row.substituteName) return;

      const pattern = new RegExp(
        `('Ingredient Name': '${row.ingredientName}'[\\s\\S]*?'Substitute Name': '${row.substituteName}'[\\s\\S]*?)'Substitute Usage': ['"].*?['"]`,
        'g'
      );
      
      const normalizedUsage = normalizeUsageTags(row.substituteUsage).join(', ');
      
      content = content.replace(
        pattern,
        `$1'Substitute Usage': '${normalizedUsage}'`
      );
    });
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filename}`);
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
  }
});

// Create a summary of unique usage tags
const summaryPath = path.join(__dirname, '../data/usage-tags.json');
fs.writeFileSync(summaryPath, JSON.stringify(uniqueUsageTags, null, 2), 'utf-8');

console.log('Finished updating all ingredient files.');
console.log(`Created usage tags summary at ${summaryPath}`);