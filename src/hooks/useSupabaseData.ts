import { useState, useEffect } from 'react';
import type { Ingredient as FrontendIngredient, Category } from '../types';
import type { SupabaseSubstitute } from '../types/substitute';
import { supabase } from '../lib/supabase';
import { transformSubstitute } from '../utils/transformers';

interface UseSupabaseDataReturn {
  ingredients: FrontendIngredient[];
  loading: boolean;
  error: Error | null;
  retry: () => void;
}

interface SupabaseIngredient {
  id: string;
  name: string;
  category: Category;
  created_at: string;
  substitutes: SupabaseSubstitute[];
}

export const useSupabaseData = (): UseSupabaseDataReturn => {
  const [ingredients, setIngredients] = useState<FrontendIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching ingredients from Supabase...');

      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('ingredients')
        .select(`
          id,
          name,
          category,
          created_at,
          substitutes (
            id,
            ingredient_id,
            name,
            usage,
            notes,
            safe_for,
            best_for,
            not_recommended_for,
            preparation_steps,
            quantity_conversion,
            image_url,
            alt_text,
            created_at,
            ratings (
              id,
              substitute_id,
              rating,
              comment,
              user_id,
              created_at
            )
          )
        `)
        .order('name')
        .returns<SupabaseIngredient[]>();

      if (ingredientsError) {
        console.error('Supabase query error:', ingredientsError);
        throw new Error(`Failed to fetch ingredients: ${ingredientsError.message}`);
      }

      if (!ingredientsData) {
        console.error('No data received from Supabase');
        throw new Error('No ingredients data received from Supabase');
      }

      console.log('Raw Supabase data:', ingredientsData);

      const formattedData: FrontendIngredient[] = ingredientsData.map((ingredient): FrontendIngredient => {
        console.log(`Processing ingredient: ${ingredient.name} (${ingredient.id})`);
        
        try {
          const transformedIngredient = {
            id: ingredient.id,
            name: ingredient.name,
            category: ingredient.category,
            created_at: ingredient.created_at,
            substitutes: (ingredient.substitutes || []).map(sub => {
              console.log(`Processing substitute: ${sub.name} (${sub.id})`);
              console.log('Original substitute data:', {
                image_url: sub.image_url,
                alt_text: sub.alt_text,
                safe_for: sub.safe_for
              });
              
              try {
                const transformedSub = {
                  ...sub,
                  ...transformSubstitute(sub)
                };
                
                console.log('Transformed substitute data:', {
                  imageUrl: transformedSub.imageUrl,
                  altText: transformedSub.altText,
                  safeFor: transformedSub.safeFor
                });
                
                return transformedSub;
              } catch (subError) {
                console.error(`Error transforming substitute ${sub.id} for ingredient ${ingredient.id}:`, subError);
                console.error('Problematic substitute data:', sub);
                
                // Return a minimal valid substitute to prevent UI breakage
                const fallbackSub = {
                  ...sub,
                  imageUrl: '/placeholder.png',
                  altText: `Image of ${sub.name}`,
                  safeFor: { dietaryRestrictions: [] },
                  bestFor: [],
                  notRecommendedFor: [],
                  preparationSteps: []
                };
                
                console.log('Using fallback substitute data:', fallbackSub);
                return fallbackSub;
              }
            })
          };
          
          console.log(`Successfully transformed ingredient ${ingredient.name}:`, transformedIngredient);
          return transformedIngredient;
        } catch (ingredientError) {
          console.error(`Error transforming ingredient ${ingredient.id}:`, ingredientError);
          console.error('Problematic ingredient data:', ingredient);
          throw ingredientError;
        }
      });

      console.log('Final formatted data:', formattedData);
      setIngredients(formattedData);
    } catch (err) {
      console.error('Error fetching data from Supabase:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  return {
    ingredients,
    loading,
    error,
    retry: fetchIngredients
  };
};