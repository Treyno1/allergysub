export type Category = 
  | 'dairy'
  | 'eggs'
  | 'proteins'
  | 'grains'
  | 'nuts-seeds'
  | 'beverages'
  | 'produce'
  | 'sweeteners'
  | 'thickeners'
  | 'condiments';

export type Allergen =
  | 'dairy'
  | 'gluten'
  | 'nuts'
  | 'eggs'
  | 'soy'
  | 'fish'
  | 'shellfish'
  | 'corn'
  | 'nightshade'
  | 'citrus';

export type DietaryRestriction = 
  | 'vegan'
  | 'vegetarian'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'soy-free'
  | 'corn-free';

export interface Ingredient {
  id: string;
  name: string;
  category: Category;
  substitutes: Substitute[];
}

export interface Substitute {
  id: string;
  name: string;
  usage: string[];
  notes: string;
  safeFor: {
    dietaryRestrictions: DietaryRestriction[];
  };
  bestFor: string[];
  notRecommendedFor: string[];
  preparationSteps: string[];
  ratio?: string;
  ratings: Rating[];
}

export interface Rating {
  id: string;
  rating: number;
  comment?: string;
  timestamp: number;
}

export interface CSVRow {
  ID: string;
  Category: string;
  'Ingredient Name': string;
  'Substitute Name': string;
  'Substitute Usage': string;
  Notes: string;
  'Safe For': string;
}