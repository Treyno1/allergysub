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

  // First, delete all duplicate 'Eggs' entries in the eggs category
  const eggsInCategory = eggItems.filter(item => 
    item.name === 'Eggs' && 
    item.category === 'eggs'
  )

  if (eggsInCategory.length > 1) {
    // Keep the first one and delete the rest
    const [mainEgg, ...duplicates] = eggsInCategory
    console.log('Main egg:', mainEgg)
    console.log('Duplicates to remove:', duplicates)

    const { error: deleteError } = await supabase
      .from('ingredients')
      .delete()
      .in('id', duplicates.map(egg => egg.id))

    if (deleteError) {
      console.error('Error deleting duplicate eggs:', deleteError)
      return
    }
    console.log(`Deleted ${duplicates.length} duplicate egg entries`)
  } else if (eggsInCategory.length === 0) {
    console.error('No main egg ingredient found in eggs category')
    return
  }

  // Get the main egg ID
  const mainEgg = eggsInCategory[0]

  // Update all other egg-related items to the eggs category
  const otherEggItems = eggItems.filter(item => 
    item.id !== mainEgg.id && 
    item.name !== 'Eggplant'
  )

  if (otherEggItems.length > 0) {
    console.log('Updating items to eggs category:', otherEggItems.map(item => item.name))
    
    const { error: updateError } = await supabase
      .from('ingredients')
      .update({ category: 'eggs' })
      .in('id', otherEggItems.map(item => item.id))

    if (updateError) {
      console.error('Error updating egg items:', updateError)
      return
    }
    console.log(`Successfully updated ${otherEggItems.length} egg items to eggs category`)
  }

  // Verify the changes
  const { data: verifyItems, error: verifyError } = await supabase
    .from('ingredients')
    .select('id, name, category')
    .not('name', 'ilike', '%eggplant%')
    .or('name.ilike.%egg%,name.ilike.%eggs%')

  if (verifyError) {
    console.error('Error verifying changes:', verifyError)
    return
  }

  const incorrectItems = verifyItems.filter(item => 
    item.name !== 'Eggplant' && 
    item.category !== 'eggs'
  )

  if (incorrectItems.length > 0) {
    console.error('Some items were not properly updated:', incorrectItems)
  } else {
    console.log('All egg items successfully moved to eggs category')
  }
}

cleanupEggData().catch(console.error) 