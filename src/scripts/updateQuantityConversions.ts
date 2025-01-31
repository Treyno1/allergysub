import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../lib/database.types';

if (!process.env.VITE_SUPABASE_URL) throw new Error('Missing VITE_SUPABASE_URL');
if (!process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing VITE_SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function updateQuantityConversions() {
  console.log('Starting quantity conversions update...');

  try {
    // Dairy Alternatives
    await updateConversion('Almond Milk', 'Milk', '1 cup almond milk = 1 cup milk (240ml)');
    await updateConversion('Oat Milk', 'Milk', '1 cup oat milk = 1 cup milk (240ml)');
    await updateConversion('Coconut Milk', 'Milk', '1 cup coconut milk = 1 cup milk (240ml). For heavy cream replacement, use full-fat coconut milk');
    await updateConversion('Greek Yogurt', 'Sour Cream', '1 cup Greek yogurt = 1 cup sour cream (240ml)');

    // Flour Alternatives
    await updateConversion('Rice Flour', 'Wheat Flour', '75g rice flour + 25g cornstarch = 100g wheat flour');
    await updateConversion('Almond Flour', 'Wheat Flour', '120g almond flour = 100g wheat flour. Reduce liquid in recipe by 10%');
    await updateConversion('Oat Flour', 'Wheat Flour', '100g oat flour = 100g wheat flour. Add 1/2 tsp xanthan gum per cup for better binding');

    // Egg Substitutes
    await updateConversion('Flax Egg', 'Eggs', '1 egg = 1 tbsp (7g) ground flaxseed + 3 tbsp (45ml) water');
    await updateConversion('Chia Egg', 'Eggs', '1 egg = 1 tbsp (12g) chia seeds + 3 tbsp (45ml) water');
    await updateConversion('Mashed Banana', 'Eggs', '1 egg = 1/4 cup (60g) mashed ripe banana');
    await updateConversion('Silken Tofu', 'Eggs', '1 egg = 1/4 cup (60g) blended silken tofu');

    // Butter Alternatives
    await updateConversion('Coconut Oil', 'Butter', '1 cup butter = 1 cup coconut oil (225g). Use solid coconut oil for baking');
    await updateConversion('Applesauce', 'Butter', '1 cup butter = 3/4 cup (180ml) unsweetened applesauce. Best for moist baked goods');

    // Sweetener Alternatives
    await updateConversion('Honey', 'Sugar', '1 cup sugar = 3/4 cup (180ml) honey. Reduce liquid in recipe by 1/4 cup per cup of honey');
    await updateConversion('Maple Syrup', 'Sugar', '1 cup sugar = 3/4 cup (180ml) maple syrup. Reduce liquid in recipe by 3 tbsp per cup');

    // Condiment Substitutes
    await updateConversion('Greek Yogurt', 'Mayonnaise', '1 cup mayonnaise = 1 cup Greek yogurt (240ml). Best for dips and dressings');
    await updateConversion('Coconut Aminos', 'Soy Sauce', '1 tbsp soy sauce = 1 tbsp coconut aminos (15ml). Slightly sweeter than soy sauce');
    await updateConversion('Nutritional Yeast', 'Parmesan', '1 cup grated parmesan = 3/4 cup (45g) nutritional yeast');

    console.log('Successfully updated quantity conversions');

    // Log the update
    await supabase.from('sync_log').insert({
      status: 'success',
      details: {
        operation: 'update_quantity_conversions',
        timestamp: new Date().toISOString(),
        details: 'Updated quantity conversions with specific measurements'
      }
    });

  } catch (error) {
    console.error('Error updating quantity conversions:', error);
    throw error;
  }
}

async function updateConversion(substituteName: string, ingredientName: string, conversion: string) {
  try {
    // First, get the ingredient ID
    const { data: ingredient } = await supabase
      .from('ingredients')
      .select('id')
      .eq('name', ingredientName)
      .single();

    if (!ingredient) {
      console.log(`Ingredient not found: ${ingredientName}`);
      return;
    }

    // Update the substitute's quantity conversion
    const { error } = await supabase
      .from('substitutes')
      .update({ quantity_conversion: conversion })
      .eq('name', substituteName)
      .eq('ingredient_id', ingredient.id);

    if (error) {
      console.error(`Error updating ${substituteName}:`, error);
    } else {
      console.log(`Updated conversion for ${substituteName}`);
    }
  } catch (error) {
    console.error(`Error in updateConversion for ${substituteName}:`, error);
  }
}

updateQuantityConversions()
  .catch(console.error); 