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

async function cleanupCondiments() {
  console.log('Cleaning up condiments...');

  try {
    // Find all Fish Sauce entries
    const { data: fishSauceItems, error: fishSauceError } = await supabase
      .from('ingredients')
      .select('*')
      .eq('name', 'Fish Sauce');

    if (fishSauceError) {
      console.error('Error fetching Fish Sauce items:', fishSauceError);
      return;
    }

    console.log('Found Fish Sauce items:', fishSauceItems.length);

    // Find the one in 'proteins' category
    const proteinsFishSauce = fishSauceItems.find(item => item.category === 'proteins');
    if (!proteinsFishSauce) {
      console.log('No Fish Sauce found in proteins category');
      return;
    }

    // Delete the proteins entry
    const { error: deleteError } = await supabase
      .from('ingredients')
      .delete()
      .eq('id', proteinsFishSauce.id);

    if (deleteError) {
      console.error('Error deleting Fish Sauce from proteins:', deleteError);
      return;
    }

    console.log('Successfully deleted Fish Sauce from proteins category');

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

cleanupCondiments(); 