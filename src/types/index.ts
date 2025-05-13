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

export type PendingReviewStatus = 'pending' | 'approved' | 'rejected';

export interface PendingReview {
  id: string;
  ingredient_name: string;
  suggested_substitute: string;
  category: string;
  description: string;
  status: PendingReviewStatus;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  name: string;
  quantity?: string;
  unit?: string;
  substitute?: string;
  suggested_substitute?: string;
  category?: string;
}

export interface Recipe {
  id: string;
  recipe_name: string;
  instructions: string;
  ingredients: RecipeIngredient[];
  substitutes: {
    ingredient_name: string;
    substitute_name: string;
    notes?: string;
    quantity_conversion?: string;
  }[];
  user_id: string;
  created_at: string;
  updated_at: string;
}