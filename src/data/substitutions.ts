export type Allergen = 'dairy' | 'gluten' | 'nuts' | 'eggs' | 'soy';

export interface Substitution {
  id: string;
  original: string;
  alternatives: Alternative[];
  commonAllergens: Allergen[];
}

interface Alternative {
  name: string;
  ratio: string;
  notes: string;
  allergenFree: Allergen[];
  usageInstructions: string[];
  bestFor: string[];
  notRecommendedFor: string[];
  preparationSteps?: string[];
}

export const substitutions: Substitution[] = [
  {
    id: '1',
    original: 'Cow\'s Milk',
    alternatives: [
      {
        name: 'Oat Milk',
        ratio: '1:1',
        notes: 'Best for baking, creates a creamy texture',
        allergenFree: ['dairy', 'nuts', 'soy'],
        usageInstructions: [
          'Shake well before using',
          'Can be heated without curdling',
          'May need to reduce sugar in recipes as oat milk is naturally sweet'
        ],
        bestFor: [
          'Baking breads and muffins',
          'Coffee and tea',
          'Creamy sauces'
        ],
        notRecommendedFor: [
          'Puddings (may not set as firmly)',
          'Instant pudding mixes'
        ],
        preparationSteps: [
          'Shake thoroughly before each use',
          'For hot beverages, heat gradually to prevent separation'
        ]
      },
      {
        name: 'Almond Milk',
        ratio: '1:1',
        notes: 'Great for smoothies and drinking',
        allergenFree: ['dairy', 'gluten', 'soy'],
        usageInstructions: [
          'Use unsweetened version for cooking',
          'May separate when heated',
          'Adds subtle nutty flavor'
        ],
        bestFor: [
          'Smoothies',
          'Cold cereals',
          'Baked goods'
        ],
        notRecommendedFor: [
          'Cream sauces (too thin)',
          'Recipes requiring high heat'
        ]
      },
      {
        name: 'Soy Milk',
        ratio: '1:1',
        notes: 'High in protein, good for all purposes',
        allergenFree: ['dairy', 'gluten', 'nuts'],
        usageInstructions: [
          'Use plain, unsweetened variety for cooking',
          'Stable at high temperatures',
          'Works well in savory dishes'
        ],
        bestFor: [
          'Baking',
          'Cooking savory dishes',
          'Making creamy sauces'
        ],
        notRecommendedFor: [
          'Dishes where beany taste would be noticeable'
        ]
      }
    ],
    commonAllergens: ['dairy']
  },
  {
    id: '2',
    original: 'Wheat Flour',
    alternatives: [
      {
        name: 'Almond Flour',
        ratio: '1:1',
        notes: 'Best for cookies and cakes, adds moisture',
        allergenFree: ['gluten', 'dairy', 'soy'],
        usageInstructions: [
          'May need to reduce fat in recipe',
          'Add xanthan gum for better binding',
          'Store in refrigerator to prevent rancidity'
        ],
        bestFor: [
          'Cookies',
          'Quick breads',
          'Pie crusts'
        ],
        notRecommendedFor: [
          'Yeasted breads',
          'Recipes needing gluten development'
        ],
        preparationSteps: [
          'Sift before measuring',
          'Combine with other flours for better texture'
        ]
      },
      {
        name: 'Rice Flour',
        ratio: '7/8:1',
        notes: 'Light texture, good for crispy batters',
        allergenFree: ['gluten', 'dairy', 'nuts', 'soy'],
        usageInstructions: [
          'Best when combined with other gluten-free flours',
          'Add extra liquid to prevent dryness',
          'Works well in roux'
        ],
        bestFor: [
          'Crispy coatings',
          'Thickening sauces',
          'Asian recipes'
        ],
        notRecommendedFor: [
          'Solo use in baked goods',
          'Bread making alone'
        ]
      },
      {
        name: 'Oat Flour',
        ratio: '1:1',
        notes: 'Hearty flavor, great for breads',
        allergenFree: ['dairy', 'nuts', 'soy'],
        usageInstructions: [
          'Use certified gluten-free if needed',
          'Let batter rest for 10 minutes before baking',
          'May need more leavening agent'
        ],
        bestFor: [
          'Cookies',
          'Muffins',
          'Quick breads'
        ],
        notRecommendedFor: [
          'Delicate pastries',
          'Angel food cake'
        ]
      }
    ],
    commonAllergens: ['gluten']
  },
  {
    id: '3',
    original: 'Eggs',
    alternatives: [
      {
        name: 'Flax Egg',
        ratio: '1 tbsp ground flax + 3 tbsp water = 1 egg',
        notes: 'Best for binding in baked goods',
        allergenFree: ['dairy', 'gluten', 'nuts', 'eggs', 'soy'],
        usageInstructions: [
          'Mix and let sit for 5-10 minutes until gel forms',
          'Use in recipes calling for 1-2 eggs',
          'Best in heartier baked goods'
        ],
        bestFor: [
          'Cookies',
          'Muffins',
          'Pancakes'
        ],
        notRecommendedFor: [
          'Meringues',
          'Angel food cake',
          'Recipes requiring more than 3 eggs'
        ],
        preparationSteps: [
          'Grind flax seeds if using whole',
          'Mix with water and let sit for 5-10 minutes',
          'Use immediately once gelled'
        ]
      },
      {
        name: 'Mashed Banana',
        ratio: '1/4 cup = 1 egg',
        notes: 'Adds moisture and sweetness',
        allergenFree: ['dairy', 'gluten', 'nuts', 'eggs', 'soy'],
        usageInstructions: [
          'Use very ripe bananas',
          'Reduce sugar in recipe',
          'Best in sweet recipes'
        ],
        bestFor: [
          'Quick breads',
          'Muffins',
          'Pancakes'
        ],
        notRecommendedFor: [
          'Savory dishes',
          'Recipes where banana flavor would be unwanted'
        ]
      },
      {
        name: 'Applesauce',
        ratio: '1/4 cup = 1 egg',
        notes: 'Good for moist baked goods',
        allergenFree: ['dairy', 'gluten', 'nuts', 'eggs', 'soy'],
        usageInstructions: [
          'Use unsweetened variety',
          'May need to reduce liquid in recipe',
          'Works best in sweet recipes'
        ],
        bestFor: [
          'Cakes',
          'Quick breads',
          'Brownies'
        ],
        notRecommendedFor: [
          'Cookies (makes too cakey)',
          'Savory dishes'
        ]
      }
    ],
    commonAllergens: ['eggs']
  }
];