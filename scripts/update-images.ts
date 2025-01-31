import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wnartvyquqouvbchymhz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduYXJ0dnlxdXFvdXZiY2h5bWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMDU0NTEsImV4cCI6MjA1MTY4MTQ1MX0.u8l8BZCGJXlzCtBsalkZm_x95a6luLSr8SCYlRH1p3E';

const supabase = createClient(supabaseUrl, supabaseKey);

const imageUpdates = [
  {
    ingredientName: 'Eggs',
    name: 'Aquafaba',
    imageUrl: 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f394',
    notes: 'The liquid from canned chickpeas that can be used as an egg white substitute',
    bestFor: ['Meringues', 'Baked Goods', 'Egg-Free Mayo'],
    notRecommendedFor: ['Scrambled Eggs'],
    safeFor: ['vegan', 'vegetarian']
  },
  {
    ingredientName: 'Wheat Flour',
    name: 'Coconut Flour',
    imageUrl: 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f395',
    notes: 'A gluten-free flour alternative made from dried coconut meat',
    bestFor: ['Baked Goods', 'Pancakes', 'Breading'],
    notRecommendedFor: ['Yeast Breads'],
    safeFor: ['gluten-free', 'grain-free']
  },
  {
    ingredientName: 'Ground Beef',
    name: 'Textured Vegetable Protein',
    imageUrl: 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f396',
    notes: 'A meat substitute made from defatted soy flour',
    bestFor: ['Ground Meat Dishes', 'Tacos', 'Chili'],
    notRecommendedFor: ['Steaks', 'Roasts'],
    safeFor: ['vegan', 'vegetarian']
  },
  {
    ingredientName: 'Ground Beef',
    name: 'Tempeh',
    imageUrl: 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f397',
    notes: 'A fermented soy product that can be used as a meat substitute',
    bestFor: ['Stir-Fries', 'Sandwiches', 'Grilled Dishes'],
    notRecommendedFor: ['Sauces', 'Soups'],
    safeFor: ['vegan', 'vegetarian']
  },
  {
    ingredientName: 'Pine Nuts',
    name: 'Hemp Seeds',
    imageUrl: 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f398',
    notes: 'Nutrient-rich seeds that can be used as a nut substitute',
    bestFor: ['Salads', 'Smoothies', 'Baked Goods'],
    notRecommendedFor: ['Nut Butter Substitutes'],
    safeFor: ['vegan', 'vegetarian', 'nut-free']
  },
  {
    ingredientName: 'Pine Nuts',
    name: 'Roasted Chickpeas',
    imageUrl: 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f399',
    notes: 'Crunchy roasted chickpeas that can be used as a nut substitute',
    bestFor: ['Snacks', 'Salad Toppings', 'Trail Mix'],
    notRecommendedFor: ['Baked Goods'],
    safeFor: ['vegan', 'vegetarian', 'nut-free']
  }
];

async function updateImages() {
  console.log('Starting image updates...');
  
  // First, get all ingredient IDs
  const { data: ingredients, error: ingredientError } = await supabase
    .from('ingredients')
    .select('id, name');

  if (ingredientError) {
    console.error('Error fetching ingredients:', ingredientError);
    return;
  }

  // Create a map of ingredient names to IDs
  const ingredientMap = new Map(ingredients.map(i => [i.name, i.id]));
  
  for (const update of imageUpdates) {
    try {
      const ingredientId = ingredientMap.get(update.ingredientName);
      if (!ingredientId) {
        console.error(`Could not find ingredient ID for ${update.ingredientName}`);
        continue;
      }

      // Get current value first
      const { data: current, error: fetchError } = await supabase
        .from('substitutes')
        .select('*')
        .eq('name', update.name)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        // Substitute doesn't exist, insert it
        const { data: insertedData, error: insertError } = await supabase
          .from('substitutes')
          .insert([{
            ingredient_id: ingredientId,
            name: update.name,
            image_url: update.imageUrl,
            notes: update.notes,
            best_for: update.bestFor,
            not_recommended_for: update.notRecommendedFor,
            safe_for: update.safeFor
          }])
          .select();

        if (insertError) {
          console.error(`Error inserting ${update.name}:`, insertError);
        } else {
          console.log(`Successfully inserted ${update.name} with image URL and details`);
        }
      } else if (!current?.image_url) {
        // Exists but no image, update it
        const { data, error } = await supabase
          .from('substitutes')
          .update({ 
            image_url: update.imageUrl,
            notes: update.notes,
            best_for: update.bestFor,
            not_recommended_for: update.notRecommendedFor,
            safe_for: update.safeFor
          })
          .eq('name', update.name)
          .select();

        if (error) {
          console.error(`Error updating ${update.name}:`, error);
        } else {
          console.log(`Successfully updated ${update.name} with new image URL and details`);
        }
      } else {
        console.log(`Skipping ${update.name} - already has an image URL: ${current.image_url}`);
      }
    } catch (error) {
      console.error(`Error processing ${update.name}:`, error);
    }
  }
  
  console.log('Image updates completed');
}

updateImages(); 