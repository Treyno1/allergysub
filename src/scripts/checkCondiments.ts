import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../lib/database.types';

if (!process.env.VITE_SUPABASE_URL) {
  throw new Error('VITE_SUPABASE_URL is required');
}
if (!process.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('VITE_SUPABASE_ANON_KEY is required');
}

const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkCondiments() {
  console.log('Checking condiments data...');

  try {
    // Get all ingredients that should be in condiments category
    const { data: condimentItems, error: condimentError } = await supabase
      .from('ingredients')
      .select(`
        *,
        substitutes (*)
      `)
      .or('category.eq.condiments,name.ilike.%sauce%,name.ilike.%dressing%,name.ilike.%marinade%');

    if (condimentError) {
      console.error('Error fetching condiment items:', condimentError);
      return;
    }

    console.log('\nFound condiment items:', condimentItems?.length || 0);
    condimentItems?.forEach(item => {
      console.log(`\n${item.name} (${item.category}):`);
      console.log('Substitutes:', item.substitutes?.length || 0);
      item.substitutes?.forEach(sub => {
        console.log(`- ${sub.name}`);
      });
    });

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkCondiments(); 