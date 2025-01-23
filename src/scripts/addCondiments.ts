import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../lib/database.types';

if (!process.env.VITE_SUPABASE_URL) {
  throw new Error('VITE_SUPABASE_URL is required');
}
if (!process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('VITE_SUPABASE_SERVICE_ROLE_KEY is required');
}

const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

const condiments = [
  {
    name: 'Mayonnaise',
    substitutes: [
      {
        name: 'Greek Yogurt',
        usage: ['Sandwiches', 'Dips', 'Dressings'],
        notes: 'Provides a tangy, creamy texture similar to mayonnaise with fewer calories',
        safeFor: ['vegetarian'],
        notRecommendedFor: ['dairy-free', 'vegan'],
        preparationSteps: ['Use plain Greek yogurt in a 1:1 ratio']
      },
      {
        name: 'Mashed Avocado',
        usage: ['Sandwiches', 'Wraps', 'Dips'],
        notes: 'Offers a creamy texture and healthy fats',
        safeFor: ['vegetarian', 'vegan', 'dairy-free'],
        notRecommendedFor: [],
        preparationSteps: ['Mash ripe avocado until smooth', 'Season with salt and lemon juice to taste']
      },
      {
        name: 'Hummus',
        usage: ['Sandwiches', 'Wraps', 'Dips'],
        notes: 'Provides protein and a creamy texture',
        safeFor: ['vegetarian', 'vegan', 'dairy-free'],
        notRecommendedFor: [],
        preparationSteps: ['Use store-bought or homemade hummus in a 1:1 ratio']
      }
    ]
  },
  {
    name: 'Soy Sauce',
    substitutes: [
      {
        name: 'Coconut Aminos',
        usage: ['Marinades', 'Stir-fries', 'Dipping sauce'],
        notes: 'Lower in sodium than soy sauce with a slightly sweeter taste',
        safeFor: ['gluten-free', 'soy-free'],
        notRecommendedFor: [],
        preparationSteps: ['Use in a 1:1 ratio', 'May need to add a pinch of salt']
      },
      {
        name: 'Tamari',
        usage: ['Marinades', 'Stir-fries', 'Dipping sauce'],
        notes: 'Similar flavor to soy sauce but gluten-free',
        safeFor: ['gluten-free'],
        notRecommendedFor: ['soy-free'],
        preparationSteps: ['Use in a 1:1 ratio']
      }
    ]
  },
  {
    name: 'Fish Sauce',
    category: 'condiments',
    substitutes: [
      {
        name: 'Coconut Aminos',
        usage: ['Asian dishes', 'Marinades', 'Dipping sauces'],
        notes: 'Milder flavor but adds umami taste',
        safeFor: ['vegetarian', 'vegan', 'fish-free'],
        notRecommendedFor: [],
        preparationSteps: ['Use slightly more coconut aminos than fish sauce called for', 'Add a pinch of salt']
      },
      {
        name: 'Mushroom Sauce',
        usage: ['Asian dishes', 'Marinades'],
        notes: 'Provides umami flavor similar to fish sauce',
        safeFor: ['vegetarian', 'vegan', 'fish-free'],
        notRecommendedFor: [],
        preparationSteps: ['Use in a 1:1 ratio']
      }
    ]
  }
];

async function addCondiments() {
  console.log('Adding condiments...');

  for (const condiment of condiments) {
    try {
      // Add the ingredient
      const { data: ingredient, error: ingredientError } = await supabase
        .from('ingredients')
        .insert({
          name: condiment.name,
          category: 'condiments'
        })
        .select()
        .single();

      if (ingredientError) {
        console.error(`Error adding ${condiment.name}:`, ingredientError);
        continue;
      }

      console.log(`Added ${condiment.name}`);

      // Add substitutes
      for (const sub of condiment.substitutes) {
        const { error: subError } = await supabase
          .from('substitutes')
          .insert({
            ingredient_id: ingredient.id,
            name: sub.name,
            usage: sub.usage,
            notes: sub.notes,
            safe_for: sub.safeFor,
            not_recommended_for: sub.notRecommendedFor,
            preparation_steps: sub.preparationSteps
          });

        if (subError) {
          console.error(`Error adding substitute ${sub.name} for ${condiment.name}:`, subError);
          continue;
        }

        console.log(`Added substitute ${sub.name} for ${condiment.name}`);
      }
    } catch (err) {
      console.error(`Unexpected error processing ${condiment.name}:`, err);
    }
  }
}

addCondiments(); 