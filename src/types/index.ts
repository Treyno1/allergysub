import type { Substitute, Rating } from './substitute';

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
  created_at?: string;
  substitutes: Substitute[];
}

export { Substitute, Rating };

export interface CSVRow {
  ID: string;
  Category: string;
  'Ingredient Name': string;
  'Substitute Name': string;
  'Substitute Usage': string;
  Notes: string;
  'Safe For': string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  dietary_restrictions?: DietaryRestriction[];
}