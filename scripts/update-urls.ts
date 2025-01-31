import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const urlUpdates = [
  {
    id: '363aafe2-dd59-4941-b5f3-340d56b88623', // Hemp Seeds
    imageUrl: 'https://media.post.rvohealth.io/wp-content/uploads/sites/3/2020/02/323037_2200-800x1200.jpg'
  },
  {
    id: '59c651dc-34b3-4dc0-8d29-417db627e666', // Textured Vegetable Protein
    imageUrl: 'https://i.ebayimg.com/images/g/OjgAAOSwFRpf3eEe/s-l1200.jpg'
  },
  {
    id: '17f8abc7-cc24-462d-80cb-0343156d9fbe', // Tempeh
    imageUrl: 'https://frommybowl.com/wp-content/uploads/2019/09/3_Ingredient_Crispy_Tempeh_Vegan_GlutenFree_FromMyBowl-683x1024.jpg'
  },
  {
    id: 'efef5b9d-cffb-42bb-aa3a-5ee5dc1b3a86', // Roasted Chickpeas
    imageUrl: 'https://thehealthyepicurean.com/wp-content/uploads/2015/06/Spicy-Roasted-Chickpeas-3-scaled.jpg'
  }
];

async function updateImageUrls() {
  console.log('Updating image URLs...\n');
  
  for (const update of urlUpdates) {
    try {
      const { error } = await supabase
        .from('substitutes')
        .update({ image_url: update.imageUrl })
        .eq('id', update.id);
      
      if (error) {
        console.error(`Error updating record ${update.id}:`, error.message);
      } else {
        console.log(`Updated image URL for record ${update.id}`);
      }
    } catch (err) {
      console.error(`Failed to update record ${update.id}:`, err);
    }
  }
  
  console.log('\nImage URL updates completed');
}

updateImageUrls(); 