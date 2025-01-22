import { supabase } from '../lib/supabase';
import { ingredients } from '../data/ingredients';
import { Ingredient, Substitute } from '../types';

export interface AuditReport {
  localCount: {
    ingredients: number;
    substitutes: number;
  };
  supabaseCount: {
    ingredients: number;
    substitutes: number;
  };
  missingIngredients: string[];
  missingSubstitutes: string[];
  inconsistentRecords: {
    ingredients: Array<{
      name: string;
      differences: string[];
    }>;
    substitutes: Array<{
      name: string;
      differences: string[];
    }>;
  };
  errors: string[];
  lastSync: string | null;
  latestRecords: {
    ingredients: string | null;
    substitutes: string | null;
  };
}

export async function performDataAudit(): Promise<AuditReport> {
  const report: AuditReport = {
    localCount: {
      ingredients: 0,
      substitutes: 0
    },
    supabaseCount: {
      ingredients: 0,
      substitutes: 0
    },
    missingIngredients: [],
    missingSubstitutes: [],
    inconsistentRecords: {
      ingredients: [],
      substitutes: []
    },
    errors: [],
    lastSync: null,
    latestRecords: {
      ingredients: null,
      substitutes: null
    }
  };

  try {
    // Get local counts with detailed substitute tracking
    const localSubstituteMap = new Map<string, Set<string>>();
    report.localCount.ingredients = ingredients.length;
    
    ingredients.forEach(ing => {
      const substituteSet = new Set<string>();
      ing.substitutes.forEach(sub => {
        substituteSet.add(sub.name.toLowerCase());
      });
      localSubstituteMap.set(ing.name.toLowerCase(), substituteSet);
      report.localCount.substitutes += ing.substitutes.length;
    });

    // Get Supabase data with timestamps
    const { data: supabaseIngredients, error: ingredientsError } = await supabase
      .from('ingredients')
      .select('*, substitutes(name)')
      .order('created_at', { ascending: false });

    if (ingredientsError) {
      report.errors.push(`Error fetching ingredients: ${ingredientsError.message}`);
      return report;
    }

    // Track Supabase substitutes
    const supabaseSubstituteMap = new Map<string, Set<string>>();
    supabaseIngredients?.forEach(ing => {
      const substituteSet = new Set<string>();
      (ing.substitutes as any[])?.forEach(sub => {
        substituteSet.add(sub.name.toLowerCase());
      });
      supabaseSubstituteMap.set(ing.name.toLowerCase(), substituteSet);
    });

    // Update counts and check for missing data
    report.supabaseCount.ingredients = supabaseIngredients?.length || 0;
    report.supabaseCount.substitutes = supabaseIngredients?.reduce(
      (count, ing) => count + ((ing.substitutes as any[])?.length || 0),
      0
    );

    // Check for missing ingredients and substitutes
    ingredients.forEach(localIng => {
      const localIngName = localIng.name.toLowerCase();
      const supabaseSubstitutes = supabaseSubstituteMap.get(localIngName);

      if (!supabaseSubstitutes) {
        report.missingIngredients.push(localIng.name);
      } else {
        // Check for missing substitutes
        localIng.substitutes.forEach(localSub => {
          const localSubName = localSub.name.toLowerCase();
          if (!supabaseSubstitutes.has(localSubName)) {
            report.missingSubstitutes.push(
              `${localSub.name} (for ${localIng.name})`
            );
          }
        });
      }
    });

    // Get last sync timestamp
    const { data: syncData } = await supabase
      .from('sync_log')
      .select('created_at, details')
      .order('created_at', { ascending: false })
      .limit(1);

    report.lastSync = syncData?.[0]?.created_at || null;

  } catch (error) {
    report.errors.push(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
  }

  return report;
}

export async function syncMissingData(report: AuditReport): Promise<void> {
  try {
    // First sync missing ingredients
    for (const ingredientName of report.missingIngredients) {
      const localIngredient = ingredients.find(i => i.name === ingredientName);
      if (!localIngredient) continue;

      const { data: newIngredient, error: ingredientError } = await supabase
        .from('ingredients')
        .insert({
          name: localIngredient.name,
          category: localIngredient.category
        })
        .select()
        .single();

      if (ingredientError) throw ingredientError;

      // Sync all substitutes for this ingredient
      for (const substitute of localIngredient.substitutes) {
        const { error: substituteError } = await supabase
          .from('substitutes')
          .insert({
            ingredient_id: newIngredient.id,
            name: substitute.name,
            usage: substitute.usage,
            notes: substitute.notes,
            safe_for: substitute.safeFor.dietaryRestrictions,
            best_for: substitute.bestFor,
            not_recommended_for: substitute.notRecommendedFor,
            preparation_steps: substitute.preparationSteps
          });

        if (substituteError) throw substituteError;
      }
    }

    // Sync missing substitutes for existing ingredients
    const missingSubstitutePatterns = report.missingSubstitutes.map(sub => {
      const match = sub.match(/^(.*?) \(for (.*?)\)$/);
      return match ? { substituteName: match[1], ingredientName: match[2] } : null;
    }).filter(Boolean);

    for (const pattern of missingSubstitutePatterns) {
      if (!pattern) continue;

      // Get the ingredient ID
      const { data: ingredientData, error: ingredientError } = await supabase
        .from('ingredients')
        .select('id')
        .eq('name', pattern.ingredientName)
        .single();

      if (ingredientError) continue;

      // Find the local substitute data
      const localIngredient = ingredients.find(i => i.name === pattern.ingredientName);
      const localSubstitute = localIngredient?.substitutes.find(
        s => s.name === pattern.substituteName
      );

      if (!localSubstitute) continue;

      // Insert the missing substitute
      const { error: substituteError } = await supabase
        .from('substitutes')
        .insert({
          ingredient_id: ingredientData.id,
          name: localSubstitute.name,
          usage: localSubstitute.usage,
          notes: localSubstitute.notes,
          safe_for: localSubstitute.safeFor.dietaryRestrictions,
          best_for: localSubstitute.bestFor,
          not_recommended_for: localSubstitute.notRecommendedFor,
          preparation_steps: localSubstitute.preparationSteps
        });

      if (substituteError) throw substituteError;
    }

    // Log successful sync
    await supabase
      .from('sync_log')
      .insert({
        status: 'success',
        details: {
          ingredients_synced: report.missingIngredients.length,
          substitutes_synced: report.missingSubstitutes.length,
          timestamp: new Date().toISOString()
        }
      });

  } catch (error) {
    // Log sync error
    await supabase
      .from('sync_log')
      .insert({
        status: 'error',
        details: {
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString()
        }
      });

    throw error;
  }
}