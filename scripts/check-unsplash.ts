import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wnartvyquqouvbchymhz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduYXJ0dnlxdXFvdXZiY2h5bWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMDU0NTEsImV4cCI6MjA1MTY4MTQ1MX0.u8l8BZCGJXlzCtBsalkZm_x95a6luLSr8SCYlRH1p3E';

const supabase = createClient(supabaseUrl, supabaseKey);

interface Substitute {
  name: string;
  image_url: string;
  ingredients: {
    name: string;
  };
}

async function checkUnsplashUrls() {
  console.log('Checking for Unsplash URLs...\n');
  
  const { data: substitutes, error } = await supabase
    .from('substitutes')
    .select(`
      name,
      image_url,
      ingredients (
        name
      )
    `)
    .filter('image_url', 'ilike', '%unsplash.com%')
    .returns<Substitute[]>();

  if (error) {
    console.error('Error fetching substitutes:', error);
    return;
  }

  if (!substitutes || substitutes.length === 0) {
    console.log('No substitutes found with Unsplash URLs');
    return;
  }

  console.log(`Found ${substitutes.length} substitutes with Unsplash URLs:\n`);
  
  substitutes.forEach(sub => {
    console.log(`Substitute: ${sub.name}`);
    console.log(`Parent Ingredient: ${sub.ingredients.name}`);
    console.log(`Image URL: ${sub.image_url}`);
    console.log('---');
  });
}

checkUnsplashUrls(); 