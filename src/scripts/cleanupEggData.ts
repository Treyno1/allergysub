import { createClient } from '@supabase/supabase-js'
import type { Database } from '../lib/database.types'
import 'dotenv/config'

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing required environment variables')
}

const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function cleanupEggData() {
  console.log('Starting egg data cleanup...')

  // Find all egg-related items except Eggplant
  const { data: eggItems, error: findError } = await supabase
    .from('ingredients')
    .select('*')
    .or('name.ilike.%egg%,name.ilike.%Egg%')
    .not('name', 'ilike', '%eggplant%')

  if (findError) {
    console.error('Error finding egg items:', findError)
    return
  }

  if (!eggItems || eggItems.length === 0) {
    console.log('No egg items found')
    return
  }

  console.log('Found egg items:', eggItems.map(item => ({ id: item.id, name: item.name, category: item.category })))

  // Update all egg items to be in the eggs category
  for (const item of eggItems) {
    if (item.name !== 'Eggplant' && item.category !== 'eggs') {
      console.log(`Updating ${item.name} (${item.id})...`)
      const { error: updateError } = await supabase
        .from('ingredients')
        .update({ category: 'eggs' })
        .eq('id', item.id)

      if (updateError) {
        console.error(`Error updating item ${item.name}:`, updateError)
      } else {
        console.log(`Successfully updated ${item.name}`)
      }
    }
  }

  console.log('Successfully cleaned up egg data')
}

cleanupEggData().catch(console.error) 