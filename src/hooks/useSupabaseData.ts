import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Ingredient as FrontendIngredient, Substitute, DietaryRestriction } from '../types';
import type { PostgrestError } from '@supabase/supabase-js';

interface UseSupabaseDataReturn {
  ingredients: FrontendIngredient[];
  loading: boolean;
  error: Error | PostgrestError | null;
  retry: () => void;
}

interface DatabaseSubstitute {
  id: string;
  name: string;
  safeFor?: {
    dietaryRestrictions?: string[];
  };
  notRecommendedFor?: string[];
  bestFor?: string[];
  usage?: string[];
  [key: string]: any;
}

const isValidDietaryRestriction = (value: string): value is DietaryRestriction => {
  return [
    'vegan',
    'vegetarian',
    'gluten-free',
    'dairy-free',
    'nut-free',
    'soy-free',
    'corn-free'
  ].includes(value);
};

export const useSupabaseData = (): UseSupabaseDataReturn => {
  const [ingredients, setIngredients] = useState<FrontendIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | PostgrestError | null>(null);

  const fetchIngredients = async () => {
    console.log('🚀 Starting ingredients fetch...');
    
    try {
      setLoading(true);
      setError(null);

      console.log('📡 Making Supabase request...');
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('ingredients')
        .select(`
          *,
          substitutes (*)
        `);

      if (ingredientsError) {
        console.error('❌ Supabase error:', {
          message: ingredientsError.message,
          details: ingredientsError.details,
          hint: ingredientsError.hint
        });
        setError(ingredientsError);
        return;
      }

      if (!ingredientsData) {
        console.error('⚠️ No data received from Supabase');
        setError(new Error('No data received from database'));
        return;
      }

      console.log('✅ Successfully received data:', {
        count: ingredientsData.length,
        firstItem: JSON.stringify(ingredientsData[0], null, 2),
        categories: [...new Set(ingredientsData.map(i => i.category))]
      });

      const formattedData = ingredientsData.map((ingredient) => ({
        ...ingredient,
        category: ingredient.category?.toLowerCase() || 'unknown',
        substitutes: (ingredient.substitutes || []).map((sub: DatabaseSubstitute): Substitute => ({
          ...sub,
          safeFor: {
            dietaryRestrictions: (sub.safeFor?.dietaryRestrictions || [])
              .filter(isValidDietaryRestriction)
          },
          notRecommendedFor: sub.notRecommendedFor || [],
          bestFor: sub.bestFor || [],
          usage: sub.usage || [],
          ratings: [], // Add empty ratings array if not present
          preparationSteps: [], // Add empty preparation steps if not present
          notes: sub.notes || '' // Ensure notes is always a string
        }))
      }));

      console.log('🔄 Formatted data sample:', {
        count: formattedData.length,
        firstItem: JSON.stringify(formattedData[0], null, 2),
        categories: [...new Set(formattedData.map(i => i.category))]
      });

      setIngredients(formattedData);
    } catch (err) {
      console.error('💥 Unexpected error during data fetch:', {
        error: err,
        type: err instanceof Error ? 'Error' : typeof err,
        message: err instanceof Error ? err.message : String(err)
      });
      setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
    } finally {
      setLoading(false);
      console.log('🏁 Data fetch completed. Loading state set to false.');
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect triggered - starting initial fetch');
    fetchIngredients();
  }, []);

  return { 
    ingredients, 
    loading, 
    error,
    retry: fetchIngredients 
  };
};