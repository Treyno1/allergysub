import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wnartvyquqouvbchymhz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduYXJ0dnlxdXFvdXZiY2h5bWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMDU0NTEsImV4cCI6MjA1MTY4MTQ1MX0.u8l8BZCGJXlzCtBsalkZm_x95a6luLSr8SCYlRH1p3E';

const supabase = createClient(supabaseUrl, supabaseKey);

const substitutesToCheck = [
  { name: 'Hemp Seeds', ingredient: 'Pine Nuts' },
  { name: 'Textured Vegetable Protein', ingredient: 'Ground Beef' },
  { name: 'Tempeh', ingredient: 'Ground Beef' },
  { name: 'Roasted Chickpeas', ingredient: 'Pine Nuts' }
];

async function checkRecords() {
  console.log('Checking current records...\n');
  
  for (const sub of substitutesToCheck) {
    const { data: ingredientData } = await supabase
      .from('ingredients')
      .select('id')
      .eq('name', sub.ingredient)
      .single();
      
    if (ingredientData) {
      const { data: substituteData, error } = await supabase
        .from('substitutes')
        .select('*')
        .eq('name', sub.name)
        .eq('ingredient_id', ingredientData.id);
        
      if (error) {
        console.error(`Error checking ${sub.name}:`, error);
        continue;
      }
      
      console.log(`Record for ${sub.name} (${sub.ingredient}):`);
      console.log(JSON.stringify(substituteData, null, 2));
      console.log('---');
    }
  }
}

checkRecords(); 