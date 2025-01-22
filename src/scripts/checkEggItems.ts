import 'dotenv/config';
import { supabase } from '../lib/supabase';

async function main() {
  // Check eggs category
  console.log('\nChecking eggs category:');
  const { data: eggIngredients, error: eggError } = await supabase
    .from('ingredients')
    .select('*')
    .eq('category', 'eggs');

  if (eggError) {
    console.error('Error checking eggs:', eggError);
    return;
  }

  console.log('Egg ingredients:', eggIngredients);

  // Check for any remaining egg-related items in other categories
  console.log('\nChecking for egg-related items in other categories:');
  const { data: otherEggItems, error: otherError } = await supabase
    .from('ingredients')
    .select('*')
    .neq('category', 'eggs')
    .ilike('name', '%egg%');

  if (otherError) {
    console.error('Error checking other categories:', otherError);
    return;
  }

  console.log('Egg-related items in other categories:', otherEggItems);

  // Check egg substitutes
  console.log('\nChecking egg substitutes:');
  const { data: substitutes, error: subsError } = await supabase
    .from('substitutes')
    .select('*')
    .eq('ingredient_id', eggIngredients?.[0]?.id || '');

  if (subsError) {
    console.error('Error checking substitutes:', subsError);
    return;
  }

  console.log('Current egg substitutes:', substitutes);
}

main().catch(console.error); 