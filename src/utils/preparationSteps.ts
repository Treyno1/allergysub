import { Category } from '../types';

type PreparationGuide = {
  basic: string[];
  additional?: string[];
};

export const defaultPreparationSteps: Record<Category, PreparationGuide> = {
  'dairy': {
    basic: [
      'Shake well before use to ensure consistency',
      'Store in an airtight container in the refrigerator',
      'Use as a 1:1 replacement unless specified otherwise'
    ],
    additional: [
      'Heat gradually to prevent separation',
      'Allow to come to room temperature before baking'
    ]
  },
  'egg': {
    basic: [
      'Prepare the substitute immediately before use',
      'Mix thoroughly until well combined',
      'Let mixture rest for 5 minutes before using'
    ]
  },
  'grains-gluten-free': {
    basic: [
      'Store in an airtight container in a cool, dry place',
      'Sift before measuring to prevent clumping',
      'Combine with other gluten-free flours for best results'
    ]
  },
  'grains-gluten': {
    basic: [
      'Measure ingredients by weight for accuracy',
      'Mix thoroughly with other dry ingredients',
      'Allow dough to rest as specified in your recipe'
    ]
  },
  'nuts-seeds': {
    basic: [
      'Store in an airtight container in a cool place',
      'Toast lightly to enhance flavor if desired',
      'Process to desired consistency if making butter'
    ]
  },
  'meat': {
    basic: [
      'Rehydrate according to package instructions if needed',
      'Season well before cooking',
      'Cook thoroughly to desired texture'
    ]
  },
  'fish-seafood': {
    basic: [
      'Prepare marinade or seasoning before cooking',
      'Ensure proper cooking temperature',
      'Check for doneness using recommended guidelines'
    ]
  },
  'herbs-spices': {
    basic: [
      'Store in an airtight container away from light',
      'Crush or grind just before use for best flavor',
      'Adjust quantity to taste'
    ]
  },
  'fruit': {
    basic: [
      'Wash thoroughly before use',
      'Prepare just before needed to prevent oxidation',
      'Adjust sweetness as needed'
    ]
  },
  'vegetables': {
    basic: [
      'Clean and prepare according to recipe requirements',
      'Cut into uniform sizes for even cooking',
      'Cook until desired tenderness is achieved'
    ]
  },
  'sweeteners': {
    basic: [
      'Measure accurately as sweetness levels may vary',
      'Dissolve in warm liquid if needed',
      'Adjust quantity to taste'
    ]
  },
  'thickeners': {
    basic: [
      'Mix with cool liquid first to prevent lumps',
      'Add gradually while stirring constantly',
      'Cook until desired thickness is achieved'
    ]
  },
  'oils-fats': {
    basic: [
      'Store according to package instructions',
      'Measure accurately for best results',
      'Bring to room temperature before baking'
    ]
  },
  'caffeine': {
    basic: [
      'Use fresh, filtered water when preparing',
      'Follow recommended steeping times',
      'Adjust strength to taste'
    ]
  },
  'drinks': {
    basic: [
      'Chill or heat as appropriate',
      'Stir or shake well before serving',
      'Adjust flavoring to taste'
    ]
  }
};