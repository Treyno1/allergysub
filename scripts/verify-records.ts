import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabaseUrl = 'https://wnartvyquqouvbchymhz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduYXJ0dnlxdXFvdXZiY2h5bWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMDU0NTEsImV4cCI6MjA1MTY4MTQ1MX0.u8l8BZCGJXlzCtBsalkZm_x95a6luLSr8SCYlRH1p3E';

const supabase = createClient(supabaseUrl, supabaseKey);

const expectedRecords = [
  {
    name: 'Textured Vegetable Protein',
    imageUrl: 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f396',
    notes: 'A meat substitute made from defatted soy flour',
    bestFor: ['Ground Meat Dishes', 'Tacos', 'Chili'],
    notRecommendedFor: ['Steaks', 'Roasts'],
    safeFor: ['vegan', 'vegetarian']
  },
  {
    name: 'Tempeh',
    imageUrl: 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f397',
    notes: 'A fermented soy product that can be used as a meat substitute',
    bestFor: ['Stir-Fries', 'Sandwiches', 'Grilled Dishes'],
    notRecommendedFor: ['Sauces', 'Soups'],
    safeFor: ['vegan', 'vegetarian']
  },
  {
    name: 'Hemp Seeds',
    imageUrl: 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f398',
    notes: 'Nutrient-rich seeds that can be used as a nut substitute',
    bestFor: ['Salads', 'Smoothies', 'Baked Goods'],
    notRecommendedFor: ['Nut Butter Substitutes'],
    safeFor: ['vegan', 'vegetarian', 'nut-free']
  },
  {
    name: 'Roasted Chickpeas',
    imageUrl: 'https://images.unsplash.com/photo-1612187209234-3e6e0d84f399',
    notes: 'Crunchy roasted chickpeas that can be used as a nut substitute',
    bestFor: ['Snacks', 'Salad Toppings', 'Trail Mix'],
    notRecommendedFor: ['Baked Goods'],
    safeFor: ['vegan', 'vegetarian', 'nut-free']
  }
];

interface Substitute {
  name: string;
  image_url: string;
  notes: string;
  best_for: string[];
  not_recommended_for: string[];
  safe_for: string[];
}

async function verifyRecords() {
  console.log('Starting record verification...');
  
  for (const expected of expectedRecords) {
    try {
      // Fetch the actual record from Supabase
      const { data: actual, error } = await supabase
        .from('substitutes')
        .select('*')
        .eq('name', expected.name)
        .single();

      if (error) {
        console.error(`Error fetching ${expected.name}:`, error);
        continue;
      }

      if (!actual) {
        console.error(`Record not found for ${expected.name}`);
        continue;
      }

      const substitute = actual as Substitute;
      
      // Verify each field
      const discrepancies = [];
      
      if (substitute.image_url !== expected.imageUrl) {
        discrepancies.push(`image_url mismatch: expected ${expected.imageUrl}, got ${substitute.image_url}`);
      }
      
      if (substitute.notes !== expected.notes) {
        discrepancies.push(`notes mismatch: expected ${expected.notes}, got ${substitute.notes}`);
      }
      
      // Compare arrays
      const bestForMatch = JSON.stringify(substitute.best_for.sort()) === JSON.stringify(expected.bestFor.sort());
      if (!bestForMatch) {
        discrepancies.push(`best_for mismatch: expected ${expected.bestFor}, got ${substitute.best_for}`);
      }
      
      const notRecommendedMatch = JSON.stringify(substitute.not_recommended_for.sort()) === JSON.stringify(expected.notRecommendedFor.sort());
      if (!notRecommendedMatch) {
        discrepancies.push(`not_recommended_for mismatch: expected ${expected.notRecommendedFor}, got ${substitute.not_recommended_for}`);
      }
      
      const safeForMatch = JSON.stringify(substitute.safe_for.sort()) === JSON.stringify(expected.safeFor.sort());
      if (!safeForMatch) {
        discrepancies.push(`safe_for mismatch: expected ${expected.safeFor}, got ${substitute.safe_for}`);
      }

      // Check image URL accessibility
      try {
        const response = await fetch(substitute.image_url);
        if (!response.ok) {
          discrepancies.push(`image_url not accessible: ${substitute.image_url}`);
        }
      } catch (err) {
        const error = err as Error;
        discrepancies.push(`Error checking image_url: ${error.message}`);
      }

      if (discrepancies.length > 0) {
        console.log(`\nDiscrepancies found for ${expected.name}:`);
        discrepancies.forEach(d => console.log(`- ${d}`));
      } else {
        console.log(`\n✓ ${expected.name} verified successfully`);
      }
    } catch (err) {
      const error = err as Error;
      console.error(`Error processing ${expected.name}:`, error.message);
    }
  }
  
  console.log('\nVerification completed');
}

verifyRecords(); 