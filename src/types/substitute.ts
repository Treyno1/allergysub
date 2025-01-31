import { DietaryRestriction } from './index';

// Rating type used by both formats
export interface Rating {
  id: string;
  substitute_id: string;
  rating: number;
  comment: string | null;
  user_id: string;
  created_at: string;
}

// Base Supabase format
export interface SupabaseSubstitute {
  id: string;
  ingredient_id: string;
  name: string;
  usage: string[];
  notes: string | null;
  safe_for: DietaryRestriction[];
  best_for: string[];
  not_recommended_for: string[];
  preparation_steps: string[];
  quantity_conversion: string | null;
  image_url: string | null;
  alt_text: string | null;
  created_at?: string;
  ratings?: Rating[];
}

// Frontend format
export interface FrontendSubstitute {
  imageUrl: string | null;
  altText: string | null;
  safeFor: {
    dietaryRestrictions: DietaryRestriction[];
  };
  bestFor: string[];
  notRecommendedFor: string[];
  preparationSteps: string[];
}

// Combined type that requires both formats
export interface Substitute extends SupabaseSubstitute, FrontendSubstitute {} 