import { Category } from '../types';

type WarningGuide = {
  general: string[];
  specific?: Record<string, string[]>;
};

export const defaultWarnings: Record<Category, WarningGuide> = {
  'dairy': {
    general: [
      'High-heat cooking methods that may cause separation',
      'Recipes requiring precise protein content',
      'Instant pudding mixes designed for dairy milk'
    ],
    specific: {
      'milk': [
        'Recipes requiring milk proteins for structure',
        'Instant puddings or custards without modification'
      ],
      'cream': [
        'Recipes requiring high fat content for texture',
        'Whipping applications without stabilizers'
      ]
    }
  },
  'egg': {
    general: [
      'Recipes requiring eggs as the main protein source',
      'Dishes where eggs are the star ingredient',
      'Traditional meringues or soufflés'
    ]
  },
  'grains-gluten-free': {
    general: [
      'Recipes requiring gluten development',
      'Traditional bread recipes without modifications',
      'Pastries needing high protein flour'
    ]
  },
  'grains-gluten': {
    general: [
      'Recipes requiring specific protein content',
      'Delicate pastries without adjustment',
      'Direct 1:1 substitution in yeast breads'
    ]
  },
  'nuts-seeds': {
    general: [
      'Applications requiring exact fat content',
      'Recipes needing specific nut flavors',
      'Direct substitution in traditional nut-based sauces'
    ]
  },
  'meat': {
    general: [
      'Raw applications or tartare',
      'Recipes requiring long braising times',
      'Dishes where meat is the primary flavor'
    ]
  },
  'fish-seafood': {
    general: [
      'Raw preparations or sushi',
      'Recipes requiring specific fish oils',
      'Traditional seafood dishes without modification'
    ]
  },
  'herbs-spices': {
    general: [
      'Recipes requiring fresh herb texture',
      'Dishes where herbs are the main ingredient',
      'Garnishing without adjustment'
    ]
  },
  'fruit': {
    general: [
      'Recipes requiring specific fruit pectin content',
      'Traditional preserves without modification',
      'Applications needing fresh fruit texture'
    ]
  },
  'vegetables': {
    general: [
      'Raw applications without preparation',
      'Recipes requiring specific vegetable starches',
      'Direct substitution in traditional dishes'
    ]
  },
  'sweeteners': {
    general: [
      'Recipes requiring sugar crystallization',
      'Traditional candy making',
      'Applications needing browning properties'
    ]
  },
  'thickeners': {
    general: [
      'High-heat applications without modification',
      'Recipes requiring specific gelling properties',
      'Direct substitution in traditional thickening methods'
    ]
  },
  'oils-fats': {
    general: [
      'High-heat frying without temperature adjustment',
      'Recipes requiring specific fat crystallization',
      'Traditional pastries without modification'
    ]
  },
  'caffeine': {
    general: [
      'Recipes requiring caffeine content',
      'Traditional coffee-based desserts',
      'Applications needing coffee oils'
    ]
  },
  'drinks': {
    general: [
      'Recipes requiring specific fermentation',
      'Traditional cocktails without modification',
      'Applications needing exact alcohol content'
    ]
  }
};