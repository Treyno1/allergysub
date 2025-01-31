import { SupabaseSubstitute, FrontendSubstitute, Rating, DietaryRestriction } from '../types/substitute';

const isValidDietaryRestriction = (value: string): value is DietaryRestriction => {
  return [
    'vegan',
    'vegetarian',
    'gluten-free',
    'dairy-free',
    'nut-free',
    'soy-free',
    'corn-free'
  ].includes(value.toLowerCase());
};

export const transformRating = (rating: any): Rating => {
  if (!rating?.id || !rating?.substitute_id) {
    console.error('Invalid rating data:', rating);
    return {
      id: 'invalid',
      substitute_id: 'invalid',
      rating: 0,
      comment: null,
      user_id: 'invalid',
      created_at: new Date().toISOString()
    };
  }

  return {
    id: rating.id,
    substitute_id: rating.substitute_id,
    rating: rating.rating,
    comment: rating.comment || null,
    user_id: rating.user_id,
    created_at: rating.created_at
  };
};

export const transformSubstitute = (data: SupabaseSubstitute): FrontendSubstitute => {
  if (!data?.id || !data?.name) {
    console.error('Missing required fields:', data);
    throw new Error('Invalid data: missing required fields');
  }

  return {
    imageUrl: data.image_url || '/placeholder.png',
    altText: data.alt_text || `Image of ${data.name}`,
    safeFor: {
      dietaryRestrictions: (data.safe_for || [])
        .filter(r => ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free', 'soy-free', 'corn-free'].includes(r))
    },
    bestFor: data.best_for || [],
    notRecommendedFor: data.not_recommended_for || [],
    preparationSteps: data.preparation_steps || []
  };
};

// Combined transformation that returns both formats
export const transformSubstituteData = (data: any): SupabaseSubstitute & FrontendSubstitute => {
  // Validate required fields
  if (!data?.id || !data?.name) {
    console.error('Missing required fields in substitute data:', data);
    throw new Error('Invalid substitute data: missing required fields');
  }

  // Transform to Supabase format first
  const supabaseData: SupabaseSubstitute = {
    id: data.id,
    ingredient_id: data.ingredient_id,
    name: data.name,
    usage: data.usage || [],
    notes: data.notes || null,
    safe_for: (data.safe_for || []).filter(isValidDietaryRestriction),
    best_for: data.best_for || [],
    not_recommended_for: data.not_recommended_for || [],
    preparation_steps: data.preparation_steps || [],
    quantity_conversion: data.quantity_conversion || null,
    image_url: data.image_url || null,
    alt_text: data.alt_text || null,
    created_at: data.created_at,
    ratings: (data.ratings || []).map(transformRating)
  };

  // Then transform to frontend format
  const frontendData = transformSubstitute(supabaseData);

  // Return combined format
  return {
    ...supabaseData,
    ...frontendData
  };
}; 