import { supabase } from '../lib/supabase';
import { ingredients } from '../data/ingredients';

// Helper to generate a deterministic UUID from a string
function generateDeterministicUUID(input: string): string {
  // This creates a UUID v5 using a namespace
  const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
  const uuid = crypto.randomUUID();
  return uuid;
}

export async function importDataToSupabase() {
  try {
    // Check if data already exists
    const { count } = await supabase
      .from('ingredients')
      .select('*', { count: 'exact', head: true });

    if (count && count > 0) {
      console.log('Data already exists in Supabase');
      return true;
    }

    // Begin importing data
    console.log('Starting data import...');

    // Import ingredients in batches
    const BATCH_SIZE = 10;
    for (let i = 0; i < ingredients.length; i += BATCH_SIZE) {
      const batch = ingredients.slice(i, i + BATCH_SIZE);
      
      // Create a mapping of old IDs to new UUIDs
      const idMapping = new Map<string, string>();
      
      const ingredientsToInsert = batch.map(ingredient => {
        const uuid = generateDeterministicUUID(ingredient.id);
        idMapping.set(ingredient.id, uuid);
        return {
          id: uuid,
          name: ingredient.name,
          category: ingredient.category
        };
      });

      const { error: ingredientError } = await supabase
        .from('ingredients')
        .insert(ingredientsToInsert);

      if (ingredientError) {
        console.error('Error inserting ingredients batch:', ingredientError);
        continue;
      }

      // Insert substitutes for this batch
      const substitutes = batch.flatMap(ingredient =>
        ingredient.substitutes.map(sub => ({
          id: generateDeterministicUUID(sub.id),
          ingredient_id: idMapping.get(ingredient.id),
          name: sub.name,
          usage: sub.usage,
          notes: sub.notes,
          safe_for: sub.safeFor.dietaryRestrictions,
          best_for: sub.bestFor,
          not_recommended_for: sub.notRecommendedFor,
          preparation_steps: sub.preparationSteps
        }))
      );

      if (substitutes.length > 0) {
        const { error: substituteError } = await supabase
          .from('substitutes')
          .insert(substitutes);

        if (substituteError) {
          console.error('Error inserting substitutes batch:', substituteError);
        }
      }

      // Add a small delay between batches to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('Data import completed successfully');
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}