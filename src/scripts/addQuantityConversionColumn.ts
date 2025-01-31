import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../lib/database.types';

if (!process.env.VITE_SUPABASE_URL) throw new Error('Missing VITE_SUPABASE_URL');
if (!process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing VITE_SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function addQuantityConversionColumn() {
  console.log('Adding and populating quantity_conversion column...');

  try {
    // First check if the column exists
    const { data: columnExists } = await supabase
      .from('substitutes')
      .select('quantity_conversion')
      .limit(1);

    if (!columnExists) {
      // Add the column using raw SQL
      const { error: alterError } = await supabase.rpc('alter_table_add_column', {
        table_name: 'substitutes',
        column_name: 'quantity_conversion',
        column_type: 'text'
      });
      
      if (alterError) {
        console.error('Error adding column:', alterError);
        return;
      }
      console.log('Added quantity_conversion column');
    } else {
      console.log('quantity_conversion column already exists');
    }

    // Update dairy alternatives
    await updateSubstitutes('Almond Milk', '1 cup almond milk = 1 cup milk (240ml)');
    await updateSubstitutes('Oat Milk', '1 cup oat milk = 1 cup milk (240ml)');
    await updateSubstitutes('Coconut Milk', '1 cup coconut milk = 1 cup milk (240ml). For heavy cream replacement, use full-fat coconut milk');
    await updateSubstitutes('Greek Yogurt', '1 cup Greek yogurt = 1 cup sour cream (240ml)');

    // Update flour alternatives
    await updateSubstitutes('Rice Flour', '75g rice flour + 25g cornstarch = 100g wheat flour');
    await updateSubstitutes('Almond Flour', '120g almond flour = 100g wheat flour. Reduce liquid in recipe by 10%');
    await updateSubstitutes('Oat Flour', '100g oat flour = 100g wheat flour. Add 1/2 tsp xanthan gum per cup for better binding');

    // Update egg substitutes
    await updateSubstitutes('Flax Egg', '1 egg = 1 tbsp (7g) ground flaxseed + 3 tbsp (45ml) water');
    await updateSubstitutes('Chia Egg', '1 egg = 1 tbsp (12g) chia seeds + 3 tbsp (45ml) water');
    await updateSubstitutes('Mashed Banana', '1 egg = 1/4 cup (60g) mashed ripe banana');
    await updateSubstitutes('Silken Tofu', '1 egg = 1/4 cup (60g) blended silken tofu');

    // Update butter alternatives
    await updateSubstitutes('Coconut Oil', '1 cup butter = 1 cup coconut oil (225g). Use solid coconut oil for baking');
    await updateSubstitutes('Applesauce', '1 cup butter = 3/4 cup (180ml) unsweetened applesauce. Best for moist baked goods');

    // Update sweetener alternatives
    await updateSubstitutes('Honey', '1 cup sugar = 3/4 cup (180ml) honey. Reduce liquid in recipe by 1/4 cup per cup of honey');
    await updateSubstitutes('Maple Syrup', '1 cup sugar = 3/4 cup (180ml) maple syrup. Reduce liquid in recipe by 3 tbsp per cup');

    // Update condiment substitutes
    await updateSubstitutes('Coconut Aminos', '1 tbsp soy sauce = 1 tbsp coconut aminos (15ml). Slightly sweeter than soy sauce');
    await updateSubstitutes('Nutritional Yeast', '1 cup grated parmesan = 3/4 cup (45g) nutritional yeast');

    // Set default for remaining
    const { error: defaultError } = await supabase
      .from('substitutes')
      .update({ quantity_conversion: '1:1 ratio - Use the same amount as the original ingredient' })
      .is('quantity_conversion', null);

    if (defaultError) {
      console.error('Error setting default conversions:', defaultError);
    } else {
      console.log('Set default conversions for remaining substitutes');
    }

    console.log('Successfully populated quantity_conversion data');

    // Log the update
    await supabase.from('sync_log').insert({
      status: 'success',
      details: {
        operation: 'add_and_populate_quantity_conversion',
        timestamp: new Date().toISOString(),
        details: 'Added quantity_conversion column and populated initial data'
      }
    });

  } catch (error) {
    console.error('Error in addQuantityConversionColumn:', error);
    throw error;
  }
}

async function updateSubstitutes(name: string, conversion: string) {
  const { error } = await supabase
    .from('substitutes')
    .update({ quantity_conversion: conversion })
    .eq('name', name);

  if (error) {
    console.error(`Error updating ${name}:`, error);
  } else {
    console.log(`Updated conversion for ${name}`);
  }
}

addQuantityConversionColumn()
  .catch(console.error); 