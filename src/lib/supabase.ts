import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

console.log('🚀 INITIALIZING SUPABASE CLIENT');
console.log('==========================================');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: Verify environment variables are loaded
console.log('🔑 Supabase Environment Variables:');
console.log('URL:', supabaseUrl || 'NOT FOUND');
console.log('Anon Key:', supabaseAnonKey ? 'Present (starts with: ' + supabaseAnonKey.substring(0, 20) + '...)' : 'NOT FOUND');
console.log('==========================================');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERROR: Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

export { supabase };