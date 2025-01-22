import 'dotenv/config'
import { supabase } from '../lib/supabase'

async function cleanupEggData() {
  console.log('Starting egg data cleanup...')

  // Find all egg-related items (except eggplant)
  const { data: eggItems, error: findError } = await supabase
    .from('ingredients')
    .select('id, name, category')
    .not('name', 'ilike', '%eggplant%')
    .or('name.ilike.%egg%,name.ilike.%eggs%')

  if (findError) {
    console.error('Error finding egg items:', findError)
    return
  }

  if (!eggItems || eggItems.length === 0) {
    console.log('No egg items found')
    return
  }

  console.log('Found egg items:', eggItems)

  // Keep the first 'Eggs' item in the eggs category as our main ingredient
  const mainEgg = eggItems.find(item => item.name === 'Eggs' && item.category === 'eggs')
  
  if (!mainEgg) {
    console.error('Main egg ingredient not found')
    return
  }

  // Delete duplicate 'Eggs' entries
  const duplicateEggs = eggItems.filter(item => 
    item.id !== mainEgg.id && 
    item.name === 'Eggs' && 
    item.category === 'eggs'
  )

  if (duplicateEggs.length > 0) {
    const { error: deleteError } = await supabase
      .from('ingredients')
      .delete()
      .in('id', duplicateEggs.map(egg => egg.id))

    if (deleteError) {
      console.error('Error deleting duplicate eggs:', deleteError)
      return
    }
    console.log(`Deleted ${duplicateEggs.length} duplicate egg entries`)
  }

  // Update all other egg-related items to the eggs category
  const otherEggItems = eggItems.filter(item => 
    item.id !== mainEgg.id && 
    !duplicateEggs.some(dup => dup.id === item.id) &&
    item.name !== 'Eggplant'
  )

  // Update all items at once
  if (otherEggItems.length > 0) {
    const { error: updateError } = await supabase
      .from('ingredients')
      .update({ category: 'eggs' })
      .in('id', otherEggItems.map(item => item.id))

    if (updateError) {
      console.error('Error updating egg items:', updateError)
    } else {
      console.log(`Successfully updated ${otherEggItems.length} egg items to eggs category`)
      console.log('Updated items:', otherEggItems.map(item => item.name).join(', '))
    }
  }

  console.log('Successfully cleaned up egg data')
}

cleanupEggData().catch(console.error) 