import { supabase } from './supabase';
import type { Database } from './database.types';

type Ingredient = Database['public']['Tables']['ingredients']['Insert'];
type Substitute = Database['public']['Tables']['substitutes']['Insert'];

export async function moveEggsToNewCategory() {
  // Find all egg-related ingredients except eggplant
  const { data: eggIngredients, error: findError } = await supabase
    .from('ingredients')
    .select('id, name, category')
    .not('name', 'ilike', '%eggplant%')
    .or('name.ilike.%egg%,name.ilike.%eggs%');

  if (findError) {
    console.error('Error finding egg ingredients:', findError);
    return;
  }

  if (!eggIngredients || eggIngredients.length === 0) {
    console.log('No egg ingredients found');
    return;
  }

  // Create main egg ingredient if it doesn't exist
  const { data: mainEgg, error: mainEggError } = await supabase
    .from('ingredients')
    .insert({
      name: 'Eggs',
      category: 'eggs',
    })
    .select()
    .single();

  if (mainEggError) {
    console.error('Error creating main egg ingredient:', mainEggError);
    return;
  }

  // Add common egg substitutes
  const substitutes: Omit<Substitute, 'id'>[] = [
    {
      ingredient_id: mainEgg.id,
      name: 'Flax Egg',
      usage: ['Baking', 'Binding'],
      notes: '1 tablespoon ground flaxseed + 3 tablespoons water = 1 egg',
      safe_for: ['vegan', 'vegetarian'],
      best_for: ['Baking', 'Binding in recipes'],
      preparation_steps: [
        'Mix 1 tablespoon ground flaxseed with 3 tablespoons water',
        'Let sit for 5-10 minutes until thickened'
      ]
    },
    {
      ingredient_id: mainEgg.id,
      name: 'Chia Egg',
      usage: ['Baking', 'Binding'],
      notes: '1 tablespoon chia seeds + 3 tablespoons water = 1 egg',
      safe_for: ['vegan', 'vegetarian'],
      best_for: ['Baking', 'Binding in recipes'],
      preparation_steps: [
        'Mix 1 tablespoon chia seeds with 3 tablespoons water',
        'Let sit for 5-10 minutes until thickened'
      ]
    },
    {
      ingredient_id: mainEgg.id,
      name: 'Commercial Egg Replacer',
      usage: ['Baking', 'Binding'],
      notes: 'Follow package instructions for equivalent of one egg',
      safe_for: ['vegan', 'vegetarian'],
      best_for: ['Baking', 'General purpose'],
      preparation_steps: [
        'Follow package instructions',
        'Usually mix with water before using'
      ]
    },
    {
      ingredient_id: mainEgg.id,
      name: 'Mashed Banana',
      usage: ['Baking'],
      notes: '1/4 cup mashed banana = 1 egg',
      safe_for: ['vegan', 'vegetarian'],
      best_for: ['Sweet baked goods', 'Quick breads'],
      preparation_steps: [
        'Mash ripe banana until smooth',
        'Use in recipe as egg substitute'
      ]
    },
    {
      ingredient_id: mainEgg.id,
      name: 'Silken Tofu',
      usage: ['Baking', 'Binding'],
      notes: '1/4 cup blended silken tofu = 1 egg',
      safe_for: ['vegan', 'vegetarian'],
      best_for: ['Dense baked goods', 'Savory dishes'],
      preparation_steps: [
        'Blend silken tofu until completely smooth',
        'Measure required amount'
      ]
    }
  ];

  const { error: substituteError } = await supabase
    .from('substitutes')
    .insert(substitutes);

  if (substituteError) {
    console.error('Error adding egg substitutes:', substituteError);
  }

  // Update the category for other egg-related ingredients
  const { error: updateError } = await supabase
    .from('ingredients')
    .update({ category: 'eggs' })
    .in('id', eggIngredients.map(ing => ing.id));

  if (updateError) {
    console.error('Error updating egg ingredients:', updateError);
    return;
  }

  console.log(`Successfully moved ${eggIngredients.length} ingredients to eggs category`);
  console.log('Moved ingredients:', eggIngredients.map(ing => ing.name).join(', '));
}

export async function addEggCategory() {
  // First, add the egg ingredient
  const { data: ingredient, error: ingredientError } = await supabase
    .from('ingredients')
    .insert({
      name: 'Eggs',
      category: 'eggs',
    })
    .select()
    .single();

  if (ingredientError) {
    console.error('Error adding egg ingredient:', ingredientError);
    return;
  }

  // Then add some common egg substitutes
  const substitutes: Omit<Substitute, 'id'>[] = [
    {
      ingredient_id: ingredient.id,
      name: 'Flax Egg',
      usage: ['Baking', 'Binding'],
      notes: '1 tablespoon ground flaxseed + 3 tablespoons water = 1 egg',
      safe_for: ['vegan', 'vegetarian'],
      best_for: ['Baking', 'Binding in recipes'],
      preparation_steps: [
        'Mix 1 tablespoon ground flaxseed with 3 tablespoons water',
        'Let sit for 5-10 minutes until thickened'
      ]
    },
    {
      ingredient_id: ingredient.id,
      name: 'Chia Egg',
      usage: ['Baking', 'Binding'],
      notes: '1 tablespoon chia seeds + 3 tablespoons water = 1 egg',
      safe_for: ['vegan', 'vegetarian'],
      best_for: ['Baking', 'Binding in recipes'],
      preparation_steps: [
        'Mix 1 tablespoon chia seeds with 3 tablespoons water',
        'Let sit for 5-10 minutes until thickened'
      ]
    }
  ];

  const { error: substituteError } = await supabase
    .from('substitutes')
    .insert(substitutes);

  if (substituteError) {
    console.error('Error adding egg substitutes:', substituteError);
  }
} 