import { createClient } from '@supabase/supabase-js';
import type { Database } from '../lib/database.types';
import 'dotenv/config';

if (!process.env.VITE_SUPABASE_URL) {
  throw new Error('Missing VITE_SUPABASE_URL');
}

if (!process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing VITE_SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function cleanupEggData() {
  console.log('Starting egg data cleanup...');

  // Find all egg items (excluding eggplant)
  const { data: eggItems, error: findError } = await supabase
    .from('ingredients')
    .select('*')
    .or('name.ilike.%egg%,category.eq.eggs')
    .not('name', 'ilike', '%eggplant%');

  if (findError) {
    console.error('Error finding egg items:', findError);
    return;
  }

  if (!eggItems) {
    console.error('No egg items found');
    return;
  }

  console.log('Found egg items:', eggItems);

  // Find the main egg with substitutes
  const mainEgg = eggItems.find(item => 
    item.category === 'eggs' && 
    item.name === 'Eggs' && 
    item.id === '597f0da8-e3b4-4313-bc8a-2968554a0e22'
  );

  if (!mainEgg) {
    console.error('Could not find main egg ingredient');
    return;
  }

  console.log('Main egg:', mainEgg);

  // Find duplicates to remove
  const duplicates = eggItems.filter(item => 
    item.name === 'Eggs' && 
    item.id !== mainEgg.id
  );

  console.log('Duplicates to remove:', duplicates);

  // Delete duplicate entries
  if (duplicates.length > 0) {
    const { error: deleteError } = await supabase
      .from('ingredients')
      .delete()
      .in('id', duplicates.map(d => d.id));

    if (deleteError) {
      console.error('Error deleting duplicates:', deleteError);
    } else {
      console.log(`Deleted ${duplicates.length} duplicate egg entries`);
    }
  }

  // Update all remaining egg items to eggs category
  const itemsToUpdate = eggItems
    .filter(item => item.id !== mainEgg.id && !duplicates.map(d => d.id).includes(item.id))
    .map(item => item.name);

  console.log('Updating items to eggs category:', itemsToUpdate);

  // Update each item individually for better error tracking
  for (const item of eggItems.filter(item => 
    item.id !== mainEgg.id && 
    !duplicates.map(d => d.id).includes(item.id)
  )) {
    console.log(`Updating ${item.name} (${item.id})...`);
    
    const { error: updateError } = await supabase
      .from('ingredients')
      .update({ category: 'eggs' })
      .eq('id', item.id);

    if (updateError) {
      console.error(`Error updating ${item.name}:`, updateError);
    } else {
      console.log(`Successfully updated ${item.name}`);
    }
  }

  // Verify updates
  const { data: notUpdated } = await supabase
    .from('ingredients')
    .select('*')
    .or('name.ilike.%egg%,category.eq.eggs')
    .not('name', 'ilike', '%eggplant%')
    .neq('category', 'eggs');

  if (notUpdated && notUpdated.length > 0) {
    console.log('Some items were not properly updated:', notUpdated);
  } else {
    console.log('All items successfully updated to eggs category');
  }
}

cleanupEggData().catch(console.error); 