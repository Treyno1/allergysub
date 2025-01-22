import { Ingredient, DietaryRestriction, CSVRow } from '../types';

export function transformCSVToIngredients(csvData: CSVRow[]): Ingredient[] {
  const ingredientMap = new Map<string, Ingredient>();

  csvData.forEach(row => {
    const ingredientKey = `${row.Category}-${row['Ingredient Name']}`;
    
    if (!ingredientMap.has(ingredientKey)) {
      ingredientMap.set(ingredientKey, {
        id: row.ID,
        name: row['Ingredient Name'],
        category: mapToHighLevelCategory(row.Category, row['Ingredient Name']),
        substitutes: []
      });
    }

    const ingredient = ingredientMap.get(ingredientKey)!;
    
    const usageString = row['Substitute Usage']?.trim() || '';
    const usageArray = usageString ? usageString.split(',').map(u => u.trim()).filter(Boolean) : [];
    
    ingredient.substitutes.push({
      id: `${row.ID}-sub`,
      name: row['Substitute Name'],
      usage: usageArray,
      notes: row.Notes || '',
      safeFor: {
        dietaryRestrictions: parseDietaryRestrictions(row['Safe For'] || '')
      },
      bestFor: [],
      notRecommendedFor: [],
      preparationSteps: [],
      ratings: []
    });
  });

  return Array.from(ingredientMap.values());
}

function mapToHighLevelCategory(category: string, ingredientName: string): string {
  // First check for condiments and sauces
  const nameLower = ingredientName.toLowerCase();
  if (nameLower.includes('sauce') || 
      nameLower.includes('dressing') || 
      nameLower.includes('marinade') ||
      nameLower.includes('condiment') ||
      category.toLowerCase().includes('sauce')) {
    return 'condiments';
  }

  // Then check the original category mapping
  const originalCategoryMap: Record<string, string> = {
    'Dairy': 'dairy',
    'Meat': 'proteins',
    'Fish-Seafood': 'proteins',
    'Egg': 'proteins',
    'Grains-Gluten': 'grains',
    'Nuts-Seeds': 'nuts-seeds',
    'Caffeine': 'beverages',
    'Fruit': 'produce',
    'Vegetables': 'produce',
    'Sweeteners': 'sweeteners',
    'Thickeners': 'thickeners',
    'Condiments': 'condiments'
  };

  if (originalCategoryMap[category]) {
    return originalCategoryMap[category];
  }

  // Then check ingredient name for specific mappings
  if (nameLower.includes('peanut butter') || 
      nameLower.includes('nuts') || 
      nameLower.includes('seeds')) {
    return 'nuts-seeds';
  }
  
  if (nameLower.includes('milk') || 
      nameLower.includes('cheese') || 
      nameLower.includes('cream') || 
      nameLower.includes('butter') && !nameLower.includes('peanut butter')) {
    return 'dairy';
  }

  if (nameLower.includes('chicken') || 
      nameLower.includes('beef') || 
      nameLower.includes('fish') || 
      nameLower.includes('egg')) {
    return 'proteins';
  }

  if (nameLower.includes('flour') || 
      nameLower.includes('bread') || 
      nameLower.includes('pasta')) {
    return 'grains';
  }

  if (nameLower.includes('coffee') || 
      nameLower.includes('tea') || 
      nameLower.includes('drink')) {
    return 'beverages';
  }

  if (nameLower.includes('fruit') || 
      nameLower.includes('vegetable') || 
      nameLower.includes('produce')) {
    return 'produce';
  }

  if (nameLower.includes('sugar') || 
      nameLower.includes('syrup') || 
      nameLower.includes('honey')) {
    return 'sweeteners';
  }

  if (nameLower.includes('starch') || 
      nameLower.includes('gum') || 
      nameLower.includes('thickener')) {
    return 'thickeners';
  }

  return 'other';
}

function parseDietaryRestrictions(safeForString: string): DietaryRestriction[] {
  if (!safeForString) return [];

  return safeForString
    .split(',')
    .map(item => item.trim().toLowerCase() as DietaryRestriction)
    .filter(Boolean);
}