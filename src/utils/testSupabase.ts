import { supabase } from '../lib/supabase';

export async function testSupabaseData() {
  console.log('Testing Supabase data...');
  
  // Test ingredients
  const { data: ingredients, error: ingredientsError } = await supabase
    .from('ingredients')
    .select('*');
  
  if (ingredientsError) {
    console.error('Error fetching ingredients:', ingredientsError);
    return false;
  }
  
  console.log(`Found ${ingredients.length} ingredients`);
  
  // Test substitutes
  const { data: substitutes, error: substitutesError } = await supabase
    .from('substitutes')
    .select(`
      *,
      ingredients (
        name,
        category
      )
    `);
  
  if (substitutesError) {
    console.error('Error fetching substitutes:', substitutesError);
    return false;
  }
  
  console.log(`Found ${substitutes.length} substitutes`);
  
  // Log some sample data
  if (ingredients.length > 0) {
    console.log('Sample ingredient:', ingredients[0]);
  }
  
  if (substitutes.length > 0) {
    console.log('Sample substitute:', substitutes[0]);
  }
  
  return true;
}