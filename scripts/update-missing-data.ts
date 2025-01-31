import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

interface Substitute {
  id: string
  name: string
  quantity_conversion: string | null
  best_for: string[] | null
  not_recommended_for: string[] | null
}

async function generateMissingData(substitute: Substitute) {
  const updates: Partial<Substitute> = {}

  if (!substitute.quantity_conversion) {
    // Generate quantity conversion based on ingredient type
    switch (substitute.name.toLowerCase()) {
      case 'tempeh':
      case 'textured vegetable protein':
      case 'hemp seeds':
      case 'roasted chickpeas':
        updates.quantity_conversion = '1:1 ratio - Use the same amount as the original protein source'
        break
      default:
        updates.quantity_conversion = '1:1 ratio - Use the same amount as the original ingredient'
    }
  }

  if (!substitute.best_for || !substitute.not_recommended_for) {
    // Generate recipe ideas based on ingredient type
    switch (substitute.name.toLowerCase()) {
      case 'tempeh':
        updates.best_for = ['Stir-fries', 'Sandwiches', 'Salads', 'Grain bowls']
        updates.not_recommended_for = ['Sweet dishes', 'Desserts', 'Smoothies']
        break
      case 'textured vegetable protein':
        updates.best_for = ['Ground meat dishes', 'Tacos', 'Chili', 'Pasta sauces']
        updates.not_recommended_for = ['Raw applications', 'Smoothies', 'Baked goods']
        break
      case 'hemp seeds':
        updates.best_for = ['Smoothies', 'Salads', 'Yogurt toppings', 'Baked goods']
        updates.not_recommended_for = ['High-heat cooking', 'Frying', 'Sauces']
        break
      case 'roasted chickpeas':
        updates.best_for = ['Snacking', 'Salad toppings', 'Trail mix', 'Garnish']
        updates.not_recommended_for = ['Smooth sauces', 'Baked goods', 'Smoothies']
        break
      default:
        updates.best_for = ['Various recipes', 'Please update with specific uses']
        updates.not_recommended_for = ['Please update with specific restrictions']
    }
  }

  return updates
}

async function updateMissingData() {
  try {
    // Step 1: Get all entries with missing data
    const { data: substitutes, error: fetchError } = await supabase
      .from('substitutes')
      .select('*')
      .or('quantity_conversion.is.null,best_for.is.null,not_recommended_for.is.null')

    if (fetchError) throw fetchError
    if (!substitutes) {
      console.log('No entries with missing data found')
      return
    }

    console.log(`Found ${substitutes.length} entries with missing data`)

    // Step 2 & 3: Generate and update missing data
    let updatedCount = 0
    for (const substitute of substitutes) {
      const updates = await generateMissingData(substitute)
      
      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from('substitutes')
          .update(updates)
          .eq('id', substitute.id)

        if (updateError) {
          console.error(`Error updating ${substitute.name}:`, updateError)
          continue
        }

        updatedCount++
        console.log(`Updated ${substitute.name} with:`, updates)
      }
    }

    // Step 4: Return summary
    console.log('\nUpdate Summary:')
    console.log(`Total entries processed: ${substitutes.length}`)
    console.log(`Successfully updated: ${updatedCount}`)
    console.log(`Failed updates: ${substitutes.length - updatedCount}`)

  } catch (error) {
    console.error('Error updating missing data:', error)
  }
}

updateMissingData() 